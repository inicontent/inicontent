<template>
	<NGrid cols="12" :x-gap="12" item-responsive responsive="screen">
		<NGridItem span="12 l:11">
			<NCard :title="t('settings')" hoverable>
				<template #header-extra>
					<NFlex>
						<NTooltop :delay="1500">
							<template #trigger>
								<NPopconfirm :show-icon="false" @positive-click="deleteDatabase">
									<template #trigger>
										<NButton type="error" tertiary round :loading="Loading.deleteDatabase">
											<template #icon>
												<NIcon>
													<Icon name="tabler:trash" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t("theFollowingActionIsIrreversible") }}
								</NPopconfirm>
							</template>
							{{ t("deleteDatabase") }}
						</NTooltop>
						<NButton @click="() => updateDatabase()" type="primary" secondary round
							:loading="Loading.updateDatabase">
							<template #icon>
								<NIcon>
									<Icon name="tabler:device-floppy" />
								</NIcon>
							</template>
							{{ t("save") }}
						</NButton>
					</NFlex>
				</template>
				<NFlex vertical>
					<NCard id="general" :title="t('generalSettings')" hoverable>
						<NForm ref="generalRef" :model="databaseCopy">
							<FieldS v-model="databaseCopy" :schema="databaseSchema" />
						</NForm>
					</NCard>
					<NCard id="translation" :title="t('translationSettings')" hoverable>
						<NForm ref="translationRef" :model="databaseCopy">
							<FieldS v-model="databaseCopy" :schema="translationSchema" />
						</NForm>
					</NCard>
					<NCard id="email" :title="t('emailSettings')" hoverable>
						<NForm ref="emailRef" :model="emailForm">
							<FieldS :key="emailFormKey" v-model="emailForm" :schema="emailSchema" />
						</NForm>
						<n-divider />
						<NFlex align="center">
							<NInput v-model:value="testRecipient" :placeholder="t('testEmailRecipient')"
								clearable style="max-width: 360px" />
							<NButton type="primary" secondary :disabled="!isEmail(testRecipient)"
								:loading="Loading.testEmail" @click="sendTestEmail">
								<template #icon>
									<NIcon><Icon name="tabler:send" /></NIcon>
								</template>
								{{ t("sendTestEmail") }}
							</NButton>
						</NFlex>
					</NCard>
				</NFlex>
			</NCard>
		</NGridItem>
		<NGridItem v-if="!$device.isMobile" span="0 l:1">
			<NAnchor affix listen-to="#container" :top="88" :bound="90" style="z-index: 1;">
				<NAnchorLink :title="t('generalSettings')" href="#general" />
				<NAnchorLink :title="t('translationSettings')" href="#translation" />
				<NAnchorLink :title="t('emailSettings')" href="#email" />
			</NAnchor>
		</NGridItem>
	</NGrid>
</template>

<script lang="ts" setup>
import { isEmail } from "inibase/utils"
import type { FormInst } from "naive-ui"

definePageMeta({
	middleware: ["database", "user", "dashboard", "global"],
	layout: "table",
})

onMounted(() => {
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return
		e.preventDefault()
		updateDatabase()
	}
})

const config = useRuntimeConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const route = useRoute()
const router = useRouter()
const database = useState<Database>("database")
const user = useState<User>("user")
const generalRef = ref<FormInst>()
const translationRef = ref<FormInst>()
const emailRef = ref<FormInst>()
const databaseCopy = ref<Database>(JSON.parse(JSON.stringify(database.value)))
databaseCopy.value.email ??= {}
const emailForm = ref<NonNullable<Database["email"]>>({
	...databaseCopy.value.email,
	smtp_port: databaseCopy.value.email.smtp_port ?? 587,
	smtp_secure: databaseCopy.value.email.smtp_secure ?? false,
	smtp_pass: "",
})
const emailFormKey = ref(0)
const testRecipient = ref(user.value?.email ?? databaseCopy.value.email.from_email ?? "")

const databaseSchema: Schema = [
	{
		key: "slug",
		type: "string",
		required: true,
	},
	{
		key: "icon",
		type: "table",
		table: "assets",
		accept: ["image"],
		suffix: "?format=avif&fit=94",
	},
	{
		key: "primaryColor",
		type: "string",
		subType: "color",
	},
	{
		key: "primaryDarkColor",
		type: "string",
		subType: "color",
	},
	{
		key: "roles",
		type: "array",
		children: [
			{
				key: "id",
				type: "id",
				inputProps: {
					disabled: true,
				},
			},
			{
				key: "name",
				type: "string",
			},
		],
		onCreate: { id: `temp-${randomID()}` },
		inputProps: (index: number) =>
			[0, 1, 2].includes(index) ? { disabled: true } : {},
		required: false,
	},
]

const translationSchema = computed<Schema>(() => [
	{
		key: "primaryLanguage",
		type: "string",
		subType: "locale",
		required: true,
	},
	{
		key: "secondaryLanguages",
		type: "array",
		children: "string",
		subType: "select",
		options: translationLanguages
			.filter((l) => l !== databaseCopy.value.primaryLanguage)
			.map((l) => ({ label: t(`languages.${l}`), value: l })),
	},
])

const emailSchema = computed<Schema>(() => [
	{
		key: "from_email",
		type: "email",
		label: t("emailConfig.from_email"),
		width: 2,
		inputProps: { placeholder: t("emailConfig.from_email") },
	},
	{
		key: "from_name",
		type: "string",
		label: t("emailConfig.from_name"),
		width: 2,
		inputProps: { placeholder: t("emailConfig.from_name") },
	},
	{
		key: "smtp_host",
		type: "string",
		label: t("emailConfig.smtp_host"),
		width: 2,
		inputProps: { placeholder: t("emailConfig.smtp_host") },
	},
	{
		key: "smtp_port",
		type: "number",
		label: t("emailConfig.smtp_port"),
		width: 2,
		inputProps: { min: 1, max: 65535 },
	},
	{
		key: "smtp_user",
		type: "string",
		label: t("emailConfig.smtp_user"),
		width: 2,
		inputProps: { placeholder: t("emailConfig.smtp_user") },
	},
	{
		key: "smtp_pass",
		type: "password",
		label: t("emailConfig.smtp_pass"),
		width: 2,
		inputProps: { placeholder: t("smtpPasswordUnchanged") },
	},
	{
		key: "smtp_secure",
		type: "boolean",
		label: t("emailConfig.smtp_secure"),
	},
])

const sessionID = useSessionCookie()

async function updateDatabase(showSuccess = true) {
	try {
		await Promise.all([
			generalRef.value?.validate(),
			translationRef.value?.validate(),
			emailRef.value?.validate(),
		])
	} catch {
		window.$message.error(t("inputsAreInvalid"))
		return false
	}

	const bodyContent = JSON.parse(JSON.stringify(databaseCopy.value)) as Database
	bodyContent.email = JSON.parse(JSON.stringify(emailForm.value))
	if (!bodyContent.email?.smtp_pass) delete bodyContent.email?.smtp_pass

	Loading.value.updateDatabase = true
	try {
		const data = await $fetch<apiResponse<Database>>(
				`${config.public.apiBase}inicontent/databases/${database.value.slug}`,
				{
					method: "PUT",
					body: bodyContent,
					credentials: "include",
					query: {
						[`${database.value.slug}_sid`]: sessionID.value,
					},
				},
			)
		if (!data.result) {
			window.$message.error(data.message)
			return false
		}

		database.value = { ...database.value, ...data.result }
		emailForm.value.smtp_pass = ""
		emailFormKey.value++
		if (route.params.database !== database.value.slug)
			await router.replace({ params: { database: database.value.slug } })
		setThemeConfig()
		if (showSuccess) window.$message.success(data.message)
		return true
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message
		window.$message.error(message ?? t("error"))
		return false
	} finally {
		Loading.value.updateDatabase = false
	}
}

async function sendTestEmail() {
	if (!isEmail(testRecipient.value) || !(await updateDatabase(false))) return

	Loading.value.testEmail = true
	try {
		const data = await $fetch<apiResponse<boolean>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/email/test`,
			{
				method: "POST",
				body: { email: testRecipient.value },
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
			},
		)
		if (data.result) window.$message.success(data.message)
		else window.$message.error(data.message)
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message
		window.$message.error(message ?? t("emailSendFailed"))
	} finally {
		Loading.value.testEmail = false
	}
}
async function deleteDatabase() {
	Loading.value.deleteDatabase = true
	const data = await $fetch<apiResponse>(
		`${config.public.apiBase}inicontent/databases/${database.value.slug}`,
		{
			method: "DELETE",
			credentials: "include",
			query: {
				[`${database.value.slug}_sid`]: sessionID.value,
			},
		},
	)
	if (data.result) {
		Loading.value.deleteDatabase = false
		window.$message.success(data.message)
		setTimeout(async () => {
			clearNuxtState("database")
			await navigateTo("/admin")
		}, 800)
	} else window.$message.error(data.message)
	Loading.value.deleteDatabase = false
}

useHead({
	title: `${t(database.value.slug)} | ${t("settings")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>
