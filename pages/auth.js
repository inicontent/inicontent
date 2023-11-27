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

    const SigninFormRef = ref(null),
      route = useRoute(),
      message = useMessage(),
      database = useState("database"),
      user = useState("user"),
      SignupForm = useState(() => ({})),
      SignupFormRef = ref(),
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
<<<<<<< HEAD
          id: 2,
          key: "password",
=======
          name: "Password",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
          type: "password",
          required: true,
        },
      ],
<<<<<<< HEAD
      SignupColumns = database.value.tables.find((item) => item.slug === "user")
=======
      SignupSchema = database.value.tables.find((item) => item.slug === "user")
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
        ?.schema
        ? database.value.tables.find((item) => item.slug === "user").schema
        : [
            {
<<<<<<< HEAD
              id: 1,
              key: "username",
=======
              name: "Username",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
              type: "text",
              required: true,
            },
            {
<<<<<<< HEAD
              id: 2,
              key: "email",
=======
              name: "Email",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
              type: "email",
              required: true,
            },
            {
<<<<<<< HEAD
              id: 3,
              key: "password",
=======
              name: "Password",
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
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
<<<<<<< HEAD
            // if (UserCookie.value && UserCookie.value.subscriptionID) {
            const { data } = await useFetch(`/api/inicontent/auth/signup`, {
              method: "POST",
              body: SignupForm.value,
            });
            if (data.value.result && data.value.result.id) {
              user.value = data.value.result;
              message.success(data.value.message.en);
              navigateTo(`/admin`);
            } else message.error(data.value.message.en);
            Loading.value["Signup"] = false;
            // } else {
            //   message.error("Please pick a plan first");
            //   navigateTo("/");
            // }
=======
            if (UserCookie.value && UserCookie.value.subscriptionID) {
              const { data } = await useFetch(
                `https://api.inicontent.com/inicontent/auth/signup`,
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
                navigateTo(`/dashboard`);
              } else message.error(data.value.message.en);
              Loading.value["Signup"] = false;
            } else {
              message.error("Please pick a plan first");
              navigateTo("/");
            }
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
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
<<<<<<< HEAD
            const { data } = await useFetch(`/api/inicontent/auth/signin`, {
              method: "PUT",
              body: SigninForm.value,
            });
            if (data.value.result && data.value.result.id) {
              user.value = data.value.result;
              message.success(data.value.message.en);
              navigateTo(`/admin`);
=======
            const { data } = await useFetch(
              `https://api.inicontent.com/inicontent/auth/login`,
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
              navigateTo(`/dashboard`);
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
            } else message.error(data.value.message.en);
            Loading.value["Signin"] = false;
          }
        } else message.error("The inputs are Invalid");
      });
    };
    useHead({
<<<<<<< HEAD
      title: `${database.value.slug} | Authentication`,
=======
      title: `${database.value.name} | Authentication`,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
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
<<<<<<< HEAD
                      h(LazyRenderFields, {
                        modelValue: SigninForm.value,
                        schema: SigninColumns,
=======
                      h(RenderFields, {
                        modelValue: SigninForm.value,
                        "onUpdate:modelValue": (v) => (SigninForm.value = v),
                        schema: SigninSchema,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
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
<<<<<<< HEAD
                        h(LazyRenderFields, {
                          modelValue: SignupForm.value,
                          schema: SignupColumns,
=======
                        h(RenderFields, {
                          modelValue: SignupForm.value,
                          "onUpdate:modelValue": (v) => (SignupForm.value = v),
                          schema: SignupSchema,
>>>>>>> dc24e3800be1aa37e1af6a18a2902f9a0aaa83d2
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
