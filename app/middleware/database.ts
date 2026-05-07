export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const currentDatabaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database || config.public.database
			: config.public.database || to.params.database,
	);

	const sessionID = useSessionCookie(currentDatabaseSlug);

	if (!database.value)
		database.value = (
			await $fetch<apiResponse<Database>>(
				`${config.public.apiBase}inicontent/databases/${currentDatabaseSlug}`,
				{
					credentials: "include",
					query: {
						[`${currentDatabaseSlug}_sid`]: sessionID.value,
					},
				},
			)
		).result;

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
