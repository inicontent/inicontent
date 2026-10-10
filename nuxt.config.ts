import { realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

// The SPA app shell is served by the node server at "/" (there is no static
// index.html in .output/public), so workbox's navigateFallback has nothing to
// serve from its precache when the device is offline. Precache it explicitly
// with a build-unique revision so the shell is re-fetched on every SW update.
const appShellRevision = Date.now().toString(36);

// Icons that the static `clientBundle.scan` can't see (computed/ternary names
// used by the offline status UI) and that therefore must be listed explicitly
// to ever end up in the offline client bundle.
const explicitOfflineIcons = [
	// Network-state indicators (SyncStatus / connection UI)
	"tabler:refresh",
	"tabler:cloud-check",
	"tabler:cloud-off",
	"tabler:refresh-alert",
	"tabler:download",
	"tabler:wifi",
	"tabler:wifi-off",
	// Status / alerts
	"tabler:check",
	"tabler:alert-triangle",
	"tabler:circle-check",
	"tabler:alert-circle",
	"tabler:info-circle",
	"tabler:help-circle",
	// Layout / navigation handles referenced dynamically
	"tabler:chevron-left",
	"tabler:chevron-right",
	"tabler:chevron-down",
	"tabler:chevron-up",
	"tabler:square-minus",
	"tabler:square-check",
	"tabler:eye",
	"tabler:external-link",
	"tabler:question-mark",
	"tabler:chart-bar",
	"tabler:arrow-left",
	"tabler:arrow-right",
];

// Is this config evaluated for its own app, or for an app that extends this
// repo as a Nuxt layer (saas, clinicOS, starter, ...)? The explicit icons
// above are resolved from the `@iconify-json/tabler` package installed in
// THIS repo only; layer consumers don't install it, so every explicit icon
// would fail to resolve in their builds (dev warning, and a hard `nuxt
// prepare` / `nuxt build` failure). Restrict the explicit list to the source
// app — consumers rely on `scan` alone, which covers their static usages.
//
// NOTE: this gate is only about the *client* bundle. The server bundle
// (`/_nuxt_icon/*`) is a separate code path and is NOT gated here, because
// `provider: "server"` means there is no Iconify API fallback for it — it
// must serve the collection from disk. modules/icon-collections.ts keeps that
// path working for consumers in dev. Do not "fix" a broken server bundle by
// touching this gate.
const isSourceApp = realpathSync(process.cwd()) === realpathSync(currentDir);

export default defineNuxtConfig({
	ssr: false,
	sourcemap: false,
	telemetry: false,
	modules: [
		"@vite-pwa/nuxt",
		"@nuxtjs/device",
		"@nuxt/fonts",
		"@nuxt/icon",
		"nuxt-tiptap-editor",
	],
	experimental: {
		payloadExtraction: true,
	},
	icon: {
		// Serve icons from your Nuxt app endpoint, not Iconify API
		provider: "server",
		// Bundle icons into the app JS so they render with no network fetch at
		// all — the bundle is part of the precached chunks and works offline.
		// `scan` covers static `name="tabler:..."` usages; the explicit list
		// (see explicitOfflineIcons above) covers the network-state icons
		// (computed/ternary names) that scanning can't see, i.e. exactly what
		// the offline status UI needs. That explicit list only applies when
		// building the source app itself — layer consumers don't have the
		// `@iconify-json/tabler` package the icons are resolved from, and
		// scan alone is enough for their statically-named usages (the rest
		// fall through to the server bundle, see isSourceApp above).
		clientBundle: {
			scan: true,
			sizeLimitKb: 512,
			icons: isSourceApp ? explicitOfflineIcons : [],
		},
	},
	fonts: {
		experimental: {
			disableLocalFallbacks: true,
		},
		defaults: {
			subsets: ["latin", "arabic"],
		},
	},
	tiptap: {
		prefix: "Tiptap",
	},
	imports: {
		dirs: ["types/*.d.ts"],
	},
	// `app/components/Block/customBlocks.ts` is the custom block registry, not a
	// component. Without this the components scan registers its default export
	// as `BlockCustomBlocks` / `LazyBlockCustomBlocks`, which is dead weight and
	// implies a lazy chunk that never exists.
	components: {
		dirs: [
			{
				// Resolve `~` explicitly through this config file's real location.
				// When the layer is consumed as an npm package (pnpm/Vercel), the
				// symlinked `node_modules/inicontent` directory defeats the
				// components scan for `~/components` and the layer's components
				// silently fail to register ("failed to find LazyX imported from
				// '#components'").
				path: join(currentDir, "app/components"),
				pathPrefix: true,
				ignore: ["**/customBlocks.ts"],
			},
		],
	},
	app: {
		head: {
			viewport: "width=device-width, initial-scale=1, maximum-scale=1",
		},
	},
	// Two rules that keep the offline-first PWA out of the dev server's way.
	// Both have been broken before and the failure is silent — the dev origin
	// serves stale code and only an incognito window looks right:
	//
	// 1. `devOptions.enabled` must stay OFF (it is the default). Turning it on
	//    registers a real worker on `localhost:3434` that survives the option
	//    being removed — nothing unregisters it — and its navigateFallback +
	//    CacheFirst rules then freeze the dev origin until it is removed by
	//    hand (see app/plugins/dev-pwa-reset.client.ts, which cleans up
	//    whatever it can find but cannot run inside a shell it doesn't ship in).
	// 2. Never serve a build (`.output`, `nuxt preview`) on the dev origin.
	//    That shell contains NO dev code at all, so no in-app cleanup is
	//    possible — `pnpm preview` is pinned to port 4343 for exactly this.
	pwa: {
		manifest: {
			name: "Inicontent",
			short_name: "inic",
			theme_color: "#ff9800",
			display: "standalone",
			icons: [
				{
					src: "/pwa-192x192.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "any",
				},
				{
					src: "/pwa-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "any",
				},
				{
					src: "/pwa-maskable-192x192.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "maskable",
				},
				{
					src: "/pwa-maskable-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				},
			],
		},
		registerType: "prompt",
		workbox: {
			navigateFallback: "/",
			// @vite-pwa/nuxt overrides workbox's default globPatterns with just
			// the build-manifest JSON, so by default NO app chunk is precached
			// and the app can't boot offline without a prior warm visit (the
			// shell HTML would load, then every _nuxt import would fail).
			// Precache every production asset instead: hashed chunks are
			// immutable (dontCacheBustURLsMatching below skips revisions), so
			// the whole app boots from the precache even on a cold offline
			// start — including the error page used to show the friendly
			// "offline" state. vendor/ (e.g. opencv.js) stays runtime-cached.
			globPatterns: [
				"_nuxt/**/*.{js,css,woff,woff2}",
				"_fonts/**/*.{woff,woff2}",
				"manifest.webmanifest", "pwa-192x192.png", "pwa-512x512.png",
			],
			// Let the newly-installed SW control the current page immediately so a
			// single online visit populates the runtime caches (without this, the
			// first visit isn't intercepted and offline wouldn't work until a second).
			clientsClaim: true,
			// The SPA shell isn't a static file, so add it to the precache
			// manifest manually (see appShellRevision above) — otherwise offline
			// navigation has nothing to serve and the app can never load.
			additionalManifestEntries: [{ url: "/", revision: appShellRevision }],
			// A3: only the precached build shell is available offline.
			cacheId: "inicontent-shell-v1",
			importScripts: ["/inicontent-containment-v1.js"],
			runtimeCaching: [],
		},
	},
	// "INIc" in binary. Gated on isSourceApp: every app that extends this repo
	// as a layer inherits this value, so without the gate all of them fight for
	// 3434 — get-port gives it to whichever dev server started first and the
	// loser silently moves to another port, so opening 3434 then shows a
	// DIFFERENT app and your edits appear to do nothing. The source app keeps
	// 3434; layer apps fall back to Nuxt's normal port selection, which their
	// terminal prints.
	...(isSourceApp ? { devServer: { port: 3434 } } : {}),
	devtools: {
		enabled: false,
	},
	vite: {
		resolve: {
			alias: [
				{
					// mjml-core eagerly requires htmlnano (for its optional `minify`
					// feature, which the email editor never enables). htmlnano drags
					// cosmiconfig -> env-paths into the client bundle and env-paths
					// calls `os.homedir()` at module-eval time, which crashes the
					// lazily-loaded MJML chunk in the browser (all previews empty).
					// See stubs/htmlnano-browser.mjs — a faithful no-op for minify.
					find: /^htmlnano$/,
					replacement: join(currentDir, "stubs/htmlnano-browser.mjs"),
				},
			],
		},
		optimizeDeps: {
			exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
		},
	},
	compatibilityDate: "latest",
	runtimeConfig: {
		public: {
			apiBase: process.env.apiBase || "https://api.inicontent.com/",
			idOne: process.env.idOne || "d7b3d61a582e53ee29b5a1d02a436d55",
			database: process.env.database || "inicontent",
		},
	},
});
