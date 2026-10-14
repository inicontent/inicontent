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
 * boot. A **pinned** deployment that cannot resolve its region records an
 * explicit error (`regionError`), which `region.global.ts` surfaces before any
 * page runs, rather than silently targeting the configured base.
 */
export default defineNuxtPlugin({
	name: "region",
	enforce: "pre",
	async setup() {
		try {
			// An explicit `?region=<code>` deep link is resolved here (not in a
			// route middleware) so it is settled before `domain.global.ts`
			// resolves a hostname to a database from `useApiBase()`.
			const requested = new URL(window.location.href).searchParams.get(
				REGION_QUERY_PARAM,
			);
			await useRegion().bootstrap(requested);
		} catch {
			// bootstrap() already fails safe; this guards the wrapper itself.
		}
	},
});
