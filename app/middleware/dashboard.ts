export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useState<User>("user");
	const database = useState<Database>("database");
	const redirectTo = useRedirectToCookie(database.value.slug);
	const isSafeRedirect = (value?: string) =>
		!!value &&
		value.startsWith("/") &&
		!value.startsWith("//") &&
		!value.includes("/auth");
	const queryRedirectTo =
		typeof to.query.redirectTo === "string" ? to.query.redirectTo : undefined;
	if (user.value) {
		if (["auth", "auth-reset", "database-auth", "database-auth-reset"].includes(to.name?.toString() ?? "")) {
			const target = isSafeRedirect(queryRedirectTo)
				? queryRedirectTo
				: isSafeRedirect(redirectTo.value ?? undefined)
					? redirectTo.value
					: undefined;
			return navigateTo(
				target
					? target
					: to.params.database
						? `/${database.value.slug}/admin`
						: "/admin",
			);
		}
	} else if (!["auth", "auth-reset", "database-auth", "database-auth-reset"].includes(to.name?.toString() ?? "")) {
		redirectTo.value = from.fullPath;
		return navigateTo(
			to.params.database ? `/${database.value.slug}/auth` : "/auth",
		);
	}
});
