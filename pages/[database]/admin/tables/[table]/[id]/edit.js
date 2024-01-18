import {
  NCard,
  NIcon,
  NButton,
  NSpace,
  NEllipsis,
  NPopover,
  NPopconfirm,
  NForm,
  useMessage,
} from "naive-ui";
import {
  IconDeviceFloppy,
  IconSend,
  IconTrash,
  IconEye,
} from "@tabler/icons-vue";

import { LazyRenderFields } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    useLanguage({
      ar: {
        view: "مُعاينة",
        update: "حِفظ",
        publish: "نشر",
        delete: "حذف",
        move_to_trash: "نقل لسلة المهملات",
        confirm_delete: "هل انت متأكد؟",
        confirm_delete_permanently: "حذف بصفة نهائية?",
      },
      en: {
        view: "View",
        update: "Update",
        publish: "Publish",
        delete: "Delete",
        move_to_trash: "Move to trash",
        confirm_delete: "Are you sure?",
        confirm_delete_permanently: "Delete Permanently?",
      },
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["UPDATE"] = false;
    Loading.value["DELETE"] = false;
    Loading.value["EDITOR"] = false;

    const route = useRoute(),
      database = useState("database"),
      schema = database.value.tables
        .find((item) => item.slug === route.params.table)
        .schema.filter(
          ({ key }) => !["id", "createdAt", "updatedAt"].includes(key)
        ),
      message = useMessage(),
      { data: single } = await useFetch(
        `${useRuntimeConfig().public.apiBase}${route.params.database}/${
          route.params.table
        }/${route.params.id}`,
        {
          transform: (res) => {
            if (!res.result || !res.result.id) {
              message.error("Item not found");
              setTimeout(
                () =>
                  navigateTo(
                    `/${route.params.database}/admin/tables/${route.params.table}/new`
                  ),
                1000
              );
            }
            return res.result ?? {};
          },
        }
      ),
      formRef = ref(),
      UPDATE = async (publish = false) => {
        formRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["UPDATE"] = true;
            const { deletedAt, ...withoutDeleted } = single.value;
            const { data } = await useFetch(
              `${useRuntimeConfig().public.apiBase}${route.params.database}/${
                route.params.table
              }/${route.params.id}`,
              {
                method: "PUT",
                body:
                  single.value.deletedAt && publish
                    ? withoutDeleted
                    : single.value,
              }
            );
            if (data.value.result && data.value.result.id) {
              single.value = data.value.result;
              message.success(data.value.message.en);
            } else message.error(data.value.message.en);
            Loading.value["UPDATE"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      DELETE = async () => {
        Loading.value["DELETE"] = true;
        const { data } = await useFetch(
          `${useRuntimeConfig().public.apiBase}${route.params.database}/${
            route.params.table
          }/${route.params.id}`,
          {
            method: "DELETE",
          }
        );
        if (data.value.code === 204) {
          message.success(data.value.message.en);
          Loading.value["DELETE"] = false;
          if (single.value.deletedAt)
            return navigateTo(
              `/${route.params.database}/admin/tables/${route.params.table}`
            );
          else single.value = data.value.result;
        } else message.error(data.value.message.en);
        Loading.value["DELETE"] = false;
      };

    useHead({
      title: `${database.value.slug} | ${t(route.params.table)} ${t(
        "table"
      )} : ${route.params.id}`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    return () =>
      h(
        NCard,
        {
          title: "Edit item",
          style: "height: fit-content",
          onKeyup: (e) =>
            e.preventDefault() && e.code === "s" && (e.ctrlKey || e.metaKey)
              ? UPDATE()
              : null,
        },
        {
          header: () =>
            h(NEllipsis, () => `${t(route.params.table)} #${single.value.id}`),
          "header-extra": () =>
            schema.length > 4
              ? h(NSpace, {}, () => [
                  h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            tag: "a",
                            href: `/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}`,
                            onClick: (e) => (
                              e.preventDefault(),
                              navigateTo(
                                `/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}`
                              )
                            ),
                            circle: true,
                            secondary: true,
                          },
                          {
                            icon: () => h(NIcon, () => h(IconEye)),
                          }
                        ),
                      default: () => t("view"),
                    }
                  ),
                  h(
                    NPopconfirm,
                    { onPositiveClick: DELETE },
                    {
                      trigger: () =>
                        h(
                          NPopover,
                          {},
                          {
                            trigger: () =>
                              h(
                                NButton,
                                {
                                  secondary: true,
                                  circle: true,
                                  type: "error",
                                  loading: Loading.value["DELETE"],
                                },
                                {
                                  icon: () => h(NIcon, () => h(IconTrash)),
                                }
                              ),
                            default: () =>
                              single.value.deletedAt
                                ? t("delete")
                                : t("move_to_trash"),
                          }
                        ),
                      default: () =>
                        single.value.deletedAt
                          ? t("confirm_delete_permanently")
                          : t("confirm_delete"),
                    }
                  ),
                  h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            secondary: true,
                            circle: true,
                            type: single.value.deletedAt ? "info" : "primary",
                            onClick: UPDATE,
                            loading: Loading.value["UPDATE"],
                          },
                          {
                            icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                          }
                        ),
                      default: () => t("update"),
                    }
                  ),
                  single.value.deletedAt
                    ? h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(
                              NButton,
                              {
                                secondary: true,
                                circle: true,
                                type: "primary",
                                onClick: () => UPDATE(true),
                                loading: Loading.value["UPDATE"],
                              },
                              {
                                icon: () => h(NIcon, () => h(IconSend)),
                              }
                            ),
                          default: () => t("publish"),
                        }
                      )
                    : null,
                ])
              : null,
          action: () =>
            h(NSpace, { justify: "end" }, () => [
              h(
                NPopconfirm,
                { onPositiveClick: DELETE },
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        round: true,
                        secondary: true,
                        type: "error",
                        loading: Loading.value["DELETE"],
                      },
                      {
                        icon: () => h(NIcon, () => h(IconTrash)),
                        default: () =>
                          single.value.deletedAt
                            ? t("delete")
                            : t("move_to_trash"),
                      }
                    ),
                  default: () =>
                    single.value.deletedAt
                      ? t("confirm_delete_permanently")
                      : t("confirm_delete"),
                }
              ),
              h(
                NButton,
                {
                  round: true,
                  secondary: true,
                  type: single.value.deletedAt ? "info" : "primary",
                  onClick: UPDATE,
                  loading: Loading.value["UPDATE"],
                },
                {
                  icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                  default: () => t("update"),
                }
              ),
              single.value.deletedAt
                ? h(
                    NButton,
                    {
                      round: true,
                      secondary: true,
                      type: "primary",
                      onClick: () => UPDATE(true),
                      loading: Loading.value["UPDATE"],
                    },
                    {
                      icon: () => h(NIcon, () => h(IconSend)),
                      default: () => t("publish"),
                    }
                  )
                : null,
            ]),
          default: () =>
            h(
              NForm,
              {
                model: single.value,
                ref: formRef,
              },
              () =>
                h(LazyRenderFields, {
                  modelValue: single.value,
                  schema: schema,
                })
            ),
        }
      );
  },
});
