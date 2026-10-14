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

	/** Fetch the region catalog from the main region and cache it. */
	async function loadRegions() {
		const query = withTrailingSlash(regionApiBase(selection.value, mainBase));
		const response = await $fetch<apiResponse<RegionOption[]>>(
			`${query}inicontent/regions`,
			{ credentials: "include", cache: "no-store" },
		);
		catalog.value = (Array.isArray(response?.result) ? response.result : [])
			.map(toRegionOption)
			.filter((option): option is RegionOption => option !== null);
		return catalog.value;
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
		resetRegionState,
	};
}
