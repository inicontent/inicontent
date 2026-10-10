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
 * caller-supplied headers are left alone.
 */
export default defineNuxtPlugin(() => {
	if (typeof window === "undefined" || typeof window.fetch !== "function")
		return;

	const original = window.fetch.bind(window);
	const base = window.location.href;

	window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
		try {
			const rewritten = rewriteSidRequest(
				input as string | URL | Request,
				init,
				base,
			);
			if (rewritten) return original(rewritten.input, rewritten.init);
		} catch {
			// A malformed request must still be sent as-is.
		}
		return original(input, init);
	};
});
