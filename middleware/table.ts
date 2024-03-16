export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp(),
    database = useState<Database>("database");

  if (!database.value.tables?.find(({ slug }) => slug === to.params.table))
    return nuxtApp.runWithContext(() =>
      navigateTo(`/${to.params.database}/admin/tables`)
    );
});
