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
	icon: {
		provider: "server",
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
		workbox: {
			navigateFallback: "/",
		},
		devOptions: {
			enabled: true,
			type: "module",
		},
	},
	devServer: {
		port: 3434, // "INIc" in binary
	},
	devtools: {
		enabled: false,
	},
	vite: {
		server: { hmr: { clientPort: 3434 } },
	},
	compatibilityDate: "latest",
})
