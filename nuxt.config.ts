export default defineNuxtConfig({
	ssr: false,
	appConfig: {
		apiBase: "https://api.inicontent.com/",
		idOne: "d7b3d61a582e53ee29b5a1d02a436d55",

		database: undefined, // use it to overwrite database name
	},
	sourcemap: false,
	modules: ["@nuxtjs/device", "nuxtjs-naive-ui"],
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
