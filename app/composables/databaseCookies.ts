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
	const cookieName = regional ? `${code}_${slug}_${key}` : `${slug}_${key}`;
	if (key !== "sid")
		return useCookie<T>(cookieName, {
			sameSite: true,
		});

	// The admin app keeps its bearer token in memory, not in a script-readable
	// cookie. `null` means "explicitly cleared"; a reload starts empty and the
	// user middleware silently refreshes from the HttpOnly server cookie.
	const tokens = useState<Record<string, string | null>>(
		"sessionTokens",
		() => ({}),
	);
	return computed<T | null | undefined>({
		get: () => {
			if (cookieName in tokens.value)
				return tokens.value[cookieName] as T | null;
			return undefined;
		},
		set: (value) => {
			tokens.value[cookieName] =
				value === undefined || value === null || value === ""
					? null
					: (value as unknown as string);
		},
	});
}
