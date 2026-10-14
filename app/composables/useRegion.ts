/**
 * Region selection state (multi-region plan, M1/M2 — client side).
 *
 * A deployment is either **pinned** to one region at build time
 * (`INICONTENT_REGION`, e.g. a regional app) or **multi-region** and lets the
 * user pick. Selecting a region changes the API origin every request targets,
 * and clears the region-scoped Nuxt state so nothing leaks across regions.
 *
 * Pure parsing/validation lives in `./region.ts`; this is the reactive wrapper.
 */

import {
	normalizePinnedRegion,
	normalizeRegionCode,
	parseRegionSelection,
	REGION_CATALOG_KEY,
	REGION_COOKIE,
	REGION_ERROR_KEY,
	REGION_STATE_KEY,
	REGIONAL_STATE_KEYS,
	type RegionOption,
	type RegionSelection,
	regionApiBase,
	resolvePinnedSelection,
	resolveSelectionAgainstCatalog,
	serializeRegionSelection,
	toRegionOption,
	withTrailingSlash,
} from "./region";
import { useRegionSession } from "./useRegionSession";

export function useRegion() {
	const config = useRuntimeConfig();

	const base = String(config.public?.apiBase ?? "");
	const mainBase = String(config.public?.mainApiBase ?? base);
	const pinned = normalizePinnedRegion(config.public?.region);
	const session = useRegionSession();

	const cookie = useCookie<string | null>(REGION_COOKIE, { sameSite: true });
	const selection = useState<RegionSelection | null>(REGION_STATE_KEY, () =>
		parseRegionSelection(cookie.value),
	);
	const catalog = useState<RegionOption[]>(REGION_CATALOG_KEY, () => []);
	const regionError = useState<string | null>(REGION_ERROR_KEY, () => null);

	/** The origin every request in the active region targets. */
	const apiBase = computed(() =>
		withTrailingSlash(regionApiBase(selection.value, base)),
	);

	/** Whether a database may be created in the active region. */
	const activeRegion = computed(
		() =>
			catalog.value.find(({ code }) => code === selection.value?.code) ?? null,
	);

	/** Reset the region-scoped caches. Called on every real region switch. */
	function resetRegionState() {
		clearNuxtState([...REGIONAL_STATE_KEYS]);
	}

	/**
	 * Select a region (or clear the selection back to the default).
	 *
	 * Switching to a different region first tears down the previous region's
	 * session and then — for a secondary region — establishes the new one, so a
	 * request never carries the old region's credential. Same-region calls only
	 * (re)establish, which makes this safe to call from bootstrap.
	 */
	async function select(next: RegionSelection | RegionOption | null) {
		const normalized = next
			? parseRegionSelection({ code: next.code, apiUrl: next.apiUrl })
			: null;
		// A pinned deployment cannot be switched: the region is part of the
		// build, so any other target is refused rather than silently honoured.
		if (pinned && normalized && normalized.code !== pinned) return null;
		const previousApiUrl = selection.value?.apiUrl ?? null;
		const changed = selection.value?.code !== normalized?.code;
		selection.value = normalized;
		cookie.value = serializeRegionSelection(normalized);
		if (changed) {
			resetRegionState();
			regionError.value = null;
		}
		await session.rotate(changed ? previousApiUrl : null);
		return normalized;
	}

	/** Select a region by code, using the cached catalog for its API URL. */
	async function selectByCode(code: string) {
		const option = catalog.value.find((region) => region.code === code);
		if (!option) return null;
		return select(option);
	}

	/**
	 * Fetch the region catalog from the **main** region and cache it.
	 *
	 * The main region is the authority for `code → apiUrl`, so the catalog is
	 * always read from there — never from the currently selected region, which
	 * would let a bad selection re-point its own validation.
	 */
	async function loadRegions() {
		const query = withTrailingSlash(mainBase);
		const response = await $fetch<apiResponse<RegionOption[]>>(
			`${query}inicontent/regions`,
			{ credentials: "include", cache: "no-store" },
		);
		catalog.value = (Array.isArray(response?.result) ? response.result : [])
			.map(toRegionOption)
			.filter((option): option is RegionOption => option !== null);
		return catalog.value;
	}

	/**
	 * Resolve the request base before the first navigation.
	 *
	 * A multi-region deployment with no persisted selection has nothing to
	 * resolve and keeps the configured default (the catalog is loaded lazily by
	 * the picker). Otherwise the catalog is fetched once and becomes the
	 * authority: a pinned deployment snaps to its own region; a multi-region one
	 * keeps its persisted selection only if the catalog still vouches for it.
	 *
	 * A **pinned** deployment that cannot resolve its region records an explicit
	 * error instead of silently falling back to the configured default: the
	 * region is part of the build, so another origin must never serve it. The
	 * same holds for an explicit deep link naming an unknown or disabled region
	 * — it is never quietly ignored.
	 *
	 * `requested` is the raw `?region=` value from the current URL (or `null`).
	 * It is resolved **here**, in the `pre` plugin, so it is settled before the
	 * SaaS `domain.global.ts` middleware resolves a hostname to a database.
	 */
	async function bootstrap(requested?: string | null) {
		const raw = typeof requested === "string" ? requested.trim() : "";
		const code = normalizeRegionCode(raw);
		if (raw && !code) {
			regionError.value = "regionNotFound";
			return;
		}
		if (!pinned && !selection.value && !code && !regionError.value) return;

		try {
			await loadRegions();
		} catch {
			// A pinned deployment or an explicit deep link must not proceed on a
			// stale/absent catalog; a plain persisted selection fails soft (the
			// app is an offline-first PWA and keeps its last selection).
			if (pinned || code || regionError.value)
				regionError.value = "regionCatalogUnavailable";
			return;
		}
		regionError.value = null;

		if (pinned) {
			const resolved = resolvePinnedSelection(pinned, catalog.value);
			if (!resolved) {
				regionError.value = "regionUnavailable";
				return;
			}
			regionError.value = null;
			await select(resolved);
			return;
		}

		if (code) {
			const option = catalog.value.find((region) => region.code === code);
			if (!option) {
				regionError.value = "regionNotFound";
				return;
			}
			if (option.enabled === false) {
				regionError.value = "regionDisabled";
				return;
			}
			regionError.value = null;
			await select(option);
			return;
		}

		await select(
			resolveSelectionAgainstCatalog(selection.value, catalog.value),
		);
	}

	return {
		/** The active selection, or null when the default API base is used. */
		selection,
		/** The fetched region catalog (empty until `loadRegions`). */
		catalog,
		/** The region code this deployment is pinned to, or "" when multi-region. */
		pinned,
		/** True when the deployment cannot switch regions. */
		isPinned: computed(() => !!pinned),
		/** The active region's catalog entry, when known. */
		activeRegion,
		/** An explicit region-resolution failure, if any (pinned deployments). */
		regionError,
		/** The origin requests target in the active region. */
		apiBase,
		select,
		selectByCode,
		loadRegions,
		bootstrap,
		resetRegionState,
	};
}
