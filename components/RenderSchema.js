import {
  NP,
  NIcon,
  NSpace,
  NButton,
  NDropdown,
  useMessage,
  NModal,
  NForm,
  NFormItem,
  NCollapse,
  NCollapseItem,
  NInput,
  NSelect,
  NSwitch,
  NScrollbar,
} from "naive-ui";
import {
  Box,
  DeviceFloppy,
  Plus,
  Trash,
  Table,
  Forms,
  AlignJustified,
  ListNumbers,
  At,
  Link,
  Upload,
  Tags,
  Calendar,
  ToggleLeft,
  BoxMultiple,
  LetterCase,
  Code,
  ListDetails,
  Key,
  Menu2,
  LetterR,
  LetterD,
} from "@vicons/tabler";
import { Buffer } from "buffer";
import draggable from "vuedraggable";

export default defineComponent({
  props: {
    table: {
      type: String,
      default: "",
    },
  },
  setup: (props) => {
    useLanguage({
      ar: {
        save: "حِفظ",
        required: "إلزامي",
        duplicatable: "قابل للنسخ",
        fields: {
          text: "نص",
          short_text: "نص قصير",
          long_text: "نص طويل",
          editor: "محرر نصوص",
          number: "رقم",
          password: "كلمة مرور",
          link: "رابط",
          email: "بريد",
          upload: "ملحق",
          tags: "وسوم",
          date: "تاريخ",
          toggle: "سحب",
          list: "قائمة",
          group: "مجموعة",
          table: "جدول",
        },
      },
      en: {
        save: "Save",
        required: "Required",
        duplicatable: "Duplicatable",
        fields: {
          text: "Text",
          short_text: "Short Text",
          long_text: "Long Text",
          editor: "Rich Editor",
          number: "Number",
          password: "Password",
          email: "Email",
          link: "Link",
          upload: "Upload",
          tags: "Tags",
          date: "Date",
          toggle: "Toggle",
          list: "List",
          group: "Group",
          table: "Table",
        },
      },
    });
    const FieldsList = [
        {
          label: t("fields.text"),
          key: "input",
          icon: () => h(NIcon, () => h(Forms)),
          children: [
            {
              label: t("fields.short_text"),
              key: "text",
              icon: () => h(NIcon, () => h(LetterCase)),
            },
            {
              label: t("fields.long_text"),
              key: "textarea",
              icon: () => h(NIcon, () => h(AlignJustified)),
            },
            {
              label: t("fields.editor"),
              key: "editor",
              icon: () => h(NIcon, () => h(Code)),
            },
            {
              label: t("fields.number"),
              key: "number",
              icon: () => h(NIcon, () => h(ListNumbers)),
            },
            {
              label: t("fields.password"),
              key: "password",
              icon: () => h(NIcon, () => h(Key)),
            },
            {
              label: t("fields.email"),
              key: "email",
              icon: () => h(NIcon, () => h(At)),
            },
            {
              label: t("fields.link"),
              key: "url",
              icon: () => h(NIcon, () => h(Link)),
            },
          ],
        },
        {
          label: t("fields.upload"),
          key: "upload",
          icon: () => h(NIcon, () => h(Upload)),
        },
        {
          label: t("fields.tags"),
          key: "tags",
          icon: () => h(NIcon, () => h(Tags)),
        },
        {
          label: t("fields.date"),
          key: "date",
          icon: () => h(NIcon, () => h(Calendar)),
        },
        {
          label: t("fields.toggle"),
          key: "boolean",
          icon: () => h(NIcon, () => h(ToggleLeft)),
        },
        {
          label: t("fields.list"),
          key: "list",
          icon: () => h(NIcon, () => h(ListDetails)),
        },
        {
          label: t("fields.group"),
          key: "group",
          icon: () => h(NIcon, () => h(BoxMultiple)),
        },
        {
          label: t("fields.table"),
          key: "table",
          icon: () => h(NIcon, () => h(Table)),
        },
      ],
      Loading = useState("Loading", () => ({}));
    Loading.value["SchemaModal"] = false;
    const Language = useGlobalCookie("Language");
    const route = useRoute(),
      message = useMessage(),
      Window = useState("Window", () => ({
        width: 0,
      })),
      database = useState("database"),
      User = useState("User"),
      ShowSchemaModal = useState("ShowSchemaModal", () => false),
      SchemaModal = ref(
        JSON.parse(
          JSON.stringify(
            database.value.tables &&
              database.value.tables.find((item) => item.slug === props.table)
                .schema
              ? database.value.tables.find((item) => item.slug === props.table)
                  .schema
              : []
          )
        )
      ),
      SaveSchemaModal = async () => {
        Loading.value["SchemaModal"] = true;
        await useFetch(
          `https://api.inicontent.com/inicontent/db/${database.value.id}`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            method: "PUT",
            body: {
              tables: database.value.tables.map((item) => {
                if (item.slug === route.params.table_slug)
                  item.schema = SchemaModal.value;
                return item;
              }),
            },
            initialCache: false,
          }
        );
        Loading.value["SchemaModal"] = false;
        ShowSchemaModal.value = false;
        message.success("Schema Updated Successfully");
        database.value = {
          ...database.value,
          tables: database.value.tables.map((item) => {
            if (item.slug === route.params.table_slug)
              item.schema = SchemaModal.value;
            return item;
          }),
        };
      },
      GenerateLabelOptions = (schema, item) => {
        if (item.type === "group" && !item.duplicatable)
          return item.children.map((i) =>
            GenerateLabelOptions(schema, {
              ...i,
              prefix: item.prefix ? `${item.prefix} ${item.name}` : item.name,
              path:
                (item.path ?? "") +
                (item.name ?? "Field Name") +
                (item.duplicatable ? ".*." : "."),
            })
          );
        else
          return {
            label: item.prefix ? `${item.prefix} ${item.name}` : item.name,
            value: ((item.path ?? "") + (item.name ?? "Field Name"))
              .toLowerCase()
              .replace(/ /g, "_")
              .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
          };
      },
      CustomFields = (schema, item) => {
        switch (item.type) {
          case "upload":
            return [
              h(
                NFormItem,
                {
                  label: "Allow Multiple",
                },
                () =>
                  h(NSwitch, {
                    value: !schema.single,
                    onUpdateValue: (v) => (schema.single = !v),
                  })
              ),
              h(
                NFormItem,
                {
                  label: "Allowed Files",
                },
                () =>
                  h(NSelect, {
                    multiple: true,
                    placeholder: "Allowed Files",
                    options: [
                      {
                        label: "Images",
                        value: "image/*",
                      },
                      {
                        label: "Videos",
                        value: "video/*",
                      },
                      {
                        label: "Audios",
                        value: "audio/*",
                      },
                      {
                        label: "Documents",
                        value:
                          ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/json,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv",
                      },
                      {
                        label: "Archives",
                        value:
                          "application/zip,application/x-7z-compressed,application/vnd.rar,application/gzip",
                      },
                    ],
                    value: schema.accept,
                    onUpdateValue: (v) => (schema.accept = v),
                  })
              ),
            ];
          case "list":
            return [
              h(
                NFormItem,
                {
                  label: "Allow Multiple",
                },
                () =>
                  h(NSwitch, {
                    value: !schema.single,
                    onUpdateValue: (v) => (schema.single = !v),
                  })
              ),
              h(
                NFormItem,
                {
                  label: "Options",
                },
                () =>
                  h(NSelect, {
                    value: schema.values,
                    onUpdateValue: (v) => (schema.values = [...new Set(v)]),
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
                  label: "Content Type",
                },
                () =>
                  h(NSelect, {
                    value: schema.content_type,
                    onUpdateValue: (v) => (schema.content_type = v),
                    filterable: true,
                    options: [
                      {
                        label: t("fields.short_text"),
                        key: "text",
                        icon: () => h(NIcon, () => h(LetterCase)),
                      },
                      {
                        label: t("fields.number"),
                        key: "number",
                        icon: () => h(NIcon, () => h(ListNumbers)),
                      },
                      {
                        label: t("fields.password"),
                        key: "password",
                        icon: () => h(NIcon, () => h(Key)),
                      },
                      {
                        label: t("fields.email"),
                        key: "email",
                        icon: () => h(NIcon, () => h(At)),
                      },
                      {
                        label: t("fields.link"),
                        key: "url",
                        icon: () => h(NIcon, () => h(Link)),
                      },
                      {
                        label: t("fields.date"),
                        key: "date",
                        icon: () => h(NIcon, () => h(Calendar)),
                      },
                    ],
                  })
              ),
            ];
          case "table":
            return [
              h(
                NFormItem,
                {
                  disabled: !schema.name,
                  label: "Allow Multiple",
                },
                () =>
                  h(NSwitch, {
                    disabled: !schema.name,
                    value: !schema.single,
                    onUpdateValue: (v) => (schema.single = !v),
                  })
              ),
              h(
                NFormItem,
                {
                  disabled: !schema.name,
                  label: "Allow Create",
                },
                () =>
                  h(NSwitch, {
                    disabled: !schema.name,
                    value: schema.allow_create,
                    onUpdateValue: (v) => (schema.allow_create = v),
                  })
              ),
              h(
                NFormItem,
                {
                  disabled: !schema.name,
                  label: "Search In",
                },
                {
                  default: () =>
                    h(NSelect, {
                      disabled: !schema.name,
                      multiple: true,
                      filterable: true,
                      value: schema.search,
                      onUpdateValue: (v) => (schema.search = v),
                      options: schema.name
                        ? database.value.tables
                            .find((table) => table.slug === schema.name)
                            .schema.filter(
                              (element) => element.type !== "table"
                            )
                            .map((element, _index, schema) =>
                              GenerateSearchInOptions(schema, element)
                            )
                            .flat(Infinity)
                        : [],
                    }),
                }
              ),
              h(
                NFormItem,
                {
                  disabled: !schema.name,
                  label: "Label Text",
                },
                {
                  default: () =>
                    h(NSelect, {
                      disabled: !schema.name,
                      multiple: true,
                      filterable: true,
                      value: schema.label,
                      onUpdateValue: (v) => (schema.label = v),
                      options: schema.name
                        ? database.value.tables
                            .find((table) => table.slug === schema.name)
                            .schema.filter(
                              (element) => element.type !== "table"
                            )
                            .map((element, _index, schema) =>
                              GenerateLabelOptions(schema, element)
                            )
                            .flat(Infinity)
                        : [],
                    }),
                }
              ),
              h(
                NFormItem,
                {
                  disabled: !schema.name,
                  label: "Label Image",
                },
                {
                  default: () =>
                    h(NSelect, {
                      disabled: !schema.name,
                      filterable: true,
                      value: schema.image,
                      onUpdateValue: (v) => (schema.image = v),
                      options: schema.name
                        ? database.value.tables
                            .find((table) => table.slug === schema.name)
                            .schema.filter(
                              (element) => element.type !== "table"
                            )
                            .map((element, _index, schema) =>
                              GenerateLabelOptions(schema, element)
                            )
                            .flat(Infinity)
                        : [],
                    }),
                }
              ),
            ];
          default:
            return [];
        }
      },
      DisabledItem = useState(() => []),
      RenderSchemaElement = (Schema) =>
        h(
          NCollapse,
          {
            accordion: true,
          },
          () =>
            h(
              draggable,
              {
                list: Schema,
                itemKey: "key",
                handle: ".handle",
              },
              {
                item: ({ element, index }) =>
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
                        element.name
                          ? element.name.charAt(0).toUpperCase() +
                            element.name.slice(1).replaceAll("_", " ")
                          : "Field Name",
                      ],
                      "header-extra": () =>
                        h(NSpace, () => [
                          h(
                            NButton,
                            {
                              onmouseleave: () =>
                                (DisabledItem.value[index] = false),
                              onClick: () => (
                                (DisabledItem.value[index] = true),
                                Schema.splice(index, 1)
                              ),
                              circle: true,
                              size: "small",
                              type: "error",
                              quaternary: true,
                            },
                            {
                              icon: () => h(NIcon, () => h(Trash)),
                            }
                          ),
                          element.type === "group"
                            ? h(
                                NDropdown,
                                {
                                  options: FieldsList,
                                  style: {
                                    maxHeight: "200px",
                                  },
                                  scrollable: true,
                                  onSelect: (v) => {
                                    if (Schema[index].children)
                                      Schema[index].children.push(
                                        v === "group"
                                          ? {
                                              key:
                                                Date.now().toString(36) +
                                                Math.random()
                                                  .toString(36)
                                                  .substring(2),
                                              type: v,
                                              duplicatable: false,
                                            }
                                          : {
                                              key:
                                                Date.now().toString(36) +
                                                Math.random()
                                                  .toString(36)
                                                  .substring(2),
                                              type: v,
                                              required: false,
                                            }
                                      );
                                    else
                                      Schema[index].children = [
                                        v === "group"
                                          ? {
                                              key:
                                                Date.now().toString(36) +
                                                Math.random()
                                                  .toString(36)
                                                  .substring(2),
                                              type: v,
                                              duplicatable: false,
                                            }
                                          : {
                                              key:
                                                Date.now().toString(36) +
                                                Math.random()
                                                  .toString(36)
                                                  .substring(2),
                                              type: v,
                                              required: false,
                                            },
                                      ];
                                  },
                                },
                                () =>
                                  h(
                                    NButton,
                                    {
                                      onmouseenter: () =>
                                        (DisabledItem.value[index] = true),
                                      onmouseleave: () =>
                                        (DisabledItem.value[index] = false),
                                      disabled: element.name ? false : true,
                                      circle: true,
                                      size: "small",
                                    },
                                    {
                                      icon: () => h(NIcon, () => h(Plus)),
                                    }
                                  )
                              )
                            : null,
                          element.type === "group"
                            ? h(
                                NButton,
                                {
                                  onmouseleave: () =>
                                    (DisabledItem.value[index] = false),
                                  round: Window.value.width > 700,
                                  circle: Window.value.width < 700,
                                  strong: true,
                                  secondary: true,
                                  size: "small",
                                  type: Schema[index].duplicatable
                                    ? "info"
                                    : "tertiary",
                                  onClick: () => (
                                    (DisabledItem.value[index] = true),
                                    (Schema[index].duplicatable =
                                      !Schema[index].duplicatable)
                                  ),
                                },
                                {
                                  icon: () => h(NIcon, () => h(LetterD)),
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : t("duplicatable"),
                                }
                              )
                            : h(
                                NButton,
                                {
                                  onmouseleave: () =>
                                    (DisabledItem.value[index] = false),
                                  round: Window.value.width > 700,
                                  circle: Window.value.width < 700,
                                  strong: true,
                                  secondary: true,
                                  size: "small",
                                  type: Schema[index].required
                                    ? "error"
                                    : "tertiary",
                                  onClick: () => (
                                    (DisabledItem.value[index] = true),
                                    (Schema[index].required =
                                      !Schema[index].required)
                                  ),
                                },
                                {
                                  icon: () => h(NIcon, () => h(LetterR)),
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : t("required"),
                                }
                              ),
                          h(
                            NDropdown,
                            {
                              options: FieldsList,
                              style: {
                                maxHeight: "200px",
                              },
                              trigger: "click",
                              scrollable: true,
                              onSelect: (v) =>
                                v === "group"
                                  ? (delete element.required,
                                    (element.duplicatable = false),
                                    (element.type = v))
                                  : (delete element.duplicatable,
                                    (element.required = false),
                                    (element.type = v)),
                            },
                            () =>
                              h(
                                NButton,
                                {
                                  onmouseenter: () =>
                                    (DisabledItem.value[index] = true),
                                  onmouseleave: () =>
                                    (DisabledItem.value[index] = false),
                                  strong: true,
                                  secondary: true,
                                  round: true,
                                  size: "small",
                                  type: "primary",
                                },
                                {
                                  icon: () =>
                                    FieldsList.flatMap((i) =>
                                      i.children
                                        ? [
                                            {
                                              label: i.label,
                                              key: i.key,
                                              icon: i.icon,
                                            },
                                            ...i.children,
                                          ]
                                        : i
                                    )
                                      .filter((i) => i.key === element.type)[0]
                                      ?.icon() ?? h(NIcon, () => h(Box)),
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : FieldsList.flatMap((i) =>
                                          i.children
                                            ? [
                                                {
                                                  label: i.label,
                                                  key: i.key,
                                                  icon: i.icon,
                                                },
                                                ...i.children,
                                              ]
                                            : i
                                        ).filter(
                                          (i) => i.key === element.type
                                        )[0]?.label ?? "Custom",
                                }
                              )
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
                                      value: Schema[index].name,
                                      onUpdateValue: (v) => (
                                        (Schema[index].name = v),
                                        (Schema[index].search = null),
                                        (Schema[index].label = null),
                                        (Schema[index].image = null)
                                      ),
                                      options: database.value.tables
                                        .filter(
                                          (table) =>
                                            table.slug !==
                                              route.params.table_slug ||
                                            route.params.table_slug === "user"
                                        )
                                        .map(({ name, slug }) => ({
                                          label:
                                            name.charAt(0).toUpperCase() +
                                            name.slice(1).replaceAll("_", " "),
                                          value: slug,
                                        })),
                                    }),
                                }
                              ),
                              ...CustomFields(Schema[index], element),
                            ]
                          : [
                              h(
                                NFormItem,
                                {
                                  label: "Field Name",
                                  style: {
                                    marginBottom: "30px",
                                  },
                                },
                                {
                                  feedback: () =>
                                    `#${
                                      (element.path ?? "") +
                                      (element.name ?? "Field Name")
                                        .toLowerCase()
                                        .replace(/ /g, "_")
                                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                    }`,
                                  default: () =>
                                    h(NInput, {
                                      value: Schema[index].name,
                                      onUpdateValue: (v) =>
                                        (Schema[index].name = v),
                                    }),
                                }
                              ),
                              ...CustomFields(Schema[index], element),
                              element.children && element.type === "group"
                                ? RenderSchemaElement(
                                    element.children.map((ele) => ({
                                      ...ele,
                                      path:
                                        (element.path ?? "") +
                                        (element.name ?? "Field Name")
                                          .toLowerCase()
                                          .replace(/ /g, "_")
                                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
                                        (element.duplicatable ? ".*." : "."),
                                    }))
                                  )
                                : null,
                            ],
                    }
                  ),
              }
            )
        );
    return () =>
      h(
        NModal,
        {
          show: ShowSchemaModal.value,
          "on-update:show": (v) => (ShowSchemaModal.value = v),
          style: {
            width: Window.value.width > 600 ? "600px" : "100%",
          },
          maskClosable: false,
          preset: "card",
          size: "small",
          segmented: { content: true, footer: "soft" },
        },
        {
          header: () =>
            SchemaModal.value && SchemaModal.value.length > 0
              ? [
                  "Schema",
                  h(NP, () => "Drag To Reorder, Click on buttons to toggle"),
                ]
              : "Schema",
          footer: () =>
            h(
              NSpace,
              {
                justify: "space-between",
              },
              () => [
                h(
                  NDropdown,
                  {
                    options: FieldsList,
                    style: {
                      maxHeight: "200px",
                    },
                    scrollable: true,
                    onSelect: (v) =>
                      SchemaModal.value.push(
                        v === "group"
                          ? {
                              key:
                                Date.now().toString(36) +
                                Math.random().toString(36).substring(2),
                              type: v,
                              duplicatable: false,
                            }
                          : {
                              key:
                                Date.now().toString(36) +
                                Math.random().toString(36).substring(2),
                              type: v,
                              required: false,
                            }
                      ),
                  },
                  () =>
                    h(
                      NButton,
                      {},
                      {
                        icon: () => h(NIcon, () => h(Plus)),
                      }
                    )
                ),
                h(
                  NButton,
                  {
                    loading: Loading.value["SchemaModal"],
                    onClick: SaveSchemaModal,
                  },
                  {
                    default: () => t("save"),
                    icon: () => h(NIcon, () => h(DeviceFloppy)),
                  }
                ),
              ]
            ),
          default: () =>
            !SchemaModal.value || SchemaModal.value.length === 0
              ? h("div", {
                  style: {
                    display: "block",
                    height: "50px",
                  },
                })
              : h(
                  NScrollbar,
                  {
                    style: {
                      maxHeight: "calc(100vh - 156px)",
                    },
                  },
                  () =>
                    h(
                      NForm,
                      {
                        size: "small",
                        labelWidth: "auto",
                        labelPlacement: "left",
                        requireMarkPlacement: "right-hanging",
                      },
                      () => RenderSchemaElement(SchemaModal.value)
                    )
                ),
        }
      );
  },
});
