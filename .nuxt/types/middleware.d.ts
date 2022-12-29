import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "dashboard"
declare module "/home/karim/Desktop/APPS/inicontent/node_modules/.pnpm/nuxt@3.0.0/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}