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
					<slot name="navbarActions">
						<NButtonGroup id="navbarExtraButtons">
							<NDropdown :options="toolsDropdownOptions" @select="toolsDropdownOnSelect" trigger="click">
								<NTooltip :delay="1500">
									<template #trigger>
										<NButton round size="small">
											<template #icon>
												<NIcon>
													<Icon name="tabler:tools" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t("tools") }}
								</NTooltip>
							</NDropdown>

							<NDropdown v-if="table.allowedMethods?.includes('c')" placement="bottom" trigger="hover"
								size="small" :options="createDropdownOptions" @select="createDropdownOnSelect">
								<NTooltip placement="top" :delay="1500">
									<template #trigger>
										<NButton round :disabled="!table.schema" tag="a"
											:href="table.schema ? `${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new` : '#'"
											@click.prevent="() => {
												if (!isMobile)
													openDrawer(table.slug)
												else
													navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`);
											}"  size="small">
											<template #icon>
												<NIcon>
													<Icon name="tabler:plus" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t("newItem") }}
								</NTooltip>
							</NDropdown>
							<LazyTableSearchButton v-model:string="searchString" v-model:array="searchArray" size="small" />
							<slot name="navbarExtraButtons"></slot>
						</NButtonGroup>
						<slot name="navbarExtraActions"></slot>
					</slot>
					<template v-if="isSlotSet('navbarActions')">
						<div id="navbarExtraButtons"></div>
						<div id="navbarExtraActions"></div>
					</template>
				</NFlex>
			</template>
			<slot name="default" :data>
				<LazyTableViewsKanban v-if="table.displayAs === 'kanban'" v-model:columns="columns" v-model:data="data"
					v-model:searchString="searchString" :slots />
				<LazyTableViewsTable v-else v-model:columns="columns" v-model:data="data"
					v-model:searchString="searchString" ref="tableViewRef" :slots />
			</slot>
		</NCard>
		<LazyTableLogs v-if="table.config?.log" />
	</div>
</template>

<script setup lang="ts">
import { isStringified } from "inibase/utils";
import Inison from "inison";
import type {
	DataTableColumns,
	DropdownOption,
	NotificationReactive,
} from "naive-ui";
import {
	Icon,
	NuxtLink,
	NButton,
	NButtonGroup,
	NIcon,
	NPopconfirm,
	NProgress,
	NTime,
	NTooltip,
	NFlex,
} from "#components";
import { generateSearchArray } from "~/composables/search";

const user = useState<User>("user");
const route = useRoute();
const router = useRouter();
const { isMobile } = useDevice();

const searchString = ref<string>(
	(route.query.search as string | undefined) ?? "",
);
const searchArray = ref<searchType>(
	route.query.search
		? generateSearchArray(Inison.unstringify(route.query.search as string))
		: { and: [[null, "=", null]] },
);

const columns = ref<DataTableColumns>();
const data = ref<apiResponse<Item[]>>();

const database = useState<Database>("database");
const table = useState<Table>("table");

watch(searchString, (v) => {
	const { search, page, ...Query }: any = route.query;

	router.push({
		query: {
			...(Query ?? {}),
			search: v,
		},
	});
});

const tablesConfig = computed({
	get: () => user.value?.config?.tables ?? {},
	set: (v) => {
		user.value.config = { ...(user.value.config ?? {}), tables: v };
		$fetch(
			`${appConfig.apiBase}${database.value.slug}/users/${user.value?.id}`,
			{
				method: "PUT",
				body: user.value,
				params: {
					return: false,
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		).catch((err) => window.$message.error(err.message));
	},
});

if (tablesConfig.value[table.value.slug]?.view)
	table.value.displayAs = tablesConfig.value[table.value.slug]?.view;

const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
});

async function deleteItem(id?: string | number | (string | number)[]) {
	if (!data.value) return;
	Loading.value.data = true;
	const deleteResponse = await $fetch<apiResponse>(
		`${appConfig.apiBase}${database.value.slug}/${table.value?.slug}${!id || Array.isArray(id) ? "" : `/${id}`}`,
		{
			method: "DELETE",
			query: {
				where: id && Array.isArray(id) ? Inison.stringify(id) : undefined,
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	);
	if (deleteResponse.result) window.$message.success(deleteResponse.message);
	else window.$message.error(deleteResponse.message);
	if (isSlotSet("default") && !table.value.displayAs)
		data.value = await $fetch<apiResponse<Item[]>>(
			`${appConfig.apiBase}${database.value.slug}/${table.value?.slug as string}`,
			{
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
			},
		);
	else
		await refreshNuxtData(
			`${database.value.slug}/${table.value?.slug as string}`,
		);
	if (table.value.config?.log)
		await refreshNuxtData(
			`${database.value.slug}/${table.value?.slug as string}/logs`,
		);
}
provide("deleteItem", deleteItem);

function renderItemButtons(row: Item) {
	return h(NButtonGroup, { vertical: isMobile }, () =>
		[
			slots.itemExtraButtons ? slots.itemExtraButtons(row) : undefined,
			table.value?.allowedMethods?.includes("r")
				? h(
						NButton,
						{
							class: "viewItemButton",
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
									() => h(NIcon, () => h(Icon, { name: "tabler:eye" })),
								),
						},
					)
				: null,
			table.value?.allowedMethods?.includes("u")
				? h(
						NButton,
						{
							class: "editItemButton",
							tag: "a",
							href: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}/edit`,
							onClick: (e) => {
								e.preventDefault();
								if (!isMobile)
									openDrawer(table.value?.slug as string, row.id, toRaw(row));
								else
									navigateTo(
										`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}/edit`,
									);
							},
							secondary: true,
							circle: true,
							type: "info",
						},
						{ icon: () => h(NIcon, () => h(Icon, { name: "tabler:pencil" })) },
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
										class: "deleteItemButton",
										strong: true,
										secondary: true,
										circle: true,
										type: "error",
									},
									{
										icon: () =>
											h(NIcon, () => h(Icon, { name: "tabler:trash" })),
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

defineExpose<TableRef>({
	search: searchArray as searchType,
	columns: columns as any,
	delete: deleteItem,
	data: data as any,
});

const slots = defineSlots<{
	default(props: { data?: apiResponse<Item[]> }): any;
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

const isSlotSet = (slotName: keyof typeof slots) => !!slots[slotName];

provide("isSlotSet", isSlotSet);

if (isSlotSet("default") && !table.value.displayAs)
	data.value = await $fetch<apiResponse<Item[]>>(
		`${appConfig.apiBase}${database.value.slug}/${table.value?.slug as string}`,
		{
			credentials: "include",
			query: { [`${database.value.slug}_sid`]: sessionID.value },
		},
	);

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
						{
							credentials: "include",
							query: { [`${database.value.slug}_sid`]: sessionID.value },
						},
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
											`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export/download?${`${database.value.slug}_sid`}=${sessionID.value}`,
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

const tableViewRef = ref();

const toolsDropdownOptions = computed(() => [
	{
		icon: () =>
			h(NIcon, () => h(Icon, { name: "tabler:layout-dashboard-filled" })),
		label: t("view"),
		key: "view",
		children: [
			{
				icon: () => h(NIcon, () => h(Icon, { name: "tabler:table" })),
				label: t("table"),
				key: "viewTable",
				children: [
					{
						icon: () => "S",
						label: t("small"),
						key: "tableSizeS",
						disabled:
							!table.value.displayAs &&
							tablesConfig.value[table.value.slug]?.size === "small",
					},
					{
						icon: () => "M",
						label: t("medium"),
						key: "tableSizeM",
						disabled:
							!table.value.displayAs &&
							!tablesConfig.value[table.value.slug]?.size,
					},
					{
						icon: () => "L",
						label: t("large"),
						key: "tableSizeL",
						disabled:
							!table.value.displayAs &&
							tablesConfig.value[table.value.slug]?.size === "large",
					},
				],
			},
			{
				icon: () =>
					h(NIcon, () => h(Icon, { name: "tabler:layout-kanban-filled" })),
				label: t("kanban"),
				key: "viewKanban",
				disabled: table.value.displayAs === "kanban",
				show: !!table.value?.groupBy,
			},
		],
	},
	{
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:table-import" })),
		label: t("import"),
		key: "import",
		disabled: true,
		show: user.value?.role === appConfig.idOne,
	},
	{
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:table-export" })),
		label: t("export"),
		key: "export",
		disabled: !table.value?.schema,
		show: user.value?.role === appConfig.idOne,
		children: [
			{
				icon: () =>
					h(NIcon, () => h(Icon, { name: "tabler:file-arrow-right" })),
				label: t("exportCurrentData"),
				key: "exportCurrentData",
			},
			{
				icon: () => h(NIcon, () => h(Icon, { name: "tabler:table-export" })),
				disabled: !!currentJob.value,
				label: t("exportAllData"),
				key: "exportAllData",
			},
		],
	},
]);

async function toolsDropdownOnSelect(
	value:
		| "import"
		| "exportCurrentData"
		| "exportAllData"
		| "viewTable"
		| "viewKanban"
		| "tableSizeS"
		| "tableSizeM"
		| "tableSizeL",
) {
	switch (value) {
		case "exportAllData": {
			await $fetch(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export`,
				{
					method: "POST",
					credentials: "include",
					query: { [`${database.value.slug}_sid`]: sessionID.value },
				},
			);
			table.value.currentJob = "export";
			break;
		}
		case "exportCurrentData": {
			tableViewRef.value.dataTableRef?.downloadCsv({
				fileName: `${table.value.slug}-${new Date().toISOString().split("T")[0]}`,
				keepOriginalData: false,
			});
			break;
		}
		case "tableSizeS":
		case "tableSizeM":
		case "tableSizeL":
		case "viewTable":
		case "viewKanban": {
			const clonedTablesConfig = structuredClone(toRaw(tablesConfig.value));
			const displayAs = value === "viewKanban" ? "kanban" : undefined;
			if (!clonedTablesConfig[table.value.slug])
				clonedTablesConfig[table.value.slug] = {};
			// @ts-ignore
			clonedTablesConfig[table.value.slug].view = displayAs;

			if (value.startsWith("tableSize"))
				// @ts-ignore
				clonedTablesConfig[table.value.slug].size = value.endsWith("S")
					? "small"
					: value.endsWith("L")
						? "large"
						: undefined;
			else data.value = undefined;
			table.value.displayAs = displayAs;
			tablesConfig.value = clonedTablesConfig;
			break;
		}
	}
}

const createDropdownOptions: DropdownOption[] = [
	{
		label: () => t("createFromClipboard"),
		key: "paste",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:copy" })),
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