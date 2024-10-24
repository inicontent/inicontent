export default defineNuxtConfig({
	ssr: false,
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
	compatibilityDate: "2024-09-04",
});
