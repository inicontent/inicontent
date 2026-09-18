<template>
	<div>
		<NResult v-if="!isAdmin" status="403" :title="t('accessDenied')" :description="t('backupsAdminOnly')" />
		<div v-else>
			<NCard
				:class="`table_${table.slug}`"
				id="tableCard"
				:title="t('backups')"
				:header-style="{ paddingRight: 0, paddingLeft: 0 }"
				content-style="padding: 0"
				:bordered="false"
				style="background-color: transparent;"
				embedded
			>
				<template #header-extra>
					<NButtonGroup>
						<NTooltip :delay="1500">
							<template #trigger>
								<NButton secondary :loading="loading" @click="load()">
									<template #icon>
										<NIcon>
											<Icon name="tabler:refresh" />
										</NIcon>
									</template>
								</NButton>
							</template>
							{{ t("refresh") }}
						</NTooltip>
						<NButton type="primary" secondary round :loading="creating" @click="openCreateModal">
							<template #icon>
								<NIcon>
									<Icon name="tabler:plus" />
								</NIcon>
							</template>
							{{ t("createBackup") }}
						</NButton>
					</NButtonGroup>
				</template>

				<NDataTable
					remote
					:scroll-x="1600"
					:columns="columns"
					:data="items"
					:loading="loading"
					:pagination="tablePagination"
					:single-line="false"
				/>
			</NCard>

			<!-- Create backup -->
			<NModal v-model:show="showCreateModal" preset="card" :title="t('createBackup')"
				style="max-width: 560px; width: calc(100vw - 24px);">
				<NForm label-placement="top">
					<NFormItem :label="t('backupName')">
						<NInput v-model:value="createForm.name" :placeholder="t('backupNamePlaceholder')" />
						<template #feedback>
							<NText depth="3" style="display: block; margin: 0 0 16px;">{{ t("backupNameHelp") }}</NText>
						</template>
					</NFormItem>
					<NFormItem :label="t('backupType')">
						<NRadioGroup v-model:value="createForm.type">
							<NFlex vertical>
								<NRadio value="full">
									<NFlex align="center">
										<NIcon style="margin-right: 6px"><Icon name="tabler:database" /></NIcon>
										<span>{{ t("fullBackup") }}</span>
									</NFlex>
								</NRadio>
								<NRadio value="table">
									<NFlex align="center">
										<NIcon style="margin-right: 6px"><Icon name="tabler:table" /></NIcon>
										<span>{{ t("tableBackup") }}</span>
									</NFlex>
								</NRadio>
							</NFlex>
						</NRadioGroup>
						<template #feedback>
							<NText depth="3" style="display: block; margin: 0 0 16px;">{{
								createForm.type === "full" ? t("fullBackupHelp") : t("tableBackupHelp")
							}}</NText>
						</template>
					</NFormItem>
					<NFormItem v-if="createForm.type === 'table'" :label="t('table')">
						<NSelect v-model:value="createForm.table" :options="tableOptions" filterable :placeholder="t('table')" />
					</NFormItem>
				</NForm>

				<template #footer>
					<NFlex justify="end">
						<NButton @click="closeCreateModal">{{ t("cancel") }}</NButton>
						<NButton
							type="primary"
							:loading="creating"
							:disabled="createForm.type === 'table' && !createForm.table"
							@click="createBackup"
						>
							{{ t("create") }}
						</NButton>
					</NFlex>
				</template>
			</NModal>

			<!-- Restore -->
			<NModal v-model:show="showRestoreModal" preset="card" :title="t('restoreBackup')"
				style="max-width: 640px; width: calc(100vw - 24px);">
				<NAlert type="warning" :show-icon="true" style="margin-bottom: 18px;">
					{{ t("restoreWarning") }}
				</NAlert>
				<NForm label-placement="top">
					<NFormItem :label="t('backupName')">
						<NText>{{ restoreTarget?.name }}</NText>
					</NFormItem>
					<NFormItem :label="t('restoreScope')">
						<NSelect v-model:value="restoreForm.scope" :options="scopeOptions" />
					</NFormItem>
					<NFormItem v-if="isTableRestoreScope" :label="t('table')">
						<NSelect v-model:value="restoreForm.table" :options="tableOptions" filterable :placeholder="t('table')" />
					</NFormItem>
					<NFormItem :label="t('restoreConfirmation')">
						<NCheckbox v-model:checked="restoreForm.confirm">{{ t("restoreConfirmationHelp") }}</NCheckbox>
					</NFormItem>
				</NForm>

				<template #footer>
					<NFlex justify="end">
						<NButton @click="showRestoreModal = false">{{ t("cancel") }}</NButton>
						<NButton
							type="error"
							:loading="restoring"
							:disabled="!restoreForm.confirm || (isTableRestoreScope && !restoreForm.table)"
							@click="restoreBackup"
						>
							{{ t("restore") }}
						</NButton>
					</NFlex>
				</template>
			</NModal>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Inison from "inison";
import type { DataTableColumns, SelectOption } from "naive-ui";
import {
	Icon,
	NButton,
	NButtonGroup,
	NIcon,
	NPopconfirm,
	NTag,
} from "#components";

const database = useState<Database>("database");
const table = useState<Table>("table");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const user = useState<User>("user");
const route = useRoute();

const isAdmin = computed(() => user.value?.role === config.public.idOne);

useHead({
	title: `${t(database.value?.slug)} | ${t("backups")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});

const loading = ref(false);
const creating = ref(false);
const restoring = ref(false);
const showCreateModal = ref(false);
const showRestoreModal = ref(false);
const items = ref<Backup[]>([]);
const restoreTarget = ref<Backup | null>(null);
const pagination = reactive({
	page: 1,
	pageSize: 15,
	itemCount: 0,
});

function isTableBackup(backup: Backup) {
	// Formatted backup rows carry the MIME type in `type`; the backup kind
	// (full vs table) is exposed through the `table` column being non-null.
	return !!backup.table;
}

const INTERNAL_TABLES = new Set([
	"backups",
	"sessions",
	"translations",
	"assets",
	"dashboards",
	"passkey_credentials",
	"passkey_challenges",
]);

const createForm = reactive({
	name: "",
	type: "full" as "full" | "table",
	table: "",
});

const restoreForm = reactive({
	scope: "table",
	table: "",
	confirm: false,
});

const apiBase = computed(
	() => `${config.public.apiBase}${database.value.slug}/backups`,
);

const tableOptions = computed<SelectOption[]>(() =>
	(database.value.tables ?? [])
		.filter(({ slug }) => !INTERNAL_TABLES.has(slug))
		.map(({ slug }) => ({ label: t(slug), value: slug })),
);

const scopeOptions = computed<SelectOption[]>(() => {
	const isFull = !isTableBackup(restoreTarget.value ?? ({} as Backup));
	const options: SelectOption[] = [
		{ label: t("backupScopeTable"), value: "table" },
		{ label: t("backupScopeTableSchema"), value: "table-schema" },
		{ label: t("backupScopeTableData"), value: "table-data" },
	];
	if (isFull) {
		options.push(
			{ label: t("backupScopeDatabaseSchema"), value: "database-schema" },
			{ label: t("backupScopeDatabaseData"), value: "database-data" },
			{ label: t("backupScopeDatabaseFull"), value: "database-full" },
		);
	}
	return options;
});

const isTableRestoreScope = computed(
	() =>
		typeof restoreForm.scope === "string" &&
		restoreForm.scope.startsWith("table"),
);

function getRequestParams() {
	return {
		locale: Language.value,
		[`${database.value.slug}_sid`]: sessionID.value,
	};
}

function formatDate(value?: number) {
	if (!value) return "--";
	return new Date(value).toLocaleString();
}

function formatSize(bytes?: number) {
	if (!bytes || bytes <= 0) return "--";
	const units = ["B", "KB", "MB", "GB", "TB"];
	const index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	const value = bytes / 1024 ** index;
	return `${value.toFixed(value >= 100 || index === 0 ? 0 : 1)} ${units[index]}`;
}

async function load(silent = false) {
	if (!isAdmin.value) return;
	if (!silent) loading.value = true;
	try {
		const response = await $fetch<apiResponse<Backup[]>>(`${apiBase.value}`, {
			params: {
				...getRequestParams(),
				options: Inison.stringify({
					page: pagination.page,
					perPage: pagination.pageSize,
				}),
			},
			credentials: "include",
		});
		items.value = response.result ?? [];
		pagination.itemCount = Number(
			response.options?.total ?? items.value.length,
		);
	} catch (error: unknown) {
		const errorMessage =
			typeof error === "object" && error !== null
				? (error as { data?: { message?: string }; message?: string })
				: undefined;
		window.$message.error(
			errorMessage?.data?.message ?? errorMessage?.message ?? t("error"),
		);
		items.value = [];
		pagination.itemCount = 0;
	} finally {
		if (!silent) loading.value = false;
	}
}

const tablePagination = computed(() => ({
	page: pagination.page,
	pageSize: pagination.pageSize,
	itemCount: pagination.itemCount,
	showSizePicker: true,
	pageSizes: [15, 30, 60, 100],
	onChange: async (page: number) => {
		pagination.page = page;
		await load();
	},
	onUpdatePageSize: async (pageSize: number) => {
		pagination.pageSize = pageSize;
		pagination.page = 1;
		await load();
	},
	prefix: ({ itemCount }: { itemCount?: number }) => itemCount,
}));

function openCreateModal() {
	createForm.name = "";
	createForm.type = "full";
	createForm.table = "";
	showCreateModal.value = true;
}

function closeCreateModal() {
	showCreateModal.value = false;
}

function openRestoreModal(backup: Backup) {
	restoreTarget.value = backup;
	restoreForm.scope = isTableBackup(backup) ? "table" : "database-full";
	restoreForm.table = backup.table ?? "";
	restoreForm.confirm = false;
	showRestoreModal.value = true;
}

async function createBackup() {
	creating.value = true;
	try {
		const response = await $fetch<apiResponse<Backup>>(`${apiBase.value}`, {
			method: "POST",
			body: {
				name: createForm.name || undefined,
				type: createForm.type,
				table: createForm.type === "table" ? createForm.table : undefined,
			},
			params: getRequestParams(),
			credentials: "include",
		});
		if (response.result) {
			window.$message.success(t("backupCreatedSuccessfully"));
			showCreateModal.value = false;
			createForm.name = "";
			await load(true);
		} else window.$message.error(response.message);
	} catch (error: unknown) {
		const errorMessage =
			typeof error === "object" && error !== null
				? (error as { data?: { message?: string }; message?: string })
				: undefined;
		window.$message.error(
			errorMessage?.data?.message ?? errorMessage?.message ?? t("error"),
		);
	} finally {
		creating.value = false;
	}
}

async function removeBackup(backup: Backup) {
	loading.value = true;
	try {
		const response = await $fetch<apiResponse<boolean>>(
			`${apiBase.value}/${backup.id}`,
			{
				method: "DELETE",
				params: getRequestParams(),
				credentials: "include",
			},
		);
		const code =
			typeof response === "object" && response !== null && "code" in response
				? (response as { code?: unknown }).code
				: undefined;
		if (response?.result || code === 204) {
			window.$message.success(t("backupDeletedSuccessfully"));
			await load(true);
		} else window.$message.error(response?.message ?? t("error"));
	} catch (error: unknown) {
		const errorMessage =
			typeof error === "object" && error !== null
				? (error as { data?: { message?: string }; message?: string })
				: undefined;
		window.$message.error(
			errorMessage?.data?.message ?? errorMessage?.message ?? t("error"),
		);
	} finally {
		loading.value = false;
	}
}

async function restoreBackup() {
	if (!restoreTarget.value) return;
	restoring.value = true;
	try {
		const response = await $fetch<apiResponse<Backup>>(
			`${apiBase.value}/${restoreTarget.value.id}/restore`,
			{
				method: "POST",
				body: {
					scope: restoreForm.scope,
					table: isTableRestoreScope.value ? restoreForm.table : undefined,
					confirm: true,
				},
				params: getRequestParams(),
				credentials: "include",
			},
		);
		if (response.result) {
			window.$message.success(t("restoreStarted"));
			showRestoreModal.value = false;
			await load(true);
		} else window.$message.error(response.message);
	} catch (error: unknown) {
		const errorMessage =
			typeof error === "object" && error !== null
				? (error as { data?: { message?: string }; message?: string })
				: undefined;
		window.$message.error(
			errorMessage?.data?.message ?? errorMessage?.message ?? t("error"),
		);
	} finally {
		restoring.value = false;
	}
}

const columns = computed<DataTableColumns<Backup>>(() => [
	{
		title: t("backupName"),
		key: "name",
		minWidth: 240,
		render: (backup) =>
			h(
				"span",
				{ style: { display: "inline-flex", alignItems: "center", gap: "8px" } },
				[
					h(NIcon, { size: 18 }, () =>
						h(Icon, {
							name: "tabler:archive",
						}),
					),
					backup.name,
				],
			),
	},
	{
		title: t("backupType"),
		key: "type",
		width: 150,
		render: (backup) =>
			h(
				NTag,
				{
					bordered: false,
					round: true,
					size: "small",
					type: isTableBackup(backup) ? "info" : "success",
				},
				{
					default: () =>
						isTableBackup(backup) ? t("tableBackup") : t("fullBackup"),
				},
			),
	},
	{
		title: t("table"),
		key: "table",
		width: 140,
		render: (backup) => (backup.table ? t(backup.table) : "--"),
	},
	{
		title: t("backupOrigin"),
		key: "automatic",
		width: 120,
		render: (backup) =>
			h(
				NTag,
				{
					bordered: false,
					round: true,
					size: "small",
					type: backup.automatic ? "warning" : "default",
				},
				{
					default: () =>
						backup.automatic ? t("automaticBackup") : t("manualBackup"),
				},
			),
	},
	{
		title: t("backupSize"),
		key: "size",
		width: 110,
		render: (backup) => formatSize(backup.size),
	},
	{
		title: t("backupState"),
		key: "state",
		width: 170,
		render: (backup) => {
			const tags = [];
			const state = backup.state ?? "queued";
			tags.push(
				h(
					NTag,
					{
						bordered: false,
						round: true,
						size: "small",
						type:
							state === "completed"
								? "success"
								: state === "failed"
									? "error"
									: state === "running"
										? "info"
										: "default",
					},
					{ default: () => t(state) },
				),
			);
			if (backup.restoreState === "running")
				tags.push(
					h(
						NTag,
						{
							bordered: false,
							round: true,
							size: "small",
							type: "warning",
						},
						{ default: () => t("restoring") },
					),
				);
			return h(
				"span",
				{ style: { display: "inline-flex", gap: "6px", flexWrap: "wrap" } },
				tags,
			);
		},
	},
	{
		title: t("createdAt"),
		key: "createdAt",
		width: 170,
		render: (backup) => formatDate(backup.createdAt),
	},
	{
		title: t("actions"),
		key: "actions",
		width: 170,
		render: (backup) => {
			const canRestore =
				backup.state === "completed" &&
				!!backup.publicURL &&
				backup.restoreState !== "running";
			return h(NButtonGroup, { size: "small" }, [
				canRestore
					? h(
							NButton,
							{
								type: "primary",
								secondary: true,
								onClick: () => openRestoreModal(backup),
							},
							{
								default: () => t("restore"),
								icon: () =>
									h(NIcon, () => h(Icon, { name: "tabler:rotate-clockwise" })),
							},
						)
					: null,
				h(
					NPopconfirm,
					{
						onPositiveClick: () => removeBackup(backup),
					},
					{
						trigger: () =>
							h(
								NButton,
								{ type: "error", secondary: true },
								{
									default: () => t("delete"),
									icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
								},
							),
						default: () => t("deleteBackupConfirm", { name: backup.name }),
					},
				),
			]);
		},
	},
]);

const hasActiveBackupJob = computed(() =>
	items.value.some(
		(backup) =>
			backup.state === "queued" ||
			backup.state === "running" ||
			backup.restoreState === "running",
	),
);

let pollTimer: ReturnType<typeof setInterval> | null = null;

watch(
	hasActiveBackupJob,
	(active) => {
		if (active) {
			if (!pollTimer) pollTimer = setInterval(() => load(true), 4000);
		} else if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
	},
	{ immediate: true },
);

watch(
	() => route.fullPath,
	() => {
		pagination.page = 1;
		void load();
	},
);

onMounted(() => {
	void load();
});

onBeforeUnmount(() => {
	if (pollTimer) clearInterval(pollTimer);
});
</script>