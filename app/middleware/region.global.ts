/**
 * Resolve an explicit region before the page's own middleware runs.
 *
 * The initial deep link is handled by `region.client.ts` (a `pre` plugin, so it
 * runs before every middleware). This covers **client-side navigations** that
 * carry `?region=<code>` — for example the "open database login" link — or that
 * land on a region-encoded hostname (`sa-1--clinic.inicontent.com`), and
 * retries a pinned deployment's resolution failure so it surfaces as an
 * explicit error rather than a silent fallback.
 *
 * A region code is only ever honoured after validation against the main-region
 * catalog: unknown, disabled, or (on a pinned build) mismatched codes abort
 * rather than silently targeting another region. A hostname prefix that names
 * no catalog region is a legacy slug, not a region, so it is not an error.
 */

/** HTTP status that best describes a region-resolution failure. */
function regionErrorStatus(key: string): number {
	switch (key) {
		case "regionNotFound":
			return 404;
		case "regionDisabled":
		case "regionMismatch":
			return 409;
		default:
			return 503;
	}
}

export default defineNuxtRouteMiddleware(async (to) => {
	const { pinned, regionError, bootstrap, selection } = useRegion();

	const hasParam = to.query[REGION_QUERY_PARAM] !== undefined;
	const requested = regionCodeFromQuery(to.query);
	// A region encoded in the hostname (`sa-1--clinic.inicontent.com`). The
	// `pre` plugin resolves it on a full page load; this covers a client-side
	// navigation that arrives on a different region's host.
	const hostRegion =
		parseDatabaseHostname(useRequestURL().hostname)?.region ?? null;

	// An explicit but malformed code is never ignored.
	if (hasParam && !requested) {
		throw createError({ statusCode: 404, statusMessage: t("regionNotFound") });
	}

	if (requested) {
		if (pinned && pinned !== requested) {
			throw createError({
				statusCode: 409,
				statusMessage: t("regionMismatch"),
			});
		}
		await bootstrap(requested, hostRegion);
	} else if (hostRegion && selection.value?.code !== hostRegion) {
		await bootstrap(null, hostRegion);
	} else if (regionError.value) {
		// A previous failure (pinned resolution, unreachable catalog): retry so a
		// transient outage can clear instead of wedging every navigation.
		await bootstrap();
	}

	if (regionError.value) {
		throw createError({
			statusCode: regionErrorStatus(regionError.value),
			statusMessage: t(regionError.value),
		});
	}
});
