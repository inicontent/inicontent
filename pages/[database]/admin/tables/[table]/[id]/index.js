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
import { LazyRenderDatas } from "#components";
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
      schema = database.value.tables.find(
        ({ slug }) => slug === route.params.table
      ).schema,
      message = useMessage(),
      { data: single } = await useFetch(
        `/api/${route.params.database}/${route.params.table}/${route.params.id}`,
        {
          transform: (res) => {
            if (!res.result || !res.result.id) {
              message.error("Item not found");
              setTimeout(
                () =>
                  navigateTo(
                    `/${route.params.database}/admin/tables/${route.params.table}`
                  ),
                1000
              );
            }
            return res.result ?? {};
          },
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
      title: `${database.value.slug} | ${t(
        database.value.tables.find(({ slug }) => slug === route.params.table)
          ?.slug ?? "--"
      )} Table : ${route.params.id}`,
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
                    ({ slug }) => slug === route.params.table
                  )?.slug ?? "--"
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
                NPopover,
                {},
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        tag: "a",
                        href: `/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}/edit`,
                        onClick: (e) => (
                          e.preventDefault(),
                          navigateTo(
                            `/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}/edit`
                          )
                        ),
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
            h(LazyRenderDatas, {
              modelValue: single.value,
              schema: schema,
            }),
        }
      );
  },
});
