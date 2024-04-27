export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.client) return;

	const nuxtApp = useNuxtApp(),
		user = useState<User>("user"),
		database = useState<Database>("database"),
		fromPath = useCookie("from"),
		event = nuxtApp.ssrContext?.event;

	const ip =
			event?.node.req.headers["x-real-ip"] ||
			event?.node.req.headers["x-forwarded-for"] ||
			event?.node.req.socket?.remoteAddress,
		userAgent = event?.node.req.headers["user-agent"];

	if (!user.value)
		user.value = (
			await $fetch<apiResponse>(
				`${useRuntimeConfig().public.apiBase}${
					to.params.database ?? "inicontent"
				}/auth/current`,
				{
					headers: {
						"x-forwarded-for": ip,
						"user-agent": userAgent,
					},
				},
			)
		).result;

	if (!database.value || database.value.slug !== to.params.database)
		database.value = (
			await $fetch<apiResponse>(
				`${useRuntimeConfig().public.apiBase}inicontent/database/${
					to.params.database ?? "inicontent"
				}`,
				{
					headers: {
						"x-forwarded-for": ip,
						"user-agent": userAgent,
					},
				},
			)
		).result;

	if (user.value) {
		if (["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
			return nuxtApp.runWithContext(() =>
				navigateTo(
					fromPath.value && !fromPath.value.endsWith("/auth")
						? fromPath.value
						: to.params.database
							? `/${to.params.database}/admin`
							: "/admin",
				),
			);
		}
	} else if (!["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
		fromPath.value = from.fullPath;
		return nuxtApp.runWithContext(() =>
			navigateTo(to.params.database ? `/${to.params.database}/auth` : "/auth"),
		);
	}
});
