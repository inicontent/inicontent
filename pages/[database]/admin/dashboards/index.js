import {
  NGrid,
  NGi,
  NCard,
  NButton,
  NIcon,
  NModal,
  NForm,
  NSpace,
  NFormItem,
  NInput,
  NH4,
  useMessage,
  NIconWrapper,
} from "naive-ui";
import {
  IconPlus,
  IconDeviceFloppy,
  IconArrowRight,
  IconDatabase,
} from "@tabler/icons-vue";

export default defineNuxtComponent({
  setup: () => {
    definePageMeta({
      middleware: "dashboard",
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["DashboardModal"] = false;

    const database = useState("database"),
      user = useState("user"),
      message = useMessage(),
      Window = useState("Window", () => ({
        width: 0,
      })),
      ShowDashboardModal = ref(false),
      DashboardModalRef = ref(null),
      DashboardModal = ref({});

    const newDashboard = async () => {
      DashboardModalRef.value?.validate(async (errors) => {
        if (!errors) {
          Loading.value["DashboardModal"] = true;
          if (database.value.dashboards)
            database.value.dashboards.push(DashboardModal.value);
          else database.value.dashboards = [DashboardModal.value];
          await useFetch(
            `${useRuntimeConfig().public.apiBase}inicontent/database/${
              database.value.slug
            }`,
            {
              method: "PUT",
              body: {
                dashboards: database.value.dashboards,
              },
            }
          );
          Loading.value["DashboardModal"] = false;
          ShowDashboardModal.value = false;
        } else message.error("The inputs are Invalid");
      });
    };

    useHead({
      title: `${database.value.slug} | Dashboards`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    return () => [
      h(
        NModal,
        {
          show: ShowDashboardModal.value,
          "on-update:show": (v) => (ShowDashboardModal.value = v),
          style: {
            width: Window.value.width > 600 ? "600px" : "100%",
          },
          title: "Create New Dashboard",
          bordered: false,
          preset: "card",
          size: "small",
          segmented: { content: "soft", footer: "soft" },
        },
        {
          footer: () =>
            h(
              NSpace,
              {
                justify: "center",
              },
              () =>
                h(
                  NButton,
                  {
                    loading: Loading.value["DashboardModal"],
                    onClick: newDashboard,
                  },
                  {
                    icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                    default: () => "Create",
                  }
                )
            ),
          default: () =>
            h(
              NForm,
              {
                ref: DashboardModalRef,
                model: DashboardModal.value,
                rules: {
                  name: {
                    required: true,
                    message: "Please give your database a name",
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
                      value: DashboardModal.value.name,
                      onUpdateValue: (v) => (DashboardModal.value.name = v),
                    })
                ),
              ]
            ),
        }
      ),
      h(
        NCard,
        {
          title: "Pick a Dashboard",
          style: {
            background: "none",
          },
          bordered: false,
        },
        {
          "header-extra": () => null,
          default: () =>
            h(
              NGrid,
              {
                xGap: 12,
                yGap: 12,
                cols: "1 600:2 800:4",
              },
              () => [
                ...(database.value.dashboards ?? []).map(({ name }) =>
                  h(NGi, () =>
                    h(
                      NCard,
                      {
                        onClick: () =>
                          navigateTo(
                            `/${route.params.database}/admin/admins/${name}`
                          ),
                        style: {
                          cursor: "pointer",
                        },
                        hoverable: true,
                      },
                      {
                        header: () =>
                          h(
                            NSpace,
                            {
                              align: "center",
                            },
                            () => [
                              h(
                                NIconWrapper,
                                {
                                  size: 28,
                                  borderRadius: 50,
                                },
                                () =>
                                  h(NIcon, () =>
                                    h(
                                      LettersIcons[name.charAt(0)] ??
                                        IconDatabase
                                    )
                                  )
                              ),
                              h(
                                NH4,
                                {
                                  style: {
                                    marginBottom: 0,
                                  },
                                },
                                () => name
                              ),
                            ]
                          ),
                        "header-extra": () =>
                          h(NSpace, () => [
                            h(
                              NButton,
                              {
                                circle: true,
                              },
                              {
                                icon: () => h(NIcon, () => h(IconArrowRight)),
                              }
                            ),
                          ]),
                      }
                    )
                  )
                ),
                h(NGi, () =>
                  h(
                    NCard,
                    {
                      hoverable: true,
                    },
                    {
                      header: () =>
                        h(
                          NH4,
                          {
                            style: {
                              marginBottom: 0,
                            },
                          },
                          () => "Add new"
                        ),
                      "header-extra": () =>
                        h(NSpace, () => [
                          h(
                            NButton,
                            {
                              circle: true,
                              onClick: () => (
                                (DashboardModal.value = {}),
                                (ShowDashboardModal.value = true)
                              ),
                            },
                            {
                              icon: () => h(NIcon, () => h(IconPlus)),
                            }
                          ),
                        ]),
                    }
                  )
                ),
              ]
            ),
        }
      ),
    ];
  },
});
