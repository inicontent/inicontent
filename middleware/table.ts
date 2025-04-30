export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database")
	const table = useState<Table>("table")
	let currentTableInPath: string | undefined = decodeURIComponent(
		(to.params.table as string) ||
			to.path.split("/admin/tables/")[1]?.split("/")[0],
	)

	if (currentTableInPath === "undefined") currentTableInPath = undefined

	if (!currentTableInPath && to.path.replace(/\/$/, "").endsWith("/auth"))
		currentTableInPath = "users"

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
