import {
	BROWSER_CONTAINMENT_VERSION,
	migrateBrowserPersistence,
	purgeBrowserCopies,
} from "../composables/browserContainment";

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
		worker?.addEventListener("message", (event) => {
			if (event.data?.type === "CONTAINMENT_IDENTIFY")
				event.ports[0]?.postMessage(BROWSER_CONTAINMENT_VERSION);
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
			if (!import.meta.dev && worker) {
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
				await registration.update();
				activate();
				const deadline = Date.now() + 15_000;
				while (
					!worker.controller ||
					(await workerVersion(worker.controller)) !==
						BROWSER_CONTAINMENT_VERSION
				) {
					if (Date.now() > deadline) throw new Error("worker-update-required");
					activate();
					await new Promise((resolve) => setTimeout(resolve, 250));
				}
			}
			quarantined.value = await migrateBrowserPersistence(blocked);
			gate.remove();
		} catch {
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
		// Ask the active worker to keep all subsequent data fetches network-only.
		// The worker's per-request handshake also blocks un-updated tabs.
		worker?.addEventListener("controllerchange", () => {
			void purgeBrowserCopies();
		});
		window.addEventListener("focus", () => {
			void purgeBrowserCopies();
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
