import {
  NCard,
  NIcon,
  NButton,
  NSpace,
  NEllipsis,
  NPopover,
  useMessage,
} from "naive-ui";
import { Printer, Pencil, Settings } from "@vicons/tabler";
import { Buffer } from "buffer";
import { NuxtLink, RenderData } from "#components";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    useLanguage({
      ar: {
        print: "طباعة",
        edit: "تعديل",
      },
      en: {
        print: "Print",
        edit: "Edit",
      },
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["PRINT"] = false;

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
      PRINT = () => {
        {
          Loading.value["PRINT"] = true;
          window.print();
          Loading.value["PRINT"] = false;
          return true;
        }
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
          title: "View item",
          style: "height: fit-content",
          onKeyup: (e) =>
            e.preventDefault() && e.code === "e" && (e.ctrlKey || e.metaKey)
              ? PRINT()
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
                NPopover,
                {},
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        disabled: true,
                        circle: true,
                        secondary: true,
                      },
                      {
                        icon: () => h(NIcon, () => h(Settings)),
                      }
                    ),
                  default: () => t("settings"),
                }
              ),
              h(
                NuxtLink,
                {
                  to: `${route.params.id}/edit`,
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
                            type: "info",
                          },
                          {
                            icon: () => h(NIcon, () => h(Pencil)),
                          }
                        ),
                      default: () => t("edit"),
                    }
                  )
              ),
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
                        type: "primary",
                        onClick: PRINT,
                        loading: Loading.value["PRINT"],
                      },
                      {
                        icon: () => h(NIcon, () => h(Printer)),
                      }
                    ),
                  default: () => t("print"),
                }
              ),
            ]),
          action: () =>
            h(NSpace, { justify: "end" }, () => [
              h(
                NButton,
                {
                  round: true,
                  secondary: true,
                  type: "primary",
                  onClick: PRINT,
                  loading: Loading.value["PRINT"],
                },
                {
                  icon: () => h(NIcon, () => h(Printer)),
                  default: () => t("print"),
                }
              ),
            ]),
          default: () =>
            h(RenderData, {
              modelValue: single.value,
              schema: Schema,
            }),
        }
      );
  },
});
