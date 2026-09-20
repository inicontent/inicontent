export default defineNuxtRouteMiddleware(async () => {
	const user = useState<User>("user");
	const database = useState<Database>("database");
	const config = useRuntimeConfig();

	const sessionID = useScopedCookie<string|undefined>("sid", database.value?.slug);

	if (!user.value) {
		const platformSessionID = useScopedCookie<string|undefined>("sid", "inicontent");

		if (!sessionID.value && !platformSessionID.value) return;

		user.value = (
			await $fetch<apiResponse<User>>(
				`${config.public.apiBase}${database.value.slug}/auth/current`,
				{
					credentials: "include",
					query: sessionID.value ? { [`${database.value.slug}_sid`]: sessionID.value } : { "inicontent_sid": platformSessionID.value },
				},
			)
		).result;
		if (!sessionID.value && user.value?.sessionID)
			sessionID.value = user.value.sessionID;
		if (!user.value) sessionID.value = undefined;
	}
});
