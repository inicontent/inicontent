import {
  NIcon,
  NSpace,
  NButton,
  NDropdown,
  useMessage,
  NGi,
  NCard,
  NGrid,
  NAnchor,
  NAnchorLink,
  NForm,
  NFormItem,
  NCollapse,
  NCollapseItem,
  NInput,
  NSelect,
  NTooltip,
  NPopconfirm,
  NEmpty,
  NFlex,
  NCascader,
  NMention,
  type FormInst,
  type MentionOption,
} from "naive-ui";
import {
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconMenu2,
  IconAsterisk,
  IconArrowsSort,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconFileDescription,
  IconFileZip,
} from "@tabler/icons-vue";
import { isArrayOfObjects } from "inibase/utils";
import draggable from "vuedraggable";
import { LazyRenderFields } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: ["dashboard", "table"],
      layout: "table",
    });

    onMounted(() => {
      document.onkeydown = function (e) {
        if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
        e.preventDefault();
        updateTable();
      };
    });

    useLanguage({
      ar: {
        tableSettings: "إعدادات الجدول",
        generalSettings: "إعدادات عامة",
        schemaSettings: "إعدادات الأعمدة",
        save: "حِفظ",
        required: "إلزامي",
        duplicatable: "قابل للنسخ",
        fieldName: "إسم الحقل",
        allowedFiles: "الملفات المسموح بها",
        options: "الخيارات",
        contentType: "نوع المحتوى",
        showAsTable: "أظهر كجدول",
        labelText: "نص التسمية",
        searchIn: "البحث في",
        labelImage: "صورة التسمية",
        changeOrder: "تغيير الترتيب",
        theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
      },
      en: {},
    });
    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["updateTable"] = false;
    Loading.value["deleteTable"] = false;
    const Language = useGlobalCookie("Language");
    const route = useRoute(),
      router = useRouter(),
      message = useMessage(),
      showDraggable = ref(false),
      Window = useState("Window", () => ({
        width: 0,
      })),
      database = useState<Database>("database"),
      tableRef = ref<FormInst | null>(null),
      tableCopy = ref(
        JSON.parse(
          JSON.stringify({
            ...database.value?.tables?.find(
              ({ slug }) => slug === route.params.table
            ),
            schema:
              database.value?.tables
                ?.find(({ slug }) => slug === route.params.table)
                ?.schema?.filter(
                  ({ key }) =>
                    !["id", "createdAt", "updatedAt", "user"].includes(key)
                ) ?? [],
          })
        )
      ),
      handleSelectedType = (type: string) => {
        switch (type) {
          case "textarea":
            return {
              type: "string",
              subType: "textarea",
            };
          case "role":
            return {
              type: "string",
              subType: "role",
            };
          case "upload":
            return {
              type: "url",
              subType: "upload",
            };
          case "array-upload":
            return {
              type: "array",
              children: "url",
              subType: "upload",
            };
          case "array-table":
            return {
              type: "array",
              children: "table",
              subType: "table",
            };
          case "tags":
            return {
              type: "array",
              subType: "tags",
            };
          case "select":
            return {
              type: ["string", "number"],
              subType: "select",
            };
          case "array-select":
            return {
              type: "array",
              children: ["string", "number"],
              subType: "select",
            };
          case "color":
            return {
              type: "string",
              subType: "color",
            };
          case "array":
          case "object":
            return {
              type: type,
              children: [],
            };
          default:
            return { type };
        }
      },
      updateTable = async () => {
        tableRef.value?.validate(async (errors) => {
          if (!errors) {
            const bodyContent = JSON.parse(JSON.stringify(tableCopy.value));
            Loading.value["updateTable"] = true;

            const data = await $fetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}inicontent/database/${
                database.value.slug
              }/${route.params.table}`,
              {
                method: "PUT",
                body: bodyContent,
              }
            );
            const tableIndex = database.value.tables?.findIndex(
              ({ slug }) => slug === route.params.table
            );
            if (tableIndex && database.value.tables && data?.result) {
              database.value.tables[tableIndex] = data.result;
              if (route.params.table !== data.result.slug)
                router.replace({
                  params: { table: data.result.slug },
                });
              message.success(data?.message ?? "Success");
            } else message.error(data?.message ?? "Error");
            Loading.value["updateTable"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      deleteTable = async () => {
        Loading.value["deleteTable"] = true;
        const data = await $fetch<apiResponse>(
          `${useRuntimeConfig().public.apiBase}inicontent/database/${
            database.value.slug
          }/${route.params.table}`,
          {
            method: "DELETE",
          }
        );
        if (data?.result) {
          const tableIndex = database.value.tables?.findIndex(
            ({ slug }) => slug === route.params.table
          );
          if (tableIndex)
            database.value.tables = database.value.tables?.toSpliced(
              tableIndex,
              1
            );
          Loading.value["deleteTable"] = false;
          message.success(data?.message ?? "Success");
          setTimeout(
            async () =>
              await navigateTo(`/${database.value.slug}/admin/tables`),
            800
          );
        } else message.error(data?.message ?? "Error");
        Loading.value["deleteTable"] = false;
      },
      GenerateLabelOptions = (
        schema: any,
        { type, key, children }: any,
        path?: string,
        prefix?: string
      ) => {
        switch (type) {
          case "array":
          case "object":
            return children.map(
              (field: any) =>
                GenerateLabelOptions(schema, field, (path ?? "") + key + "."),
              (prefix ? `${prefix} ` : "") + t(key)
            );
          default:
            return {
              label: (prefix ? `${prefix} ` : "") + t(key),
              value: (path ?? "") + key,
            };
        }
      },
      changeFieldType = (
        { id, key, required, children }: any,
        newType: string
      ) => {
        switch (newType) {
          case "object":
          case "array":
            return { id, key, type: newType, required, children };
          default:
            return { id, key, ...handleSelectedType(newType), required };
        }
      },
      CustomFields = (field: any) => {
        switch (field.subType ?? field.type) {
          case "upload":
            return [
              h(
                NFormItem,
                {
                  label: t("allowedFiles"),
                },
                () =>
                  h(NSelect, {
                    multiple: true,
                    placeholder: t("allowedFiles"),
                    renderLabel: (option: any) =>
                      h(NFlex, { align: "center" }, () => [
                        h(NIcon, () => option.icon),
                        option.label as string,
                      ]),
                    options: [
                      {
                        label: t("image"),
                        value: "image",
                        icon: h(IconPhoto),
                      },
                      {
                        label: t("video"),
                        value: "video",
                        icon: h(IconVideo),
                      },
                      {
                        label: t("audio"),
                        value: "audio",
                        icon: h(IconMusic),
                      },
                      {
                        label: t("documents"),
                        value: "document",
                        icon: h(IconFileDescription),
                      },
                      {
                        label: t("archive"),
                        value: "archive",
                        icon: h(IconFileZip),
                      },
                    ],
                    value: field.accept,
                    onUpdateValue: (v) => (field.accept = v),
                  })
              ),
            ];
          case "select":
            return [
              h(
                NFormItem,
                {
                  label: t("options"),
                },
                () =>
                  h(NSelect, {
                    value: field.values,
                    onUpdateValue: (v) => (field.values = [...new Set(v)]),
                    filterable: true,
                    multiple: true,
                    tag: true,
                    showArrow: false,
                    show: false,
                  })
              ),
            ];
          case "tags":
            return [
              h(
                NFormItem,
                {
                  label: t("contentType"),
                },
                () =>
                  h(NSelect, {
                    value: field.children,
                    onUpdateValue: (v) => (field.children = v),
                    filterable: true,
                    multiple: true,
                    renderLabel: (option: any) =>
                      h(NFlex, { align: "center" }, () => [
                        option.icon(),
                        option.label as string,
                      ]),
                    options: flatFieldsList()
                      ?.filter(({ key }) =>
                        [
                          "string",
                          "number",
                          "password",
                          "email",
                          "url",
                          "id",
                        ].includes(key)
                      )
                      .map((field) => ({
                        label: field.label,
                        value: field.key,
                        icon: field.icon,
                      })),
                  })
              ),
            ];
          case "table":
            return [
              h(
                NFormItem,
                {
                  disabled: !field.key,
                  label: t("searchIn"),
                },
                {
                  default: () =>
                    h(NCascader, {
                      disabled: !field.key,
                      multiple: true,
                      clearable: true,
                      filterable: true,
                      expandTrigger: "hover",
                      checkStrategy: "child",
                      cascade: false,
                      value: field.searchIn,
                      onUpdateValue: (v) => (field.searchIn = v),
                      options: field.key
                        ? database.value.tables
                            ?.find(({ slug }) => slug === field.key)
                            ?.schema?.map((_item, _index: number, schema) =>
                              GenerateSearchInOptions(schema, _item)
                            )
                            .flat(Infinity) ?? []
                        : [],
                    }),
                }
              ),
            ];
          default:
            return [];
        }
      },
      RenderSchemaElement = (schema: any) =>
        h(
          NCollapse,
          {
            accordion: true,
            triggerAreas: ["main", "arrow"],
          },
          () =>
            h(
              draggable,
              {
                list: schema,
                itemKey: "id",
                handle: ".handle",
              },
              {
                item: ({ element, index }: any) =>
                  h(
                    NCollapseItem,
                    {
                      name: index,
                    },
                    {
                      header: () => [
                        h(
                          NIcon,
                          {
                            class: "handle",
                            style:
                              Language.value === "ar"
                                ? {
                                    marginLeft: "10px",
                                  }
                                : {
                                    marginRight: "10px",
                                  },
                            size: 18,
                          },
                          () => h(IconMenu2)
                        ),
                        element.key ? t(element.key) : "--",
                      ],
                      "header-extra": () =>
                        h(NSpace, () => [
                          ...(["array", "object"].includes(element.type) &&
                          isArrayOfObjects(element.children)
                            ? [
                                h(
                                  NDropdown,
                                  {
                                    options: FieldsList(),
                                    style: {
                                      maxHeight: "200px",
                                    },
                                    scrollable: true,
                                    onSelect: (type) =>
                                      (schema[index].children = [
                                        ...(schema[index].children ?? []),
                                        {
                                          id: `temp-${randomID()}`,
                                          key: null,
                                          required: false,
                                          ...handleSelectedType(type),
                                        },
                                      ]),
                                  },
                                  () =>
                                    h(
                                      NButton,
                                      {
                                        disabled: element.key ? false : true,
                                        circle: true,
                                        size: "small",
                                      },
                                      {
                                        icon: () => h(NIcon, () => h(IconPlus)),
                                      }
                                    )
                                ),
                              ]
                            : [
                                h(
                                  NButton,
                                  {
                                    round: Window.value.width > 700,
                                    circle: Window.value.width < 700,
                                    strong: true,
                                    secondary: true,
                                    size: "small",
                                    type: schema[index].required
                                      ? "error"
                                      : "tertiary",
                                    onClick: () =>
                                      (schema[index].required =
                                        !schema[index].required),
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(IconAsterisk)),
                                    default: () =>
                                      Window.value.width < 700
                                        ? null
                                        : t("required"),
                                  }
                                ),
                              ]),
                          h(
                            NDropdown,
                            {
                              options: FieldsList(),
                              style: {
                                maxHeight: "200px",
                              },
                              trigger: "click",
                              scrollable: true,
                              onSelect: (type) =>
                                (schema[index] = changeFieldType(
                                  schema[index],
                                  type
                                )),
                            },
                            () =>
                              h(
                                NButton,
                                {
                                  strong: true,
                                  secondary: true,
                                  round: true,
                                  size: "small",
                                  type: "primary",
                                },
                                {
                                  icon: getField(
                                    element.subType ?? element.type
                                  ).icon,
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : getField(
                                          element.subType ?? element.type
                                        ).label,
                                }
                              )
                          ),
                          h(
                            NButton,
                            {
                              onClick: () => schema.splice(index, 1),
                              circle: true,
                              secondary: true,
                              size: "small",
                              type: "error",
                            },
                            {
                              icon: () => h(NIcon, () => h(IconTrash)),
                            }
                          ),
                        ]),
                      default: () =>
                        element.type === "table"
                          ? [
                              h(
                                NFormItem,
                                {
                                  label: "Table Name",
                                },
                                {
                                  default: () =>
                                    h(NSelect, {
                                      filterable: true,
                                      value: schema[index].table,
                                      onUpdateValue: (v) =>
                                        (schema[index].table = v),
                                      options: database.value.tables
                                        ?.filter(
                                          ({ slug }) =>
                                            slug !== route.params.table ||
                                            route.params.table === "user"
                                        )
                                        .map(({ slug, id }) => ({
                                          label: t(slug),
                                          value: slug,
                                        })),
                                    }),
                                }
                              ),
                              ...CustomFields(schema[index]),
                            ]
                          : [
                              h(
                                NFormItem,
                                {
                                  label: t("fieldName"),
                                  style: {
                                    marginBottom: "30px",
                                  },
                                },
                                {
                                  feedback: () =>
                                    `#${getPath(
                                      tableCopy.value.schema,
                                      element.id,
                                      true
                                    )}`,
                                  default: () =>
                                    h(NInput, {
                                      value: schema[index].key,
                                      onUpdateValue: (v) =>
                                        (schema[index].key = v),
                                    }),
                                }
                              ),
                              ...CustomFields(schema[index]),
                              element.children &&
                              ["array", "object"].includes(element.type) &&
                              isArrayOfObjects(element.children)
                                ? RenderSchemaElement(element.children)
                                : null,
                            ],
                    }
                  ),
              }
            )
        ),
      generateMentionOptions = (
        schema: Schema,
        prefix?: string
      ): MentionOption[] => {
        let RETURN: MentionOption[] = [];
        for (const field of schema) {
          if (
            (Array.isArray(field.type) && field.subType !== "tags") ||
            (field.type === "array" &&
              field.children &&
              isArrayOfObjects(field.children)) ||
            field.type === "table"
          )
            continue;
          if (field.children && isArrayOfObjects(field.children))
            RETURN = [
              ...RETURN,
              ...generateMentionOptions(field.children, field.key),
            ];
          else
            RETURN.push({
              label: (prefix ? `${prefix}/` : "") + field.key,
              value: field.key,
            });
        }
        return RETURN;
      };

    useHead({
      title: `${database.value.slug} | ${t(
        database.value.tables?.find(({ slug }) => slug === route.params.table)
          ?.slug ?? "--"
      )} ${t("settings")}`,
      link: [{ rel: "icon", href: database.value?.icon ?? "" }],
    });

    return () =>
      h(
        NGrid,
        { xGap: 12, cols: 12, itemResponsive: true, responsive: "screen" },
        () => [
          h(NGi, { span: "12 s:10" }, () =>
            h(
              NCard,
              {
                title: t("tableSettings"),
                hoverable: true,
              },
              {
                "header-extra": () =>
                  h(NSpace, () => [
                    h(
                      NTooltip,
                      {},
                      {
                        trigger: () =>
                          h(
                            NPopconfirm,
                            {
                              showIcon: false,
                              onPositiveClick: deleteTable,
                            },
                            {
                              activator: () =>
                                h(
                                  NButton,
                                  {
                                    type: "error",
                                    tertiary: true,
                                    round: true,
                                    loading: Loading.value["deleteTable"],
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(IconTrash)),
                                  }
                                ),
                              default: () =>
                                t("theFollowingActionIsIrreversible"),
                            }
                          ),
                        default: () => t("deleteTable"),
                      }
                    ),
                    h(
                      NButton,
                      {
                        round: true,
                        loading: Loading.value["updateTable"],
                        onClick: updateTable,
                      },
                      {
                        default: () => t("save"),
                        icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                      }
                    ),
                  ]),
                default: () =>
                  h(NSpace, { vertical: true }, () => [
                    h(
                      NCard,
                      {
                        title: t("generalSettings"),
                        id: "generalSettings",
                        hoverable: true,
                      },
                      () => [
                        h(
                          NForm,
                          {
                            ref: tableRef,
                            model: tableCopy.value,
                          },
                          () => [
                            h(LazyRenderFields, {
                              modelValue: tableCopy.value,
                              schema: [
                                {
                                  id: 1,
                                  key: "slug",
                                  type: "string",
                                  required: true,
                                },
                              ],
                            }),
                            h(
                              NFormItem,
                              {
                                required: true,
                                label: t("label"),
                                path: "label",
                              },
                              () =>
                                h(NMention, {
                                  value: tableCopy.value.label,
                                  onUpdateValue: (value) =>
                                    (tableCopy.value.label = value),
                                  options: generateMentionOptions(
                                    database.value.tables?.find(
                                      ({ slug }) => slug === route.params.table
                                    )?.schema ?? []
                                  ),
                                })
                            ),
                          ]
                        ),
                      ]
                    ),
                    h(
                      NCard,
                      {
                        title: t("schemaSettings"),
                        id: "schemaSettings",
                        hoverable: true,
                      },
                      {
                        "header-extra": () =>
                          h(NSpace, () => [
                            !tableCopy.value.schema ||
                            tableCopy.value.schema.length < 2
                              ? null
                              : h(
                                  NTooltip,
                                  {},
                                  {
                                    default: () => t("changeOrder"),
                                    trigger: () =>
                                      h(
                                        NButton,
                                        {
                                          round: true,
                                          type: showDraggable.value
                                            ? "primary"
                                            : "default",
                                          onClick: () =>
                                            (showDraggable.value =
                                              !showDraggable.value),
                                        },
                                        () => h(NIcon, () => h(IconArrowsSort))
                                      ),
                                  }
                                ),
                            h(
                              NDropdown,
                              {
                                options: FieldsList(),
                                style: {
                                  maxHeight: "200px",
                                },
                                scrollable: true,
                                onSelect: (type) =>
                                  tableCopy.value.schema.push({
                                    id: `temp-${randomID()}`,
                                    key: null,
                                    required: false,
                                    ...handleSelectedType(type),
                                  }),
                              },
                              () =>
                                h(
                                  NButton,
                                  { round: true },
                                  {
                                    icon: () => h(NIcon, () => h(IconPlus)),
                                  }
                                )
                            ),
                          ]),
                        default: () =>
                          !tableCopy.value.schema ||
                          tableCopy.value.schema.length === 0
                            ? h(NEmpty)
                            : [
                                showDraggable.value
                                  ? null
                                  : h("style", ".handle {display:none}"),
                                h(
                                  NForm,
                                  {
                                    size: "small",
                                  },
                                  () =>
                                    RenderSchemaElement(tableCopy.value.schema)
                                ),
                              ],
                      }
                    ),
                  ]),
              }
            )
          ),
          h(NGi, { span: "0 s:2" }, () => [
            h(
              NAnchor,
              {
                affix: true,
                listenTo: "#container",
                top: 88,
                style: "z-index: 1",
                bound: 24,
              },
              () => [
                h(NAnchorLink, {
                  title: t("generalSettings"),
                  href: "#generalSettings",
                }),
                h(NAnchorLink, {
                  title: t("schemaSettings"),
                  href: "#schemaSettings",
                }),
              ]
            ),
          ]),
        ]
      );
  },
});
