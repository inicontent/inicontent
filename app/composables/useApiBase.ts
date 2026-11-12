import { useMainApiBase } from "./useMainApiBase.ts";
import {
	REGION_STATE_KEY,
	type RegionSelection,
	withTrailingSlash,
} from "./region.ts";

/**
 * The single seam for **region-scoped** API calls: tenant databases, their
 * tables/assets/pages, and the per-region database list. It resolves to the
 * active region's origin when one is selected (`INICONTENT_REGION` or the
 * region picker), and to the configured default otherwise — which is the main
 * control plane, the only deployed region at launch. A user switches regions
 * here to fetch that region's databases, while their global identity stays on
 * `useMainApiBase()`.
 *
 * Every region-scoped call site must read it through this composable so region
 * routing stays a one-place change. Do not add new direct
 * `config.public.apiBase` reads.
 */
export function useRegionalApiBase(): string {
	const config = useRuntimeConfig();
	const region = useState<RegionSelection | null>(REGION_STATE_KEY, () => null);

	const base = region.value?.apiUrl || String(config.public?.apiBase ?? "");
	return base ? withTrailingSlash(base) : "";
}

/** Route requests to the platform database independently of the selected region. */
export function useApiBase(
	databaseSlug = useState<Database | undefined>("database").value?.slug,
): string {
	return databaseSlug === "inicontent" ? useMainApiBase() : useRegionalApiBase();
}
