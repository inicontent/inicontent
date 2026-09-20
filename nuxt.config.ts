import { realpathSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
// app — consumers fall back to `scan` and the Iconify API instead.
const isSourceApp =
	realpathSync(process.cwd()) ===
	realpathSync(dirname(fileURLToPath(import.meta.url)));

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
		// `@iconify-json/tabler` package the icons are resolved from.
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
	app: {
		head: {
			viewport: "width=device-width, initial-scale=1, maximum-scale=1",
		},
	},
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
				"**/*.{png,ico,svg,webmanifest,json}",
			],
			// Let the newly-installed SW control the current page immediately so a
			// single online visit populates the runtime caches (without this, the
			// first visit isn't intercepted and offline wouldn't work until a second).
			clientsClaim: true,
			// The SPA shell isn't a static file, so add it to the precache
			// manifest manually (see appShellRevision above) — otherwise offline
			// navigation has nothing to serve and the app can never load.
			additionalManifestEntries: [{ url: "/", revision: appShellRevision }],
			runtimeCaching: [
				{
					// Icons are served by the Nuxt app's own /_nuxt_icon endpoint
					// (same origin). The clientBundle above covers the statically
					// used + network-state icons; this route saves any other icon
					// (icon-picker choices, per-item/table icons) the first time
					// it's fetched while online, then serves it from cache
					// offline. Revalidate in the background so collections stay
					// fresh while online.
					urlPattern: ({ url }) => url.pathname.includes("_nuxt_icon/"),
					handler: "StaleWhileRevalidate",
					options: {
						cacheName: "inicontent-icon-cache",
						expiration: {
							maxEntries: 400,
							maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
						},
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
				{
					// Database metadata, dashboard definitions and other
					// rarely-changing configuration. Serve from cache instantly,
					// revalidate in the background.
					urlPattern: ({ url, request }) =>
						url.hostname.endsWith("inicontent.com") &&
						request.method === "GET" &&
						/\/databases\/|\/translations$|\/schema$/i.test(url.pathname),
					handler: "StaleWhileRevalidate",
					options: {
						cacheName: "inicontent-config-cache",
						expiration: {
							maxEntries: 200,
							maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
						},
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
				{
					// All other API reads (table data, items, searches). Try the
					// network first, fall back to cache when offline.
					urlPattern: ({ url, request }) =>
						url.hostname.endsWith("inicontent.com") && request.method === "GET",
					handler: "NetworkFirst",
					options: {
						cacheName: "inicontent-api-cache",
						networkTimeoutSeconds: 3,
						expiration: {
							maxEntries: 500,
							maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
						},
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
				{
					// Runtime-cache static assets (in case a build asset isn't
					// precached). Cache-first, so they load fast offline.
					urlPattern: ({ request }) =>
						request.destination === "style" ||
						request.destination === "script" ||
						request.destination === "font" ||
						request.destination === "image",
					handler: "CacheFirst",
					options: {
						cacheName: "inicontent-static-cache",
						expiration: {
							maxEntries: 500,
							maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
						},
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
			],
		},
	},
	devServer: {
		port: 3434, // "INIc" in binary
	},
	devtools: {
		enabled: false,
	},
	vite: {
		server: {
			ws: { clientPort: 3434 },
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
