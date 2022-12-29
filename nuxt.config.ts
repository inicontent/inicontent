export default defineNuxtConfig({
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  app: {
    baseURL: "/inicontent-vue/",
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
});
