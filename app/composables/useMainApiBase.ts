import { withTrailingSlash } from "./region";

/**
 * The single seam for **main-region** API calls.
 *
 * The main region owns what is global: identities, the region catalog, pricing,
 * subscriptions, invoices and payments. Those endpoints must reach the main
 * control plane no matter which region the user has selected, or a regional
 * deployment would look for a subscription (or a user) that only exists there.
 *
 * `useApiBase()` is the opposite seam — region-scoped (tenant) requests. Reach
 * for this one only for the main-owned operations listed above.
 */
export function useMainApiBase(): string {
	const config = useRuntimeConfig();
	const base = String(
		config.public?.mainApiBase ?? config.public?.apiBase ?? "",
	);
	return base ? withTrailingSlash(base) : "";
}
