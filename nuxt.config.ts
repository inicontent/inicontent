export default defineNuxtConfig({
	ssr: false,
	sourcemap: false,
	modules: ["@nuxtjs/device", "nuxtjs-naive-ui"],
	imports: {
		dirs: ["types/*.d.ts"],
	},
	experimental: {
		payloadExtraction: false,
	},
	devServer: {
		port: 3434, // "INIc" in binary
	},
	devtools: {
		enabled: false,
	},
	routeRules: {
		"/": { redirect: "/auth" },
	},
	css: ["~/assets/main.css"],
	runtimeConfig: {
		public: {
			apiBase: "https://test.api.inicontent.com/",
		},
	},
});
