export default defineNuxtConfig({
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  app: {
    baseURL: "/inicontent/",
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
});
