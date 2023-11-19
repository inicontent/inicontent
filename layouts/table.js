import { NLayout, NLayoutSider, NMenu, NLayoutContent, NIcon } from "naive-ui";
<<<<<<< HEAD
import {
  Plus,
  Eye,
  Folders,
  Language as LanguageIcon,
  Users,
  Fingerprint,
} from "@vicons/tabler";
=======
import { CirclePlus, Eye, Folders } from "@vicons/tabler";
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
import { NuxtLayout, NuxtLink } from "#components";

export default defineComponent({
  setup: (props, { slots }) => {
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
<<<<<<< HEAD
=======
        assets: "الملفات والصور",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
        show_all: "أظهر الكل",
        add_new: "عنصر جديد",
      },
      en: {
<<<<<<< HEAD
=======
        assets: "Assets",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
        show_all: "Show All",
        add_new: "New Item",
      },
    });

    const route = useRoute(),
      Window = useState("Window", () => ({
        width: 0,
      })),
<<<<<<< HEAD
      user = useState("user"),
=======
      User = useState("User"),
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
      isMenuOpen = useState("isMenuOpen", () => false),
      database = useState("database");
    return () =>
      h(NuxtLayout, { name: "default" }, () =>
        h(
          NLayout,
          {
            position: "absolute",
            hasSider: true,
          },
          () => [
            h(
              NLayoutSider,
              {
                collapsed: !isMenuOpen.value,
                onCollapse: () => (isMenuOpen.value = false),
                onExpand: () => (isMenuOpen.value = true),
                style: "z-index: 999",
                bordered: true,
                showTrigger: "bar",
                collapseMode: "width",
<<<<<<< HEAD
                collapsedWidth: Window.value.width < 700 ? 0 : 64,
=======
                collapsedWidth: Window.width < 700 ? 0 : 64,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                width: 240,
                nativeScrollbar: false,
              },
              () =>
                h(NMenu, {
                  collapsed: !isMenuOpen.value,
                  collapsedIconSize: 22,
<<<<<<< HEAD
                  collapsedWidth: Window.value.width < 700 ? 0 : 64,
=======
                  collapsedWidth: Window.width < 700 ? 0 : 64,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                  options: [
                    ...database.value.tables
                      .filter(
                        ({ slug, allowed_methods }) =>
<<<<<<< HEAD
                          !["user", "session", "asset", "translation"].includes(
                            slug
                          ) &&
                          user.value.role &&
                          (user.value.role === "admin" ||
                            slug === "user" ||
                            (allowed_methods &&
                              allowed_methods.find(
                                (method) => method.role === user.value.role
                              ) &&
                              allowed_methods
                                .find(
                                  (method) => method.role === user.value.role
                                )
                                .methods.includes("r")))
                      )
                      .map(({ slug, allowed_methods }) => ({
=======
                          User.value.role &&
                          (User.value.role === "admin" ||
                            slug === "user" ||
                            (allowed_methods &&
                              allowed_methods[User.value.role] &&
                              allowed_methods[User.value.role].includes("r")))
                      )
                      .map(({ name, slug, allowed_methods }) => ({
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                        label: () =>
                          h(
                            NuxtLink,
                            {
<<<<<<< HEAD
                              to: `/${route.params.database}/admin/tables/${slug}`,
                            },
                            { default: () => t(slug) }
                          ),
                        key: slug,
                        icon: () => t(slug).charAt(0).toUpperCase(),
                        children:
                          user.value.role === "admin" ||
                          slug === "user" ||
                          (allowed_methods &&
                            allowed_methods.find(
                              (method) =>
                                method.role === user.value.role &&
                                method.methods.includes("c")
                            ))
=======
                              to: `/${route.params.db_slug}/tables/${slug}`,
                            },
                            { default: () => name }
                          ),
                        key: slug,
                        icon: () => name.charAt(0),
                        children:
                          User.value.role === "admin" ||
                          slug === "user" ||
                          (allowed_methods &&
                            allowed_methods[User.value.role] &&
                            allowed_methods[User.value.role].includes("c"))
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                            ? [
                                {
                                  label: () =>
                                    h(
                                      NuxtLink,
                                      {
<<<<<<< HEAD
                                        to: `/${route.params.database}/admin/tables/${slug}`,
=======
                                        to: `/${route.params.db_slug}/tables/${slug}`,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                                      },
                                      { default: () => t("show_all") }
                                    ),
                                  key: slug,
                                  icon: () => h(NIcon, () => h(Eye)),
                                },
                                {
                                  label: () =>
                                    h(
                                      NuxtLink,
                                      {
<<<<<<< HEAD
                                        to: `/${route.params.database}/admin/tables/${slug}/new`,
=======
                                        to: `/${route.params.db_slug}/tables/${slug}/new`,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                                      },
                                      { default: () => t("add_new") }
                                    ),
                                  key: `new-${slug}`,
<<<<<<< HEAD
                                  icon: () => h(NIcon, () => h(Plus)),
=======
                                  icon: () => h(NIcon, () => h(CirclePlus)),
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                                },
                              ]
                            : null,
                      })),
<<<<<<< HEAD
                    database.value.tables.filter(
                      ({ slug, allowed_methods }) =>
                        ["user", "session", "asset", "translation"].includes(
                          slug
                        ) &&
                        user.value.role &&
                        (user.value.role === "admin" ||
                          slug === "user" ||
                          (allowed_methods &&
                            allowed_methods.find(
                              (method) => method.role === user.value.role
                            ) &&
                            allowed_methods
                              .find((method) => method.role === user.value.role)
                              .methods.includes("r")))
                    ).length
                      ? {
                          key: "divider-1",
                          type: "divider",
                        }
                      : null,
                    ...database.value.tables
                      .filter(
                        ({ slug, allowed_methods }) =>
                          ["user", "session", "asset", "translation"].includes(
                            slug
                          ) &&
                          user.value.role &&
                          (user.value.role === "admin" ||
                            slug === "user" ||
                            (allowed_methods &&
                              allowed_methods.find(
                                (method) => method.role === user.value.role
                              ) &&
                              allowed_methods
                                .find(
                                  (method) => method.role === user.value.role
                                )
                                .methods.includes("r")))
                      )
                      .map(({ slug, allowed_methods }) => ({
                        label: () =>
                          h(
                            NuxtLink,
                            {
                              to: `/${route.params.database}/admin/tables/${slug}`,
                            },
                            { default: () => t(slug) }
                          ),
                        key: slug,
                        icon: () =>
                          h(NIcon, () => {
                            switch (slug) {
                              case "asset":
                                return h(Folders);
                              case "translation":
                                return h(LanguageIcon);
                              case "user":
                                return h(Users);
                              case "session":
                                return h(Fingerprint);
                              default:
                                return t(slug).charAt(0).toUpperCase();
                            }
                          }),
                        children:
                          user.value.role === "admin" ||
                          slug === "user" ||
                          (allowed_methods &&
                            allowed_methods.find(
                              (method) =>
                                method.role === user.value.role &&
                                method.methods.includes("c")
                            ))
                            ? [
                                {
                                  label: () =>
                                    h(
                                      NuxtLink,
                                      {
                                        to: `/${route.params.database}/admin/tables/${slug}`,
                                      },
                                      { default: () => t("show_all") }
                                    ),
                                  key: slug,
                                  icon: () => h(NIcon, () => h(Eye)),
                                },
                                {
                                  label: () =>
                                    h(
                                      NuxtLink,
                                      {
                                        to: `/${route.params.database}/admin/tables/${slug}/new`,
                                      },
                                      { default: () => t("add_new") }
                                    ),
                                  key: `new-${slug}`,
                                  icon: () => h(NIcon, () => h(Plus)),
                                },
                              ]
                            : null,
                      })),
                  ],
                  defaultExpandedKeys: [
                    route.params.table ??
                      route.path.split("/").filter(Boolean).pop(),
                  ],
                  value:
                    route.params.table ??
                    route.path.split("/").filter(Boolean).pop(),
=======
                    {
                      key: "divider-1",
                      type: "divider",
                    },
                    {
                      label: () =>
                        h(
                          NuxtLink,
                          {
                            to: `/${route.params.db_slug}/tables/asset`,
                          },
                          { default: () => t("assets") }
                        ),
                      key: "asset",
                      icon: () => h(NIcon, () => h(Folders)),
                    },
                  ],
                  defaultExpandedKeys: [route.params.slug],
                  value: route.params.slug,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                  accordion: true,
                })
            ),
            h(
              NLayoutContent,
              {
                position: "absolute",
                contentStyle: {
                  padding:
<<<<<<< HEAD
                    Window.value.width < 700
=======
                    Window.width < 700
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
                      ? "24px"
                      : Language.value === "ar"
                      ? "24px 88px 24px 24px"
                      : "24px 24px 24px 88px",
                },
                nativeScrollbar: false,
                id: "page_content",
              },
              () => [
                isMenuOpen.value
                  ? h("div", {
                      onClick: () => (isMenuOpen.value = false),
                      style: {
                        width: "100%",
                        height: "100%",
                        right: "0px",
                        top: "0px",
                        backgroundColor: "#0000006e",
                        position: "absolute",
                        zIndex: 99,
                        cursor: "pointer",
                      },
                    })
                  : null,
                slots.default(),
              ]
            ),
          ]
        )
      );
  },
});
