<template>
	<NGrid x-gap="12" cols="12" layout-shift-disabled>
		<NGridItem :span="!$device.isMobile ? 10 : 12">
			<NCard
			:title="t('settings')" style="background-color: transparent;" 
			:header-style="{ paddingRight: 0, paddingLeft: 0 }" content-style="padding: 0" :bordered="false" embedded>
				<template #header-extra>
					<NFlex>
						<NTooltip :delay="1500">
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
						</NTooltip>
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
				<NCard v-show="$device.isMobile || activeSection === 'general'" id="general" :title="t('generalSettings')" hoverable>
					<NForm ref="generalRef" :model="databaseCopy">
						<FieldS v-model="databaseCopy" :schema="databaseSchema" />
					</NForm>
				</NCard>
				<NCard v-show="$device.isMobile || activeSection === 'translation'" id="translation" :title="t('translationSettings')" hoverable>
					<NForm ref="translationRef" :model="databaseCopy">
						<FieldS v-model="databaseCopy" :schema="translationSchema" />
					</NForm>
				</NCard>
				<NCard v-if="canExportDatabase" v-show="$device.isMobile || activeSection === 'database-export'"
					id="database-export" :title="t('databaseExport')" hoverable>
					<template #header-extra>
						<NButton v-if="exportStatus?.state === 'completed'" type="primary" secondary
							:loading="Loading.downloadDatabaseExport" @click="downloadDatabaseExport">
							<template #icon><NIcon><Icon name="tabler:download" /></NIcon></template>
							{{ t("download") }}
						</NButton>
						<NButton v-else type="primary" secondary :disabled="exportIsActive"
							:loading="Loading.databaseExport" @click="startDatabaseExport">
							<template #icon><NIcon><Icon name="tabler:database-export" /></NIcon></template>
							{{ t("startDatabaseExport") }}
						</NButton>
					</template>
					<NFlex vertical>
						<NText depth="3">{{ t("databaseExportDescription") }}</NText>
						<NProgress v-if="exportIsActive" type="line" :percentage="exportStatus?.progress ?? 0"
							indicator-placement="inside" processing />
						<NText v-if="exportStatus" depth="3">
							{{ t(`databaseExportState.${exportStatus.state}`) }}
							<template v-if="exportStatus.totalBytes">
									· {{ formatBytes(exportStatus.processedBytes) }} / {{ formatBytes(exportStatus.totalBytes) }}
							</template>
						</NText>
						<NText v-if="exportStatus?.state === 'completed'" depth="3">
							{{ t("databaseExportExpires", { date: new Date(exportStatus.expiresAt).toLocaleString() }) }}
						</NText>
						<NText v-if="exportStatus?.state === 'failed'" type="error">
							{{ exportStatus.error || t("databaseExportFailed") }}
						</NText>
					</NFlex>
				</NCard>
				<NCard v-show="$device.isMobile || activeSection === 'email'" id="email" :title="t('emailSettings')" hoverable>
					<NFlex align="center" :wrap="false" style="margin-bottom: 12px;">
						<NSwitch v-model:value="useCustomSmtp" />
						<span>{{ t("emailConfig.use_custom_smtp") }}</span>
					</NFlex>
					<NForm ref="emailRef" :model="emailForm">
						<FieldS :key="emailFormKey" v-model="emailForm" :schema="emailSchema" />
					</NForm>
					<n-divider />
					<NFlex align="center" justify="end">
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
			</NCard>
		</NGridItem>
		<NGridItem v-if="!$device.isMobile" span="2" style="padding-top: 58px;">
			<div class="settings-tabs-affix">
				<NTabs v-model:value="activeSection" type="line" :placement="isRTL ? 'left' : 'right'"
					@update:value="changeSection">
					<NTab name="general">{{ t('generalSettings') }}</NTab>
					<NTab name="translation">{{ t('translationSettings') }}</NTab>
					<NTab v-if="canExportDatabase" name="database-export">
						{{ t('databaseExport') }}
					</NTab>
					<NTab name="email">{{ t('emailSettings') }}</NTab>
				</NTabs>
			</div>
		</NGridItem>
	</NGrid>
</template>

<script lang="ts" setup>
import { isEmail } from "inibase/utils";
import type { FormInst } from "naive-ui";

definePageMeta({
	middleware: ["database", "user", "dashboard", "global"],
	layout: "table",
});

onMounted(() => {
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return;
		e.preventDefault();
		updateDatabase();
	};
});

const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute();
const router = useRouter();
const database = useState<Database>("database");
const user = useState<User>("user");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const isRTL = computed(() => Language.value === "ar");
const generalRef = ref<FormInst>();
const translationRef = ref<FormInst>();
const emailRef = ref<FormInst>();
type SettingsSection = "general" | "translation" | "database-export" | "email";
const activeSection = ref<SettingsSection>("general");
const databaseCopy = ref<Database>(JSON.parse(JSON.stringify(database.value)));
databaseCopy.value.email ??= {};
const emailForm = ref<NonNullable<Database["email"]>>({
	...databaseCopy.value.email,
	smtp_port: databaseCopy.value.email.smtp_port ?? 587,
	smtp_secure: databaseCopy.value.email.smtp_secure ?? false,
	smtp_pass: "",
});
// UI-only toggle — not persisted, derived from/collapsed into smtp_host presence
const useCustomSmtp = ref(!!databaseCopy.value.email.smtp_host);
const emailFormKey = ref(0);
const testRecipient = ref(
	user.value?.email ?? databaseCopy.value.email.from_email ?? "",
);
const exportStatus = ref<DatabaseExportStatus>();
let exportPollTimer: ReturnType<typeof setTimeout> | undefined;
const canExportDatabase = computed(
	() => user.value?.role === config.public.idOne,
);
const exportIsActive = computed(() =>
	["queued", "running"].includes(exportStatus.value?.state ?? ""),
);

function sectionFromHash(hash: string): SettingsSection | undefined {
	const section = hash.replace(/^#/, "") as SettingsSection;
	if (
		["general", "translation", "database-export", "email"].includes(section) &&
		(section !== "database-export" || canExportDatabase.value)
	)
		return section;
}

watch(
	() => route.hash,
	(hash) => {
		const section = sectionFromHash(hash);
		if (section) activeSection.value = section;
	},
	{ immediate: true },
);

function changeSection(value: string | number) {
	const section = value as SettingsSection;
	if (section === "database-export" && !canExportDatabase.value) return;
	activeSection.value = section;
	if (route.hash !== `#${section}`) router.replace({ hash: `#${section}` });
}

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
		onCreate: () => ({ id: `temp-${randomID()}` }),
		inputProps: (index: number) =>
			[0, 1, 2].includes(index) ? { disabled: true } : {},
		required: false,
	},
];

const translationSchema = computed<Schema>(() => [
	{
		key: "primaryLanguage",
		type: "string",
		subType: "locale",
		required: true,
		width: 2,
	},
	{
		key: "secondaryLanguages",
		type: "array",
		children: "string",
		subType: "select",
		options: translationLanguages
			.filter((l) => l !== databaseCopy.value.primaryLanguage)
			.map((l) => ({ label: t(`languages.${l}`), value: l })),
		width: 2,
	},
]);

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
	...(useCustomSmtp.value
		? ([
				{
					key: "smtp_host",
					type: "string",
					label: t("emailConfig.smtp_host"),
					width: 2,
					required: true,
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
			] as Schema)
		: []),
]);

const sessionID = useScopedCookie<string>("sid", database.value?.slug);

function exportRequestOptions() {
	return {
		credentials: "include" as const,
		query: {
			[`${database.value.slug}_sid`]: sessionID.value,
			_t: Date.now(),
		},
	};
}

function formatBytes(bytes: number) {
	if (!bytes) return "0 B";
	const units = ["B", "KB", "MB", "GB", "TB"];
	const index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function scheduleExportPoll() {
	if (exportPollTimer) clearTimeout(exportPollTimer);
	if (!exportIsActive.value) return;
	exportPollTimer = setTimeout(async () => {
		await loadDatabaseExportStatus();
		scheduleExportPoll();
	}, 1500);
}

async function loadDatabaseExportStatus() {
	if (!canExportDatabase.value) return;
	try {
		const response = await $fetch<apiResponse<DatabaseExportStatus | null>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/export`,
			exportRequestOptions(),
		);
		exportStatus.value = response.result ?? undefined;
	} catch {
		exportStatus.value = undefined;
	}
}

async function startDatabaseExport() {
	Loading.value.databaseExport = true;
	try {
		const response = await $fetch<apiResponse<DatabaseExportStatus>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/export`,
			{ ...exportRequestOptions(), method: "POST" },
		);
		if (!response.result) throw new Error(response.message);
		exportStatus.value = response.result;
		scheduleExportPoll();
	} catch (error: unknown) {
		const message = error as { data?: { message?: string }; message?: string };
		window.$message.error(
			message.data?.message || message.message || t("databaseExportFailed"),
		);
	} finally {
		Loading.value.databaseExport = false;
	}
}

async function downloadDatabaseExport() {
	Loading.value.downloadDatabaseExport = true;
	try {
		const response = await $fetch<apiResponse<{ url: string }>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/export/download`,
			exportRequestOptions(),
		);
		if (!response.result?.url) throw new Error(response.message);
		window.location.assign(response.result.url);
	} catch (error: unknown) {
		const message = error as { data?: { message?: string }; message?: string };
		window.$message.error(
			message.data?.message || message.message || t("databaseExportFailed"),
		);
	} finally {
		Loading.value.downloadDatabaseExport = false;
	}
}

onMounted(async () => {
	await loadDatabaseExportStatus();
	scheduleExportPoll();
});
onBeforeUnmount(() => {
	if (exportPollTimer) clearTimeout(exportPollTimer);
});

async function updateDatabase(showSuccess = true) {
	try {
		await Promise.all([
			generalRef.value?.validate(),
			translationRef.value?.validate(),
			emailRef.value?.validate(),
		]);
	} catch {
		window.$message.error(t("inputsAreInvalid"));
		return false;
	}

	const bodyContent = JSON.parse(
		JSON.stringify(databaseCopy.value),
	) as Database;
	bodyContent.email = JSON.parse(JSON.stringify(emailForm.value));
	// Toggling off custom SMTP clears smtp_host so the API falls back to the default Inicontent SMTP
	if (!useCustomSmtp.value && bodyContent.email) {
		bodyContent.email.smtp_host = "";
		bodyContent.email.smtp_user = "";
		bodyContent.email.smtp_pass = "";
		bodyContent.email.smtp_secure = false;
	}
	if (!bodyContent.email?.smtp_pass) delete bodyContent.email?.smtp_pass;

	Loading.value.updateDatabase = true;
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
		);
		if (!data.result) {
			window.$message.error(data.message);
			return false;
		}

		database.value = { ...database.value, ...data.result };
		emailForm.value.smtp_pass = "";
		emailFormKey.value++;
		if (route.params.database !== database.value.slug)
			await router.replace({ params: { database: database.value.slug } });
		setThemeConfig();
		if (showSuccess) window.$message.success(data.message);
		return true;
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message;
		window.$message.error(message ?? t("error"));
		return false;
	} finally {
		Loading.value.updateDatabase = false;
	}
}

async function sendTestEmail() {
	if (!isEmail(testRecipient.value) || !(await updateDatabase(false))) return;

	Loading.value.testEmail = true;
	try {
		const data = await $fetch<apiResponse<boolean>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/email/test`,
			{
				method: "POST",
				body: { email: testRecipient.value },
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
			},
		);
		if (data.result) window.$message.success(data.message);
		else window.$message.error(data.message);
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message;
		window.$message.error(message ?? t("emailSendFailed"));
	} finally {
		Loading.value.testEmail = false;
	}
}
async function deleteDatabase() {
	Loading.value.deleteDatabase = true;
	const data = await $fetch<apiResponse>(
		`${config.public.apiBase}inicontent/databases/${database.value.slug}`,
		{
			method: "DELETE",
			credentials: "include",
			query: {
				[`${database.value.slug}_sid`]: sessionID.value,
			},
		},
	);
	if (data.result) {
		Loading.value.deleteDatabase = false;
		window.$message.success(data.message);
		setTimeout(async () => {
			clearNuxtState("database");
			await navigateTo("/admin");
		}, 800);
	} else window.$message.error(data.message);
	Loading.value.deleteDatabase = false;
}

useHead({
	title: `${t(database.value.slug)} | ${t("settings")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>