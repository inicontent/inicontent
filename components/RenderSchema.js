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
    const FieldsList = [
        {
          label: "Text",
          key: "input",
          icon: () => h(NIcon, () => h(Forms)),
          children: [
            {
              label: "Short Text",
              key: "text",
              icon: () => h(NIcon, () => h(LetterCase)),
            },
            {
              label: "Long Text",
              key: "textarea",
              icon: () => h(NIcon, () => h(AlignJustified)),
            },
            {
              label: "Rich Editor",
              key: "editor",
              icon: () => h(NIcon, () => h(Code)),
            },
          ],
        },
        {
          label: "Number",
          key: "number",
          icon: () => h(NIcon, () => h(ListNumbers)),
        },
        {
          label: "Password",
          key: "password",
          icon: () => h(NIcon, () => h(Key)),
        },
        {
          label: "Email",
          key: "email",
          icon: () => h(NIcon, () => h(At)),
        },
        {
          label: "Link",
          key: "url",
          icon: () => h(NIcon, () => h(Link)),
        },
        {
          label: "Tags",
          key: "tags",
          icon: () => h(NIcon, () => h(Tags)),
        },
        {
          label: "Date",
          key: "date",
          icon: () => h(NIcon, () => h(Calendar)),
        },
        {
          label: "Upload",
          key: "upload",
          icon: () => h(NIcon, () => h(Upload)),
        },
        {
          label: "Toggle",
          key: "boolean",
          icon: () => h(NIcon, () => h(ToggleLeft)),
        },
        {
          label: "List",
          key: "list",
          icon: () => h(NIcon, () => h(ListDetails)),
        },
        {
          label: "Group",
          key: "group",
          icon: () => h(NIcon, () => h(BoxMultiple)),
        },
        {
          label: "Table",
          key: "table",
          icon: () => h(NIcon, () => h(Table)),
        },
      ],
      Loading = useState("Loading", () => ({}));
    Loading.value["SchemaModal"] = false;

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
      GenerateLabelOptions = (schema, item, prefix = null) => {
        if (item.type === "group" && !item.duplicatable)
          return item.children.map((i) =>
            GenerateLabelOptions(
              schema,
              i,
              prefix ? `${prefix} ${item.name}` : item.name
            )
          );
        else
          return {
            label: prefix ? `${prefix} ${item.name}` : item.name,
            value: pathTo(schema, item.key),
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
                  path: pathTo(SchemaModal.value, item.key) + `.single`,
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
                  path: pathTo(SchemaModal.value, item.key) + `.accept`,
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
                  path: pathTo(SchemaModal.value, item.key) + `.single`,
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
                  path: pathTo(SchemaModal.value, item.key) + `.values`,
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
          case "table":
            return [
              h(
                NFormItem,
                {
                  disabled: !schema.name,
                  label: "Allow Multiple",
                  path: pathTo(SchemaModal.value, item.key) + `.single`,
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
                  path: pathTo(SchemaModal.value, item.key) + `.allow_create`,
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
                  path: pathTo(SchemaModal.value, item.key) + `.search`,
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
                            .schema.filter((item) => item.type !== "table")
                            .map((item, _index, schema) =>
                              GenerateSearchInOptions(schema, item)
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
                  path: pathTo(SchemaModal.value, item.key) + `.label`,
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
                            .schema.filter((item) => item.type !== "table")
                            .map((item, _index, schema) =>
                              GenerateLabelOptions(schema, item)
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
                  path: pathTo(SchemaModal.value, item.key) + `.image`,
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
                            .schema.filter((item) => item.type !== "table")
                            .map((item, _index, schema) =>
                              GenerateLabelOptions(schema, item)
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
                            style: {
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
                              onmouseenter: () =>
                                (DisabledItem.value[index] = true),
                              onmouseleave: () =>
                                (DisabledItem.value[index] = false),
                              onClick: () => Schema.splice(index, 1),
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
                                  onmouseenter: () =>
                                    (DisabledItem.value[index] = true),
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
                                  onClick: () =>
                                    (Schema[index].duplicatable =
                                      !Schema[index].duplicatable),
                                },
                                {
                                  icon: () => h(NIcon, () => h(LetterD)),
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : "Duplicatable",
                                }
                              )
                            : h(
                                NButton,
                                {
                                  onmouseenter: () =>
                                    (DisabledItem.value[index] = true),
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
                                  onClick: () =>
                                    (Schema[index].required =
                                      !Schema[index].required),
                                },
                                {
                                  icon: () => h(NIcon, () => h(LetterR)),
                                  default: () =>
                                    Window.value.width < 700
                                      ? null
                                      : "Required",
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
                                  path:
                                    pathTo(SchemaModal.value, element.key) +
                                    `.name`,
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
                                  path:
                                    pathTo(SchemaModal.value, element.key) +
                                    `.name`,
                                  style: {
                                    marginBottom: "30px",
                                  },
                                },
                                {
                                  feedback: () =>
                                    `#${pathTo(
                                      SchemaModal.value,
                                      element.key
                                    )}`,
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
                                ? RenderSchemaElement(element.children)
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
                    default: () => "Save",
                    icon: () => h(NIcon, () => h(DeviceFloppy)),
                  }
                ),
              ]
            ),
          default: () => [
            h(
              NForm,
              {
                size: "small",
                "label-width": "auto",
                "label-placement": "left",
                "require-mark-placement": "right-hanging",
              },
              () => RenderSchemaElement(SchemaModal.value)
            ),
            !SchemaModal.value || SchemaModal.value.length === 0
              ? h("div", {
                  style: {
                    display: "block",
                    height: "50px",
                  },
                })
              : null,
          ],
        }
      );
  },
});
