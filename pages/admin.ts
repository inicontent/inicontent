import {
  useMessage,
  NCard,
  NModal,
  NSpace,
  NButton,
  NIcon,
  NForm,
  NCollapse,
  NCollapseItem,
  type FormInst,
} from "naive-ui";
import {
  IconPlus,
  IconDeviceFloppy,
  IconSettings,
  IconArrowRight,
} from "@tabler/icons-vue";
import { LazyTablesGrid, LazyRenderFields } from "#components";
import type { Database } from "~/types";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        add_new: "أضف عنصر جديد",
        table_settings: "إعدادات الجدول",
        c: "c",
        r: "r",
        u: "c",
        d: "d",
      },
      en: {
        add_new: "Add New Item",
        table_settings: "Table Settings",
        c: "c",
        r: "r",
        u: "c",
        d: "d",
      },
    });

    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["Database"] = false;

    const database = useState<Database>("database"),
      message = useMessage(),
      DisabledItem = useState<boolean[]>(() => []),
      Window = useState("Window", () => ({
        width: 0,
      })),
      { data: databases } = await useFetch("/api/inicontent/database", {
        transform: (i: any) => i.result as Database[],
      }),
      ShowDatabaseModal = ref(false),
      DatabaseRef = ref<FormInst | null>(null),
      DatabaseModal = ref<Database>(),
      Database = async () => {
        DatabaseRef.value?.validate(async (errors: any) => {
          if (!errors) {
            Loading.value["Database"] = true;
            const { data }: any = await useFetch(
              `/api/inicontent/database/${
                DatabaseModal.value?.id ? DatabaseModal.value.id : ""
              }`,
              {
                method: DatabaseModal.value?.id ? "PUT" : "POST",
                body: DatabaseModal.value,
              } as any
            );
            if (data.value?.result) {
              database.value = data.value.result;
              Loading.value["Database"] = false;
              ShowDatabaseModal.value = false;
              message.success(data.value.message.en);
            } else message.error(data.value.message.en);
            Loading.value["Database"] = false;
          } else message.error("The inputs are Invalid");
        });
      };

    useHead({
      title: `${database.value.slug} | Dashboard`,
      link: [{ rel: "icon", href: database.value?.icon ?? "" }],
    });

    return () =>
      h(
        NCard,
        { title: t("databases"), style: "background: none", bordered: false },
        {
          "header-extra": () =>
            h(
              NButton,
              {
                circle: true,
                onClick: () => (
                  (DatabaseModal.value = {
                    tables: [
                      {
                        slug: "user",
                        allowed_methods: [
                          {
                            role: "user",
                            methods: ["c", "r", "u", "d"],
                          },
                          { role: "guest", methods: ["c"] },
                        ],
                        schema: [
                          {
                            key: "username",
                            type: "string",
                            required: true,
                          },
                          {
                            key: "password",
                            type: "password",
                            required: true,
                          },
                          {
                            key: "email",
                            type: "email",
                            required: true,
                          },
                          {
                            key: "role",
                            type: "string",
                            subType: "role",
                            required: true,
                          },
                          {
                            key: "user",
                            type: ["array", "table"],
                            children: "table",
                            required: false,
                          },
                        ],
                      },
                      {
                        slug: "session",
                        allowed_methods: [
                          { role: "user", methods: ["c", "r", "u", "d"] },
                        ],
                        schema: [
                          {
                            key: "ip",
                            type: "ip",
                            required: true,
                          },
                          {
                            key: "userAgent",
                            type: "string",
                            required: true,
                          },
                          {
                            key: "user",
                            type: "table",
                            required: true,
                          },
                        ],
                      },
                      {
                        slug: "translation",
                        allowed_methods: [
                          {
                            role: "user",
                            methods: ["c", "r", "u", "d"],
                          },
                          { role: "guest", methods: ["r"] },
                        ],
                        schema: [
                          {
                            key: "original",
                            type: "string",
                            required: true,
                          },
                          {
                            key: "translated",
                            type: "string",
                            required: true,
                          },
                          {
                            key: "table",
                            type: "string",
                            required: false,
                          },
                          {
                            key: "item",
                            type: "id",
                            required: false,
                          },
                          {
                            key: "locale",
                            type: "string",
                            required: true,
                          },
                          {
                            key: "user",
                            type: ["array", "table"],
                            children: "table",
                            required: true,
                          },
                        ],
                      },
                      {
                        slug: "asset",
                        allowed_methods: [
                          {
                            role: "user",
                            methods: ["c", "r", "u", "d"],
                          },
                          {
                            role: "guest",
                            methods: ["r"],
                          },
                        ],
                      },
                    ],
                  }),
                  (ShowDatabaseModal.value = true)
                ),
              },
              { icon: () => h(NIcon, () => h(IconPlus)) }
            ),
          default: () => [
            h(
              NModal,
              {
                show: ShowDatabaseModal.value,
                "on-update:show": (v: boolean) => (ShowDatabaseModal.value = v),
                style: {
                  width: Window.value.width > 600 ? "600px" : "100%",
                },
                preset: "card",
                title:
                  DatabaseModal.value &&
                  DatabaseModal.value?.hasOwnProperty("id")
                    ? t("update_database")
                    : t("create_database"),
                bordered: false,
                size: "huge",
                segmented: {
                  content: "soft",
                  footer: "soft",
                },
              },
              {
                default: () =>
                  h(
                    NForm,
                    {
                      ref: DatabaseRef,
                      model: DatabaseModal.value,
                    },
                    () =>
                      h(LazyRenderFields, {
                        modelValue: DatabaseModal.value,
                        schema: [
                          {
                            id: 1,
                            key: "slug",
                            type: "string",
                            required: true,
                          },
                          {
                            id: 2,
                            key: "icon",
                            type: "url",
                            subType: "upload",
                            single: true,
                            required: true,
                          },
                          {
                            id: 3,
                            key: "allowed_domains",
                            type: "array",
                            children: "url",
                            required: true,
                          },
                          {
                            id: 4,
                            key: "languages",
                            type: "array",
                            children: "string",
                            required: true,
                          },
                          {
                            id: 5,
                            key: "roles",
                            type: "array",
                            children: "string",
                            defaultValue: ["admin", "user", "guest"],
                            required: true,
                          },
                          {
                            id: 6,
                            key: "tables",
                            type: "array",
                            onCreate: () => ({
                              allowed_methods: DatabaseModal.value?.roles
                                ?.filter((role) => role !== "admin")
                                .map((role) => ({
                                  role: role,
                                  methods: [],
                                })),
                            }),
                            children: [
                              {
                                id: 7,
                                key: "slug",
                                type: "text",
                                required: true,
                                inputProps: (value: string) =>
                                  [
                                    "user",
                                    "session",
                                    "translation",
                                    "asset",
                                  ].includes(value)
                                    ? {
                                        disabled: true,
                                      }
                                    : null,
                              },
                              {
                                id: 8,
                                key: "allowed_methods",
                                type: "array",
                                disableActions: true,
                                children: [
                                  {
                                    id: 9,
                                    key: "role",
                                    type: "text",
                                    inputProps: {
                                      disabled: true,
                                    },
                                    required: true,
                                  },
                                  {
                                    id: 10,
                                    key: "methods",
                                    type: "array",
                                    children: "string",
                                    subType: "checkbox",
                                    values: ["c", "r", "u", "d"],
                                    required: true,
                                  },
                                ],
                              },
                            ] as any,
                          },
                        ],
                      })
                  ),
                footer: () =>
                  h(NSpace, { justify: "end" }, () => [
                    h(
                      NButton,
                      {
                        loading: Loading.value["Database"],
                        onClick: Database,
                      },
                      {
                        default: () =>
                          DatabaseModal.value?.hasOwnProperty("id")
                            ? t("save")
                            : t("create"),
                        icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                      }
                    ),
                  ]),
              }
            ),
            databases.value && databases.value.length
              ? h(
                  NCollapse,
                  {
                    defaultExpandedNames: t(databases.value[0]?.slug),
                    accordion: true,
                  },
                  () =>
                    databases.value?.map((database, index) =>
                      h(
                        NCollapseItem,
                        {
                          title: t(database.slug),
                          name: database.slug,
                          disabled: DisabledItem.value[index],
                        },
                        {
                          "header-extra": () =>
                            h(NSpace, {}, () => [
                              h(
                                NButton,
                                {
                                  circle: true,
                                  onClick: () =>
                                    databases.value
                                      ? ((DisabledItem.value[index] = true),
                                        setTimeout(
                                          () =>
                                            (DisabledItem.value[index] = false),
                                          1
                                        ),
                                        (DatabaseModal.value = JSON.parse(
                                          JSON.stringify(databases.value[index])
                                        )),
                                        (ShowDatabaseModal.value = true))
                                      : null,
                                },
                                { icon: () => h(NIcon, () => h(IconSettings)) }
                              ),
                              h(
                                NButton,
                                {
                                  tag: "a",
                                  href: `/${database.slug}/admin`,
                                  onClick: (e) => (
                                    e.preventDefault(),
                                    (DisabledItem.value[index] = true),
                                    setTimeout(
                                      () => (DisabledItem.value[index] = false),
                                      1
                                    ),
                                    navigateTo(`/${database.slug}/admin`)
                                  ),
                                  circle: true,
                                  type: "primary",
                                },
                                {
                                  icon: () => h(NIcon, () => h(IconArrowRight)),
                                }
                              ),
                            ]),
                          default: () =>
                            h(LazyTablesGrid, { modelValue: database }),
                        }
                      )
                    )
                )
              : null,
          ],
        }
      );
  },
});
