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
  NForm,
  NModal,
  type FormInst,
  useMessage,
  NDropdown,
} from "naive-ui";
import {
  IconSettings,
  IconPlus,
  IconFolders,
  IconLanguage,
  IconUsers,
  IconFingerprint,
  IconDeviceFloppy,
  IconDots,
  IconArrowRight,
} from "@tabler/icons-vue";
import type { Database, Table, User, apiResponse } from "~/types";
import { LazyRenderFields } from "#components";

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
        c: "إضافة",
        r: "قراءة",
        u: "تعديل",
        d: "حذف",
      },
      en: {
        add_new_table: "Add new table",
        add_new: "Add New Item",
        table_settings: "Table Settings",
        c: "Create",
        r: "Read",
        u: "Update",
        d: "Delete",
      },
    });
    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["Table"] = false;

    const user = useState<User>("user"),
      database = toRef(props, "modelValue"),
      Window = useState("Window", () => ({
        width: 0,
      })),
      Hover = useState<Record<string, boolean>>("Loading", () => ({})),
      message = useMessage(),
      ShowTableModal = ref(false),
      TableRef = ref<FormInst | null>(null),
      TableModal = ref<Table>(),
      TableSave = async () => {
        const bodyContent = JSON.parse(JSON.stringify(TableModal.value));
        TableRef.value?.validate(async (errors: any) => {
          if (!errors) {
            Loading.value["Table"] = true;
            const { data } = await useFetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}inicontent/database/${
                database.value.slug
              }`,
              {
                method: "PUT",
                body: {
                  ...database.value,
                  tables: [...(database.value.tables ?? []), bodyContent],
                },
              }
            );
            if (data.value?.result) {
              database.value = data.value.result;
              Loading.value["Database"] = false;
              ShowTableModal.value = false;
              message.success(data.value.message.en);
            } else message.error(data.value?.message.en ?? "Error");
            Loading.value["Table"] = false;
          } else message.error("The inputs are Invalid");
        });
      };

    return () => [
      h(
        NModal,
        {
          show: ShowTableModal.value,
          "on-update:show": (v: boolean) => (ShowTableModal.value = v),
          style: {
            width: Window.value.width > 600 ? "600px" : "100%",
          },
          preset: "card",
          title: t("create_table"),
          bordered: false,
          segmented: {
            footer: "soft",
          },
        },
        {
          default: () =>
            h(
              NForm,
              {
                ref: TableRef as any,
                model: TableModal.value as any,
              },
              () =>
                h(LazyRenderFields, {
                  modelValue: TableModal.value,
                  schema: [
                    {
                      id: 1,
                      key: "slug",
                      type: "text",
                      required: true,
                    },
                    {
                      id: 2,
                      key: "allowed_methods",
                      type: "array",
                      disableActions: true,
                      children: [
                        {
                          id: 3,
                          key: "role",
                          type: "text",
                          inputProps: {
                            disabled: true,
                          },
                          required: true,
                        },
                        {
                          id: 4,
                          key: "methods",
                          type: "array",
                          children: "string",
                          subType: "checkbox",
                          values: ["c", "r", "u", "d"],
                          required: true,
                        },
                      ],
                    },
                  ],
                })
            ),
          footer: () =>
            h(NSpace, { justify: "end" }, () => [
              h(
                NButton,
                {
                  loading: Loading.value["Table"],
                  onClick: TableSave,
                },
                {
                  default: () => t("create"),
                  icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                }
              ),
            ]),
        }
      ),
      h(NGrid, { xGap: 12, yGap: 12, cols: "1 500:2 800:4" }, () => [
        ...(database.value.tables
          ?.filter(
            ({ slug, allowed_methods }) =>
              user.value &&
              (user.value.role === "admin" ||
                slug === "user" ||
                allowed_methods
                  ?.find(({ role }) => role === user.value.role)
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
                    table.slug === "asset"
                      ? h(
                          NButton,
                          {
                            tag: "a",
                            href: `/${database.value.slug}/admin/tables/${table.slug}`,
                            onClick: (e) => (
                              e.preventDefault(),
                              navigateTo(
                                `/${database.value.slug}/admin/tables/${table.slug}`
                              )
                            ),
                            circle: true,
                          },
                          {
                            icon: () => h(NIcon, () => h(IconArrowRight)),
                          }
                        )
                      : h(
                          NDropdown,
                          {
                            options: [
                              {
                                key: `/${database.value.slug}/admin/tables/${table.slug}/new`,
                                label: t("add_new"),
                                icon: () => h(IconPlus),
                                show:
                                  user.value.role === "admin" ||
                                  table.allowed_methods
                                    ?.find(
                                      ({ role }) => role === user.value.role
                                    )
                                    ?.methods?.includes("c"),
                              },
                              {
                                key: `/${database.value.slug}/admin/tables/${table.slug}/settings`,
                                label: t("table_settings"),
                                icon: () => h(IconSettings),
                                show: user.value.role === "admin",
                              },
                            ],
                            renderLabel: (option) =>
                              h(
                                "a",
                                {
                                  href: option.key,
                                  onClick: (e) => (
                                    e.preventDefault(),
                                    navigateTo(option.key as string)
                                  ),
                                },
                                option.label as string
                              ),
                          },
                          () =>
                            h(
                              NButton,
                              {
                                circle: true,
                                onmouseover: () =>
                                  (Hover.value[table.slug] = true),
                                onmouseleave: () =>
                                  (Hover.value[table.slug] = false),
                              },
                              {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      Hover.value[table.slug]
                                        ? IconArrowRight
                                        : IconDots
                                    )
                                  ),
                              }
                            )
                        ),
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
                    onClick: () => (
                      (TableModal.value = {
                        slug: "",
                        allowed_methods:
                          database.value.roles?.map((role) => ({
                            role: role,
                            methods: [],
                          })) ?? [],
                      }),
                      (ShowTableModal.value = true)
                    ),
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
      ]),
    ];
  },
});
