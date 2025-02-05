export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useState<User>("users");
	const database = useState<Database>("database");
	const fromPath = useCookie("from");
	if (user.value) {
		if (["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
			return navigateTo(
				fromPath.value &&
					(fromPath.value.startsWith(`/${database.value.slug}`) ||
						fromPath.value.startsWith("/admin")) &&
					!fromPath.value.endsWith("/auth")
					? fromPath.value
					: to.params.database
						? `/${database.value.slug}/admin`
						: "/admin",
			);
		}
	} else if (!["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
		fromPath.value = from.fullPath;
		return navigateTo(
			to.params.database ? `/${database.value.slug}/auth` : "/auth",
		);
	}
});
