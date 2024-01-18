export default defineNuxtConfig({
  ssr: false,
  imports: {
    dirs: ["types/*.d.ts"],
  },
  experimental: {
    payloadExtraction: false,
  },
  runtimeConfig: {
    public: {
      apiBase: "https://test-api.inicontent.com/", //http://localhost:3001/
    },
  },
});
