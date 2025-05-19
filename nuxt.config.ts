import naive from "naive-ui"
import { addComponent } from "nuxt/kit"

export default defineNuxtConfig({
	ssr: false,
	sourcemap: false,
	telemetry: false,

	modules: [
		"nuxt-tiptap-editor",
		"@nuxtjs/device",
		"@nuxt/fonts",
		"@nuxt/icon",
		"nuxt-build-cache",
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
	build: {
		transpile: process.env.NODE_ENV === "production" ? ["naive-ui"] : [],
	},
	future: { compatibilityVersion: 4 },
	hooks: {
		"imports:extend": () => {
			// Add imports for naive-ui components
			Object.keys(naive)
				.filter((name) => /^N[A-Z]|n-[a-z]/.test(name))
				.forEach((name) => {
					addComponent({
						export: name,
						name,
						filePath: "naive-ui",
						mode: "all",
						global: true,
					})
				})
		},
		"prepare:types": ({ references }) => {
			references.push({
				types: "naive-ui/volar",
			})
		},
	},
	vite: {
		server: { hmr: { clientPort: 3434 } },
	},
	...(process.env.GIGET_AUTH
		? {
				extends: [
					["gh:inicontent/private", { install: true, preferOffline: true }],
				],
			}
		: {}),
	compatibilityDate: "2025-05-18",
})
