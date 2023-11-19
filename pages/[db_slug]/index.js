import {
  useMessage,
  NCard,
  NModal,
  NSpace,
  NButton,
  NIcon,
  NGrid,
  NGi,
  NIconWrapper,
  NH4,
  NForm,
  NFormItem,
  NInput,
  NUpload,
  NUploadDragger,
  NDynamicTags,
  NDataTable,
  NCheckboxGroup,
  NCheckbox,
  NText,
  NTag,
} from "naive-ui";
import {
  Plus,
  Trash,
  DeviceFloppy,
  Link,
  Settings,
  Upload,
} from "@vicons/tabler";
import { Buffer } from "buffer";
import { NuxtLink } from "#components";
export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["AddNewDatabase"] = false;

    const database = useState("database"),
      Window = useState("Window", () => ({
        width: 0,
      })),
      route = useRoute(),
      User = useState("User"),
      message = useMessage(),
      ShowAddNewDatabaseModal = ref(false),
      AddNewDatabaseRef = ref(null),
      AddNewDatabaseModal = ref(),
      AddNewDatabase = async () => {
        AddNewDatabaseRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["AddNewDatabase"] = true;
            const { data } = await useFetch(
              `https://api.inicontent.com/inicontent/db/${AddNewDatabaseModal.value.id}!`,
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Buffer.from(
                      `${User.value.username}:${User.value.password}`
                    ).toString("base64"),
                },
                method: "PUT",
                body: AddNewDatabaseModal.value,
                initialCache: false,
              }
            );
            if (data.value.result) {
              database.value = data.value.result;
              Loading.value["AddNewDatabase"] = false;
              ShowAddNewDatabaseModal.value = false;
              message.success(data.value.message.en);
            } else message.error(data.value.message.en);
            Loading.value["AddNewDatabase"] = false;
          } else message.error("The inputs are Invalid");
        });
      };
    useHead({
      title: `${database.value.name} | Tables`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    return () =>
      h(
        NCard,
        { title: "Tables", style: "background: none", bordered: false },
        {
          header: () =>
            h(NuxtLink, { to: `${route.params.db_slug}/tables` }, () =>
              h(NText, () => "Tables")
            ),
          "header-extra": () =>
            User.value && User.value.role === "admin"
              ? h(
                  NButton,
                  {
                    circle: true,
                    onClick: () => (
                      (AddNewDatabaseModal.value = JSON.parse(
                        JSON.stringify(database.value)
                      )),
                      (ShowAddNewDatabaseModal.value = true)
                    ),
                  },
                  { icon: () => h(NIcon, () => h(Settings)) }
                )
              : null,
          default: () => [
            User.value && User.value.role === "admin"
              ? h(
                  NModal,
                  {
                    show: ShowAddNewDatabaseModal.value,
                    "on-update:show": (v) =>
                      (ShowAddNewDatabaseModal.value = v),
                    style: {
                      width: Window.value.width > 600 ? "600px" : "100%",
                    },
                    preset: "card",
                    title:
                      AddNewDatabaseModal.value &&
                      AddNewDatabaseModal.value.hasOwnProperty("id")
                        ? "Update the database"
                        : "Create new Database",
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
                          ref: AddNewDatabaseRef,
                          model: AddNewDatabaseModal.value,
                          rules: {
                            name: {
                              required: true,
                              message: "Please give your database a name",
                              trigger: ["input", "blur"],
                            },
                            slug: {
                              required: true,
                              message:
                                "Please give your database a unique slug",
                              trigger: ["input", "blur"],
                            },
                            allowed_domains: {
                              required: true,
                              validator(rule, value) {
                                if (value) {
                                  var ret = true;
                                  value.forEach((val) => {
                                    if (!val) {
                                      ret = new Error("This field is required");
                                    } else if (
                                      val === "*" ||
                                      val.charAt(0) === "#"
                                    ) {
                                      ret = true;
                                    } else if (
                                      !/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(
                                        val
                                      )
                                    ) {
                                      ret = new Error(
                                        "This is not a valid link"
                                      );
                                    }
                                  });
                                  return ret;
                                } else
                                  return new Error("This field is required");
                              },
                              trigger: ["input", "blur"],
                            },
                          },
                        },
                        () => [
                          h(
                            NFormItem,
                            {
                              label: "Name",
                              path: "name",
                            },
                            () =>
                              h(NInput, {
                                value: AddNewDatabaseModal.value.name,
                                onUpdateValue: (v) => (
                                  (AddNewDatabaseModal.value.name = v),
                                  (AddNewDatabaseModal.value.slug = v
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""))
                                ),
                              })
                          ),
                          h(
                            NFormItem,
                            {
                              label: "Slug",
                              path: "slug",
                            },
                            () =>
                              h(NInput, {
                                disabled:
                                  AddNewDatabaseModal.value &&
                                  AddNewDatabaseModal.value.hasOwnProperty(
                                    "id"
                                  ),
                                value: AddNewDatabaseModal.value.slug,
                                onUpdateValue: (v) =>
                                  (AddNewDatabaseModal.value.slug = v
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")),
                              })
                          ),
                          h(
                            NFormItem,
                            {
                              label: "Icon",
                              path: "icon",
                            },
                            () =>
                              h(
                                NUpload,
                                {
                                  directoryDnd: true,
                                  max: 1,
                                  multiple: false,
                                  accept: "image/*",
                                  action: `https://api.inicontent.com/inicontent/assets`,
                                  headers: {
                                    Authorization:
                                      "Basic " +
                                      Buffer.from(
                                        `${User.value.username}:${User.value.password}`
                                      ).toString("base64"),
                                  },
                                  fileList: AddNewDatabaseModal.value.icon
                                    ? [
                                        {
                                          id: AddNewDatabaseModal.value.icon
                                            .split("/")
                                            .pop()
                                            .split("#")[0]
                                            .split("?")[0],
                                          name: AddNewDatabaseModal.value.icon
                                            .split("/")
                                            .pop()
                                            .split("#")[0]
                                            .split("?")[0],
                                          status: "finished",
                                          url: AddNewDatabaseModal.value.icon,
                                        },
                                      ]
                                    : undefined,
                                  onRemove: ({ file }) => {
                                    delete AddNewDatabaseModal.value.icon;
                                    return true;
                                  },
                                  onFinish: ({ file, event }) => {
                                    const src = JSON.parse(
                                      event.target.response
                                    ).result.public_url;
                                    AddNewDatabaseModal.value.icon = src;
                                    file.url = src;
                                    file.name = src
                                      .split("/")
                                      .pop()
                                      .split("#")[0]
                                      .split("?")[0];
                                    return file;
                                  },
                                  listType: "image",
                                },
                                () =>
                                  h(NUploadDragger, () => [
                                    h(
                                      "div",
                                      {
                                        style: {
                                          "margin-bottom": "12px",
                                        },
                                      },
                                      h(NIcon, { size: 48, depth: 3 }, () =>
                                        h(Upload)
                                      )
                                    ),
                                    h(
                                      NText,
                                      { style: { "font-size": "16px" } },
                                      () =>
                                        "Click or drag a file to this area to upload"
                                    ),
                                  ])
                              )
                          ),
                          h(
                            NFormItem,
                            {
                              label: "Allowed Domains",
                              path: "allowed_domains",
                            },
                            () =>
                              h(
                                NDynamicTags,
                                {
                                  value:
                                    AddNewDatabaseModal.value.allowed_domains,
                                  onUpdateValue: (v) =>
                                    (AddNewDatabaseModal.value.allowed_domains =
                                      v),
                                },
                                {
                                  input: ({ submit, deactivate }) =>
                                    h(
                                      NInput,
                                      {
                                        onBlur: deactivate,
                                        onChange: submit,
                                      },
                                      {
                                        suffix: () => h(NIcon, () => h(Link)),
                                      }
                                    ),
                                }
                              )
                          ),
                          h(
                            NFormItem,
                            {
                              label: "Roles",
                              path: "roles",
                            },
                            () =>
                              h(NDynamicTags, {
                                value: [
                                  "admin",
                                  "user",
                                  "guest",
                                  ...(AddNewDatabaseModal.value.roles ?? []),
                                ],
                                onCreate: (label) =>
                                  AddNewDatabaseModal.value.roles
                                    ? AddNewDatabaseModal.value.roles.push(
                                        label
                                          .toLowerCase()
                                          .replace(/ /g, "_")
                                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                      )
                                    : (AddNewDatabaseModal.value.roles = [
                                        label
                                          .toLowerCase()
                                          .replace(/ /g, "_")
                                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                                      ]),
                                renderTag: (tag, index) =>
                                  h(
                                    NTag,
                                    {
                                      type: index > 2 ? "default" : "primary",
                                      disabled: index < 3,
                                      closable: index > 2,
                                      onClose: () => (
                                        AddNewDatabaseModal.value.roles.splice(
                                          index,
                                          1
                                        ),
                                        AddNewDatabaseModal.value.roles
                                          .length === 0
                                          ? delete AddNewDatabaseModal.value
                                              .roles
                                          : ""
                                      ),
                                    },
                                    {
                                      default: () =>
                                        tag.charAt(0).toUpperCase() +
                                        tag.slice(1).replaceAll("_", " "),
                                    }
                                  ),
                              })
                          ),
                          h(NSpace, () => [
                            h(NH4, () => "Tables"),
                            h(
                              NButton,
                              {
                                size: "small",
                                circle: true,
                                onClick: () =>
                                  AddNewDatabaseModal.value.tables.push({
                                    name: "",
                                    slug: "",
                                    allowed_methods: {},
                                  }),
                              },
                              {
                                icon: () => h(NIcon, () => h(Plus)),
                              }
                            ),
                          ]),
                          h(NDataTable, {
                            columns: [
                              {
                                title: "Name",
                                width: 100,
                                key: "name",
                                render(row, index) {
                                  return h(
                                    NFormItem,
                                    {
                                      showLabel: false,
                                      path: `tables.${index}.name`,
                                      disabled: row.slug === "user",
                                      rule: {
                                        required: true,
                                        validator(rule, value) {
                                          return !value
                                            ? new Error(
                                                "This field is required"
                                              )
                                            : true;
                                        },
                                        trigger: ["input", "blur"],
                                      },
                                    },
                                    () =>
                                      h(NInput, {
                                        value: row.name,
                                        disabled: row.slug === "user",
                                        onUpdateValue: (v) => (
                                          (AddNewDatabaseModal.value.tables[
                                            index
                                          ].name = v),
                                          (AddNewDatabaseModal.value.tables[
                                            index
                                          ].slug = v
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""))
                                        ),
                                      })
                                  );
                                },
                              },
                              {
                                title: "Slug",
                                width: 100,
                                key: "slug",
                                render(row, index) {
                                  return h(
                                    NFormItem,
                                    {
                                      disabled:
                                        (AddNewDatabaseModal.value &&
                                          AddNewDatabaseModal.value.hasOwnProperty(
                                            "id"
                                          )) ||
                                        row.slug === "user",
                                      showLabel: false,
                                      path: `tables.${index}.slug`,
                                      rule: {
                                        required: true,
                                        validator(rule, value) {
                                          return !value
                                            ? new Error(
                                                "This field is required"
                                              )
                                            : true;
                                        },
                                        trigger: ["input", "blur"],
                                      },
                                    },
                                    () =>
                                      h(NInput, {
                                        disabled:
                                          (AddNewDatabaseModal.value &&
                                            AddNewDatabaseModal.value.hasOwnProperty(
                                              "id"
                                            )) ||
                                          row.slug === "user",
                                        value: row.slug,
                                        onUpdateValue: (v) =>
                                          (AddNewDatabaseModal.value.tables[
                                            index
                                          ].slug = [
                                            "user",
                                            "assets",
                                            "session",
                                          ].includes(
                                            v
                                              .toLowerCase()
                                              .replace(/ /g, "_")
                                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                          )
                                            ? v
                                                .toLowerCase()
                                                .replace(/ /g, "_")
                                                .replace(
                                                  /[^\[a-zA-Zء-ي]-_+/g,
                                                  ""
                                                )
                                            : null),
                                      })
                                  );
                                },
                              },
                              {
                                title: "Allowed methods",
                                width: 100,
                                key: "allowed_methods",
                                render: (row, index) =>
                                  [
                                    "user",
                                    "guest",
                                    ...(AddNewDatabaseModal.value.roles ?? []),
                                  ].map((role) =>
                                    h(
                                      NFormItem,
                                      {
                                        label:
                                          role.charAt(0).toUpperCase() +
                                          role.slice(1).replaceAll("_", " "),
                                        path: `tables.${index}.allowed_methods.${role}`,
                                      },
                                      () =>
                                        h(
                                          NCheckboxGroup,
                                          {
                                            disabled: row.slug === "user",
                                            value:
                                              AddNewDatabaseModal.value.tables[
                                                index
                                              ] &&
                                              AddNewDatabaseModal.value.tables[
                                                index
                                              ].allowed_methods
                                                ? Array.from(
                                                    AddNewDatabaseModal.value
                                                      .tables[index]
                                                      .allowed_methods[role] ??
                                                      ""
                                                  )
                                                : ["c", "r", "u"],
                                            onUpdateValue: (v) =>
                                              (AddNewDatabaseModal.value.tables[
                                                index
                                              ].allowed_methods[role] =
                                                v.join("")),
                                            itemStyle: "display: flex",
                                          },
                                          () =>
                                            h(NSpace, () => [
                                              h(NCheckbox, {
                                                value: "c",
                                                label: "Create",
                                              }),
                                              h(NCheckbox, {
                                                value: "r",
                                                label: "Read",
                                              }),
                                              h(NCheckbox, {
                                                value: "u",
                                                label: "Update",
                                              }),
                                              h(NCheckbox, {
                                                value: "d",
                                                label: "Delete",
                                              }),
                                            ])
                                        )
                                    )
                                  ),
                              },
                              {
                                title: "Actions",
                                fixed: "right",
                                align: "center",
                                width: 60,
                                key: "actions",
                                render(row, index) {
                                  return h(
                                    NButton,
                                    {
                                      strong: true,
                                      secondary: true,
                                      circle: true,
                                      type: "error",
                                      disabled: row.slug === "user",
                                      onClick() {
                                        delete AddNewDatabaseModal.value.tables[
                                          index
                                        ];
                                      },
                                    },
                                    { icon: () => h(NIcon, () => h(Trash)) }
                                  );
                                },
                              },
                            ],
                            data:
                              AddNewDatabaseModal.value.tables.filter(
                                (i) => i.slug === "user"
                              ).length > 0
                                ? AddNewDatabaseModal.value.tables
                                : [
                                    ...AddNewDatabaseModal.value.tables,
                                    {
                                      name: "User",
                                      slug: "user",
                                      schema: [
                                        {
                                          name: "Username",
                                          type: "text",
                                          required: true,
                                          key:
                                            Date.now().toString(36) +
                                            Math.random()
                                              .toString(36)
                                              .substring(2),
                                        },
                                        {
                                          name: "Password",
                                          type: "password",
                                          required: true,
                                          key:
                                            Date.now().toString(36) +
                                            Math.random()
                                              .toString(36)
                                              .substring(2),
                                        },
                                        {
                                          name: "Email",
                                          type: "email",
                                          required: false,
                                          key:
                                            Date.now().toString(36) +
                                            Math.random()
                                              .toString(36)
                                              .substring(2),
                                        },
                                        {
                                          name: "Role",
                                          type: "role",
                                          required: true,
                                          key:
                                            Date.now().toString(36) +
                                            Math.random()
                                              .toString(36)
                                              .substring(2),
                                        },
                                      ],
                                    },
                                  ],
                            scrollX: 700,
                          }),
                        ]
                      ),
                    footer: () =>
                      h(NSpace, { justify: "end" }, () => [
                        h(
                          NButton,
                          {
                            loading: Loading.value["AddNewDatabase"],
                            onClick: AddNewDatabase,
                          },
                          {
                            default: () => "Save",
                            icon: () => h(NIcon, () => h(DeviceFloppy)),
                          }
                        ),
                      ]),
                  }
                )
              : null,
            h(NGrid, { xGap: 12, yGap: 12, cols: "1 500:2 800:4" }, () =>
              database.value.tables
                .filter(
                  ({ slug, allowed_methods }) =>
                    User.value &&
                    (User.value.role === "admin" ||
                      slug === "user" ||
                      (allowed_methods &&
                        allowed_methods[User.value.role] &&
                        allowed_methods[User.value.role].includes("r")))
                )
                .map((table) =>
                  h(NGi, () =>
                    h(
                      NuxtLink,
                      { to: `/${database.value.slug}/tables/${table.slug}` },
                      () =>
                        h(
                          NCard,
                          {
                            style: "height: 100%",
                            headerStyle: "height: 100%",
                            hoverable: true,
                          },
                          {
                            header: () =>
                              h(NSpace, () => [
                                h(NIconWrapper, { borderRadius: 50 }, () =>
                                  h(
                                    NIcon,
                                    { style: "font-style: normal" },
                                    () => table.name.charAt(0)
                                  )
                                ),
                                h(
                                  NH4,
                                  { style: "margin-bottom: 0" },
                                  () => table.name
                                ),
                              ]),
                            "header-extra": () =>
                              h(NSpace, () => [
                                User.value &&
                                User.value.role &&
                                (User.value.role === "admin" ||
                                  (table.allowed_methods &&
                                    table.allowed_methods[User.value.role] &&
                                    table.allowed_methods[
                                      User.value.role
                                    ].includes("c")))
                                  ? h(
                                      NuxtLink,
                                      {
                                        to: `/${database.value.slug}/tables/${table.slug}/new`,
                                      },
                                      () =>
                                        h(
                                          NButton,
                                          { circle: true },
                                          {
                                            icon: () => h(NIcon, () => h(Plus)),
                                          }
                                        )
                                    )
                                  : null,
                              ]),
                          }
                        )
                    )
                  )
                )
            ),
          ],
        }
      );
  },
});
