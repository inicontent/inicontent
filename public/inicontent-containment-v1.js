/* Imported before Workbox routes. Never cache API or user-supplied assets. */
(() => {
	const version = "browser-storage-v1";
	const sensitiveCache = (name) =>
		/^inicontent-(api|config|static|icon)-cache$/.test(name) ||
		name.startsWith("workbox-precache-");
	self.addEventListener("activate", (event) => {
		event.waitUntil(
			caches
				.keys()
				.then((names) =>
					Promise.all(
						names.filter(sensitiveCache).map((name) => caches.delete(name)),
					),
				),
		);
	});
	self.addEventListener("message", (event) => {
		if (event.data?.type === "CONTAINMENT_VERSION")
			event.ports[0]?.postMessage(version);
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
