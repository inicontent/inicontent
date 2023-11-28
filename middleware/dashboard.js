export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp(),
    user = useState("user"),
    database = useState("database");
  try {
    await nuxtApp.runWithContext(() =>
      useAsyncData(
        "current",
        () => $fetch(`/api/${to.params.database ?? "inicontent"}/auth/current`),
        {
          transform(response) {
            user.value = response.result;
          },
          server: false,
        }
      )
    );
    await nuxtApp.runWithContext(() =>
      useAsyncData(
        "database",
        () =>
          $fetch(
            `/api/inicontent/database/${to.params.database ?? "inicontent"}`
          ),
        {
          transform(response) {
            database.value = response.result;
          },
          server: false,
        }
      )
    );
  } catch (error) {
    user.value = null;
  }
  if (user.value) {
    if (["auth", "database-auth"].includes(to.name)) {
      return nuxtApp.runWithContext(() =>
        navigateTo(
          to.params.database ? `/${to.params.database}/admin` : `/admin`
        )
      );
    }
  } else if (!["auth", "database-auth"].includes(to.name)) {
    return nuxtApp.runWithContext(() =>
      navigateTo(to.params.database ? `/${to.params.database}/auth` : "/auth")
    );
  }
});
