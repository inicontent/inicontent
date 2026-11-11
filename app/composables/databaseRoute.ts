import { publicRegionLabel } from "./region.ts";

/** Root path of the database addressed by the current route. */
export function databaseRoutePrefix(route: {
	params: Record<string, unknown>;
}): string {
	const { database, region } = route.params;
	if (typeof database !== "string" || !database) return "";
	const slug = encodeURIComponent(database);
	return typeof region === "string" && region
		? `/${encodeURIComponent(region)}/${slug}`
		: `/${slug}`;
}

/** Path to a tenant from a SaaS database list. */
export function tenantDatabasePath(
	slug: string,
	region?: string | null,
): string {
	return `/${publicRegionLabel(region) ?? "eu"}/${encodeURIComponent(slug)}`;
}

export function useTenantDatabasePath() {
	const config = useRuntimeConfig();
	const { selection, pinned } = useRegion();
	return (slug: string) =>
		config.public.regionalDatabasePaths
			? tenantDatabasePath(slug, selection.value?.code ?? (pinned || null))
			: `/${encodeURIComponent(slug)}`;
}
