import { isNetworkError } from "~/composables/useOfflineFetch";

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const currentDatabaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database || config.public.database
			: config.public.database || to.params.database,
	);

	const sessionID = useSessionCookie(currentDatabaseSlug);
	const query: Record<string, string> = {};

	if (sessionID.value) query[`${currentDatabaseSlug}_sid`] = sessionID.value;

	if (!database.value) {
		try {
			database.value = (
				await $fetch<apiResponse<Database>>(
					`${config.public.apiBase}inicontent/databases/${currentDatabaseSlug}`,
					{
						credentials: "include",
						query,
					},
				)
			).result;
		} catch (error) {
			// Offline (or a hung network). In production the service worker
			// serves this from the config cache, but when there's no cached
			// copy yet (e.g. dev mode) that's impossible — so surface a clean
			// 503 "offline" error instead of leaking the raw fetch stack.
			if (isNetworkError(error)) {
				throw createError({
					statusCode: 503,
					statusMessage: "offline",
				});
			}
			throw error;
		}
	}

	if (!database.value)
		throw createError({
			statusCode: 404,
			statusMessage: "database",
		});

	formatDatabase();
	syncCookiesFromDatabase(database.value.slug);

	useState<ThemeConfig>("ThemeConfig", () => ({
		primaryColor: "#FF9800",
		primaryColorHover: "#F7A42A",
		primaryColorPressed: "#E19421",
		primaryColorSuppl: "#CB7900",
	}));

	setThemeConfig();
});
