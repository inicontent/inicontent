import { join } from "node:path";

export default defineNuxtConfig({
  ssr: false,
  imports: {
    dirs: ["types/*.d.ts"],
  },
  nitro: {
    hooks: {
      "dev:reload": () => require("sharp"),
    },
  },
  experimental: {
    payloadExtraction: false,
  },
  runtimeConfig: {
    databasePath: join(process.cwd(), "databases"),
  },
});
