export default defineNuxtRouteMiddleware(async () => {
	const user = useState<User>("user")
	const database = useState<Database>("database")
	const appConfig = useAppConfig()

	const sessionID = useCookie<string | null>("sessionID", {
		sameSite: true,
	})

	if (!user.value)
		user.value = (
			await $fetch<apiResponse<User>>(
				`${appConfig.apiBase}${database.value.slug}/auth/current`,
				{
					credentials: "include",
					query: { [`${database.value.slug}_sid`]: sessionID.value },
				},
			)
		).result
})
