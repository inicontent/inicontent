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
	const { regionError, bootstrap, selection } = useRegion();

	const hasParam = to.query[REGION_QUERY_PARAM] !== undefined;
	const requested = registryRegionCode(regionCodeFromQuery(to.query));
	const encoded = to.params.region;
	const urlRegion =
		registryRegionCode(encoded) ??
		parseDatabaseHostname(useRequestURL().hostname)?.region ??
		null;

	if ((hasParam && !requested) || (encoded && !registryRegionCode(encoded))) {
		throw createError({ statusCode: 404, statusMessage: t("regionNotFound") });
	}

	if (requested && urlRegion && requested !== urlRegion) {
		throw createError({ statusCode: 409, statusMessage: t("regionMismatch") });
	}

	const target = requested ?? urlRegion;
	if (target && (selection.value?.code !== target || regionError.value)) {
		await bootstrap(requested, urlRegion);
	} else if (regionError.value) {
		await bootstrap();
	}

	if (regionError.value) {
		throw createError({
			statusCode: regionErrorStatus(regionError.value),
			statusMessage: t(regionError.value),
		});
	}
});
