<template>
  <n-card hoverable style="max-width: 300px">
    <n-tabs :default-value="$route.query.tab ?? 'signin'" size="large" animated>
      <n-tab-pane name="signin" tab="Sign in">
        <n-form
          ref="SigninFormRef"
          :model="SigninForm"
          :rules="SigninRules"
          @submit="SigninSubmit"
        >
          <n-form-item-row label=" Username" path="username">
            <n-input v-model:value="SigninForm.username" />
          </n-form-item-row>
          <n-form-item-row label="Password" path="password">
            <n-input v-model:value="SigninForm.password" type="password" />
          </n-form-item-row>
          <n-button
            attr-type="submit"
            type="primary"
            block
            secondary
            strong
            :loading="Loading['Signin']"
          >
            Sign In
          </n-button>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="Sign up">
        <n-form :model="SignupForm" ref="SignupFormRef" @submit="SignupSubmit">
          <n-scrollbar style="max-height: 320px">
            <RenderFields v-model="SignupForm" :schema="Schema" />
          </n-scrollbar>
          <n-button
            attr-type="submit"
            type="primary"
            block
            secondary
            strong
            :loading="Loading['Signup']"
          >
            Sign up
          </n-button>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NTabs,
  NTabPane,
  NScrollbar,
  NButton,
  NForm,
  NFormItemRow,
  NInput,
  useMessage,
} from "naive-ui";

definePageMeta({
  middleware: "dashboard",
});

const Loading = useState("Loading", () => ({}));
Loading.value["Signin"] = false;
Loading.value["Signup"] = false;

const route = useRoute(),
  database = useState("database"),
  SigninFormRef = ref(null),
  message = useMessage(),
  UserCookie = useCookie("User"),
  User = useState("User"),
  SignupForm = useState(() => ({})),
  SignupFormRef = ref(),
  SigninForm = ref({
    username: "",
    password: "",
  }),
  SigninRules = {
    username: {
      required: true,
      message: "Please input your username",
      trigger: ["input", "blur"],
    },
    password: {
      required: true,
      message: "Please input your password",
      trigger: ["input", "blur"],
    },
  };

const Schema = database.value.tables.find((item) => item.slug === "user")
  ?.schema
  ? database.value.tables.find((item) => item.slug === "user").schema
  : [
      {
        name: "Username",
        key: "l6nmm5sw0dq2lxkezpz",
        type: "text",
        required: true,
      },
      {
        name: "Email",
        key: "l6nmm5sw0dbsq2lxkezpz",
        type: "email",
        required: true,
      },
      {
        name: "Password",
        key: "l6nmm5sxcw0dq2lxkezpz",
        type: "password",
        required: true,
      },
    ];

const SignupSubmit = async (e) => {
  e.preventDefault();
  SignupFormRef.value?.validate(async (errors) => {
    if (!errors) {
      Loading.value["Signup"] = true;
      const { data } = await useFetch(
        `https://api.inicontent.com/${route.params.db_slug}/auth/signup`,
        {
          method: "POST",
          body: SignupForm.value,
          initialCache: false,
        }
      );
      if (data.value.result && data.value.result.id) {
        UserCookie.value = SignupForm.value;
        User.value = data.value.result;
        message.success(data.value.message.en);
        navigateTo(`/${route.params.db_slug}`);
      } else message.error(data.value.message.en);
      Loading.value["Signup"] = false;
    } else message.error("The inputs are Invalid");
  });
};

const SigninSubmit = async (e) => {
  e.preventDefault();
  SigninFormRef.value?.validate(async (errors) => {
    if (!errors) {
      Loading.value["Signin"] = true;
      const { data } = await useFetch(
        `https://api.inicontent.com/${route.params.db_slug}/auth/login`,
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
        navigateTo(`/${route.params.db_slug}`);
      } else message.error(data.value.message.en);
      Loading.value["Signin"] = false;
    } else message.error("The inputs are Invalid");
  });
};
useHead({
  title: `${database.value.name} | Authentication`,
  link: [{ rel: "icon", href: database.value.icon }],
});
</script>
