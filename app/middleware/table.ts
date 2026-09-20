export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database")
	const table = useState<Table>("table")
	let currentTableInPath: string | undefined = decodeURIComponent(
		(to.params.table as string) ||
			to.path.split("/admin/tables/")[1]?.split("/")[0] ||
			"",
	)

	if (currentTableInPath === "undefined") currentTableInPath = undefined

	if (!currentTableInPath && to.path.replace(/\/$/, "").includes("/auth"))
		currentTableInPath = "users"

	// The backups page is a database-level admin surface. New databases ship
	// with a "backups" table in their meta, but legacy databases created before
	// the feature only get a lazy table — so never 404 on its dedicated pages.
	if (currentTableInPath === "backups") {
		table.value =
			database.value.tables?.find(({ slug }) => slug === "backups") ??
			({ slug: "backups", label: "backups" } as Table)
		return
	}

	if (
		!database.value.tables ||
		!currentTableInPath ||
		!database.value.tables?.find(({ slug }) => slug === currentTableInPath)
	) {
		// The 404 error page renders inside the table layout. Drop any stale
		// table state (e.g. the previously visited table) so the sidebar
		// doesn't keep a now-mismatched table highlighted.
		clearNuxtState("table")
		// The redirect intent is dead (the table no longer exists) — drop it
		// so a later login doesn't bounce back into this same 404 loop.
		useScopedCookie<string | null>("redirectTo", database.value?.slug).value =
			undefined
		// Do NOT `throw` here: an error thrown from a route middleware during
		// *client-side* navigation is swallowed by the router (nothing renders
		// the error page), so navigating here from /auth after a redirectTo
		// would abort silently and leave the user stuck on the auth page.
		// Register the error with `showError()` (NuxtRoot swaps in error.vue)
		// and `return true` so the navigation itself completes.
		showError(createError({
			statusCode: 404,
			statusMessage: "table",
		}))
		return true
	}

	table.value = database.value.tables.find(
		({ slug }) => slug === currentTableInPath,
	) as Table
})
