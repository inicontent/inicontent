export default defineNuxtRouteMiddleware(async () => {
	const user = useState<User>("user");
	const database = useState<Database>("database");
	const config = useRuntimeConfig();

	const sessionID = useScopedCookie<string|undefined>("sid", database.value?.slug);

	if (!user.value) {
		const platformSessionID = useScopedCookie<string|undefined>("sid", "inicontent");

		if (!sessionID.value && !platformSessionID.value) return;

		let refreshed = true;
		try {
			user.value = (
				await $fetch<apiResponse<User>>(
					`${config.public.apiBase}${database.value.slug}/auth/current`,
					{
						credentials: "include",
						query: sessionID.value ? { [`${database.value.slug}_sid`]: sessionID.value } : { "inicontent_sid": platformSessionID.value },
					},
				)
			).result;
		} catch {
			// A failed refresh must not throw out of the middleware: that aborts
			// the whole navigation (including the one logout just started) and
			// strands the user on the page they were leaving. Leave `user` empty
			// so the auth route takes over, and KEEP the session cookie — the
			// server was unreachable, not proof the session ended.
			refreshed = false;
			user.value = undefined;
		}
		if (!sessionID.value && user.value?.sessionID)
			sessionID.value = user.value.sessionID;
		if (refreshed && !user.value) sessionID.value = undefined;
	}
});
