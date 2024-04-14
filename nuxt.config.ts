export default defineNuxtConfig({
	ssr: false,
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
			apiBase:
				process.env.NODE_ENV === "development"
					? "http://localhost:3433/"
					: "https://test-api.inicontent.com/", // "INIa" in binary
		},
	},
});
