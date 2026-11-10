import { withTrailingSlash } from "./region";

/**
 * The single seam for **main control-plane** API calls.
 *
 * `https://api.inicontent.com` owns what is global: identities (auth and users),
 * the region catalog, pricing, subscriptions, invoices and payments, plus
 * compliance and monitoring. Those endpoints must reach the main control plane
 * no matter which region the user has selected: one inicontent user can own
 * databases in several regions, and a regional deployment hosts none of this
 * global state.
 *
 * `mainApiBase` is configured on its own, independently of
 * `config.public.apiBase` — the region-scoped origin, which may point at a
 * regional deployment that hosts none of this global state. The trailing
 * `apiBase` fallback is only a last resort for a consumer that predates the
 * config key; with the layer's config in place it is never reached.
 *
 * `useApiBase()` is the opposite seam — region-scoped (tenant/database)
 * requests. Reach for this one only for the main-owned operations above.
 */
export function useMainApiBase(): string {
	const config = useRuntimeConfig();
	const base = String(
		config.public?.mainApiBase ?? config.public?.apiBase ?? "",
	);
	return base ? withTrailingSlash(base) : "";
}
