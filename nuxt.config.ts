// The SPA app shell is served by the node server at "/" (there is no static
// index.html in .output/public), so workbox's navigateFallback has nothing to
// serve from its precache when the device is offline. Precache it explicitly
// with a build-unique revision so the shell is re-fetched on every SW update.
const appShellRevision = Date.now().toString(36);

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
			hmr: { clientPort: 3434 },
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
