const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
});

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();

	if (!database.value)
		database.value = (
			await $fetch<apiResponse<Database>>(
				`${config.public.apiBase}inicontent/databases/${
					config.public.database === "inicontent"
						? to.params.database || config.public.database
						: config.public.database || to.params.database
				}`,
				{
					credentials: "include",
					query: {
						[`${
							config.public.database === "inicontent"
								? to.params.database || config.public.database
								: config.public.database || to.params.database
						}_sid`]: sessionID.value,
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

	useState<ThemeConfig>("ThemeConfig", () => ({
		primaryColor: "#FF9800",
		primaryColorHover: "#F7A42A",
		primaryColorPressed: "#E19421",
		primaryColorSuppl: "#CB7900",
	}));

	setThemeConfig();
});
