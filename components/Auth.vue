<template>
    <n-card hoverable style="max-width: 300px">
        <n-tabs ref="tabsInstRef" v-model:value="tabsValue" size="large" justify-content="center" animated>
            <n-tab-pane name="signin" :tab="t('signin')">
                <n-form ref="SigninFormRef" :model="SigninForm" @submit="SigninSubmit">
                    <FieldS v-model="SigninForm" :schema="SigninColumns" />
                    <n-button attr-type="submit" type="primary" block secondary strong :loading="Loading.Signin">
                        {{ t("signin") }}
                    </n-button>
                </n-form>
            </n-tab-pane>
            <n-tab-pane name="signup" :tab="t('signup')">
                <n-form ref="SignupFormRef" :model="SignupForm" @submit="SignupSubmit">
                    <FieldS v-model="SignupForm" :schema="SignupColumns" />
                    <n-button attr-type="submit" type="primary" block secondary strong :loading="Loading.Signup">
                        {{ t("signup") }}
                    </n-button>
                </n-form>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>

<script lang="ts" setup>
import {
	type FormInst,
	NButton,
	NCard,
	NForm,
	NTabPane,
	NTabs,
	type TabsInst,
} from "naive-ui";

defineTranslation({
	ar: {
		signin: "تسجيل الدخول",
		signup: "إنشاء حساب",
	},
});
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

const SigninFormRef = ref<FormInst | null>(null),
	route = useRoute(),
	tabsInstRef = ref<TabsInst | null>(null),
	tabsValue = ref((route.query.tab as string) ?? "signin"), // Default tab
	database = useState<Database>("database"),
	user = useState<User>("users"),
	SignupForm = useState(() => ({})),
	SignupFormRef = ref<FormInst | null>(null),
	SigninForm = ref({
		username: "",
		password: "",
	}),
	SigninColumns: Schema = [
		{
			key: "username",
			type: "string",
			required: true,
		},
		{
			key: "password",
			type: "password",
			required: true,
		},
	],
	SignupColumns: Schema = database.value?.tables
		?.find((item) => item.slug === "users")
		?.schema?.filter(
			(field) =>
				!["id", "createdAt", "createdBy", "updatedAt", "role"].includes(
					field.key,
				),
		) ?? [
		{
			key: "username",
			type: "string",
			required: true,
		},
		{
			key: "email",
			type: "email",
			required: true,
		},
		{
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
			if (Loading.value.Signup !== true) {
				Loading.value.Signup = true;
				const data = await $fetch<Record<string, any>>(
					`${appConfig.apiBase}${database.value.slug}/user`,
					{
						method: "POST",
						body: bodyContent,
					},
				);
				if (data.result) {
					window.$message.success(data.message);
					tabsValue.value = "signin";
					tabsInstRef.value?.syncBarPosition();
				} else window.$message.error(data.message);
				Loading.value.Signup = false;
			}
		} else window.$message.error(t("inputsAreInvalid"));
	});
};
const SigninSubmit = async (e: Event) => {
	e.preventDefault();
	SigninFormRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = JSON.parse(JSON.stringify(SigninForm.value));
			if (Loading.value.Signin !== true) {
				Loading.value.Signin = true;
				const data = await $fetch<Record<string, any>>(
					`${appConfig.apiBase}${database.value.slug}/auth/signin`,
					{
						method: "PUT",
						body: bodyContent,
					},
				);
				if (data.result?.id) {
					window.$message.success(data.message);
					user.value = data.result;
					database.value = (
						await $fetch<any>(
							`${appConfig.apiBase}inicontent/databases/${database.value.slug}`,
						)
					).result;
					await navigateTo(
						route.params.database
							? `/${route.params.database}/admin`
							: "/admin",
					);
				} else window.$message.error(data.message);
				Loading.value.Signin = false;
			}
		} else window.$message.error(t("inputsAreInvalid"));
	});
};
useHead({
	title: `${t(database.value.slug)} | ${t("authentication")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>
