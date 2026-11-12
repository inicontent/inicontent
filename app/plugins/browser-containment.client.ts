import {
	BROWSER_CONTAINMENT_VERSION,
	migrateBrowserPersistence,
	purgeBrowserCopies,
} from "../composables/browserContainment";
import { releaseAllObjectUrls } from "../composables/managedObjectUrl";
import { resolvePhiDatabase, setPhiDatabase } from "../composables/phiGuard";

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
		let persistenceReady = false;
		function showGate(message: string) {
			const gate = document.createElement("div");
			gate.setAttribute("role", "alert");
			gate.style.cssText =
				"position:fixed;inset:0;z-index:2147483647;background:#fff;color:#172033;display:grid;place-content:center;padding:32px;font:18px/1.6 system-ui;text-align:center";
			gate.textContent = message;
			document.body.append(gate);
			return gate;
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
			const phi = resolvePhiDatabase(currentDatabase.value);
			const networkOnly = !persistenceReady || phi;
			setPhiDatabase(networkOnly);
			if (!loaded) return;
			try {
				worker?.controller?.postMessage({
					type: "CONTAINMENT_PHI",
					phi: networkOnly,
				});
			} catch {
				// The worker may be gone during unload; the next boot re-syncs.
			}
			if (phi) void purgeBrowserCopies().catch(() => {});
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
		// An older worker can intercept even no-store requests. Keep its clients
		// out of the app until the replacement controls the page.
		const controller = worker?.controller;
		const controllerIsCurrent =
			controller &&
			(await workerVersion(controller).catch(() => null)) ===
				BROWSER_CONTAINMENT_VERSION;
		async function updateWorker() {
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
			activate();
		}

		if (!import.meta.dev && worker && controller && !controllerIsCurrent) {
			const gate = showGate("Updating this browser’s app files…");
			worker.addEventListener(
				"controllerchange",
				() => window.location.reload(),
				{
					once: true,
				},
			);
			void (async () => {
				const registration = await worker.getRegistration().catch(() => null);
				if (await registration?.unregister().catch(() => false))
					window.location.reload();
				else await updateWorker();
			})().catch(() => {});
			gate.append(document.createElement("br"));
			const button = document.createElement("button");
			button.textContent = "Reload";
			button.onclick = () => window.location.reload();
			gate.append(button);
			await new Promise(() => {});
		}

		// Render with network-only access while persistence is being migrated.
		// A blocked or failed migration leaves offline storage disabled for this tab.
		void migrateBrowserPersistence(() => {})
			.then((result) => {
				quarantined.value = result;
				persistenceReady = true;
				syncPhi();
			})
			.catch(() => {});
		void updateWorker().catch(() => {});
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
		});
		window.addEventListener("focus", () => {
			if (
				currentDatabase.value?.slug &&
				resolvePhiDatabase(currentDatabase.value)
			)
				void purgeBrowserCopies().catch(() => {});
		});
		const channel =
			typeof BroadcastChannel === "undefined"
				? null
				: new BroadcastChannel("inicontent-session-boundary-v1");
		let leaving = false;
		async function resetContext(broadcast: boolean) {
			if (leaving) return;
			leaving = true;
			showGate("Your session changed. Reloading securely…");
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
