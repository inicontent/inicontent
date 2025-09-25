export default defineNuxtConfig({
	ssr: false,
	sourcemap: false,
	telemetry: false,
	modules: [
		"@nuxtjs/device",
		"@nuxt/fonts",
		"@nuxt/icon",
		"nuxt-tiptap-editor",
	],
	tiptap: {
		prefix: "Tiptap",
	},
	imports: {
		dirs: ["types/*.d.ts"],
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
