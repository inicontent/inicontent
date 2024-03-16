export default defineNuxtConfig({
  ssr: false,
  imports: {
    dirs: ["types/*.d.ts"],
  },
  experimental: {
    payloadExtraction: false,
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  devtools: {
    enabled: false,
  },
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NODE_ENV == "development"
          ? "http://localhost:3001/"
          : "https://test-api.inicontent.com/",
    },
  },
});
