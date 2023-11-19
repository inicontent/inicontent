import { NLayout, NLayoutSider, NMenu, NLayoutContent, NIcon } from "naive-ui";
import { Eye, Folders, Pencil, Plus, Trash } from "@vicons/tabler";
import { NuxtLayout, NuxtLink } from "#components";

export default defineComponent({
  setup: (props, { slots }) => {
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {},
      en: {},
    });

    const route = useRoute(),
      Window = useState("Window", () => ({
        width: 0,
      })),
      user = useState("user"),
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
                collapsedWidth: Window.value.width < 700 ? 0 : 64,
                width: 240,
                nativeScrollbar: false,
              },
              () =>
                h(NMenu, {
                  collapsed: !isMenuOpen.value,
                  collapsedIconSize: 22,
                  collapsedWidth: Window.value.width < 700 ? 0 : 64,
                  options: [
                    ...database.value.tables.map(
                      ({ slug, allowed_methods }) => ({
                        label: () =>
                          h(
                            NuxtLink,
                            {
                              to: `/${route.params.database}/admin/tables/${slug}`,
                            },
                            { default: () => t(slug) }
                          ),
                        key: slug,
                        icon: () => t(slug).charAt(0),
                        children:
                          (user.value.role === "admin" || slug === "user") &&
                          allowed_methods
                            ? [
                                user.value.role === "admin" ||
                                (allowed_methods.find(
                                  (method) => method.role === user.value.role
                                ) &&
                                  allowed_methods
                                    .find(
                                      (method) =>
                                        method.role === user.value.role
                                    )
                                    .methods.includes("r"))
                                  ? {
                                      label: () =>
                                        h(
                                          NuxtLink,
                                          {
                                            to: `/${route.params.database}/api/${slug}/get`,
                                          },
                                          { default: () => "GET" }
                                        ),
                                      key: "get",
                                      icon: () => h(NIcon, () => h(Eye)),
                                    }
                                  : null,
                                user.value.role === "admin" ||
                                allowed_methods.find(
                                  (method) =>
                                    method.role === user.value.role &&
                                    method.methods.includes("c")
                                )
                                  ? {
                                      label: () =>
                                        h(
                                          NuxtLink,
                                          {
                                            to: `/${route.params.database}/api/${slug}/post`,
                                          },
                                          { default: () => "POST" }
                                        ),
                                      key: "post",
                                      icon: () => h(NIcon, () => h(Plus)),
                                    }
                                  : null,
                                user.value.role === "admin" ||
                                (allowed_methods.find(
                                  (method) => method.role === user.value.role
                                ) &&
                                  allowed_methods
                                    .find(
                                      (method) =>
                                        method.role === user.value.role
                                    )
                                    .methods.includes("u"))
                                  ? {
                                      label: () =>
                                        h(
                                          NuxtLink,
                                          {
                                            to: `/${route.params.database}/api/${slug}/put`,
                                          },
                                          { default: () => "PUT" }
                                        ),
                                      key: "put",
                                      icon: () => h(NIcon, () => h(Pencil)),
                                    }
                                  : null,
                                user.value.role === "admin" ||
                                (allowed_methods.find(
                                  (method) => method.role === user.value.role
                                ) &&
                                  allowed_methods
                                    .find(
                                      (method) =>
                                        method.role === user.value.role
                                    )
                                    .methods.includes("d"))
                                  ? {
                                      label: () =>
                                        h(
                                          NuxtLink,
                                          {
                                            to: `/${route.params.database}/api/${slug}/delete`,
                                          },
                                          { default: () => "DELETE" }
                                        ),
                                      key: "delete",
                                      icon: () => h(NIcon, () => h(Trash)),
                                    }
                                  : null,
                              ].filter((i) => i !== null)
                            : null,
                      })
                    ),
                    {
                      key: "divider-1",
                      type: "divider",
                    },
                    {
                      label: () =>
                        h(
                          NuxtLink,
                          {
                            to: `/${route.params.database}/admin/tables/asset`,
                          },
                          { default: () => t("Assets") }
                        ),
                      key: "assets",
                      icon: () => h(NIcon, () => h(Folders)),
                      children: [
                        {
                          label: () =>
                            h(
                              NuxtLink,
                              {
                                to: `/${route.params.database}/api/asset/get`,
                              },
                              { default: () => "GET" }
                            ),
                          key: "assets-get",
                          icon: () => h(NIcon, () => h(Eye)),
                        },
                        {
                          label: () =>
                            h(
                              NuxtLink,
                              {
                                to: `/${route.params.database}/api/asset/post`,
                              },
                              { default: () => "POST" }
                            ),
                          key: "assets-post",
                          icon: () => h(NIcon, () => h(Plus)),
                        },
                        {
                          label: () =>
                            h(
                              NuxtLink,
                              {
                                to: `/${route.params.database}/api/asset/put`,
                              },
                              { default: () => "PUT" }
                            ),
                          key: "assets-put",
                          icon: () => h(NIcon, () => h(Pencil)),
                        },
                        {
                          label: () =>
                            h(
                              NuxtLink,
                              {
                                to: `/${route.params.database}/api/asset/delete`,
                              },
                              { default: () => "DELETE" }
                            ),
                          key: "assets-delete",
                          icon: () => h(NIcon, () => h(Trash)),
                        },
                      ],
                    },
                  ],
                  defaultExpandedKeys: [
                    route.params.table ??
                      route.path.split("/").filter(Boolean).pop(),
                  ],
                  value:
                    route.params.table ??
                    route.path.split("/").filter(Boolean).pop(),
                  accordion: true,
                })
            ),
            h(
              NLayoutContent,
              {
                position: "absolute",
                contentStyle: {
                  padding:
                    Window.value.width < 700
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
