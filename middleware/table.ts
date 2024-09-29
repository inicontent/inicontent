export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const table = useState<Table>("table");
	const currentTableInPath =
		to.params.table || to.path.split("/admin/tables/")[1]?.split("/")[0];

	if (
		!database.value.tables ||
		!currentTableInPath ||
		!database.value.tables?.find(({ slug }) => slug === currentTableInPath)
	)
		throw createError({
			statusCode: 404,
			statusMessage: "table",
		});

	table.value = database.value.tables.find(
		({ slug }) => slug === currentTableInPath,
	) as Table;
});
