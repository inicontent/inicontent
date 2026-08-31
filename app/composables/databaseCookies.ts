const syncedCookieKeys = ["language", "theme", "sid", "redirectTo"] as const;
// Only theme is shared globally across all databases. language, sid and
// redirectTo are scoped per database so each database keeps its own value.
const globalOnlyKeys = new Set(["theme"]);

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

export function useLanguageCookie(databaseSlug?: string) {
	return useCookie<LanguagesType | null>(
		scopedCookieName("language", databaseSlug),
		{ sameSite: true },
	);
}

export function useRedirectToCookie(databaseSlug?: string) {
	return useCookie<string | null>(scopedCookieName("redirectTo", databaseSlug), {
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

export function syncThemeToAllDatabases(theme: "dark" | "light") {
	if (import.meta.server) return;
	// Theme cookies must always be stored on the root path. A document.cookie
	// write without an explicit Path defaults to the current URL directory
	// (e.g. /clinic/admin), duplicating them alongside the root-path cookies
	// that useCookie() writes. Delete plus rewrite keeps every path in sync.
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name] = cookie.split("=");
		const trimmed = name.trim();
		if (!trimmed.endsWith("_theme") || trimmed === "theme") continue;
		// Best-effort removal of any duplicate persisted on the current
		// directory path by the old path-relative writes.
		const dir = location.pathname.replace(/\/[^/]*$/, "") || "/";
		if (dir !== "/") {
			document.cookie = `${trimmed}=;path=${dir};max-age=0`;
		}
		document.cookie = `${trimmed}=${theme};path=/;SameSite=Strict`;
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
