import {
  useMessage,
  NCard,
  NSpace,
  NButton,
  NIcon,
  NGrid,
  NGi,
  NForm,
  NAnchor,
  NAnchorLink,
} from "naive-ui";
import { DeviceFloppy } from "@vicons/tabler";
import { Buffer } from "buffer";
import { RenderFields } from "#components";
export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["UpdateDatabase"] = false;

    const database = useState("database"),
      User = useState("User"),
      message = useMessage(),
      databaseRef = ref(),
      databaseCopy = ref(JSON.parse(JSON.stringify(database.value))),
      UpdateDatabase = async () => {
        databaseRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["UpdateDatabase"] = true;
            const { data } = await useFetch(
              `https://api.inicontent.com/inicontent/db/${database.value.id}!`,
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Buffer.from(
                      `${User.value.username}:${User.value.password}`
                    ).toString("base64"),
                },
                method: "PUT",
                body: databaseCopy.value,
                initialCache: false,
              }
            );
            if (data.value.result) {
              database.value = data.value.result;
              Loading.value["UpdateDatabase"] = false;
              message.success(data.value.message.en);
            } else message.error(data.value.message.en);
            Loading.value["UpdateDatabase"] = false;
          } else message.error("The inputs are Invalid");
        });
      };

    if (
      !databaseCopy.value.tables ||
      databaseCopy.value.tables.filter((i) => i.slug === "user").length === 0
    )
      databaseCopy.value.tables = [
        ...(databaseCopy.value.tables ?? []),
        {
          name: "User",
          slug: "user",
          schema: [
            {
              name: "Username",
              type: "text",
              required: true,
            },
            {
              name: "Password",
              type: "password",
              required: true,
            },
            {
              name: "Email",
              type: "email",
              required: false,
            },
            {
              name: "Role",
              type: "role",
              required: true,
            },
          ],
        },
      ];
    else
      databaseCopy.value.tables = databaseCopy.value.tables.map((table) => ({
        ...table,
        allowed_methods: Object.fromEntries(
          Object.entries(table.allowed_methods).map(([key, value]) => [
            key,
            value.split(""),
          ])
        ),
      }));

    useHead({
      title: `${database.value.name} | Tables`,
      link: [{ rel: "icon", href: database.value.icon }],
    });

    return () =>
      h(NGrid, { xGap: 12, cols: 12, itemResponsive: true }, () => [
        h(NGi, { span: 11 }, () =>
          h(
            NCard,
            {
              title: "Settings",
              hoverable: true,
            },
            {
              "header-extra": () => h("span", {}, "SSS"),
              default: () => [
                h(
                  NCard,
                  { title: "General", id: "general", hoverable: true },
                  () =>
                    h(NSpace, { vertical: true }, () => [
                      h(
                        NCard,
                        { title: "Basic", id: "basic", hoverable: true },
                        () => [
                          h(
                            NForm,
                            {
                              ref: databaseRef,
                              model: databaseCopy.value,
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
                                          ret = new Error(
                                            "This field is required"
                                          );
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
                                      return new Error(
                                        "This field is required"
                                      );
                                  },
                                  trigger: ["input", "blur"],
                                },
                              },
                            },
                            () =>
                              h(RenderFields, {
                                modelValue: databaseCopy.value,
                                "onUpdate:modelValue": (v) =>
                                  (databaseCopy.value = v),
                                schema: [
                                  {
                                    name: "Name",
                                    type: "text",
                                    required: true,
                                  },
                                  {
                                    name: "Slug",
                                    type: "text",
                                    required: true,
                                  },
                                  {
                                    name: "Icon",
                                    type: "upload",
                                    single: true,
                                    required: true,
                                  },
                                  {
                                    name: "Allowed Domains",
                                    type: "tags",
                                    content_type: "url",
                                    required: true,
                                  },
                                  {
                                    name: "Languages",
                                    type: "list",
                                    values: [
                                      { label: "Arabic", value: "ar" },
                                      { label: "English", value: "en" },
                                    ],
                                    single: false,
                                    required: true,
                                  },
                                  {
                                    name: "Roles",
                                    type: "tags",
                                    content_type: "text",
                                    default_value: ["admin", "user", "guest"],
                                    required: true,
                                  },
                                  {
                                    name: "Tables",
                                    type: "group",
                                    duplicatable: true,
                                    disabled_items: [0],
                                    children: [
                                      {
                                        name: "Name",
                                        type: "text",
                                        required: true,
                                      },
                                      {
                                        name: "Slug",
                                        type: "text",
                                        required: true,
                                      },
                                      {
                                        name: "Allowed methods",
                                        type: "group",
                                        children: [
                                          "user",
                                          "guest",
                                          ...(databaseCopy.value.roles?.filter(
                                            (role) => role !== "admin"
                                          ) ?? []),
                                        ].map((role) => ({
                                          name:
                                            role.charAt(0).toUpperCase() +
                                            role.slice(1).replaceAll("_", " "),
                                          type: "list",
                                          single: false,
                                          values: [
                                            {
                                              value: "c",
                                              label: "Create",
                                            },
                                            {
                                              value: "r",
                                              label: "Read",
                                            },
                                            {
                                              value: "u",
                                              label: "Update",
                                            },
                                            {
                                              value: "d",
                                              label: "Delete",
                                            },
                                          ],
                                          required: true,
                                        })),
                                      },
                                    ],
                                  },
                                ],
                              })
                          ),
                        ]
                      ),
                      h(
                        NCard,
                        { title: "Email", id: "email", hoverable: true },
                        () => []
                      ),
                    ])
                ),
              ],
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
            () => [
              h(NAnchorLink, { title: "General", href: "#general" }, () => [
                h(NAnchorLink, { title: "Basic", href: "#basic" }),
                h(NAnchorLink, { title: "Email", href: "#email" }),
              ]),
            ]
          ),
        ]),
      ]);
  },
});
