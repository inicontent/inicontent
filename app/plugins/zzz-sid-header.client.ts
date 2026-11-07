import type { RegionOption, RegionSelection } from "#imports";
/**
 * Move tenant session IDs from URL query strings into the Authorization
 * header, at the network boundary.
 *
 * Why `window.fetch` and not a `$fetch` wrapper: Nuxt resolves its
 * auto-imported `$fetch` at build time to its own module export, so
 * reassigning `globalThis.$fetch` from a plugin never reaches the call sites
 * that matter (and Nuxt overwrites `globalThis.$fetch` after plugins run).
 * ofetch dereferences the global `fetch` at call time, so wrapping it here
 * intercepts every caller: ofetch, raw `fetch`, and any library built on them.
 *
 * Rules live in `sidRequest.ts`: a single `*_sid` is moved to
 * `Authorization: Bearer` and stripped from the URL; multi-sid and
 * caller-supplied headers are left alone. Requests to a **secondary region**
 * origin additionally lose `inicontent_sid` entirely — the main-region platform
 * session must never be forwarded to another region, which authenticates with
 * its own host-only regional session cookie instead.
 *
 * The region state is captured once here (same `useState` instances the region
 * composables use) so the wrapper never needs a Nuxt context at call time.
 */
export default defineNuxtPlugin(() => {
	if (typeof window === "undefined" || typeof window.fetch !== "function")
		return;

	const config = useRuntimeConfig();
	const selection = useState<RegionSelection | null>(
		REGION_STATE_KEY,
		() => null,
	);
	const catalog = useState<RegionOption[]>(REGION_CATALOG_KEY, () => []);

	const original = window.fetch.bind(window);
	const base = window.location.href;

	window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
		try {
			const regionOrigins = collectRegionOrigins({
				selection: selection.value,
				catalog: catalog.value,
				mainApiUrl: config.public?.mainApiBase ?? config.public?.apiBase,
			});
			const rewritten = rewriteSidRequest(
				input as string | URL | Request,
				init,
				base,
				regionOrigins,
			);
			if (rewritten) return original(rewritten.input, rewritten.init);
		} catch {
			// A malformed request must still be sent as-is.
		}
		return original(input, init);
	};
});
