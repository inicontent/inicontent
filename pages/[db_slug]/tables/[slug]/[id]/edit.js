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
import { DeviceFloppy, Send, Trash, Eye } from "@vicons/tabler";
import { Buffer } from "buffer";
import { NuxtLink, RenderFields } from "#components";

export default defineComponent({
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
      Schema = database.value.tables.find(
        (item) => item.slug === route.params.slug
      ).schema,
      User = useState("User"),
      message = useMessage(),
      { data: single } = await useFetch(
        `https://api.inicontent.com/${route.params.db_slug}/${
          route.params.slug
        }/${route.params.id}?_options[show_deleted]=true${
          Schema
            ? "&_options[columns]=" +
              JSON.stringify(
                Schema.map((item) => GetPathes(item)).flat(Infinity)
              )
            : ""
        }`,
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                `${User.value.username}:${User.value.password}`
              ).toString("base64"),
          },
          transform: (res) => {
            if (!res.result || !res.result.id) {
              message.error("Item not found");
              setTimeout(
                () =>
                  navigateTo(
                    `/${route.params.db_slug}/tables/${route.params.slug}`
                  ),
                1000
              );
            }
            return res.result ?? {};
          },
          initialCache: false,
        }
      ),
      formRef = ref(),
      UPDATE = async (publish = false) => {
        formRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["UPDATE"] = true;
            const { deleted_at, ...withoutDeleted } = single.value;
            const { data } = await useFetch(
              `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}/${route.params.id}!`,
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Buffer.from(
                      `${User.value.username}:${User.value.password}`
                    ).toString("base64"),
                },
                method: "PUT",
                body:
                  single.value.deleted_at && publish
                    ? withoutDeleted
                    : single.value,
                initialCache: false,
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
          `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}/${route.params.id}`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            method: "DELETE",
            initialCache: false,
          }
        );
        if (data.value.code === 204) {
          message.success(data.value.message.en);
          Loading.value["DELETE"] = false;
          if (single.value.deleted_at)
            return navigateTo(
              `/${route.params.db_slug}/tables/${route.params.slug}`
            );
          else single.value = data.value.result;
        } else message.error(data.value.message.en);
        Loading.value["DELETE"] = false;
      };

    useHead({
      title: `${database.value.name} | ${
        database.value.tables.find((item) => item.slug === route.params.slug)
          .name
      } Table : ${route.params.id}`,
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
            h(
              NEllipsis,
              () =>
                `${
                  database.value.tables.find(
                    (item) => item.slug === route.params.slug
                  ).name
                } #${single.value.id}`
            ),
          "header-extra": () =>
            h(NSpace, {}, () => [
              h(
                NuxtLink,
                {
                  to: `/${route.params.db_slug}/tables/${route.params.slug}/${route.params.id}`,
                },
                () =>
                  h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                          },
                          {
                            icon: () => h(NIcon, () => h(Eye)),
                          }
                        ),
                      default: () => t("view"),
                    }
                  )
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
                              icon: () => h(NIcon, () => h(Trash)),
                            }
                          ),
                        default: () =>
                          single.value.deleted_at
                            ? t("delete")
                            : t("move_to_trash"),
                      }
                    ),
                  default: () =>
                    single.value.deleted_at
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
                        type: single.value.deleted_at ? "info" : "primary",
                        onClick: UPDATE,
                        loading: Loading.value["UPDATE"],
                      },
                      {
                        icon: () => h(NIcon, () => h(DeviceFloppy)),
                      }
                    ),
                  default: () => t("update"),
                }
              ),
              single.value.deleted_at
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
                            icon: () => h(NIcon, () => h(Send)),
                          }
                        ),
                      default: () => t("publish"),
                    }
                  )
                : null,
            ]),
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
                        icon: () => h(NIcon, () => h(Trash)),
                        default: () =>
                          single.value.deleted_at
                            ? t("delete")
                            : t("move_to_trash"),
                      }
                    ),
                  default: () =>
                    single.value.deleted_at
                      ? t("confirm_delete_permanently")
                      : t("confirm_delete"),
                }
              ),
              h(
                NButton,
                {
                  round: true,
                  secondary: true,
                  type: single.value.deleted_at ? "info" : "primary",
                  onClick: UPDATE,
                  loading: Loading.value["UPDATE"],
                },
                {
                  icon: () => h(NIcon, () => h(DeviceFloppy)),
                  default: () => t("update"),
                }
              ),
              single.value.deleted_at
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
                      icon: () => h(NIcon, () => h(Send)),
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
                h(RenderFields, {
                  modelValue: single.value,
                  "onUpdate:modelValue": (v) => (single.value = v),
                  schema: Schema,
                })
            ),
        }
      );
  },
});
