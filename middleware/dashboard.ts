import type { Database, User, apiResponse } from "~/types";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp(),
    user = useState<User>("user"),
    database = useState<Database>("database"),
    fromPath = useCookie("from");

  if (!["auth", "database-auth"].includes(from.name?.toString() ?? ""))
    fromPath.value = from.fullPath;
  // todo: save from path and use it to redirect
  if (!user.value)
    user.value = (
      await $fetch<apiResponse>(
        `${useRuntimeConfig().public.apiBase}${
          to.params.database ?? "inicontent"
        }/auth/current`
      )
    ).result;

  if (!database.value || database.value.slug !== to.params.database)
    database.value = (
      await $fetch<apiResponse>(
        `${useRuntimeConfig().public.apiBase}inicontent/database/${
          to.params.database ?? "inicontent"
        }`
      )
    ).result;

  if (user.value) {
    if (["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
      return nuxtApp.runWithContext(() =>
        navigateTo(
          fromPath.value ??
            (to.params.database ? `/${to.params.database}/admin` : `/admin`)
        )
      );
    }
  } else if (!["auth", "database-auth"].includes(to.name?.toString() ?? "")) {
    return nuxtApp.runWithContext(() =>
      navigateTo(to.params.database ? `/${to.params.database}/auth` : "/auth")
    );
  }
});
