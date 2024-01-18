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
import type { Database, apiResponse } from "~/types";

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
      DisabledItem = useState<Record<string | number, boolean>>(() => ({})),
      Window = useState("Window", () => ({
        width: 0,
      })),
      { data: databases } = await useFetch<apiResponse<Database[]>>(
        `${useRuntimeConfig().public.apiBase}inicontent/database`
      ),
      ShowDatabaseModal = ref(false),
      DatabaseRef = ref<FormInst | null>(null),
      DatabaseModal = ref<Database>(),
      DatabaseSave = async () => {
        DatabaseRef.value?.validate(async (errors: any) => {
          if (!errors) {
            Loading.value["Database"] = true;
            const { data } = await useFetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}inicontent/database${
                DatabaseModal.value?.id ? `/${DatabaseModal.value.slug}` : ""
              }`,
              {
                method: DatabaseModal.value?.id ? "PUT" : "POST",
                body: DatabaseModal.value,
              }
            );
            if (!data.value) return message.error(t("error"));

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
                  (DatabaseModal.value = {}), (ShowDatabaseModal.value = true)
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
                            required: false,
                          },
                          {
                            id: 4,
                            key: "languages",
                            type: "array",
                            subType: "select",
                            children: "string",
                            values: Languages,
                            single: false,
                            required: false,
                          },
                          {
                            id: 5,
                            key: "roles",
                            type: "array",
                            subType: "tags",
                            children: "string",
                            disabledItems: [0, 1, 2],
                            defaultValue: ["admin", "user", "guest"],
                            required: false,
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
                        onClick: DatabaseSave,
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
            databases.value &&
            databases.value.result &&
            databases.value.result.length
              ? h(
                  NCollapse,
                  {
                    defaultExpandedNames: t(databases.value.result[0]?.slug),
                    accordion: true,
                  },
                  () =>
                    databases.value?.result?.map((database, index) =>
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
                                    databases.value?.result
                                      ? ((DisabledItem.value[index] = true),
                                        setTimeout(
                                          () =>
                                            (DisabledItem.value[index] = false),
                                          1
                                        ),
                                        (DatabaseModal.value = JSON.parse(
                                          JSON.stringify(
                                            databases.value.result[index]
                                          )
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
