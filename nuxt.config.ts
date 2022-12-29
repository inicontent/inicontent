export default defineNuxtConfig({
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  vite: {
    base: "/inicontent-vue/",
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
});
