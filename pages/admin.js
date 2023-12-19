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
  NCollapse,
  NCollapseItem,
  NPopover,
} from "naive-ui";
import {
  Plus,
  DeviceFloppy,
  Settings,
  ArrowRight,
  Folders,
  Language as LanguageIcon,
  Users,
  Fingerprint,
} from "@vicons/tabler";

import { LazyRenderFields } from "#components";
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

    const Loading = useState("Loading", () => ({}));
    Loading.value["Database"] = false;

    const database = useState("database"),
      message = useMessage(),
      user = useState("user"),
      DisabledItem = useState(() => []),
      Window = useState("Window", () => ({
        width: 0,
      })),
      { data: databases } = await useFetch("/api/inicontent/database", {
        transform: (i) => i.result,
      }),
      ShowDatabaseModal = ref(false),
      DatabaseRef = ref(null),
      DatabaseModal = ref(),
      Database = async () => {
        DatabaseRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["Database"] = true;
            const { data } = await useFetch(
              `/api/inicontent/database/${
                DatabaseModal.value.id ? DatabaseModal.value.id : ""
              }`,
              {
                method: DatabaseModal.value.id ? "PUT" : "POST",
                body: DatabaseModal.value,

                transform: (res) => {
                  if (res.result && Array.isArray(res.result))
                    res.result = [].concat(res.result)[0];
                  return res;
                },
              }
            );
            if (data.value.result) {
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
      link: [{ rel: "icon", href: database.value.icon }],
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
                            subtype: "role",
                            required: true,
                          },
                          {
                            key: "user",
                            type: ["table", "array"],
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
                            type: ["table", "array"],
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
              { icon: () => h(NIcon, () => h(Plus)) }
            ),
          default: () => [
            h(
              NModal,
              {
                show: ShowDatabaseModal.value,
                "on-update:show": (v) => (ShowDatabaseModal.value = v),
                style: {
                  width: Window.value.width > 600 ? "600px" : "100%",
                },
                preset: "card",
                title:
                  DatabaseModal.value &&
                  DatabaseModal.value.hasOwnProperty("id")
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
                            type: "text",
                            required: true,
                          },
                          {
                            id: 2,
                            key: "icon",
                            type: "upload",
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
                            default_value: ["admin", "user", "guest"],
                            required: true,
                          },
                          {
                            id: 6,
                            key: "tables",
                            type: "array",
                            onCreate: () => ({
                              allowed_methods: DatabaseModal.value.roles
                                .filter((role) => role !== "admin")
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
                                input_props: (value) =>
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
                                    input_props: {
                                      disabled: true,
                                    },
                                    required: true,
                                  },
                                  {
                                    id: 10,
                                    key: "methods",
                                    type: "array",
                                    children: "string",
                                    subtype: "checkbox",
                                    values: ["c", "r", "u", "d"],
                                    required: true,
                                  },
                                ],
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
                        loading: Loading.value["Database"],
                        onClick: Database,
                      },
                      {
                        default: () =>
                          DatabaseModal.value.hasOwnProperty("id")
                            ? t("save")
                            : t("create"),
                        icon: () => h(NIcon, () => h(DeviceFloppy)),
                      }
                    ),
                  ]),
              }
            ),
            h(
              NCollapse,
              {
                defaultExpandedNames: t(databases.value[0]?.slug),
                accordion: true,
              },
              () =>
                databases.value.map(({ slug, tables }, index) =>
                  h(
                    NCollapseItem,
                    {
                      title: t(slug),
                      name: slug,
                      disabled: DisabledItem.value[index],
                    },
                    {
                      "header-extra": () =>
                        h(NSpace, {}, () => [
                          h(
                            NButton,
                            {
                              circle: true,
                              onClick: () => (
                                (DisabledItem.value[index] = true),
                                setTimeout(
                                  () => (DisabledItem.value[index] = false),
                                  1
                                ),
                                (DatabaseModal.value = JSON.parse(
                                  JSON.stringify(databases.value[index])
                                )),
                                (ShowDatabaseModal.value = true)
                              ),
                            },
                            { icon: () => h(NIcon, () => h(Settings)) }
                          ),
                          h(
                            NButton,
                            {
                              tag: "a",
                              href: `/${slug}/admin`,
                              onClick: () => (
                                e.preventDefault(),
                                (DisabledItem.value[index] = true),
                                setTimeout(
                                  () => (DisabledItem.value[index] = false),
                                  1
                                ),
                                navigateTo(`/${slug}/admin`)
                              ),
                              circle: true,
                              type: "primary",
                            },
                            { icon: () => h(NIcon, () => h(ArrowRight)) }
                          ),
                        ]),
                      default: () =>
                        h(
                          NGrid,
                          { xGap: 12, yGap: 12, cols: "1 500:2 800:4" },
                          () =>
                            tables
                              ?.filter(
                                ({ slug, allowed_methods }) =>
                                  user.value &&
                                  (user.value.role === "admin" ||
                                    slug === "user" ||
                                    allowed_methods
                                      ?.find(
                                        (method) =>
                                          method.role === user.value.role
                                      )
                                      ?.methods?.includes("r"))
                              )
                              .toSorted(
                                (a, b) =>
                                  [
                                    "user",
                                    "session",
                                    "translation",
                                    "asset",
                                  ].includes(b.slug) -
                                  [
                                    "user",
                                    "session",
                                    "translation",
                                    "asset",
                                  ].includes(a.slug)
                              )
                              .map((table) =>
                                h(NGi, () =>
                                  h(
                                    NCard,
                                    {
                                      onClick: () =>
                                        navigateTo(
                                          `/${slug}/admin/tables/${table.slug}`
                                        ),
                                      style: {
                                        cursor: "pointer",
                                      },
                                      hoverable: true,
                                    },
                                    {
                                      header: () =>
                                        h(NSpace, () => [
                                          h(
                                            NIconWrapper,
                                            { borderRadius: 50 },
                                            () =>
                                              h(
                                                NIcon,
                                                { style: "font-style: normal" },
                                                () => {
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
                                                      return t(
                                                        table.slug
                                                      ).charAt(0);
                                                  }
                                                }
                                              )
                                          ),
                                          h(
                                            NH4,
                                            { style: "margin-bottom: 0" },
                                            () => t(table.slug)
                                          ),
                                        ]),
                                      "header-extra": () =>
                                        h(NSpace, () => [
                                          user.value.role === "admin" ||
                                          allowed_methods
                                            ?.find(
                                              (method) =>
                                                method.role === user.value.role
                                            )
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
                                                        href: `/${slug}/admin/tables/${table.slug}/new`,
                                                        onClick: (e) => (
                                                          e.preventDefault(),
                                                          navigateTo(
                                                            `/${slug}/admin/tables/${table.slug}/new`
                                                          )
                                                        ),
                                                        circle: true,
                                                      },
                                                      {
                                                        icon: () =>
                                                          h(NIcon, () =>
                                                            h(Plus)
                                                          ),
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
                                                        href: `/${slug}/admin/tables/${table.slug}/settings`,
                                                        onClick: (e) => (
                                                          e.preventDefault(),
                                                          navigateTo(
                                                            `/${slug}/admin/tables/${table.slug}/settings`
                                                          )
                                                        ),
                                                      },
                                                      {
                                                        icon: () =>
                                                          h(NIcon, () =>
                                                            h(Settings)
                                                          ),
                                                      }
                                                    ),
                                                  default: () =>
                                                    t("table_settings"),
                                                }
                                              )
                                            : null,
                                        ]),
                                    }
                                  )
                                )
                              )
                        ),
                    }
                  )
                )
            ),
          ],
        }
      );
  },
});
