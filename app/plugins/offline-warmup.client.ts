/**
 * Warm the runtime caches on the very first visit.
 *
 * The page's boot requests — notably the database metadata fetch in
 * middleware/database.ts — fire before the freshly installed service worker
 * activates and claims the page. They are therefore NOT intercepted by workbox
 * and never populate the runtime caches, so offline used to work only from the
 * second visit onward.
 *
 * When the service worker takes control for the first time (clientsClaim), we
 * reload the page once: every boot request on the reloaded page flows through
 * the SW, caching the DB metadata (and anything else requested early) plus the
 * still-warming chunks. Offline then works from the very first visit.
 *
 * The reload is a one-shot: `sessionStorage` survives the reload and the module
 * flag guards the rest of the page's lifetime, so a later SW update that
 * re-claims the page never triggers another reload.
 */
export default defineNuxtPlugin(() => {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
		return;

	// Already controlled: this page's boot requests were intercepted and the
	// caches are warm — no reload needed.
	if (navigator.serviceWorker.controller) return;

	const WARMED_FLAG = "inicontent:sw-first-claim-warmed";
	let reloadRequested = false;

	const hasWarmed = () => {
		try {
			return sessionStorage.getItem(WARMED_FLAG) !== null;
		} catch {
			return reloadRequested;
		}
	};

	const markWarmed = () => {
		reloadRequested = true;
		try {
			sessionStorage.setItem(WARMED_FLAG, "1");
		} catch {
			/* the module flag still prevents a second reload this page */
		}
	};

	navigator.serviceWorker.addEventListener("controllerchange", () => {
		if (!navigator.serviceWorker.controller) return;
		if (hasWarmed()) return;
		markWarmed();
		window.location.reload();
	});
});
