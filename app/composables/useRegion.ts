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
	parseRegionSelection,
	REGION_CATALOG_KEY,
	REGION_COOKIE,
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

export function useRegion() {
	const config = useRuntimeConfig();

	const base = String(config.public?.apiBase ?? "");
	const mainBase = String(config.public?.mainApiBase ?? base);
	const pinned = normalizePinnedRegion(config.public?.region);

	const cookie = useCookie<string | null>(REGION_COOKIE, { sameSite: true });
	const selection = useState<RegionSelection | null>(REGION_STATE_KEY, () =>
		parseRegionSelection(cookie.value),
	);
	const catalog = useState<RegionOption[]>(REGION_CATALOG_KEY, () => []);

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

	/** Select a region (or clear the selection back to the default). */
	function select(next: RegionSelection | RegionOption | null) {
		const normalized = next
			? parseRegionSelection({ code: next.code, apiUrl: next.apiUrl })
			: null;
		// A pinned deployment cannot be switched: the region is part of the
		// build, so any other target is refused rather than silently honoured.
		if (pinned && normalized && normalized.code !== pinned) return null;
		const changed = selection.value?.code !== normalized?.code;
		selection.value = normalized;
		cookie.value = serializeRegionSelection(normalized);
		if (changed) resetRegionState();
		return normalized;
	}

	/** Select a region by code, using the cached catalog for its API URL. */
	function selectByCode(code: string) {
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
	 * When the catalog is unreachable the current selection is left untouched —
	 * `null` for a pinned deployment, so requests stay on the configured base
	 * instead of guessing another region.
	 */
	async function bootstrap() {
		if (!pinned && !selection.value) return;

		try {
			await loadRegions();
		} catch {
			// Fail safe: never invent an origin.
			return;
		}

		if (pinned) {
			const resolved = resolvePinnedSelection(pinned, catalog.value);
			if (resolved) select(resolved);
			return;
		}

		select(resolveSelectionAgainstCatalog(selection.value, catalog.value));
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
		/** The origin requests target in the active region. */
		apiBase,
		select,
		selectByCode,
		loadRegions,
		bootstrap,
		resetRegionState,
	};
}
