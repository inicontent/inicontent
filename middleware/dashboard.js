import { Buffer } from "buffer";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const UserCookie = useCookie("User"),
    User = useState("User"),
    database = useState("database");
  if (
    UserCookie.value &&
    UserCookie.value.username &&
    UserCookie.value.password
  ) {
    User.value = (
      await useFetch(
        `https://api.inicontent.com/${
          to.params.db_slug ?? "inicontent"
        }/auth/current`,
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                `${UserCookie.value.username}:${UserCookie.value.password}`
              ).toString("base64"),
          },
          transform: (res) => res.result,
          key: UserCookie.value.username,
        }
      )
    ).data.value;
    if (User.value && User.value.id) {
      User.value.password = UserCookie.value.password;
      if (["auth", "db_slug-auth"].includes(to.name))
        return navigateTo(
          to.params.db_slug ? `/${to.params.db_slug}` : `/dashboard`
        );
    } else if (!["auth", "db_slug-auth"].includes(to.name)) {
      UserCookie.value = null;
      User.value = null;
      return navigateTo(
        to.params.db_slug ? `/${to.params.db_slug}/auth` : "/auth"
      );
    }
    if (!database.value || database.value.slug !== to.params.db_slug)
      database.value = (
        await useFetch(
          `https://api.inicontent.com/inicontent/db/${
            to.params.db_slug ?? "inicontent"
          }`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            transform: (res) => res.result,
            key: (to.params.db_slug ?? "inicontent") + User.value.username,
          }
        )
      ).data.value;
    if (
      to.params.table_slug &&
      (!database.value.tables ||
        !database.value.tables.find(
          (item) => item.slug === to.params.table_slug
        ))
    )
      return navigateTo(`/${to.params.db_slug}`);
  } else if (["auth", "db_slug-auth"].includes(to.name))
    database.value = (
      await useFetch(
        `https://api.inicontent.com/inicontent/db/${
          to.params.db_slug ?? "inicontent"
        }`,
        {
          transform: (res) => res.result,
          key: to.params.db_slug ?? "inicontent",
        }
      )
    ).data.value;
  else return navigateTo(`/${to.params.db_slug ?? ""}/auth`);
});
