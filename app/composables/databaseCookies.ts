function resolveDatabaseSlug(databaseSlug?: string) {
	if (databaseSlug) return databaseSlug;

	const config = useRuntimeConfig();
	if (config.public.database && config.public.database !== "inicontent") {
		return String(config.public.database);
	}

	const database = useState<Database | null>("database", () => null);
	if (database.value?.slug) return database.value.slug;

	const route = useRoute();
	const routeDatabase = route.params.database;
	if (Array.isArray(routeDatabase)) return routeDatabase[0] || "inicontent";
	if (routeDatabase) return String(routeDatabase);

	return "inicontent";
}

export function useScopedCookie<T>(key: string, databaseSlug?: string) {
	const slug = resolveDatabaseSlug(databaseSlug);
	const { public: config } = useRuntimeConfig();
	const { hostname } = useRequestURL();
	const region = useState<RegionSelection | null>(REGION_STATE_KEY, () => null);
	// The apex is shared by tenants with the same slug in different regions.
	// Keep their session cookies separate while retaining existing EU sessions.
	const code = region.value?.code;
	const regional =
		config.regionalDatabasePaths &&
		(isPlatformApex(hostname) ||
			(import.meta.dev && hostname === "localhost")) &&
		slug !== "inicontent" &&
		code &&
		code !== "main";
	return useCookie<T>(regional ? `${code}_${slug}_${key}` : `${slug}_${key}`, {
		sameSite: true,
	});
}
