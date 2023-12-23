import { NLayout, NLayoutSider, NMenu, NLayoutContent, NIcon } from "naive-ui";
import {
  Plus,
  Eye,
  Folders,
  Language as LanguageIcon,
  Users,
  Fingerprint,
} from "@vicons/tabler";
import { NuxtLayout, NuxtLink } from "#components";

export default defineComponent({
  setup: (props, { slots }) => {
    const Language = useGlobalCookie("Language");

    useLanguage({
      ar: {
        show_all: "أظهر الكل",
        add_new: "عنصر جديد",
      },
      en: {
        show_all: "Show All",
        add_new: "New Item",
      },
    });

    const route = useRoute(),
      Window = useState("Window", () => ({
        width: 0,
      })),
      user = useState("user"),
      isMenuOpen = useState("isMenuOpen", () => false),
      database = useState("database");

    return () =>
      h(
        "div",
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
                    options: database.value.tables
                      ? [
                          ...database.value.tables
                            ?.filter(
                              ({ slug, allowed_methods }) =>
                                ![
                                  "user",
                                  "session",
                                  "asset",
                                  "translation",
                                ].includes(slug) &&
                                (user.value.role === "admin" ||
                                  slug === "user" ||
                                  allowed_methods
                                    ?.find(
                                      (method) =>
                                        method.role === user.value.role
                                    )
                                    ?.methods?.includes("r"))
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
                              icon: () => t(slug).charAt(0).toUpperCase(),
                              children:
                                user.value.role === "admin" ||
                                slug === "user" ||
                                allowed_methods
                                  ?.find(
                                    (method) => method.role === user.value.role
                                  )
                                  ?.methods?.includes("c")
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
                          database.value.tables?.filter(
                            ({ slug, allowed_methods }) =>
                              [
                                "user",
                                "session",
                                "asset",
                                "translation",
                              ].includes(slug) &&
                              user.value.role &&
                              (user.value.role === "admin" ||
                                slug === "user" ||
                                allowed_methods
                                  ?.find(
                                    (method) => method.role === user.value.role
                                  )
                                  ?.methods?.includes("r"))
                          ).length
                            ? {
                                key: "divider-1",
                                type: "divider",
                              }
                            : null,
                          ...database.value.tables
                            ?.filter(
                              ({ slug, allowed_methods }) =>
                                [
                                  "user",
                                  "session",
                                  "asset",
                                  "translation",
                                ].includes(slug) &&
                                user.value.role &&
                                (user.value.role === "admin" ||
                                  slug === "user" ||
                                  allowed_methods
                                    ?.find(
                                      (method) =>
                                        method.role === user.value.role
                                    )
                                    ?.methods?.includes("r"))
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
                                allowed_methods
                                  ?.find(
                                    (method) => method.role === user.value.role
                                  )
                                  ?.methods?.includes("c")
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
                        ]
                      : [],
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
        )
      );
  },
});
