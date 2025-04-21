<template>
	<div>
		<LazyFormDrawer v-if="!isMobile">
			<template #default="{ onAfterCreate, onAfterUpdate }">
				<slot name="form" :onAfterCreate :onAfterUpdate></slot>
			</template>
		</LazyFormDrawer>
		<NCard :title="t(table.slug) ?? '--'" :class="`table_${table.slug}`" id="tableCard"
			:header-style="{ paddingRight: 0, paddingLeft: 0 }" content-style="padding: 0" :bordered="false">
			<template #header-extra>
				<NFlex align="center" id="navbarActions" style="flex-direction: row-reverse;">
					<NButtonGroup id="navbarExtraButtons">
						<NDropdown v-if="user && user.role === appConfig.idOne" :options="toolsDropdownOptions"
							@select="toolsDropdownOnSelect" trigger="click">
							<NTooltip :delay="500">
								<template #trigger>
									<NButton round>
										<template #icon>
											<NIcon>
												<IconTools />
											</NIcon>
										</template>
									</NButton>
								</template>
								{{ t("tools") }}
							</NTooltip>
						</NDropdown>

						<NDropdown v-if="table.allowedMethods?.includes('c')" placement="bottom" trigger="hover"
							size="small" :options="createDropdownOptions" @select="createDropdownOnSelect">
							<NTooltip placement="top" :delay="500">
								<template #trigger>
									<NButton round :disabled="!table.schema" tag="a"
										:href="table.schema ? `${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new` : '#'"
										@click.prevent="() => {
											if (!isMobile)
												openDrawer(table.slug)
											else
												navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`);
										}">
										<template #icon>
											<NIcon>
												<IconPlus />
											</NIcon>
										</template>
									</NButton>
								</template>
								{{ t("newItem") }}
							</NTooltip>
						</NDropdown>
					</NButtonGroup>
				</NFlex>
			</template>
			<slot name="default" :data>
				<ClientOnly>
					<LazyTableViewsKanban v-if="table.displayAs === 'kanban'" :table="table.slug"
						v-model:columns="columns" v-model:data="data" ref="dataRef" :slots />
					<LazyTableViewsTable v-else :table="table.slug" v-model:columns="columns" v-model:data="data"
						v-model:refresh="refresh" ref="tableViewRef" :slots />
				</ClientOnly>
			</slot>
		</NCard>
		<LazyTableLogs v-if="table.config?.log" />
	</div>
</template>

<script setup lang="ts">
import {
	IconCopy,
	IconEye,
	IconFileArrowRight,
	IconPencil,
	IconPlus,
	IconTableExport,
	IconTableImport,
	IconTools,
	IconTrash,
} from "@tabler/icons-vue";
import Inison from "inison";
import {
	NButton,
	NButtonGroup,
	NCard,
	NDropdown,
	NFlex,
	NIcon,
	NProgress,
	NTooltip,
	NTime,
	NPopconfirm,
	type DataTableColumns,
	type NotificationReactive,
	type DropdownOption,
} from "naive-ui";
import { FormatObjectCriteriaValue, isStringified } from "inibase/utils";
import { NuxtLink } from "#components";

const user = useState<User>("user");
const route = useRoute();
const searchArray = ref<searchType | undefined>(
	route.query.search
		? generateSearchArray(Inison.unstringify(route.query.search as string))
		: undefined,
);

const columns = ref<DataTableColumns>();
const data = ref();
const refresh = ref<() => Promise<void>>();

const database = useState<Database>("database");

const table = useState<Table>("table");
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

async function deleteItem(id?: string | string[]) {
	if (!data.value) return;
	Loading.value.data = true;
	const deleteResponse = await $fetch<apiResponse>(
		`${appConfig.apiBase}${database.value.slug}/${table.value?.slug}${!id || Array.isArray(id) ? "" : `/${id}`}`,
		{
			method: "DELETE",
			query:
				id && Array.isArray(id) ? { where: Inison.stringify(id) } : undefined,
		},
	);
	if (deleteResponse.result) {
		window.$message.success(deleteResponse.message);
		refresh.value?.();
	} else {
		window.$message.error(deleteResponse.message);
		Loading.value.data = false;
	}
}

function renderItemButtons(row: Item) {
	return h(NButtonGroup, { vertical: isMobile }, () =>
		[
			slots.itemExtraButtons ? slots.itemExtraButtons(row) : undefined,
			table.value?.allowedMethods?.includes("r")
				? h(
						NButton,
						{
							secondary: true,
							circle: true,
							type: "primary",
						},
						{
							icon: () =>
								h(
									NuxtLink,
									{
										to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}`,
									},
									() => h(NIcon, () => h(IconEye)),
								),
						},
					)
				: null,
			table.value?.allowedMethods?.includes("u")
				? h(
						NButton,
						{
							tag: "a",
							href: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}/edit`,
							onClick: (e) => {
								e.preventDefault();
								if (!isMobile)
									openDrawer(
										table.value?.slug as string,
										row.id,
										structuredClone(toRaw(row)),
									);
								else
									navigateTo(
										`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}/edit`,
									);
							},
							secondary: true,
							circle: true,
							type: "info",
						},
						{ icon: () => h(NIcon, () => h(IconPencil)) },
					)
				: null,
			table.value?.allowedMethods?.includes("d")
				? h(
						NPopconfirm,
						{
							onPositiveClick: () => deleteItem(row.id),
						},
						{
							trigger: () =>
								h(
									NButton,
									{
										strong: true,
										secondary: true,
										circle: true,
										type: "error",
									},
									{
										icon: () => h(NIcon, () => h(IconTrash)),
									},
								),
							default: () => t("theFollowingActionIsIrreversible"),
						},
					)
				: null,
		].filter((i) => i !== null),
	);
}
provide("renderItemButtons", renderItemButtons);

provide("deleteItem", deleteItem);

defineExpose<TableRef>({
	search: searchArray as searchType,
	columns: columns as any,
	delete: deleteItem,
});

const slots = defineSlots<{
	default(props: { data: apiResponse<Item[]> | null }): any;
	form(props: {
		onAfterCreate: () => Promise<void>;
		onAfterUpdate: () => Promise<void>;
	}): any;
	navbarActions(): any;
	navbarExtraButtons(): any;
	navbarExtraActions(): any;
	itemActions(props: Item): any;
	itemExtraActions(props: Item): any;
	itemExtraButtons(props: Item): any;
	item(props: Item): any;
}>();

onBeforeRouteLeave(() => {
	clearNuxtState("drawer");
});

defineTranslation({
	ar: {
		search: "بحث",
		reset: "إفراغ",
		tools: "الأدوات",
		clearTable: "إفراغ الجدول",
		export: "تصدير",
		import: "إستيراد",
		exportCurrentData: "تصدير البيانات الحالية",
		exportAllData: "تصدير كل البيانات",
		columns: "الأعمدة",
		an_export_job_is_running_in_background: "هناك عملية تصدير جارية",
		an_export_job_is_done: "عملية التصدير إنتهت",
	},
});

const { isMobile } = useDevice();

const notificationRef = ref<NotificationReactive>();
const currentJob = computed(() => table.value?.currentJob);
async function jobNotification() {
	if (currentJob.value) {
		if (!notificationRef.value)
			notificationRef.value = window.$notification.info({
				title: t(`an_${currentJob.value}_job_is_running_in_background`),
				onClose() {
					notificationRef.value?.destroy();
					notificationRef.value = undefined;
					table.value.currentJob = undefined;
				},
				meta: () => h(NTime),
			});

		const jobTimer = setInterval(async () => {
			if (notificationRef.value) {
				const currentJobProgress = (
					await $fetch<apiResponse<number>>(
						`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/${currentJob.value}`,
					)
				).result;

				if (currentJobProgress === 100) {
					clearInterval(jobTimer);
					notificationRef.value.title = t(`an_${currentJob.value}_job_is_done`);
					if (currentJob.value === "export")
						notificationRef.value.action = () =>
							h(
								NButton,
								{
									text: true,
									type: "primary",
									onClick: () => {
										window.open(
											`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export/download`,
										);
										notificationRef.value?.destroy();
										notificationRef.value = undefined;
										table.value.currentJob = undefined;
									},
								},
								{
									default: () => t("download"),
								},
							);
					setTimeout(() => {
						if (notificationRef.value)
							notificationRef.value.content = undefined;
					}, 500);
				} else
					notificationRef.value.content = () =>
						h(NProgress, {
							type: "line",
							percentage: currentJobProgress,
							indicatorPlacement: "inside",
							processing: true,
						});
			}
		}, 1000);
	}
}
watch(currentJob, jobNotification);
onMounted(jobNotification);

function generateSearchArray(searchQuery: any): searchType {
	const RETURN: searchType = {};
	for (const [condition, items] of Object.entries(searchQuery)) {
		if (!RETURN[condition as "and" | "or"])
			RETURN[condition as "and" | "or"] = [];
		for (const [key, value] of Object.entries(items)) {
			if (["and", "or"].includes(key))
				RETURN[condition as "and" | "or"]?.push({
					[key]: generateSearchArray(value),
				});
			else
				RETURN[condition as "and" | "or"]?.push([
					key,
					...FormatObjectCriteriaValue(value),
				]);
		}
	}
	return RETURN;
}

const tableViewRef = ref();

const toolsDropdownOptions = computed(() => [
	{
		icon: () => h(NIcon, () => h(IconTableImport)),
		label: t("import"),
		disabled: true,
		key: "import",
	},
	{
		icon: () => h(NIcon, () => h(IconTableExport)),
		label: t("export"),
		key: "export",
		disabled: !table.value?.schema,
		children: [
			{
				icon: () => h(NIcon, () => h(IconFileArrowRight)),
				label: t("exportCurrentData"),
				key: "exportCurrentData",
			},
			{
				icon: () => h(NIcon, () => h(IconTableExport)),
				disabled: !!currentJob.value,
				label: t("exportAllData"),
				key: "exportAllData",
			},
		],
	},
]);

async function toolsDropdownOnSelect(
	value: "import" | "exportCurrentData" | "exportAllData",
) {
	switch (value) {
		case "exportAllData": {
			await $fetch(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export`,
				{ method: "POST" },
			);
			table.value.currentJob = "export";
			break;
		}
		case "exportCurrentData": {
			tableViewRef.value.dataTableRef?.downloadCsv({
				fileName: table.value.slug,
				keepOriginalData: false,
			});
			break;
		}
	}
}

const createDropdownOptions: DropdownOption[] = [
	{
		label: t("createFromClipboard"),
		key: "paste",
		icon: () => h(NIcon, () => h(IconCopy)),
	},
];
async function createDropdownOnSelect(value: string) {
	try {
		const itemFromClipboard = await navigator.clipboard.readText();

		if (!itemFromClipboard) {
			window.$message.error(t("clipboardEmpty"));
			return;
		}
		if (!isStringified(itemFromClipboard)) {
			window.$message.error(t("clipboardItemIsNotCorrect"));
			return;
		}

		const unstringifiedItem = Inison.unstringify<Item>(itemFromClipboard);
		if (!unstringifiedItem) {
			window.$message.error(t("clipboardItemIsNotCorrect"));
			return;
		}

		switch (value) {
			case "paste": {
				if (!isMobile)
					openDrawer(table.value.slug, undefined, unstringifiedItem);
				else
					await navigateTo(
						`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value.slug}/new?data=${itemFromClipboard}`,
					);
			}
		}
	} catch {
		window.$message.error(t("clipboardItemIsNotCorrect"));
	}
}

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>

<style scoped>
#tableCard {
	background: none;
}

@media (max-width: 768px) {
	:global(#tableCard > .n-card-header) {
		flex-direction: column;
		gap: 8px;
	}
}
</style>