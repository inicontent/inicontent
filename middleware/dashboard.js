export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp(),
    user = useState("user"),
    database = useState("database"),
    fromPath = useCookie("from"),
    ip = useState("ip"),
    userAgent = useState("userAgent");

  if (!["auth", "database-auth"].includes(from.name))
    fromPath.value = from.fullPath;
  // todo: save from path and use it to redirect
  if (!user.value)
    user.value = (
      await $fetch(`/api/${to.params.database ?? "inicontent"}/auth/current`, {
        headers: { "x-forwarded-for": ip.value, "user-agent": userAgent.value },
      })
    ).result;

  if (!database.value || database.value.slug !== to.params.database)
    database.value = (
      await $fetch(
        `/api/inicontent/database/${to.params.database ?? "inicontent"}`,
        {
          headers: {
            "x-forwarded-for": ip.value,
            "user-agent": userAgent.value,
          },
        }
      )
    ).result;

  if (user.value) {
    if (["auth", "database-auth"].includes(to.name)) {
      return nuxtApp.runWithContext(() =>
        navigateTo(
          fromPath.value ??
            (to.params.database ? `/${to.params.database}/admin` : `/admin`)
        )
      );
    }
  } else if (!["auth", "database-auth"].includes(to.name)) {
    return nuxtApp.runWithContext(() =>
      navigateTo(to.params.database ? `/${to.params.database}/auth` : "/auth")
    );
  }
});
