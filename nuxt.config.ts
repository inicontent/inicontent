export default defineNuxtConfig({
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  router: {
    base: "/inicontent-vue/",
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
});
