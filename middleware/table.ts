export default defineNuxtRouteMiddleware(async (to, from) => {
	const nuxtApp = useNuxtApp(),
		database = useState<Database>("database"),
		table = useState<Table>("table"),
		currentTableInPath =
			to.params.table || to.path.split("/admin/tables/")[1]?.split("/")[0];

	if (
		!database.value.tables ||
		!currentTableInPath ||
		!database.value.tables?.find(({ slug }) => slug === currentTableInPath)
	)
		return nuxtApp.runWithContext(() =>
			navigateTo(`/${to.params.database}/admin/tables`),
		);

	table.value = database.value.tables.find(
		({ slug }) => slug === currentTableInPath,
	) as Table;
});
