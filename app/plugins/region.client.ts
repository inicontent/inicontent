/**
 * Resolve the active region before the first navigation.
 *
 * Route middleware (notably `middleware/database.ts`) and the public domain
 * resolver fetch from `useApiBase()` during the initial navigation, so the
 * region has to be settled *before* they run. Plugins execute first, which is
 * why this is a plugin and not part of `app.vue` (see the same reasoning in the
 * translations note in AGENTS.md).
 *
 * The work itself lives in `useRegion().bootstrap()`: it does nothing for a
 * multi-region deployment with no persisted selection, snaps a pinned
 * deployment to its own region, and re-validates a persisted selection against
 * the main region's catalog. A failure is swallowed deliberately — the app must
 * boot, and a pinned deployment then stays on its configured base rather than
 * silently targeting another region.
 */
export default defineNuxtPlugin({
	name: "region",
	enforce: "pre",
	async setup() {
		try {
			await useRegion().bootstrap();
		} catch {
			// bootstrap() already fails safe; this guards the wrapper itself.
		}
	},
});
