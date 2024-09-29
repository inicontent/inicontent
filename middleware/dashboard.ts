export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useState<User>("user"),
		database = useState<Database>("database"),
		fromPath = useCookie("from");

	if (
		!database.value ||
		database.value.slug !== (to.params.database ?? "inicontent")
	)
		database.value = (
			await $fetch<apiResponse<Database>>(
				`${useRuntimeConfig().public.apiBase}inicontent/database/${
					to.params.database ?? "inicontent"
				}`,
			)
		).result;

	if (!database.value)
		throw createError({
			statusCode: 404,
			statusMessage: "database",
		});

	if (
		!user.value ||
		(database.value && database.value.slug !== to.params.database)
	)
		user.value = (
			await $fetch<apiResponse<User>>(
				`${useRuntimeConfig().public.apiBase}${
					to.params.database ?? "inicontent"
				}/auth/current`,
			)
		).result;

	if (user.value) {
		if (["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
			return navigateTo(
				fromPath.value &&
					!fromPath.value.endsWith("/auth") &&
					fromPath.value.startsWith(to.params.database as string)
					? fromPath.value
					: to.params.database
						? `/${to.params.database}/admin`
						: "/admin",
			);
		}
	} else if (!["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
		fromPath.value = from.fullPath;
		return navigateTo(
			to.params.database ? `/${to.params.database}/auth` : "/auth",
		);
	}
});
