// Global middleware that restores sessions passed across deployments as URL
// query params. When the tenant app redirects to the platform app (pages,
// blocks, templates, billing), cookies cannot travel cross-origin, so the
// redirect URL carries `?{db}_sid=...&inicontent_sid=...` (see
// usePlatformRedirect). This middleware writes them back into the scoped
// cookies so the target boots already signed in. It runs before the route
// level `database` / `user` middlewares and is a no-op when the params are
// absent, so it is safe on every deployment of this app.
export default defineNuxtRouteMiddleware((to) => {
	const config = useRuntimeConfig();
	const databaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database || config.public.database
			: config.public.database || to.params.database,
	);

	const ingest = (key: string) => {
		const value = to.query[key];
		if (typeof value !== "string" || !value.trim()) return;
		const cookie = useCookie<string | null>(key, { sameSite: true });
		// Never overwrite an existing (fresher) local session.
		if (!cookie.value) cookie.value = value;
	};

	ingest(`${databaseSlug}_sid`);
	// On the platform database the database sid key IS the platform key, so
	// only the platform key is ingested there.
	if (databaseSlug !== "inicontent") ingest("inicontent_sid");
});
