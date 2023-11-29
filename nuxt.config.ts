import { join } from "node:path";

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    hooks: {
      "dev:reload": () => require("sharp"),
    },
    serverAssets: [
      {
        baseName: "databases",
        dir: "./server/databases",
      },
    ],
  },
  css: ["~/assets/css/main.css"],
  experimental: {
    payloadExtraction: false,
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
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
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === "development"
          ? ["naive-ui", "vueuc", "date-fns-tz/formatInTimeZone"]
          : [],
    },
  },
  runtimeConfig: {
    databasePath: join(process.cwd(), "server", "databases"),
  },
});
