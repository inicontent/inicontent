import { NLayout, NLayoutSider, NMenu, NLayoutContent, NIcon } from "naive-ui";
import { CirclePlus, Eye, Folders } from "@vicons/tabler";
import { NuxtLayout, NuxtLink } from "#components";

export default defineComponent({
  setup: (props, { slots }) => {
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
        assets: "الملفات والصور",
        show_all: "أظهر الكل",
        add_new: "عنصر جديد",
      },
      en: {
        assets: "Assets",
        show_all: "Show All",
        add_new: "New Item",
      },
    });

    const route = useRoute(),
      Window = useState("Window", () => ({
        width: 0,
      })),
      User = useState("User"),
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
                collapsedWidth: Window.width < 700 ? 0 : 64,
                width: 240,
                nativeScrollbar: false,
              },
              () =>
                h(NMenu, {
                  collapsed: !isMenuOpen.value,
                  collapsedIconSize: 22,
                  collapsedWidth: Window.width < 700 ? 0 : 64,
                  options: [
                    ...database.value.tables
                      .filter(
                        ({ slug, allowed_methods }) =>
                          User.value.role &&
                          (User.value.role === "admin" ||
                            slug === "user" ||
                            (allowed_methods &&
                              allowed_methods[User.value.role] &&
                              allowed_methods[User.value.role].includes("r")))
                      )
                      .map(({ name, slug, allowed_methods }) => ({
                        label: () =>
                          h(
                            NuxtLink,
                            {
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
                            ? [
                                {
                                  label: () =>
                                    h(
                                      NuxtLink,
                                      {
                                        to: `/${route.params.db_slug}/tables/${slug}`,
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
                                        to: `/${route.params.db_slug}/tables/${slug}/new`,
                                      },
                                      { default: () => t("add_new") }
                                    ),
                                  key: `new-${slug}`,
                                  icon: () => h(NIcon, () => h(CirclePlus)),
                                },
                              ]
                            : null,
                      })),
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
                  accordion: true,
                })
            ),
            h(
              NLayoutContent,
              {
                position: "absolute",
                contentStyle: {
                  padding:
                    Window.width < 700
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
