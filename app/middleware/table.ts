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
	)
		throw createError({
			statusCode: 404,
			statusMessage: "table",
		})

	table.value = database.value.tables.find(
		({ slug }) => slug === currentTableInPath,
	) as Table
})
