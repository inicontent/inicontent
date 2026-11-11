import {
	BROWSER_CONTAINMENT_VERSION,
	migrateBrowserPersistence,
	purgeBrowserCopies,
} from "../composables/browserContainment";
import { releaseAllObjectUrls } from "../composables/managedObjectUrl";
import {
	isPhiDatabase,
	resolvePhiDatabase,
	setPhiDatabase,
} from "../composables/phiGuard";

export default defineNuxtPlugin({
	name: "browser-containment",
	enforce: "pre",
	async setup(nuxtApp) {
		const currentUser = useState<User | undefined>("user");
		const currentDatabase = useState<Database>("database");
		const loggingOut = useState<boolean>("containment_loggingOut", () => false);
		const quarantined = useState<boolean>(
			"containment_quarantined",
			() => false,
		);
		// The gate is intentionally outside Vue: it remains visible while an IDB
		// version upgrade waits on an old tab, before route middleware or forms run.
		const gate = document.createElement("div");
		gate.setAttribute("role", "alert");
		gate.style.cssText =
			"position:fixed;inset:0;z-index:2147483647;background:#fff;color:#172033;display:grid;place-content:center;padding:32px;font:18px/1.6 system-ui;text-align:center";
		gate.textContent = "Securing this browser’s stored data…";
		document.body.append(gate);
		function blocked() {
			gate.textContent =
				"Close other tabs or installed windows of this app to continue. Unsynced work is being preserved. Do not clear site data.";
		}
		const worker = navigator.serviceWorker;
		/**
		 * Keep the PHI guard and the service worker in sync with the active
		 * database. Until a database is positively loaded as non-PHI we assume
		 * PHI, so no response is runtime-cached in the meantime.
		 */
		function syncPhi() {
			const loaded = Boolean(currentDatabase.value?.slug);
			// Conservative (C1): only an explicit `phi: false` is non-PHI.
			const phi = loaded ? resolvePhiDatabase(currentDatabase.value) : true;
			setPhiDatabase(phi);
			if (!loaded) return;
			try {
				worker?.controller?.postMessage({ type: "CONTAINMENT_PHI", phi });
			} catch {
				// The worker may be gone during unload; the next boot re-syncs.
			}
			if (phi) void purgeBrowserCopies();
		}
		worker?.addEventListener("message", (event) => {
			if (event.data?.type === "CONTAINMENT_IDENTIFY")
				event.ports[0]?.postMessage(BROWSER_CONTAINMENT_VERSION);
			else if (event.data?.type === "CONTAINMENT_REPORT_PHI") syncPhi();
		});
		async function workerVersion(controller: ServiceWorker): Promise<unknown> {
			return new Promise((resolve) => {
				const channel = new MessageChannel();
				const timer = setTimeout(() => {
					channel.port1.close();
					resolve(null);
				}, 1500);
				channel.port1.onmessage = (event) => {
					clearTimeout(timer);
					channel.port1.close();
					resolve(event.data);
				};
				controller.postMessage({ type: "CONTAINMENT_VERSION" }, [
					channel.port2,
				]);
			});
		}
		try {
			const ensureWorker = (async () => {
				if (import.meta.dev || !worker) return;
				const registration = await worker.register("/sw.js", {
					scope: "/",
					updateViaCache: "none",
				});
				const activate = () =>
					registration.waiting?.postMessage({ type: "SKIP_WAITING" });
				registration.installing?.addEventListener("statechange", activate);
				registration.addEventListener("updatefound", () =>
					registration.installing?.addEventListener("statechange", activate),
				);
				await Promise.race([
					registration.update(),
					new Promise((_, reject) =>
						setTimeout(
							() => reject(new Error("worker-update-timeout")),
							10_000,
						),
					),
				]);
				activate();
				if (!registration.waiting && worker.controller) {
					const current = await workerVersion(worker.controller);
					if (current === BROWSER_CONTAINMENT_VERSION) return;
				}
				const deadline = Date.now() + 15_000;
				while (
					!worker.controller ||
					(await workerVersion(worker.controller)) !==
						BROWSER_CONTAINMENT_VERSION
				) {
					if (Date.now() > deadline) throw new Error("worker-update-required");
					activate();
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			})();
			const quarantinedResult = (
				await Promise.all([ensureWorker, migrateBrowserPersistence(blocked)])
			)[1];
			quarantined.value = quarantinedResult;
			gate.remove();
			syncPhi();
		} catch {
			try {
				const registrations = await worker?.getRegistrations?.();
				await Promise.all(
					(registrations ?? []).map((registration) =>
						registration.unregister(),
					),
				);
				if (typeof caches !== "undefined") {
					const names = await caches.keys();
					await Promise.all(names.map((name) => caches.delete(name)));
				}
			} catch {
				// Best-effort recovery.
			}
			gate.textContent =
				"Browser update or storage cleanup could not finish. Close other app tabs, reconnect and reload. Unsynced work is preserved; do not clear site data.";
			const button = document.createElement("button");
			button.textContent = "Reload";
			button.onclick = () => window.location.reload();
			gate.append(button);
			// Keep boot suspended: a failed migration must not enable cached fallbacks.
			await new Promise(() => {});
		}
		const apiBase = useApiBase();
		globalThis.$fetch = globalThis.$fetch.create({
			cache: "no-store",
			onResponse({ request, response }) {
				if (
					String(request).startsWith(String(apiBase)) &&
					currentUser.value?.id &&
					(response.status === 401 || response._data?.code === "loginFirst")
				)
					void resetContext(true);
			},
		});
		// Keep the guard and the worker informed as soon as the database the user
		// is working in is known (or changes).
		watch(
			() => [currentDatabase.value?.slug, currentDatabase.value?.phi],
			() => syncPhi(),
			{ immediate: true },
		);
		// A PHI database keeps every subsequent data fetch network-only; the
		// worker's per-request handshake also blocks un-updated tabs. Non-PHI
		// databases fall through to the runtime caches instead.
		worker?.addEventListener("controllerchange", () => {
			syncPhi();
			if (isPhiDatabase()) void purgeBrowserCopies();
		});
		window.addEventListener("focus", () => {
			if (isPhiDatabase()) void purgeBrowserCopies();
		});
		const channel =
			typeof BroadcastChannel === "undefined"
				? null
				: new BroadcastChannel("inicontent-session-boundary-v1");
		let leaving = false;
		async function resetContext(broadcast: boolean) {
			if (leaving) return;
			leaving = true;
			document.body.append(gate);
			gate.textContent = "Your session changed. Reloading securely…";
			if (broadcast) {
				try {
					if (channel) channel.postMessage("reset");
					else
						localStorage.setItem(
							"inicontent:session-boundary:v1",
							String(Date.now()),
						);
				} catch {
					// A blocked browser storage API must not prevent this tab resetting.
				}
			}
			clearNuxtData();
			// Drop in-memory media handles to the previous session before reload.
			releaseAllObjectUrls();
			await purgeBrowserCopies().catch(() => {});
			// A reload drops component state and in-flight requests as well as Nuxt data.
			window.location.reload();
		}
		window.addEventListener("storage", (event) => {
			if (event.key === "inicontent:session-boundary:v1")
				void resetContext(false);
		});
		channel?.addEventListener("message", () => {
			void resetContext(false);
		});
		window.addEventListener("inicontent-session-ended", () => {
			void resetContext(true);
		});
		nuxtApp.hook("app:mounted", () => {
			watch(
				() => [currentUser.value?.id, currentDatabase.value?.slug],
				(next, previous) => {
					// Initial sign-in after an anonymous page has no previous authenticated state.
					if (
						!loggingOut.value &&
						previous[0] != null &&
						(next[0] !== previous[0] || next[1] !== previous[1])
					)
						void resetContext(true);
				},
			);
		});
	},
});
