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

import { useMainApiBase } from "./useMainApiBase.ts";
import {
	isSingleRegion as catalogHasSingleRegion,
	creatableRegions,
	DEFAULT_REGION_CODE,
	normalizePinnedRegion,
	registryRegionCode,
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
	selectableRegions,
	serializeRegionSelection,
	toRegionOption,
	withTrailingSlash,
} from "./region.ts";
import { useRegionSession } from "./useRegionSession.ts";

export function useRegion() {
	const config = useRuntimeConfig();

	const base = String(config.public?.apiBase ?? "");
	const mainBase = useMainApiBase();
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

	/** The catalog reduced to regions a picker may offer (enabled only). */
	const selectableCatalog = computed(() => selectableRegions(catalog.value));

	/** The catalog reduced to regions that accept new databases. */
	const creatableCatalog = computed(() => creatableRegions(catalog.value));

	/**
	 * Whether the catalog offers at most one creatable region. One available
	 * region is the default, so callers hide the picker instead of advertising a
	 * choice that does not exist.
	 */
	const isSingleRegion = computed(() => catalogHasSingleRegion(catalog.value));

	/** Reset the region-scoped caches. Called on every real region switch. */
	function resetRegionState() {
		clearNuxtState([...REGIONAL_STATE_KEYS]);
		clearNuxtData();
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
			{ credentials: "omit", cache: "no-store", timeout: 4000, retry: 0 },
		);
		if (!Array.isArray(response?.result))
			throw new Error("Invalid region catalog");
		catalog.value = response.result
			.map(toRegionOption)
			.filter((option): option is RegionOption => option !== null);
		return catalog.value;
	}

	/**
	 * Resolve the request base before the first navigation.
	 *
	 * The query and the region encoded in a tenant host or path must resolve
	 * against the registry before any database request is made.
	 *
	 * The two must agree. When an explicit query parameter and the hostname name
	 * different regions, resolution fails closed (`regionMismatch`) rather than
	 * silently choosing one — "do not fall back to the main region" applies in
	 * both directions.
	 *
	 * A **pinned** deployment that cannot resolve its region records an explicit
	 * error instead of silently falling back to the configured default: the
	 * region is part of the build, so another origin must never serve it.
	 *
	 * It is resolved **here**, in the `pre` plugin, so it is settled before the
	 * SaaS `domain.global.ts` middleware resolves a hostname to a database.
	 */
	async function bootstrap(
		requested?: string | null,
		hostRegion?: string | null,
		useLoadedCatalog = false,
	) {
		const raw = typeof requested === "string" ? requested.trim() : "";
		const queryCode = registryRegionCode(raw);
		if (raw && !queryCode) {
			regionError.value = "regionNotFound";
			return;
		}

		const rawHost = typeof hostRegion === "string" ? hostRegion.trim() : "";
		const hostCode = registryRegionCode(rawHost);
		if (rawHost && !hostCode) {
			regionError.value = "regionNotFound";
			return;
		}
		if (queryCode && hostCode && queryCode !== hostCode) {
			regionError.value = "regionMismatch";
			return;
		}

		const code = queryCode ?? hostCode;

		if (pinned && code && code !== pinned) {
			regionError.value = "regionMismatch";
			return;
		}
		if (!pinned && !selection.value && !code && !regionError.value) return;

		try {
			if (!useLoadedCatalog || !catalog.value.length) await loadRegions();
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
			// An explicit EU tenant URL must not silently fall back to the
			// global API when the region catalog is unavailable: surface a
			// region-unavailable error before any tenant request is made.
			if (
				config.public.regionalDatabasePaths &&
				code === DEFAULT_REGION_CODE &&
				catalog.value.length === 0
			) {
				regionError.value = "regionUnavailable";
				return;
			}
			const option = catalog.value.find((region) => region.code === code);
			if (option) {
				if (option.enabled === false) {
					regionError.value = "regionDisabled";
					return;
				}
				regionError.value = null;
				await select(option);
				return;
			}
			regionError.value = "regionNotFound";
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
		/** The catalog reduced to regions the picker may offer (sorted). */
		selectableCatalog,
		/** The catalog reduced to regions accepting new databases (sorted). */
		creatableCatalog,
		/** True when no more than one creatable region exists. */
		isSingleRegion,
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
