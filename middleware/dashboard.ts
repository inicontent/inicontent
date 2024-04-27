export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.client) return;

	const nuxtApp = useNuxtApp(),
		user = useState<User>("user"),
		database = useState<Database>("database"),
		client = useState<Record<string, any>>("client", () => ({
			ip: null,
			userAgent: null,
		})),
		fromPath = useCookie("from");

	if (!user.value)
		user.value = (
			await $fetch<apiResponse>(
				`${useRuntimeConfig().public.apiBase}${
					to.params.database ?? "inicontent"
				}/auth/current`,
				client.value.ip && client.value.userAgent
					? {
							headers: {
								"x-forwarded-for": client.value.ip,
								"user-agent": client.value.userAgent,
							},
						}
					: {},
			)
		).result;

	if (!database.value || database.value.slug !== to.params.database)
		database.value = (
			await $fetch<apiResponse>(
				`${useRuntimeConfig().public.apiBase}inicontent/database/${
					to.params.database ?? "inicontent"
				}`,
				client.value.ip && client.value.userAgent
					? {
							headers: {
								"x-forwarded-for": client.value.ip,
								"user-agent": client.value.userAgent,
							},
						}
					: {},
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
