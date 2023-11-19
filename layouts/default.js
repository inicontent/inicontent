import {
  NMessageProvider,
  NLayout,
  NScrollbar,
  NLayoutHeader,
  NPageHeader,
  NTag,
  NAvatar,
  NBreadcrumb,
  NBreadcrumbItem,
  NSpace,
  NDropdown,
  NButton,
  NLayoutContent,
  NLayoutFooter,
  NText,
  NIcon,
<<<<<<< HEAD
  NPopover,
} from "naive-ui";
import {
  Moon,
  Sun,
  Settings,
  Copyright,
  User,
=======
  useLoadingBar,
} from "naive-ui";
import {
  Sun,
  MoonStars,
  Copyright,
  UserCircle,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
  Pencil,
  Logout,
  Language as LanguageIcon,
} from "@vicons/tabler";
<<<<<<< HEAD
=======
import { Buffer } from "buffer";
import { NuxtLink } from "#components";
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2

export default defineComponent({
  setup: async (props, { slots }) => {
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
<<<<<<< HEAD
        settings: "الإعدادات",
        toggle_theme: "تغيير الوضع",
        Edit: "تعديل",
        asset: "صور وملفات",
        translation: "ترجمة النصوص",
        Admin: "لوحة التحكم",
        Settings: "إعدادات",
        Tables: "جداول",
        User: "مستخدم",
=======
        Edit: "تعديل",
        Asset: "الملفات والصور",
        Tables: "جداول",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
        copyright: "جميع الحقوق محفوظة",
        logout: "تسجيل الخروج",
        profile: "تعديل الحساب",
      },
      en: {
<<<<<<< HEAD
        settings: "Settings",
        toggle_theme: "Toggle Theme",
        asset: "Assets",
        translation: "Translation",
=======
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
        copyright: "All rights reserved Inicontent",
        logout: "Logout",
        profile: "Edit User",
      },
    });

<<<<<<< HEAD
    const Loading = useState("Loading", () => ({})),
      route = useRoute(),
      Window = useState("Window"),
      user = useState("user"),
      Theme = useGlobalCookie("Theme"),
      database = useState("database", () => ({
        name: "Inicontent",
        icon: "/favicon.ico",
      }));

=======
    const route = useRoute(),
      Window = useState("Window"),
      UserCookie = useCookie("User"),
      User = useState("User"),
      Theme = useGlobalCookie("Theme"),
      nuxtApp = useNuxtApp(),
      loadingBar = useLoadingBar(),
      database = useState("database", () => ({
        name: "Inicontent",
        icon: "/inicontent/favicon.ico",
      }));

    nuxtApp.hook("page:start", () => loadingBar.start());
    nuxtApp.hook("page:finish", () => loadingBar.finish());
    nuxtApp.hook("app:error", () => loadingBar.error());

>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
    onMounted(() => {
      Window.value = { width: window.innerWidth };
      window.addEventListener(
        "resize",
        () => (Window.value = { width: window.innerWidth })
      );
    });

    return () =>
      h(NMessageProvider, () =>
        h(NLayout, { position: "absolute" }, () => [
          h(
            NScrollbar,
            { style: "max-height: 65px", xScrollable: true, trigger: "none" },
            () =>
              h(
                NLayoutHeader,
                { style: "height: 64px; padding: 15px 24px", bordered: true },
                () =>
                  h(
                    NPageHeader,
                    {},
                    {
                      avatar: () =>
<<<<<<< HEAD
                        route.name.startsWith("database")
                          ? h(
                              NTag,
                              {
                                onClick: () =>
                                  navigateTo(`/${database.value.slug}`),
                                strong: true,
                                round: true,
                                bordered: false,
                                style: { cursor: "pointer" },
                              },
                              {
                                default: () => database.value.slug,
                                avatar: () =>
                                  h(NAvatar, {
                                    src: database.value.icon ?? "/favicon.ico",
                                  }),
                              }
                            )
                          : h(
                              NTag,
                              { strong: true, round: true, bordered: false },
                              {
                                default: () => database.value.slug,
                                avatar: () =>
                                  h(NAvatar, {
                                    src: database.value.icon ?? "/favicon.ico",
                                  }),
                              }
                            ),
=======
                        h(
                          NTag,
                          { strong: true, round: true, bordered: false },
                          {
                            default: () => database.value.name,
                            avatar: () =>
                              h(NAvatar, {
                                src:
                                  database.value.icon ??
                                  "/inicontent/favicon.ico",
                              }),
                          }
                        ),
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                      title: () =>
                        ![
                          "index",
                          "auth",
                          "dashboard",
<<<<<<< HEAD
                          "database",
                          "database-auth",
                        ].includes(route.name)
                          ? h(NBreadcrumb, {}, () =>
                              route.path
                                .split("/")
                                .filter(Boolean)
                                .filter((_path, index) =>
                                  route.name.startsWith("database")
                                    ? index !== 0
                                    : true
                                )
                                .map((childRoute, index) =>
                                  h(
                                    NBreadcrumbItem,
                                    {
                                      href: route.path
                                        .split("/")
                                        .slice(
                                          0,
                                          index +
                                            (route.name.startsWith("database")
                                              ? 3
                                              : 2)
                                        )
                                        .join("/"),
                                      onClick: (e) => (
                                        e.preventDefault(),
                                        navigateTo(
                                          route.path
                                            .split("/")
                                            .slice(
                                              0,
                                              index +
                                                (route.name.startsWith(
                                                  "database"
                                                )
                                                  ? 3
                                                  : 2)
                                            )
                                            .join("/")
                                        )
                                      ),
                                    },
                                    () => t(toName(childRoute))
=======
                          "db_slug",
                          "db_slug-auth",
                        ].includes(route.name)
                          ? h(NBreadcrumb, {}, () =>
                              route.path
                                .substring(1)
                                .split("/")
                                .filter(Boolean)
                                .map((childRoute, index) =>
                                  h(NBreadcrumbItem, () =>
                                    h(
                                      NuxtLink,
                                      {
                                        to: route.path
                                          .split("/")
                                          .slice(0, index + 2)
                                          .join("/"),
                                      },
                                      () =>
                                        t(
                                          childRoute.charAt(0).toUpperCase() +
                                            childRoute
                                              .slice(1)
                                              .replaceAll("_", " ")
                                        )
                                    )
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                                  )
                                )
                            )
                          : null,
                      extra: () =>
                        h(NSpace, { inline: true, wrap: false }, () => [
<<<<<<< HEAD
                          ...(user.value && user.value.id
                            ? [
                                h(
                                  NDropdown,
                                  {
                                    options: [
                                      {
                                        key: "header",
                                        type: "render",
                                        render: () =>
                                          h(
                                            NSpace,
                                            {
                                              justify: "center",
                                              style: {
                                                padding: "5px 0",
                                              },
                                            },
                                            () =>
                                              h(
                                                NText,
                                                {
                                                  strong: true,
                                                },
                                                () =>
                                                  user.value.username
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  user.value.username.slice(1)
                                              )
                                          ),
                                      },
                                      {
                                        key: "header-divider",
                                        type: "divider",
                                      },
                                      {
                                        label: t("profile"),
                                        key: "edit",
                                        icon: () => h(NIcon, () => h(Pencil)),
                                      },
                                      {
                                        label: t("logout"),
                                        key: "logout",
                                        icon: () => h(NIcon, () => h(Logout)),
                                      },
                                    ],
                                    onSelect: async (v) => {
                                      switch (v) {
                                        case "edit":
                                          navigateTo(
                                            `/${route.params.database}/admin/tables/user/${user.value.id}/edit`
                                          );
                                          break;
                                        case "logout":
                                          await $fetch(
                                            `/api/${
                                              route.params.database ??
                                              "inicontent"
                                            }/auth/signout`,
                                            {}
                                          );
                                          user.value = null;
                                          await navigateTo(
                                            route.params.database
                                              ? `/${route.params.database}/auth`
                                              : "/auth"
                                          );
                                          break;
                                      }
                                    },
                                  },
                                  () =>
                                    h(
                                      NButton,
                                      {
                                        size: "small",
                                        circle: true,
                                      },
                                      {
                                        icon: () => h(NIcon, () => h(User)),
                                      }
                                    )
                                ),
                                user.value.role === "admin"
                                  ? h(
                                      NPopover,
                                      {},
                                      {
                                        trigger: () =>
                                          h(
                                            NButton,
                                            {
                                              size: "small",
                                              circle: true,
                                              tag: "a",
                                              href: `/${route.params.database}/admin/settings`,
                                              onClick: (e) => (
                                                e.preventDefault(),
                                                navigateTo(
                                                  `/${route.params.database}/admin/settings`
                                                )
                                              ),
                                            },
                                            {
                                              icon: () =>
                                                h(NIcon, () => h(Settings)),
                                            }
                                          ),
                                        default: () => t("settings"),
                                      }
                                    )
                                  : null,
                              ]
                            : []),
                          h(
                            NPopover,
                            {},
                            {
                              trigger: () =>
                                h(
                                  NButton,
                                  {
                                    size: "small",
                                    circle: true,
                                    onClick: () =>
                                      Theme.value === "dark"
                                        ? (Theme.value = "light")
                                        : (Theme.value = "dark"),
                                  },
                                  {
                                    icon: () =>
                                      h(NIcon, () =>
                                        Theme.value === "light"
                                          ? h(Moon)
                                          : h(Sun)
                                      ),
                                  }
                                ),
                              default: () => t("toggle_theme"),
                            }
                          ),
=======
                          User.value && User.value.id
                            ? h(
                                NDropdown,
                                {
                                  options: [
                                    {
                                      key: "header",
                                      type: "render",
                                      render: () =>
                                        h(
                                          NSpace,
                                          {
                                            justify: "center",
                                            style: {
                                              padding: "5px 0",
                                            },
                                          },
                                          () =>
                                            h(
                                              NText,
                                              {
                                                strong: true,
                                              },
                                              () =>
                                                User.value.username
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                User.value.username.slice(1)
                                            )
                                        ),
                                    },
                                    {
                                      key: "header-divider",
                                      type: "divider",
                                    },
                                    {
                                      label: t("profile"),
                                      key: "edit",
                                      icon: () => h(NIcon, () => h(Pencil)),
                                    },
                                    {
                                      label: t("logout"),
                                      key: "logout",
                                      icon: () => h(NIcon, () => h(Logout)),
                                    },
                                  ],
                                  onSelect: async (v) => {
                                    switch (v) {
                                      case "edit":
                                        navigateTo(
                                          `${
                                            route.name.startsWith("dashboard")
                                              ? "/dashboard/"
                                              : "/"
                                          }${
                                            route.params.db_slug
                                          }/tables/user/${User.value.id}/edit`
                                        );
                                        break;
                                      case "logout":
                                        await $fetch(
                                          `https://api.inicontent.com/${
                                            route.params.db_slug ?? "inicontent"
                                          }/auth/logout`,
                                          {
                                            headers: {
                                              Authorization:
                                                "Basic " +
                                                Buffer.from(
                                                  `${User.value.username}:${User.value.password}`
                                                ).toString("base64"),
                                            },
                                          }
                                        );
                                        UserCookie.value = null;
                                        User.value = null;
                                        await navigateTo(
                                          route.name.startsWith("dashboard")
                                            ? "/auth"
                                            : route.params.db_slug
                                            ? `/${route.params.db_slug}/auth`
                                            : "/auth"
                                        );
                                        break;
                                    }
                                  },
                                },
                                () =>
                                  h(
                                    NButton,
                                    {
                                      size: "small",
                                      circle: true,
                                    },
                                    {
                                      icon: () => h(NIcon, () => h(UserCircle)),
                                    }
                                  )
                              )
                            : null,
                          h(
                            NButton,
                            {
                              size: "small",
                              circle: true,
                              onClick: () =>
                                Theme.value === "dark"
                                  ? (Theme.value = "light")
                                  : (Theme.value = "dark"),
                            },
                            {
                              icon: () =>
                                h(NIcon, () =>
                                  Theme.value === "light"
                                    ? h(MoonStars)
                                    : h(Sun)
                                ),
                            }
                          ),

>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                          h(
                            NDropdown,
                            {
                              value: Language.value,
                              options: [
                                {
                                  label: "Arabic",
                                  key: "ar",
                                },
                                {
                                  label: "English",
                                  key: "en",
                                },
                              ],
                              onSelect: (v) => (Language.value = v),
                            },
                            () =>
                              h(
                                NButton,
                                { size: "small", round: true },
                                {
                                  icon: () => h(NIcon, () => h(LanguageIcon)),
                                  default: () => Language.value.toUpperCase(),
                                }
                              )
                          ),
                        ]),
                    }
                  )
              )
          ),
          h(
            NLayoutContent,
            {
              id: "container",
              position: "absolute",
              style: "top: 64px; bottom: 34px; height: calc(~'100vh - 98px')",
              nativeScrollbar: false,
              contentStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
                height: "max-content",
              },
            },
            () => slots.default()
          ),
          h(
            NLayoutFooter,
            {
              position: "absolute",
              style: {
                height: "34px",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
              },
              bordered: true,
            },
            () =>
              h(NText, {}, () => [
                t("copyright"),
                h(NIcon, { size: 12 }, () => h(Copyright)),
                new Date().getFullYear(),
              ])
          ),
        ])
      );
  },
});
