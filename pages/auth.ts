import {
  NCard,
  NForm,
  NTabPane,
  NTabs,
  NButton,
  NScrollbar,
  useMessage,
  type FormInst,
  type TabsInst,
} from "naive-ui";
import { LazyRenderFields } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        signin: "تسجيل الدخول",
        signup: "إنشاء حساب",
      },
      en: {},
    });

    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["Signin"] = false;
    Loading.value["Signup"] = false;

    const SigninFormRef = ref<FormInst | null>(null),
      route = useRoute(),
      message = useMessage(),
      tabsInstRef = ref<TabsInst | null>(null),
      tabsValue = ref<string>((route.query.tab as string) ?? "signin"), // Default tab
      database = useState<Database>("database"),
      user = useState<User>("user"),
      SignupForm = useState(() => ({})),
      SignupFormRef = ref<FormInst | null>(null),
      SigninForm = ref({
        username: "",
        password: "",
      }),
      SigninColumns = [
        {
          id: 1,
          key: "username",
          type: "text",
          required: true,
        },
        {
          id: 2,
          key: "password",
          type: "password",
          required: true,
        },
      ],
      SignupColumns = database.value?.tables
        ?.find((item) => item.slug === "user")
        ?.schema?.filter(
          (field) =>
            !["id", "createdAt", "updatedAt", "role"].includes(field.key)
        ) ?? [
        {
          id: 1,
          key: "username",
          type: "text",
          required: true,
        },
        {
          id: 2,
          key: "email",
          type: "email",
          required: true,
        },
        {
          id: 3,
          key: "password",
          type: "password",
          required: true,
        },
      ];

    const SignupSubmit = async (e: Event) => {
      e.preventDefault();
      SignupFormRef.value?.validate(async (errors) => {
        if (!errors) {
          const bodyContent = JSON.parse(JSON.stringify(SignupForm.value));
          if (Loading.value["Signup"] !== true) {
            Loading.value["Signup"] = true;
            const data = await $fetch<Record<string, any>>(
              `${useRuntimeConfig().public.apiBase}${database.value.slug}/user`,
              {
                method: "POST",
                body: bodyContent,
              }
            );
            if (data.result) {
              message.success(data.message);
              tabsValue.value = "signin";
              tabsInstRef.value?.syncBarPosition();
            } else message.error(data.message);
            Loading.value["Signup"] = false;
          }
        } else message.error("The inputs are Invalid");
      });
    };
    const SigninSubmit = async (e: Event) => {
      e.preventDefault();
      SigninFormRef.value?.validate(async (errors) => {
        if (!errors) {
          const bodyContent = JSON.parse(JSON.stringify(SigninForm.value));
          if (Loading.value["Signin"] !== true) {
            Loading.value["Signin"] = true;
            const { data } = await useFetch<Record<string, any>>(
              `${useRuntimeConfig().public.apiBase}${
                database.value.slug
              }/auth/signin`,
              {
                method: "PUT",
                body: bodyContent,
              }
            );
            if (data.value?.result && data.value?.result.id) {
              message.success(data.value.message);
              user.value = data.value.result;
              // clearNuxtState("database");
              navigateTo(`/${database.value.slug}/admin`);
            } else message.error(data.value?.message);
            Loading.value["Signin"] = false;
          }
        } else message.error("The inputs are Invalid");
      });
    };
    useHead({
      title: t("authentication"),
      link: [{ rel: "icon", href: database.value?.icon ?? "" }],
    });

    return () =>
      h(
        NCard,
        {
          hoverable: true,
          style: {
            maxWidth: "300px",
          },
        },
        () =>
          h(
            NTabs,
            {
              ref: tabsInstRef as any,
              value: tabsValue.value,
              onUpdateValue: (v: string) => (tabsValue.value = v),
              size: "large",
              justifyContent: "center",
              trigger: "hover",
              animated: true,
            },
            () => [
              h(
                NTabPane,
                {
                  name: "signin",
                  tab: t("signin"),
                },
                () => [
                  h(
                    NForm,
                    {
                      ref: SigninFormRef as any,
                      model: SigninForm.value,
                      onSubmit: SigninSubmit,
                    },
                    () => [
                      h(LazyRenderFields, {
                        modelValue: SigninForm.value,
                        schema: SigninColumns,
                      }),
                      h(
                        NButton,
                        {
                          attrType: "submit",
                          type: "primary",
                          block: true,
                          secondary: true,
                          strong: true,
                          loading: Loading.value["Signin"],
                        },
                        () => t("signin")
                      ),
                    ]
                  ),
                ]
              ),
              h(
                NTabPane,
                {
                  name: "signup",
                  tab: t("signup"),
                },
                () => [
                  h(
                    NForm,
                    {
                      ref: SignupFormRef as any,
                      model: SignupForm.value,
                      onSubmit: SignupSubmit,
                    },
                    () => [
                      h(NScrollbar, { style: { maxHeight: "320px" } }, () =>
                        h(LazyRenderFields, {
                          modelValue: SignupForm.value,
                          schema: SignupColumns,
                        })
                      ),
                      h(
                        NButton,
                        {
                          attrType: "submit",
                          type: "primary",
                          block: true,
                          secondary: true,
                          strong: true,
                          loading: Loading.value["Signup"],
                        },
                        () => t("signup")
                      ),
                    ]
                  ),
                ]
              ),
            ]
          )
      );
  },
});
