/* Imported before Workbox routes. Runtime-caches API/asset responses only for
 * clients whose active database is not flagged PHI; PHI (and unknown) clients
 * stay network-only and must answer the handshake. */
(() => {
	const version = "browser-storage-v1";
	// clientId -> boolean (true = PHI). An absent entry is unknown and treated
	// as PHI, so nothing is cached until a client positively reports non-PHI.
	const phiByClient = new Map();
	self.addEventListener("message", (event) => {
		const data = event.data;
		if (data?.type === "CONTAINMENT_VERSION") {
			event.ports[0]?.postMessage(version);
		} else if (data?.type === "CONTAINMENT_PHI" && event.source?.id) {
			phiByClient.set(event.source.id, data.phi === true);
		}
	});
	self.addEventListener("activate", (event) => {
		// A restarted worker has no per-client state: ask every client to report
		// its active database before caching resumes.
		event.waitUntil(
			self.clients.matchAll().then((clients) => {
				for (const client of clients)
					client.postMessage({ type: "CONTAINMENT_REPORT_PHI" });
			}),
		);
	});
	async function currentClient(clientId) {
		const client = clientId && (await self.clients.get(clientId));
		if (!client) return false;
		return new Promise((resolve) => {
			const channel = new MessageChannel();
			const finish = (value) => {
				clearTimeout(timer);
				channel.port1.close();
				resolve(value);
			};
			const timer = setTimeout(() => finish(false), 2000);
			channel.port1.onmessage = (event) => finish(event.data === version);
			client.postMessage({ type: "CONTAINMENT_IDENTIFY" }, [channel.port2]);
		});
	}
	self.addEventListener("fetch", (event) => {
		const request = event.request;
		const url = new URL(request.url);
		// Only the static shell/navigation belongs to Workbox's precache handler.
		const shell =
			request.method === "GET" &&
			url.origin === self.location.origin &&
			(request.mode === "navigate" ||
				url.pathname.startsWith("/_nuxt/") ||
				url.pathname.startsWith("/_fonts/") ||
				[
					"/manifest.webmanifest",
					"/pwa-192x192.png",
					"/pwa-512x512.png",
				].includes(url.pathname));
		if (shell) return;
		// Known non-PHI client: fall through to Workbox's runtime routes so the
		// response can be served offline later.
		if (phiByClient.get(event.clientId) === false) return;
		event.respondWith(
			(async () => {
				// A stale tab cannot continue reading responses or replaying its old queue
				// under the new worker. Updated clients answer this handshake, including
				// after a worker restart; no identity or clinical data is exchanged.
				if (!(await currentClient(event.clientId)))
					return new Response(
						JSON.stringify({
							result: null,
							message: "Reload required before continuing",
							code: 409,
						}),
						{
							status: 409,
							headers: {
								"Content-Type": "application/json",
								"Cache-Control": "no-store",
							},
						},
					);
				return fetch(request, { cache: "no-store" });
			})(),
		);
	});
})();
