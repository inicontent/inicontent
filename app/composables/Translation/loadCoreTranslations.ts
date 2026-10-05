/**
 * @deprecated Use `loadTranslations` instead, which also picks up the
 * consuming app's own `app/locales` (see `modules/layer-locales.ts`).
 *
 * Kept as a re-export so anything importing the old name — it is published
 * from `app/composables/index.ts` — keeps working.
 */
export { default } from "./loadTranslations";
