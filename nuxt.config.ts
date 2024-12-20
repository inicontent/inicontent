export default defineNuxtConfig({
	ssr: false,
	appConfig: {
		apiBase:
			process.env.NODE_ENV === "production"
				? "https://api.inicontent.com/"
				: "http://localhost:3433/",
		idOne:
			process.env.NODE_ENV === "production"
				? "d7b3d61a582e53ee29b5a1d02a436d55"
				: "97048f40b9d9429b84b2c8d19beb68c1",
		database: null, // use it to overwrite database name
	},
	sourcemap: false,
	modules: ["@nuxtjs/device", "nuxtjs-naive-ui", "nuxt-tiptap-editor"],
	tiptap: {
		prefix: "Tiptap",
	},
	imports: {
		dirs: ["types/*.d.ts"],
	},
	telemetry: false,
	experimental: {
		payloadExtraction: false,
	},
	devServer: {
		port: 3434, // "INIc" in binary
	},
	devtools: {
		enabled: false,
	},
	vite: {
		server: {
			hmr: {
				clientPort: 3434,
			},
		},
	},
	...(process.env.GIGET_AUTH
		? {
				extends: [
					["gh:inicontent/private", { install: true, preferOffline: true }],
				],
			}
		: {}),
	compatibilityDate: "2024-11-25",
});
