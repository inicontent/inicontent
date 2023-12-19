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
} from "naive-ui";
import {
  QuestionMark,
  DeviceFloppy,
  Plus,
  Trash,
  Menu2,
  Asterisk,
} from "@vicons/tabler";
import draggable from "vuedraggable";
import { objectToDotNotation } from "inibase/utils";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });
    useLanguage({
      ar: {
        table_settings: "إعدادات الجدول",
        schema: "الأعمدة",
        save: "حِفظ",
        required: "إلزامي",
        duplicatable: "قابل للنسخ",
        field_name: "إسم الحقل",
        allowed_files: "الملفات المسموح بها",
        options: "الخيارات",
        content_type: "نوع المحتوى",
        show_as_table: "أظهر كجدول",
        label_text: "نص التسمية",
        search_in: "البحث في",
        label_image: "صورة التسمية",
      },
      en: {
        table_settings: "Table Settings",
        schema: "schema",
        save: "Save",
        required: "Required",
        duplicatable: "Duplicatable",
        field_name: "Field Name",
        allowed_files: "Allowed Files",
        options: "Options",
        content_type: "Content Type",
        show_as_table: "Show as table",
        label_text: "Label Text",
        search_in: "Search in",
        label_image: "Label Image",
      },
    });
    const Loading: any = useState("Loading", () => ({}));
    Loading.value["schemaModal"] = false;
    const Language = useGlobalCookie("Language");
    const route = useRoute(),
      message = useMessage(),
      showDraggable = ref(false),
      Window = useState("Window", () => ({
        width: 0,
      })),
      database: any = useState("database"),
      DisabledItem: any = ref({}),
      ShowschemaModal = useState("ShowschemaModal", () => false),
      schemaModal = ref(
        JSON.parse(
          JSON.stringify(
            database.value?.tables?.find(
              ({ slug }: any) => slug === route.params.table
            )?.schema ?? []
          )
        )
      ),
      SaveschemaModal = async () => {
        Loading.value["schemaModal"] = true;
        await useFetch(`/api/inicontent/database/${database.value.slug}`, {
          method: "PUT",
          body: {
            tables: database.value.tables.map((item: any) => {
              if (item.slug === route.params.table)
                item.schema = schemaModal.value;
              return item;
            }),
          },
        });
        Loading.value["schemaModal"] = false;
        ShowschemaModal.value = false;
        message.success("schema Updated Successfully");
        database.value = {
          ...database.value,
          tables: database.value.tables.map((item: any) => {
            if (item.slug === route.params.table)
              item.schema = schemaModal.value;
            return item;
          }),
        };
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
            return { id, key, type: newType, required };
        }
      },
      CustomFields = (field: any) => {
        switch (field.type) {
          case "upload":
            return [
              h(
                NFormItem,
                {
                  label: t("allowed_files"),
                },
                () =>
                  h(NSelect, {
                    multiple: true,
                    placeholder: t("allowed_files"),
                    options: [
                      {
                        label: t("image"),
                        value: "image",
                      },
                      {
                        label: t("video"),
                        value: "video",
                      },
                      {
                        label: t("audio"),
                        value: "audio",
                      },
                      {
                        label: t("documents"),
                        value: "document",
                      },
                      {
                        label: t("archive"),
                        value: "archive",
                      },
                    ],
                    value: field.accept,
                    onUpdateValue: (v) => (field.accept = v),
                  })
              ),
            ];
          case "list":
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
                  label: t("content_type"),
                },
                () =>
                  h(NSelect, {
                    value: field.content_type,
                    onUpdateValue: (v) => (field.content_type = v),
                    filterable: true,
                    options: FieldsList.flatMap(
                      ({ label, key, icon, children }) => [
                        { label, key, icon },
                        ...(children ?? []),
                      ]
                    ).filter(({ key }) =>
                      ["text", "number", "email", "url", "color"].includes(key)
                    ),
                  })
              ),
            ];
          case "table":
            return [
              h(
                NFormItem,
                {
                  disabled: !field.key,
                  label: t("search_in"),
                },
                {
                  default: () =>
                    h(NSelect, {
                      disabled: !field.key,
                      multiple: true,
                      filterable: true,
                      value: field.search,
                      onUpdateValue: (v) => (field.search = v),
                      options: field.key
                        ? database.value.tables
                            .find(({ slug }: any) => slug === field.key)
                            ?.schema.filter(({ type }: any) => type !== "table")
                            .map((element: any, _index: number, schema: any) =>
                              GenerateSearchInOptions(schema, element)
                            )
                            .flat(Infinity) ?? []
                        : [],
                    }),
                }
              ),
              h(
                NFormItem,
                {
                  disabled: !field.key,
                  label: t("label_text"),
                },
                {
                  default: () =>
                    h(NSelect, {
                      disabled: !field.key,
                      multiple: true,
                      filterable: true,
                      value: field.label,
                      onUpdateValue: (value: string) => (field.label = value),
                      options: field.key
                        ? database.value.tables
                            .find(({ slug }: any) => slug === field.key)
                            ?.schema?.filter(
                              ({ type }: any) => type !== "table"
                            )
                            .map((element: any, _index: number, schema: any) =>
                              GenerateLabelOptions(schema, element)
                            )
                            .flat(Infinity) ?? []
                        : [],
                    }),
                }
              ),
              h(
                NFormItem,
                {
                  disabled: !field.key,
                  label: t("label_image"),
                },
                {
                  default: () =>
                    h(NSelect, {
                      disabled: !field.key,
                      filterable: true,
                      value: field.image,
                      onUpdateValue: (value: string) => (field.image = value),
                      options: field.key
                        ? database.value.tables
                            .find(({ slug }: any) => slug === field.key)
                            ?.schema?.filter(
                              ({ type }: any) => type !== "table"
                            )
                            .map((element: any, _index: number, schema: any) =>
                              GenerateLabelOptions(schema, element)
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
          },
          () =>
            h(
              draggable,
              {
                list: schema,
                itemKey: "key",
                handle: ".handle",
              },
              {
                item: ({ element, index }: any) =>
                  h(
                    NCollapseItem,
                    {
                      name: index,
                      disabled: DisabledItem.value[index],
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
                          () => h(Menu2)
                        ),
                        element.key ? t(element.key) : "--",
                      ],
                      "header-extra": () =>
                        h(NSpace, () => [
                          ...(["array", "object"].includes(element.type)
                            ? [
                                h(
                                  NDropdown,
                                  {
                                    options: FieldsList,
                                    style: {
                                      maxHeight: "200px",
                                    },
                                    scrollable: true,
                                    onSelect: (type) =>
                                      (schema[index].children = [
                                        ...(schema[index].children ?? []),
                                        {
                                          type: type,
                                          required: false,
                                        },
                                      ]),
                                  },
                                  () =>
                                    h(
                                      NButton,
                                      {
                                        onClick: () => (
                                          (DisabledItem.value[index] = true),
                                          setTimeout(
                                            () =>
                                              (DisabledItem.value[index] =
                                                false),
                                            1
                                          )
                                        ),
                                        disabled: element.key ? false : true,
                                        circle: true,
                                        size: "small",
                                      },
                                      {
                                        icon: () => h(NIcon, () => h(Plus)),
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
                                    onClick: () => (
                                      ((DisabledItem.value[index] = true),
                                      setTimeout(
                                        () =>
                                          (DisabledItem.value[index] = false),
                                        1
                                      )),
                                      (schema[index].required =
                                        !schema[index].required)
                                    ),
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(Asterisk)),
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
                              options: FieldsList,
                              style: {
                                maxHeight: "200px",
                              },
                              trigger: "click",
                              scrollable: true,
                              onSelect: (type) =>
                                (element = changeFieldType(element, type)),
                            },
                            () =>
                              h(
                                NButton,
                                {
                                  onClick: () => (
                                    (DisabledItem.value[index] = true),
                                    setTimeout(
                                      () => (DisabledItem.value[index] = false),
                                      1
                                    )
                                  ),
                                  strong: true,
                                  secondary: true,
                                  round: true,
                                  size: "small",
                                  type: "primary",
                                },
                                {
                                  icon: () =>
                                    FieldsList.flatMap(
                                      ({ label, key, icon, children }) => [
                                        { label, key, icon },
                                        ...(children ?? []),
                                      ]
                                    )
                                      .find(({ key }) => key === element.type)
                                      ?.icon() ??
                                    h(NIcon, () => h(QuestionMark)),
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : FieldsList.flatMap(
                                          ({ label, key, icon, children }) => [
                                            { label, key, icon },
                                            ...(children ?? []),
                                          ]
                                        ).find(
                                          ({ key }) => key === element.type
                                        )?.label ?? "Custom",
                                }
                              )
                          ),
                          h(
                            NButton,
                            {
                              onClick: () => (
                                ((DisabledItem.value[index] = true),
                                setTimeout(
                                  () => (DisabledItem.value[index] = false),
                                  1
                                )),
                                schema.splice(index, 1)
                              ),
                              circle: true,
                              secondary: true,
                              size: "small",
                              type: "error",
                            },
                            {
                              icon: () => h(NIcon, () => h(Trash)),
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
                                      value: schema[index].key,
                                      onUpdateValue: (v) => (
                                        (schema[index].key = v),
                                        (schema[index].search = null),
                                        (schema[index].label = null),
                                        (schema[index].image = null)
                                      ),
                                      options: database.value.tables
                                        .filter(
                                          ({ slug }: any) =>
                                            slug !== route.params.table ||
                                            route.params.table === "user"
                                        )
                                        .map(({ slug }: any) => ({
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
                                  label: t("field_name"),
                                  style: {
                                    marginBottom: "30px",
                                  },
                                },
                                {
                                  feedback: () =>
                                    `#${getPath(schema, element.id)}`,
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
                              ["array", "object"].includes(element.type)
                                ? RenderSchemaElement(element.children)
                                : null,
                            ],
                    }
                  ),
              }
            )
        );

    useHead({
      title: `${database.value.slug} | ${t(
        database.value.tables.find(
          ({ slug }: any) => slug === route.params.table
        )?.slug ?? "--"
      )} Settings`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    onMounted(async () => {
      if (Language.value) {
        await useFetch(`/api/${route.params.database}/translation`, {
          params: {
            _where: JSON.stringify({
              original:
                "[]" +
                Object.entries(
                  objectToDotNotation(
                    (useState("LanguageMessages").value ?? {})[
                      Language.value
                    ] ?? {}
                  )
                )
                  .filter(([key, value]: any) => value === null)
                  .map(([key, value]) => key)
                  .join(","),
            }),
          },
        });
      }
    });
    return () =>
      h(NGrid, { xGap: 12, cols: 12, itemResponsive: true }, () => [
        h(NGi, { span: 11 }, () =>
          h(
            NCard,
            {
              title: t("table_settings"),
              hoverable: true,
            },
            {
              "header-extra": () =>
                h(
                  NButton,
                  {
                    round: true,
                    loading: Loading.value["schemaModal"],
                    onClick: SaveschemaModal,
                  },
                  {
                    default: () => t("save"),
                    icon: () => h(NIcon, () => h(DeviceFloppy)),
                  }
                ),
              default: () =>
                h(
                  NCard,
                  {
                    title: t("schema"),
                    id: "schema",
                    hoverable: true,
                  },
                  {
                    "header-extra": () =>
                      h(
                        NDropdown,
                        {
                          options: FieldsList,
                          style: {
                            maxHeight: "200px",
                          },
                          scrollable: true,
                          onSelect: (type) =>
                            schemaModal.value.push(
                              ["array", "object"].includes(type)
                                ? {
                                    key: null,
                                    required: false,
                                    type: type,
                                    children: [],
                                  }
                                : {
                                    key: null,
                                    required: false,
                                    type: type,
                                  }
                            ),
                        },
                        () =>
                          h(
                            NButton,
                            { round: true },
                            {
                              icon: () => h(NIcon, () => h(Plus)),
                            }
                          )
                      ),
                    default: () => [
                      showDraggable.value
                        ? null
                        : h("style", ".handle {display:none}"),
                      !schemaModal.value || schemaModal.value.length === 0
                        ? h("div", {
                            style: {
                              display: "block",
                              height: "50px",
                            },
                          })
                        : h(
                            NForm,
                            {
                              size: "small",
                            },
                            () => RenderSchemaElement(schemaModal.value)
                          ),
                    ],
                  }
                ),
            }
          )
        ),
        h(NGi, { span: 1 }, () => [
          h(
            NAnchor,
            {
              affix: true,
              listenTo: "#container",
              top: 88,
              style: "z-index: 1",
              bound: 24,
            },
            () => [h(NAnchorLink, { title: t("schema"), href: "#schema" })]
          ),
        ]),
      ]);
  },
});
