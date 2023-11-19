export default defineNuxtConfig({
  ssr: false,
<<<<<<< HEAD
  nitro: {
    hooks: {
      "dev:reload": () => require("sharp"),
    },
  },
  css: ["~/assets/css/main.css"],
  experimental: {
    payloadExtraction: false,
  },
=======
  experimental: {
    payloadExtraction: false,
  },
  app: {
    baseURL: "/inicontent/",
  },
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
  components: {
    global: true,
    dirs: ["~/components"],
  },
});
