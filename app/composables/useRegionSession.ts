/**
 * Regional session lifecycle (M3 — client side).
 *
 * A secondary region hosts no global user/session table, so the browser cannot
 * authenticate there with the main-region session. Instead it exchanges a
 * signed, single-use *region grant* for a short-lived **regional session**:
 *
 *   main      POST /inicontent/auth/region-grant        → { grant }
 *   region    POST /inicontent/auth/region-grant/redeem → sets host-only cookie
 *
 * The redeem response sets an `httpOnly` cookie on the **region API origin**;
 * `credentials: "include"` makes the browser store it, and it then travels
 * automatically on region-scoped requests. This composable never reads or holds
 * the token — it only orchestrates the exchange and the teardown.
 *
 * The main-region platform session must never reach a secondary region. The
 * network boundary (`sidRequest.ts`) drops it; this module guarantees the
 * region has its own credential to use instead, and that switching regions
 * destroys the previous one.
 */

import { useMainApiBase } from "./useMainApiBase.ts";
import {
	apiUrlOrigin,
	normalizeRegionApiUrl,
	REGION_STATE_KEY,
	type RegionSelection,
	withTrailingSlash,
} from "./region.ts";

export function useRegionSession() {
	const mainBase = useMainApiBase();
	const selection = useState<RegionSelection | null>(
		REGION_STATE_KEY,
		() => null,
	);

	/** Whether a selection targets a secondary region (not the main base). */
	function isSecondary(target: RegionSelection | null | undefined): boolean {
		if (!target) return false;
		const regionOrigin = apiUrlOrigin(target.apiUrl);
		const mainOrigin = apiUrlOrigin(mainBase);
		return !!regionOrigin && regionOrigin !== mainOrigin;
	}

	/**
	 * Mint a grant at the main region and redeem it at the selected region,
	 * which sets the host-only regional session cookie. Returns `false` (and
	 * sets nothing) when the exchange cannot complete, so callers can degrade
	 * without ever using the wrong credential.
	 */
	async function establish(): Promise<boolean> {
		const target = selection.value;
		if (!isSecondary(target)) return false;
		const code = target?.code;
		const regionBase = withTrailingSlash(target?.apiUrl ?? "");
		if (!code || !regionBase) return false;

		// The main-region session is the *proof* of identity the grant is minted
		// from. It is read from the app's own scoped cookie; the API also accepts
		// its host-only platform cookie via `credentials: "include"`.
		const mainSID = useScopedCookie<string | undefined>(
			"sid",
			"inicontent",
		).value;

		try {
			const minted = await $fetch<{ grant?: string }>(
				`${mainBase}inicontent/auth/region-grant`,
				{
					method: "POST",
					body: { region: code },
					credentials: "include",
					...(mainSID ? { query: { inicontent_sid: mainSID } } : {}),
				},
			);
			if (!minted?.grant) return false;

			await $fetch(`${regionBase}inicontent/auth/region-grant/redeem`, {
				method: "POST",
				body: { grant: minted.grant },
				credentials: "include",
			});
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Expire the regional session cookie on an explicit region origin. Never
	 * touches the main region — that is a global sign-out, not a region switch.
	 */
	async function clear(apiUrl?: string | null): Promise<void> {
		const normalized = normalizeRegionApiUrl(apiUrl);
		if (!normalized) return;
		if (apiUrlOrigin(normalized) === apiUrlOrigin(mainBase)) return;
		try {
			await $fetch(
				`${withTrailingSlash(normalized)}inicontent/auth/region-session/signout`,
				{
					method: "POST",
					credentials: "include",
				},
			);
		} catch {
			// Best effort: a failed teardown must not strand the switch.
		}
	}

	/** Destroy the previous region's session, then establish the new one. */
	async function rotate(previousApiUrl?: string | null): Promise<void> {
		if (previousApiUrl) await clear(previousApiUrl);
		await establish();
	}

	return { establish, clear, rotate, isSecondary };
}
