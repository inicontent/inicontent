<template>
	<div style="min-height: 100vh; display: grid; place-items: center; padding: 24px;">
		<NCard :title="t('resetPassword')" style="width: min(420px, 100%);" hoverable>
			<NAlert v-if="!token" type="error" :title="t('invalidResetLink')" />
			<NForm v-else ref="formRef" :model="form" @submit="submitReset">
				<FieldS v-model="form" :schema="passwordSchema" />
				<NButton attr-type="submit" type="primary" block secondary strong :loading="Loading.PasswordReset">
					{{ t("resetPassword") }}
				</NButton>
			</NForm>
			<template #footer>
				<NButton text type="primary" @click="navigateTo(authPath)">
					<template #icon><NIcon><Icon name="tabler:arrow-left" /></NIcon></template>
					{{ t("backToSignIn") }}
				</NButton>
			</template>
		</NCard>
	</div>
</template>

<script lang="ts" setup>
import type { FormInst } from "naive-ui";

const config = useRuntimeConfig();
const route = useRoute();
const database = useState<Database>("database");
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const formRef = ref<FormInst | null>(null);
const form = ref({ password: "", confirmPassword: "" });
const token = computed(() =>
	typeof route.query.token === "string" ? route.query.token : "",
);
const authPath = computed(() =>
	route.params.database ? `/${database.value.slug}/auth` : "/auth",
);
const passwordSchema = computed<Schema>(() => [
	{
		key: "password",
		type: "password",
		label: t("newPassword"),
		required: true,
	},
	{
		key: "confirmPassword",
		type: "password",
		label: t("confirmPassword"),
		required: true,
	},
]);

async function submitReset(event: Event) {
	event.preventDefault();
	try {
		await formRef.value?.validate();
	} catch {
		window.$message.error(t("inputsAreInvalid"));
		return;
	}

	if (form.value.password.length < 8) {
		window.$message.error(t("passwordMinimumLength"));
		return;
	}
	if (form.value.password !== form.value.confirmPassword) {
		window.$message.error(t("passwordsDoNotMatch"));
		return;
	}

	Loading.value.PasswordReset = true;
	try {
		const data = await $fetch<apiResponse<boolean>>(
			`${config.public.apiBase}${database.value.slug}/auth/reset`,
			{
				method: "PUT",
				body: { token: token.value, password: form.value.password },
				credentials: "include",
				query: { locale: Language.value },
			},
		);
		if (!data.result) {
			window.$message.error(data.message);
			return;
		}
		window.$message.success(data.message);
		await navigateTo(authPath.value);
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message;
		window.$message.error(message ?? t("invalidResetLink"));
	} finally {
		Loading.value.PasswordReset = false;
	}
}

useHead(() => ({
	title: `${t(database.value.slug)} | ${t("resetPassword")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
}));
</script>