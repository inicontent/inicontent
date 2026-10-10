import { isJunkResponse, isNetworkError } from "~/composables/useOfflineFetch";

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const currentDatabaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database || config.public.database
			: config.public.database || to.params.database,
	);

	const sessionID = useScopedCookie<string>("sid", currentDatabaseSlug);
	const query: Record<string, string> = {};

	if (sessionID.value) query[`${currentDatabaseSlug}_sid`] = sessionID.value;

	if (!database.value) {
		try {
			database.value = (
				await $fetch<apiResponse<Database>>(
					`${useApiBase()}inicontent/databases/${currentDatabaseSlug}`,
					{
						credentials: "include",
						cache: "no-store",
						query,
					},
				)
			).result;
		} catch (error) {
			// Mount the error view; never fall back to another session's stored metadata.
			showError(
				isNetworkError(error) || isJunkResponse(error)
					? createError({ statusCode: 503, statusMessage: "offline" })
					: (error as Error),
			);
			return true;
		}
	}

	if (!database.value) {
		showError(createError({ statusCode: 404, statusMessage: "database" }));
		return true;
	}

	formatDatabase();

	useState<ThemeConfig>("ThemeConfig", () => ({
		primaryColor: "#FF9800",
		primaryColorHover: "#F7A42A",
		primaryColorPressed: "#E19421",
		primaryColorSuppl: "#CB7900",
	}));

	setThemeConfig();
});
