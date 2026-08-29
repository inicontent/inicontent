export default defineNuxtRouteMiddleware(async () => {
	const user = useState<User>("user");
	const database = useState<Database>("database");
	const config = useRuntimeConfig();

	const sessionID = useSessionCookie();

	if (!user.value) {
		// No session cookie yet → anonymous visitor. Skip the auth round-trip;
		// hitting /auth/current with no session just returns null anyway.
		if (!sessionID.value) return;

		user.value = (
			await $fetch<apiResponse<User>>(
				`${config.public.apiBase}${database.value.slug}/auth/current`,
				{
					credentials: "include",
					query: { [`${database.value.slug}_sid`]: sessionID.value },
				},
			)
		).result;
		if (!sessionID.value && user.value?.sessionID)
			sessionID.value = user.value.sessionID;
		if (!user.value) sessionID.value = null;
	}
});
