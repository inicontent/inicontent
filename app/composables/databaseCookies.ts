const syncedCookieKeys = ["language", "theme", "sid", "redirectTo"] as const;
// Only sid must be isolated per database. Other keys stay mirrored to the
// global cookie so components that read useCookie("language") still work.
const globalOnlyKeys = new Set(["language", "theme", "redirectTo"]);

function isSet(value: string | null | undefined) {
	return value !== null && value !== undefined && value !== "";
}

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

function scopedCookieName(key: string, databaseSlug?: string) {
	return `${resolveDatabaseSlug(databaseSlug)}_${key}`;
}

export function useSessionCookie(databaseSlug?: string) {
	return useCookie<string | null>(scopedCookieName("sid", databaseSlug), {
		sameSite: true,
	});
}

export function syncCookiesFromDatabase(databaseSlug?: string) {
	const resolvedDatabaseSlug = resolveDatabaseSlug(databaseSlug);

	for (const key of syncedCookieKeys) {
		const globalCookie = useCookie<string | null>(key, { sameSite: true });
		const scopedCookie = useCookie<string | null>(
			scopedCookieName(key, resolvedDatabaseSlug),
			{
			sameSite: true,
			},
		);

		if (isSet(scopedCookie.value)) {
			// Always keep global in sync so components reading useCookie(key) work.
			if (!globalOnlyKeys.has(key)) {
				globalCookie.value = null;
			} else {
				globalCookie.value = scopedCookie.value;
			}
		} else if (isSet(globalCookie.value)) {
			scopedCookie.value = globalCookie.value;
		}
	}
}

export function syncCookiesToDatabase(databaseSlug?: string) {
	const resolvedDatabaseSlug = resolveDatabaseSlug(databaseSlug);

	for (const key of syncedCookieKeys) {
		const globalCookie = useCookie<string | null>(key, { sameSite: true });
		const scopedCookie = useCookie<string | null>(
			scopedCookieName(key, resolvedDatabaseSlug),
			{
			sameSite: true,
			},
		);

		if (isSet(globalCookie.value)) {
			scopedCookie.value = globalCookie.value;
			// For sid, wipe the global so the token is only in the scoped cookie.
			if (!globalOnlyKeys.has(key)) {
				globalCookie.value = null;
			}
		} else if (isSet(scopedCookie.value) && globalOnlyKeys.has(key)) {
			globalCookie.value = scopedCookie.value;
		}
	}
}