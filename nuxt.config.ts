export default defineNuxtConfig({
	ssr: true,
	build: {
		transpile:
			process.env.NODE_ENV === "production"
				? [
						"naive-ui",
						"vueuc",
						"@css-render/vue3-ssr",
						"@juggle/resize-observer",
					]
				: ["@juggle/resize-observer"],
	},
	sourcemap: false,
	modules: ["@nuxtjs/device"],
	vite: {
		optimizeDeps: {
			include: process.env.NODE_ENV === "development" ? ["naive-ui"] : [],
		},
	},
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
			apiBase: "https://test-api.inicontent.com/", // "INIa" in binary
		},
	},
});
