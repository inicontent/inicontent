import { flattenSchema } from "inibase/utils";

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const appConfig = useAppConfig();
	if (!database.value)
		database.value = (
			await $fetch<apiResponse<Database>>(
				`${appConfig.apiBase}inicontent/databases/${
					appConfig.database || to.params.database || "inicontent"
				}`,
			)
		).result;

	if (!database.value)
		throw createError({
			statusCode: 404,
			statusMessage: "database",
		});

	useState<ThemeConfig>("ThemeConfig", () => ({
		primaryColor: "#FF9800",
		primaryColorHover: "#F7A42A",
		primaryColorPressed: "#E19421",
		primaryColorSuppl: "#CB7900",
	}));

	setThemeConfig();
});
