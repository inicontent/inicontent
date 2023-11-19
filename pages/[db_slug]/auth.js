import {
  NCard,
  NForm,
  NTabPane,
  NTabs,
  NButton,
  NScrollbar,
  useMessage,
} from "naive-ui";
import { RenderFields } from "#components";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        signin: "تسجيل الدخول",
        signup: "إنشاء حساب",
      },
      en: {
        signin: "Sign in",
        signup: "Sign up",
      },
    });

    const Loading = useState("Loading", () => ({}));
    Loading.value["Signin"] = false;
    Loading.value["Signup"] = false;

    const route = useRoute(),
      message = useMessage(),
      database = useState("database"),
      UserCookie = useCookie("User"),
      User = useState("User"),
      SigninFormRef = ref(null),
      SigninForm = ref({
        username: "",
        password: "",
      }),
      SignupFormRef = ref(),
      SignupForm = useState(() => ({})),
      SigninSchema = [
        {
          name: "Username",
          type: "text",
          required: true,
        },
        {
          name: "Password",
          type: "password",
          required: true,
        },
      ],
      SignupSchema = database.value.tables.find((item) => item.slug === "user")
        ?.schema
        ? database.value.tables.find((item) => item.slug === "user").schema
        : [
            {
              name: "Username",
              type: "text",
              required: true,
            },
            {
              name: "Email",
              type: "email",
              required: true,
            },
            {
              name: "Password",
              type: "password",
              required: true,
            },
          ];

    const SignupSubmit = async (e) => {
      e.preventDefault();
      SignupFormRef.value?.validate(async (errors) => {
        if (!errors) {
          if (Loading.value["Signup"] !== true) {
            Loading.value["Signup"] = true;
            if (UserCookie.value && UserCookie.value.subscriptionID) {
              const { data } = await useFetch(
                `https://api.inicontent.com/${database.value.slug}/auth/signup`,
                {
                  method: "POST",
                  body: SignupForm.value,
                  initialCache: false,
                }
              );
              if (data.value.result && data.value.result.id) {
                UserCookie.value = SigninForm.value;
                User.value = data.value.result;
                message.success(data.value.message.en);
                navigateTo(`/${database.value.slug}`);
              } else message.error(data.value.message.en);
              Loading.value["Signup"] = false;
            } else {
              message.error("Please pick a plan first");
              navigateTo("/");
            }
          }
        } else message.error("The inputs are Invalid");
      });
    };
    const SigninSubmit = async (e) => {
      e.preventDefault();
      SigninFormRef.value?.validate(async (errors) => {
        if (!errors) {
          if (Loading.value["Signin"] !== true) {
            Loading.value["Signin"] = true;
            const { data } = await useFetch(
              `https://api.inicontent.com/${database.value.slug}/auth/login`,
              {
                method: "POST",
                body: SigninForm.value,
                initialCache: false,
              }
            );
            if (data.value.result && data.value.result.id) {
              UserCookie.value = SigninForm.value;
              User.value = data.value.result;
              message.success(data.value.message.en);
              navigateTo(`/${database.value.slug}`);
            } else message.error(data.value.message.en);
            Loading.value["Signin"] = false;
          }
        } else message.error("The inputs are Invalid");
      });
    };
    useHead({
      title: `${database.value.name} | Authentication`,
      link: [{ rel: "icon", href: database.value.icon }],
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
              defaultValue: route.query.tab ?? "signin",
              size: "large",
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
                      ref: SigninFormRef,
                      model: SigninForm.value,
                      onSubmit: SigninSubmit,
                    },
                    () => [
                      h(RenderFields, {
                        modelValue: SigninForm.value,
                        "onUpdate:modelValue": (v) => (SigninForm.value = v),
                        schema: SigninSchema,
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
                      ref: SignupFormRef,
                      model: SignupForm.value,
                      onSubmit: SignupSubmit,
                    },
                    () => [
                      h(NScrollbar, { style: { maxHeight: "320px" } }, () =>
                        h(RenderFields, {
                          modelValue: SignupForm.value,
                          "onUpdate:modelValue": (v) => (SignupForm.value = v),
                          schema: SignupSchema,
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
