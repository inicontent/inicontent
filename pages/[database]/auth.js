import {
  NCard,
  NForm,
  NTabPane,
  NTabs,
  NButton,
  NScrollbar,
  useMessage,
} from "naive-ui";
import { LazyRenderFields } from "#components";

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
      user = useState("user"),
      SigninFormRef = ref(null),
      SigninForm = ref({
        username: "",
        password: "",
      }),
      SignupFormRef = ref(),
      SignupForm = useState(() => ({})),
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
      SignupColumns = database.value.tables?.find(
        (item) => item.slug === "user"
      )?.schema
        ? database.value.tables?.find((item) => item.slug === "user").schema
        : [
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

    const SignupSubmit = async (e) => {
      e.preventDefault();
      SignupFormRef.value?.validate(async (errors) => {
        if (!errors) {
          if (Loading.value["Signup"] !== true) {
            Loading.value["Signup"] = true;
            // if (UserCookie.value && UserCookie.value.subscriptionID) {
            const { data } = await useFetch(
              `/api/${database.value.slug}/auth/signup`,
              {
                method: "POST",
                body: SignupForm.value,
              }
            );
            if (data.value.result && data.value.result.id) {
              user.value = data.value.result;
              message.success(data.value.message.en);
              navigateTo(`/${database.value.slug}/admin`);
            } else message.error(data.value.message.en);
            Loading.value["Signup"] = false;
            // } else {
            //   message.error("Please pick a plan first");
            //   navigateTo("/");
            // }
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
              `/api/${database.value.slug}/auth/signin`,
              {
                method: "PUT",
                body: SigninForm.value,
              }
            );
            if (data.value.result && data.value.result.id) {
              user.value = data.value.result;
              message.success(data.value.message.en);
              navigateTo(`/${database.value.slug}/admin`);
            } else message.error(data.value.message.en);
            Loading.value["Signin"] = false;
          }
        } else message.error("The inputs are Invalid");
      });
    };
    useHead({
      title: `${database.value.slug} | Authentication`,
      link: [{ rel: "icon", href: database.value?.icon }],
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
                      ref: SignupFormRef,
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
