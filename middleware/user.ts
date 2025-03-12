export default defineNuxtRouteMiddleware(async () => {
	const user = useState<User>("user");
	const database = useState<Database>("database");
	const appConfig = useAppConfig();

	if (!user.value)
		user.value = (
			await $fetch<apiResponse<User>>(
				`${appConfig.apiBase}${database.value.slug}/auth/current`,
			)
		).result;
});
