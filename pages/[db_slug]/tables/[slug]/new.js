import {
  NCard,
  NIcon,
  NButton,
  NSpace,
  NEllipsis,
  NPopover,
  NForm,
  useMessage,
} from "naive-ui";
import { Send } from "@vicons/tabler";
import { Buffer } from "buffer";
import { RenderFields } from "#components";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    useLanguage({
      ar: {
        new: "جديد",
        publish: "نشر",
      },
      en: {
        new: "New",
        publish: "Publish",
      },
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["CREATE"] = false;

    const route = useRoute(),
      database = useState("database"),
      Schema = database.value.tables.find(
        (item) => item.slug === route.params.slug
      ).schema,
      User = useState("User"),
      message = useMessage(),
      single = ref({}),
      formRef = ref(),
      CREATE = async () => {
        formRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["CREATE"] = true;
            const { data } = await useFetch(
              `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}`,
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Buffer.from(
                      `${User.value.username}:${User.value.password}`
                    ).toString("base64"),
                },
                method: "POST",
                body: single.value,
                initialCache: false,
                transform: (res) => {
                  if (res.result) res.result = [].concat(res.result)[0];
                  return res;
                },
              }
            );
            if (data.value.result && data.value.result.id) {
              message.success(data.value.message.en);
              Loading.value["CREATE"] = false;
              return navigateTo(
                `/${route.params.db_slug}/tables/${route.params.slug}/${data.value.result.id}`
              );
            } else message.error(data.value.message.en);
            Loading.value["CREATE"] = false;
          } else message.error("The inputs are Invalid");
        });
      };

    useHead({
      title: `${database.value.name} | ${t("new")} ${
        database.value.tables.find((item) => item.slug === route.params.slug)
          .name
      }`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    return () =>
      h(
        NCard,
        {
          title: `${t("new")} item`,
          style: "height: fit-content",
          onKeyup: (e) =>
            e.preventDefault() && e.code === "s" && (e.ctrlKey || e.metaKey)
              ? CREATE()
              : null,
        },
        {
          header: () =>
            h(
              NEllipsis,
              () =>
                `${t("new")} ${
                  database.value.tables.find(
                    (item) => item.slug === route.params.slug
                  ).name
                }`
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
                        secondary: true,
                        circle: true,
                        type: "primary",
                        onClick: CREATE,
                        loading: Loading.value["CREATE"],
                      },
                      {
                        icon: () => h(NIcon, () => h(Send)),
                      }
                    ),
                  default: () => t("publish"),
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
                  onClick: CREATE,
                  loading: Loading.value["CREATE"],
                },
                {
                  icon: () => h(NIcon, () => h(Send)),
                  default: () => t("publish"),
                }
              ),
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
