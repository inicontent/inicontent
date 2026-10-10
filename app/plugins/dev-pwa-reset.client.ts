/**
 * Dev-only kill switch for a stale service worker.
 *
 * `pwa.devOptions.enabled` is (and must stay) off, so `pnpm dev` never
 * REGISTERS a worker — but a worker registered in the past (this repo used to
 * ship `devOptions: { enabled: true }`, or a build was previewed on the dev
 * origin) keeps controlling `localhost:3434` forever, because nothing in the
 * app ever unregisters one. Its workbox config then answers every navigation
 * from the precached shell and `CacheFirst`-serves scripts/styles for 30 days,
 * so edits appear only in a fresh (incognito) window.
 *
 * So the dev bundle actively removes any worker it finds: unregister every
 * registration on this origin, drop every cache, and — if a worker was
 * actually controlling this page, i.e. the page we just loaded may be the
 * stale shell — reload once so the clean state is what the tab shows.
 *
 * The reload is rate-limited through `sessionStorage` so an `unregister()`
 * that doesn't take effect cannot loop (same one-shot idea as
 * offline-warmup.client.ts, which tolerates the controllerchange this fires).
 *
 * Deliberately dev-only: `import.meta.dev` is statically false in a build, so
 * none of this reaches production, where the worker is the point.
 */
export default defineNuxtPlugin(() => {
	if (!import.meta.dev) return;
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
		return;

	const RELOAD_KEY = "inicontent:dev-sw-reset-at";
	const RELOAD_COOLDOWN_MS = 60_000;

	// A page the worker controls may be the frozen shell it served.
	const wasControlled = !!navigator.serviceWorker.controller;

	void (async () => {
		const registrations = await navigator.serviceWorker.getRegistrations();
		const cacheNames = typeof caches === "undefined" ? [] : await caches.keys();
		if (!registrations.length && !cacheNames.length) return;

		await Promise.all(registrations.map((r) => r.unregister()));
		await Promise.all(cacheNames.map((name) => caches.delete(name)));
		console.info(
			`[dev] cleared ${registrations.length} service worker registration(s) and ${cacheNames.length} cache(s)`,
		);

		if (!wasControlled) return;

		let lastReload = 0;
		try {
			lastReload = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
		} catch {
			/* sessionStorage unavailable: reload below, once, unprotected */
		}
		if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return;

		try {
			sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
		} catch {
			/* same — reload anyway */
		}
		window.location.reload();
	})();
});
