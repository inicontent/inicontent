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
import { IconDeviceFloppy } from "@tabler/icons-vue";

import { LazyRenderFields } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        save: "حِفظ",
        Name: "الإسم",
        Slug: "عنوان فرعي",
        "Allowed methods": "الأوامر المسموح بها",
        "Allowed domains": "النِطاقات المسموح بها",
        Languages: "اللغات",
        Roles: "الأدوار",
        Guest: "زائر",
        Icon: "أيقونة",
        Create: "إنشاء",
        Read: "قِرائة",
        Update: "تحديث",
        Delete: "حذف",
        general_settings: "إعدادات عامة",
        tables_settings: "إعدادات الجداول",
        translation_settings: "إعدادات الترجمة",
        email_settings: "إعدادات البريد",
      },
      en: {
        save: "Save",
        general_settings: "General Settings",
        tables_settings: "Tables Settings",
        translation_settings: "Translation Settings",
        email_settings: "Email Settings",
      },
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["UpdateDatabase"] = false;

    const database = useState("database"),
      message = useMessage(),
      databaseRef = ref(),
      databaseCopy = ref(JSON.parse(JSON.stringify(database.value))),
      UpdateDatabase = async () => {
        databaseRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["UpdateDatabase"] = true;
            const { data } = await useFetch(
              `/api/inicontent/database/${database.value.slug}`,
              {
                method: "PUT",
                body: databaseCopy.value,
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

    useHead({
      title: `${database.value.slug} | ${t("Settings")}`,
      link: [{ rel: "icon", href: database.value.icon }],
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
                title: `${database.value.slug} ${t("Settings")}`,
                hoverable: true,
              },
              {
                "header-extra": () =>
                  h(
                    NButton,
                    {
                      round: true,
                      loading: Loading.value["UpdateDatabase"],
                      onClick: UpdateDatabase,
                    },
                    {
                      default: () => t("save"),
                      icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                    }
                  ),
                default: () =>
                  h(NSpace, { vertical: true }, () => [
                    h(
                      NCard,
                      {
                        title: t("general_settings"),
                        id: "general_settings",
                        hoverable: true,
                      },
                      () => [
                        h(
                          NForm,
                          {
                            ref: databaseRef,
                            model: databaseCopy.value,
                          },
                          () =>
                            h(LazyRenderFields, {
                              modelValue: databaseCopy.value,
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
                                  defaultValue: ["admin", "user", "guest"],
                                  required: true,
                                },
                              ],
                            })
                        ),
                      ]
                    ),
                    h(
                      NCard,
                      {
                        id: "tables_settings",
                        hoverable: true,
                        contentStyle: {
                          paddingTop: 0,
                          paddingBottom: 0,
                        },
                      },
                      () => [
                        h(
                          NForm,
                          {
                            ref: databaseRef,
                            model: databaseCopy.value,
                          },
                          () =>
                            h(LazyRenderFields, {
                              modelValue: databaseCopy.value,
                              schema: [
                                {
                                  id: 6,
                                  key: "tables",
                                  type: "array",
                                  onCreate: () => ({
                                    allowed_methods: databaseCopy.value.roles
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
                                      inputProps: (value) =>
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
                                  ],
                                },
                              ],
                            })
                        ),
                      ]
                    ),
                    h(
                      NCard,
                      {
                        title: t("translation_settings"),
                        id: "translation_settings",
                        hoverable: true,
                      },
                      () => []
                    ),
                    h(
                      NCard,
                      {
                        title: t("email_settings"),
                        id: "email_settings",
                        hoverable: true,
                      },
                      () => []
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
                  title: t("general_settings"),
                  href: "#general_settings",
                }),
                h(NAnchorLink, {
                  title: t("tables_settings"),
                  href: "#tables_settings",
                }),
                h(NAnchorLink, {
                  title: t("translation_settings"),
                  href: "#translation_settings",
                }),
                h(NAnchorLink, {
                  title: t("email_settings"),
                  href: "#email_settings",
                }),
              ]
            ),
          ]),
        ]
      );
  },
});
