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
	return useCookie<T>(
		`${resolveDatabaseSlug(databaseSlug)}_${key}`,
		{ sameSite: true },
	);
}