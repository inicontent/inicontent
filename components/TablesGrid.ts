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
  IconSettings,
  IconPlus,
  IconFolders,
  IconLanguage,
  IconUsers,
  IconFingerprint,
} from "@tabler/icons-vue";
import type { Database, User } from "~/types";

export default defineNuxtComponent({
  props: {
    modelValue: {
      type: Object as PropType<Database>,
      default: {},
    },
  },
  setup: (props) => {
    useLanguage({
      ar: {
        add_new_table: "أضف جدول جديد",
        add_new: "أضف عنصر جديد",
        table_settings: "إعدادات الجدول",
      },
      en: {
        add_new_table: "Add new table",
        add_new: "Add New Item",
        table_settings: "Table Settings",
      },
    });
    const Loading = useState("Loading", () => ({}));
    const user = useState<User>("user"),
      database = toRef(props, "modelValue");

    return () =>
      h(NGrid, { xGap: 12, yGap: 12, cols: "1 500:2 800:4" }, () => [
        ...(database.value.tables
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
              Number(
                ["user", "session", "translation", "asset"].includes(b.slug)
              ) -
              Number(
                ["user", "session", "translation", "asset"].includes(a.slug)
              )
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
                              return h(IconFolders);
                            case "translation":
                              return h(IconLanguage);
                            case "user":
                              return h(IconUsers);
                            case "session":
                              return h(IconFingerprint);
                            default:
                              return t(table.slug).charAt(0).toUpperCase();
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
                      table.allowed_methods
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
                                    icon: () => h(NIcon, () => h(IconPlus)),
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
                                    href: `/${database.value.slug}/admin/tables/${table.slug}/settings`,
                                    onClick: (e) => (
                                      e.preventDefault(),
                                      navigateTo(
                                        `/${database.value.slug}/admin/tables/${table.slug}/settings`
                                      )
                                    ),
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(IconSettings)),
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
          ) ?? []),
        h(NGi, () =>
          h(
            NPopover,
            {},
            {
              trigger: () =>
                h(
                  NCard,
                  {
                    onClick: () => null,
                    style: {
                      cursor: "pointer",
                    },
                    contentStyle: {
                      padding: "15px 0",
                    },
                    hoverable: true,
                  },
                  () =>
                    h(
                      NSpace,
                      {
                        justify: "center",
                        align: "center",
                      },
                      () => h(NIcon, { size: 36 }, () => h(IconPlus))
                    )
                ),
              default: () => t("add_new_table"),
            }
          )
        ),
      ]);
  },
});
