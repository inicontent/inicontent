import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default" | "table"
declare module "/home/karim/Desktop/APPS/inicontent/node_modules/.pnpm/nuxt@3.0.0/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}