export default defineNuxtConfig({
  ssr: false,
  nitro: {
    hooks: {
      "dev:reload": () => require("sharp"),
    },
  },
  css: ["~/assets/css/main.css"],
  experimental: {
    payloadExtraction: false,
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
});
