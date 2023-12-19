import {
  NCard,
  NSpace,
  NButton,
  NIcon,
  NGrid,
  NGi,
  NIconWrapper,
  NH4,
  NPopover,
} from "naive-ui";
import {
  Settings,
  Plus,
  Folders,
  Language as LanguageIcon,
  Users,
  Fingerprint,
} from "@vicons/tabler";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        add_new: "أضف عنصر جديد",
        table_settings: "إعدادات الجدول",
      },
      en: {
        add_new: "Add New Item",
        table_settings: "Table Settings",
      },
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["AddNewDatabase"] = false;

    const database = useState("database"),
      route = useRoute(),
      user = useState("user");
    useHead({
      title: `${database.value.slug} | ${t("Tables")}`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    return () =>
      h(
        NCard,
        { title: t("Tables"), style: "background: none", bordered: false },
        () =>
          h(NGrid, { xGap: 12, yGap: 12, cols: "1 500:2 800:4" }, () =>
            database.value.tables
              ?.filter(
                ({ slug, allowed_methods }) =>
                  user.value &&
                  (user.value.role === "admin" ||
                    slug === "user" ||
                    allowed_methods
                      ?.find((method) => method.role === user.value.role)
                      ?.methods?.includes("r"))
              )
              .toSorted(
                (a, b) =>
                  ["user", "session", "translation", "asset"].includes(b.slug) -
                  ["user", "session", "translation", "asset"].includes(a.slug)
              )
              .map((table) =>
                h(NGi, () =>
                  h(
                    NCard,
                    {
                      onClick: () =>
                        navigateTo(
                          `/${database.value.slug}/admin/tables/${table.slug}`
                        ),
                      style: {
                        cursor: "pointer",
                      },
                      hoverable: true,
                    },
                    {
                      header: () =>
                        h(NSpace, () => [
                          h(NIconWrapper, { borderRadius: 50 }, () =>
                            h(NIcon, { style: "font-style: normal" }, () => {
                              switch (table.slug) {
                                case "asset":
                                  return h(Folders);
                                case "translation":
                                  return h(LanguageIcon);
                                case "user":
                                  return h(Users);
                                case "session":
                                  return h(Fingerprint);
                                default:
                                  return t(table.slug).charAt(0);
                              }
                            })
                          ),
                          h(NH4, { style: "margin-bottom: 0" }, () =>
                            t(table.slug)
                          ),
                        ]),
                      "header-extra": () =>
                        h(NSpace, () => [
                          user.value.role === "admin" ||
                          allowed_methods
                            ?.find((method) => method.role === user.value.role)
                            ?.methods?.includes("c")
                            ? h(
                                NPopover,
                                {},
                                {
                                  trigger: () =>
                                    h(
                                      NButton,
                                      {
                                        tag: "a",
                                        href: `/${database.value.slug}/admin/tables/${table.slug}/new`,
                                        onClick: (e) => (
                                          e.preventDefault(),
                                          navigateTo(
                                            `/${database.value.slug}/admin/tables/${table.slug}/new`
                                          )
                                        ),
                                        circle: true,
                                      },
                                      {
                                        icon: () => h(NIcon, () => h(Plus)),
                                      }
                                    ),
                                  default: () => t("add_new"),
                                }
                              )
                            : null,
                          user.value.role === "admin"
                            ? h(
                                NPopover,
                                {},
                                {
                                  trigger: () =>
                                    h(
                                      NButton,
                                      {
                                        circle: true,
                                        tag: "a",
                                        href: `/${route.params.database}/admin/tables/${table.slug}/settings`,
                                        onClick: (e) => (
                                          e.preventDefault(),
                                          navigateTo(
                                            `/${route.params.database}/admin/tables/${table.slug}/settings`
                                          )
                                        ),
                                      },
                                      {
                                        icon: () => h(NIcon, () => h(Settings)),
                                      }
                                    ),
                                  default: () => t("table_settings"),
                                }
                              )
                            : null,
                        ]),
                    }
                  )
                )
              )
          )
      );
  },
});
