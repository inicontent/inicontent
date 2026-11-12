import { withTrailingSlash } from "./region.ts";

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
 * The control plane can be overridden for local and self-hosted deployments.
 */
export function useMainApiBase(): string {
	const config = useRuntimeConfig();
	return withTrailingSlash(
		String(config.public?.mainApiBase || "https://api.inicontent.com/"),
	);
}
