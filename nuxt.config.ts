export default defineNuxtConfig({
	ssr: false,
	sourcemap: false,
	telemetry: false,

	modules: [
		"@nuxtjs/device",
		"@nuxt/fonts",
		"@nuxt/icon",
		"nuxt-build-cache",
		"nuxt-tiptap-editor",
	],
	tiptap: {
		prefix: "Tiptap",
	},
	imports: {
		dirs: ["types/*.d.ts"],
	},
	experimental: {
		buildCache: true,
		payloadExtraction: false,
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
	compatibilityDate: "2025-05-18",
})
