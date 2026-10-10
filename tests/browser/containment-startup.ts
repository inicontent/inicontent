/** Exercise actual startup plugin against a real worker and real storage. */
const state = new Map<string, { value: unknown }>();
let defaults: { cache?: string; onResponse?: (event: unknown) => void };
const hooks = new Map<string, () => void>();
Object.assign(globalThis, {
	defineNuxtPlugin: (plugin: unknown) => plugin,
	useState: (key: string, init?: () => unknown) => {
		if (!state.has(key)) state.set(key, { value: init?.() });
		return state.get(key);
	},
	useRuntimeConfig: () => ({ public: { apiBase: `${location.origin}/api/` } }),
	// The plugin reads the base through the seam composable, not the config.
	useApiBase: () => `${location.origin}/api/`,
	$fetch: {
		create: (options: typeof defaults) => {
			defaults = options;
			return {};
		},
	},
	clearNuxtData: () => {},
	watch: () => {},
});
async function run() {
	const { default: plugin } = await import(
		"../../app/plugins/browser-containment.client"
	);
	await plugin.setup({
		hook: (name: string, handler: () => void) => hooks.set(name, handler),
	});
	hooks.get("app:mounted")?.();
	if (!state.get("containment_quarantined")?.value)
		throw new Error("quarantine notice missing");
	if (defaults.cache !== "no-store")
		throw new Error("fetch default not enforced");
	if (document.querySelector('[role="alert"]'))
		throw new Error("startup gate did not clear");
	const response = await fetch("/api/synthetic");
	if (response.status !== 200) throw new Error("startup handshake missing");
	document.body.appendChild(document.createElement("p")).textContent =
		"STARTUP PLUGIN CHECKS PASSED: migration, notice, fetch defaults and worker handshake";
}
run().catch((error) => {
	document.body.appendChild(document.createElement("p")).textContent =
		`FAIL: ${error.message}`;
});
