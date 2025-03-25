<template>
	<div>
		<LazyFormDrawer v-if="!isMobile">
			<template #default="{ onAfterCreate, onAfterUpdate }">
				<slot name="form" :onAfterCreate :onAfterUpdate></slot>
			</template>
		</LazyFormDrawer>
		<NCard :title="t(table.slug) ?? '--'" style="background:none"
			:header-style="{ paddingRight: 0, paddingLeft: 0 }" content-style="padding: 0" :bordered="false">
			<template #header-extra>
				<NFlex align="center">
					<slot name="navbarExtraActions"></slot>
					<slot name="navbarActions">
						<NButtonGroup>
							<slot name="navbarExtraButtons"></slot>
							<NPopover :disabled="!whereQuery && (!data?.result || !table?.schema)"
								style="max-height: 240px;" :style="`width: ${isMobile ? '350px' : '500px'}`"
								placement="bottom-end" trigger="click" scrollable>
								<template #trigger>
									<NTooltip :delay="500">
										<template #trigger>
											<NButton round>
												<template #icon>
													<NIcon>
														<IconSearch />
													</NIcon>
												</template>
											</NButton>
										</template>
										{{ t("search") }}
									</NTooltip>
								</template>
								<template #footer>
									<NFlex justify="end">
										<NButtonGroup>
											<NButton round type="error" secondary :loading="Loading.data"
												:disabled="isSearchDisabled" @click="searchArray = undefined">
												<template #icon>
													<NIcon>
														<IconX />
													</NIcon>
												</template>
												{{ t("reset") }}
											</NButton>
											<NButton round type="primary" secondary :loading="Loading.data"
												:disabled="isSearchDisabled" @click="executeSearch">
												<template #icon>
													<NIcon>
														<IconSearch />
													</NIcon>
												</template>
												{{ t("search") }}
											</NButton>
										</NButtonGroup>
									</NFlex>
								</template>
								<TableSearch v-model="localSearchArray" :callback="executeSearch" />
							</NPopover>
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
					</slot>
				</NFlex>
			</template>
			<slot name="default" :data>
				<NDataTable :bordered="false" :scroll-x="tableWidth" resizable id="DataTable" remote ref="dataRef"
					:columns :data="data?.result ?? []" :loading="Loading.data" :pagination="dataTablePagination"
					:row-key="(row) => row.id" v-model:checked-row-keys="checkedRowKeys"
					@update:sorter="handleSorterChange" :get-csv-cell="getCsvCell" :get-csv-header="getCsvHeader"
					:rowProps @scroll="handleScroll" />
				<NDropdown show-arrow size="small" placement="right" trigger="manual" :x :y :options="dropdownOptions"
					:show="showDropdown" :onClickoutside @select="handleSelect" />
			</slot>
		</NCard>
		<LazyTableLogs v-if="table.config?.log" />
	</div>
</template>

<script setup lang="ts">
import {
	IconColumns3,
	IconCopy,
	IconEye,
	IconEyeOff,
	IconFileArrowRight,
	IconPencil,
	IconPlus,
	IconSearch,
	IconTableExport,
	IconTableImport,
	IconTableMinus,
	IconTools,
	IconTrash,
	IconX,
} from "@tabler/icons-vue";
import Inison from "inison";
import {
	NButton,
	NButtonGroup,
	NCard,
	NDataTable,
	NDropdown,
	NFlex,
	NIcon,
	NPopconfirm,
	NPopover,
	NProgress,
	NTooltip,
	type DataTableColumns,
	type DataTableInst,
	type NotificationReactive,
	type DataTableGetCsvCell,
	type DataTableGetCsvHeader,
	NTime,
	type DropdownOption,
	NPerformantEllipsis,
} from "naive-ui";
import { NuxtLink, Column } from "#components";
import {
	FormatObjectCriteriaValue,
	isArrayOfObjects,
	isObject,
	isStringified,
} from "inibase/utils";

const user = useState<User>("user");
const route = useRoute();
const searchArray = ref<searchType | undefined>(
	route.query.search
		? generateSearchArray(Inison.unstringify(route.query.search as string))
		: undefined,
);
const localSearchArray = ref<searchType>(
	searchArray.value || { and: [[null, "=", null]] },
);
function executeSearch() {
	searchArray.value = JSON.parse(JSON.stringify(localSearchArray.value));
}
watch(
	localSearchArray,
	(value) => {
		if (!value || !Object.keys(value).length)
			localSearchArray.value = { and: [[null, "=", null]] };
	},
	{ deep: true },
);
watch(
	searchArray,
	(value) => {
		if (!value) {
			if (whereQuery.value) whereQuery.value = undefined;
		} else {
			const generatedSearchInput = generateSearchInput(value);
			if (generatedSearchInput) {
				whereQuery.value = Inison.stringify(generatedSearchInput);
				pagination.onUpdatePage(1);
			}
		}
	},
	{ deep: true },
);

const columns = ref<DataTableColumns>();

defineExpose<TableRef>({
	search: searchArray as searchType,
	columns,
	delete: DELETE,
});

const slots = defineSlots<{
	default(props: { data: apiResponse<Item[]> | null }): any;
	form(props: {
		onAfterCreate: () => Promise<void>;
		onAfterUpdate: () => Promise<void>;
	}): any;
	navbarActions(): any;
	navbarExtraActions(): any;
	navbarExtraButtons(): any;
	itemActions(props: Item): any;
	itemExtraActions(props: Item): any;
	itemExtraButtons(props: Item): any;
}>();

function isSlotEmpty(slotName: keyof typeof slots): boolean {
	const slot = slots[slotName];

	if (!slot) return false;

	const vnodes: VNode[] = (slot as any)();
	// Check if all nodes are comments or have undefined children
	return vnodes.every(
		(vnode) => vnode.type === Comment || vnode.children === undefined,
	);
}

onBeforeRouteLeave(() => {
	clearNuxtState("drawer");
});

defineTranslation({
	ar: {
		search: "بحث",
		reset: "إفراغ",
		tools: "الأدوات",
		clearTable: "إفراغ الجدول",
	},
});

const router = useRouter();
const database = useState<Database>("database");
const table = useState<Table>("table");
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const { isMobile } = useDevice();

const whereQuery = ref<string | undefined>(
	route.query.search as string | undefined,
);

const notificationRef = ref<NotificationReactive>();
const currentJob = computed(() => table.value?.currentJob);
async function jobNotification() {
	if (currentJob.value) {
		if (!notificationRef.value)
			notificationRef.value = window.$notification.info({
				title: t(`an_${currentJob.value}_job_is_running_in_background`),
				onClose() {
					notificationRef.value = undefined;
				},
				meta() {
					return h(NTime);
				},
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
									},
								},
								{
									default: () => t("download"),
								},
							);
					setTimeout(() => {
						(notificationRef.value as NotificationReactive).content = undefined;
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

function generateSearchInput(searchArray: any) {
	const RETURN: Record<string, any> = {};
	for (const condition in searchArray) {
		for (const item of searchArray[condition]) {
			if (!RETURN[condition]) RETURN[condition] = {};
			if (Array.isArray(item) && item[0])
				RETURN[condition][item[0]] =
					`${item[1] === "=" ? "" : item[1]}${item[2]}`;
			else RETURN[condition] = generateSearchInput(item);
		}
	}
	return Object.keys(RETURN).length ? RETURN : undefined;
}

watch(whereQuery, (v) => {
	const { search, page, ...Query }: any = route.query;
	return v
		? router.push({
				query: {
					...(Query ?? {}),
					search: v,
				},
			})
		: router.push({
				query: Query ?? {},
			});
});

const dataRef = ref<DataTableInst>();
const checkedRowKeys = ref<string[]>([]);
const pagination = reactive({
	page: route.query.page ? Number(route.query.page) : 1,
	pageCount: 1,
	pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
	itemCount: 0,
	async onUpdatePage(currentPage: number) {
		pagination.page = currentPage;
		let { page, ...Query }: any = route.query;
		Query = {
			...Query,
			page: currentPage !== 1 ? currentPage : undefined,
		};
		router.push({ query: Query });
		queryOptions.value = Inison.stringify({
			...Inison.unstringify(queryOptions.value),
			page: pagination.page,
		});
		await refresh();
	},
	async onUpdatePageSize(pageSize: number) {
		const OLD_pageSize = structuredClone(toRaw(pagination.pageSize));
		pagination.pageSize = pageSize;
		let { perPage, page, ...Query }: any = route.query;
		if (pageSize !== 15) {
			pagination.page = Math.round(
				OLD_pageSize < pageSize
					? page / (pageSize / OLD_pageSize)
					: page * (pageSize / OLD_pageSize),
			);
			Query = {
				...Query,
				perPage: pageSize,
				page: pagination.page === 1 ? undefined : pagination.page,
			};
			await refresh();
		}
	},
});
const queryOptions = ref(
	Inison.stringify({
		page: pagination.page,
		perPage: pagination.pageSize,
		columns: [],
	}),
);

const { data, refresh } = await useLazyFetch<apiResponse<Item[]>>(
	`${appConfig.apiBase}${database.value.slug}/${table.value.slug}`,
	{
		query: {
			options: queryOptions,
			where: whereQuery,
		},
		onRequest() {
			Loading.value.data = true;
		},
		onResponse({
			response: {
				_data: {
					options: { total, totalPages },
				},
			},
		}) {
			Loading.value.data = false;
			pagination.pageCount = totalPages ?? 0;
			pagination.itemCount = total ?? 0;
		},
	},
);

async function DELETE(id?: string | string[]) {
	if (!data.value) return;
	Loading.value.data = true;
	const deleteResponse = await $fetch<apiResponse>(
		`${appConfig.apiBase}${database.value.slug}/${table.value.slug}${!id || Array.isArray(id) ? "" : `/${id}`}`,
		{
			method: "DELETE",
			query:
				id && Array.isArray(id) ? { where: Inison.stringify(id) } : undefined,
		},
	);
	if (deleteResponse.result) {
		window.$message.success(deleteResponse.message);
		pagination.onUpdatePage(1);
	} else {
		window.$message.error(deleteResponse.message);
		Loading.value.data = false;
	}
}

const toolsDropdownOptions = [
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
		children: [
			{
				icon: () => h(NIcon, () => h(IconFileArrowRight)),
				label: t("export_current_data"),
				key: "export_current_data",
			},
			{
				icon: () => h(NIcon, () => h(IconTableExport)),
				disabled: !!currentJob.value,
				label: t("export_all_data"),
				key: "export_all_data",
			},
		],
	},
];

async function toolsDropdownOnSelect(
	value: "import" | "export_current_data" | "export_all_data",
) {
	switch (value) {
		case "export_all_data": {
			await $fetch(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export`,
				{ method: "POST" },
			);
			table.value.currentJob = "export";
			break;
		}
		case "export_current_data": {
			dataRef.value?.downloadCsv({
				fileName: table.value.slug,
				keepOriginalData: false,
			});
			break;
		}
	}
}

const getCsvCell: DataTableGetCsvCell = (value) => {
	if (["boolean", "string", "number"].includes(typeof value)) return value;
	if (!value) return null;
	if (isObject(value) && Object.hasOwn(value, "id")) return value.id;
	if (
		Array.isArray(value) &&
		isArrayOfObjects(value) &&
		value.every((_v) => Object.hasOwn(_v, "id"))
	)
		value = value.map((_v) => _v.id);
	return `"${Inison.stringify(value)}"`;
};

const getCsvHeader: DataTableGetCsvHeader = (col) => {
	return (col.key as string) || "Unknown";
};

const sortObject = ref<Record<string, "asc" | "desc">>({});

function handleSorterChange({
	columnKey,
	order,
}: { columnKey: string; order: string }) {
	if (!order) delete sortObject.value[columnKey];
	else {
		sortObject.value[columnKey] = order.slice(0, -3) as "asc" | "desc";
	}
	queryOptions.value = Object.keys(sortObject.value).length
		? Inison.stringify({
				...Inison.unstringify(queryOptions.value),
				sort: sortObject.value,
			})
		: Inison.stringify(
				(({ sort, ...rest }) => rest)(Inison.unstringify(queryOptions.value)),
			);
}

const tableWidth = ref<number>(0);
const dataTablePagination = ref();
const isSearchDisabled = ref(false);

const currentItem = ref<Item>();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);
async function handleSelect(value: string) {
	showDropdown.value = false;
	if (!currentItem.value) return;
	switch (value) {
		case "copy": {
			await copyToClipboard(Inison.stringify(currentItem.value));
			window.$message.success(t("copiedSuccessfully"));
			currentItem.value = undefined;
		}
	}
}
function onClickoutside(e: MouseEvent) {
	const isRightClick = e.button === 2;
	if (!isRightClick) showDropdown.value = false;
}
const dropdownOptions: DropdownOption[] = [
	{
		label: t("copyItem"),
		key: "copy",
		icon: () => h(NIcon, () => h(IconCopy)),
	},
];
function rowProps(row: Item) {
	return {
		onContextmenu: async (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			// If it's a link or an image, do not show the dropdown
			if (
				target.closest("a[href]") || // Link
				target.closest("img") || // Image
				target.closest("button") || // Button
				target.closest('[role="button"]') // ARIA role button
			) {
				showDropdown.value = false;
				return;
			}

			// Check if text is selected and the mouse is above the selection
			const selection = window.getSelection();
			if (selection && selection.toString().trim() !== "") {
				const range = selection.getRangeAt(0); // Get the range of the selected text
				const rect = range.getBoundingClientRect(); // Get the bounding rectangle of the selection

				// Check if the mouse is within the bounding rectangle of the selection
				if (
					e.clientX >= rect.left &&
					e.clientX <= rect.right &&
					e.clientY >= rect.top &&
					e.clientY <= rect.bottom
				) {
					showDropdown.value = false;
					return;
				}
			}

			e.preventDefault();
			showDropdown.value = false;
			await nextTick();
			currentItem.value = (({ id, createdAt, updatedAt, ...rest }) => rest)(
				row,
			);
			showDropdown.value = true;
			x.value = e.clientX + 8;
			y.value = e.clientY + 6;
		},
	};
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

function handleScroll() {
	showDropdown.value = false; // Hide dropdown on scroll
}
watchEffect(() => {
	isSearchDisabled.value = !!(
		localSearchArray.value &&
		Object.keys(localSearchArray.value).length === 1 &&
		(
			localSearchArray.value[
				Object.keys(localSearchArray.value)[0] as "and" | "or"
			]?.[0] as any
		)[0] === null
	);

	dataTablePagination.value = {
		disabled: !data.value?.options.total,
		simple: isMobile,
		showSizePicker:
			data.value?.options &&
			(!data.value.options.perPage ||
				(data.value.options.total as number) > data.value.options.perPage),
		pageSizes: [15, 30, 60, 100, 500],
		prefix: ({ itemCount }: { itemCount?: number }) => itemCount,
		...pagination,
	};
});
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const hiddenColumns = useCookie<Record<string, string[]>>("hiddenColumns", {
	default: () => ({}) as Record<string, string[]>,
	sameSite: true,
});
function setColumns() {
	columns.value = [
		...(table.value.allowedMethods !== "r"
			? [
					{
						type: "selection",
						fixed: "left",
						options: [
							{
								label: t("delete"),
								key: "delete",
								disabled: checkedRowKeys.value.length === 0,
								icon: () => h(NIcon, () => h(IconTrash)),
								onSelect: async () => {
									await DELETE(checkedRowKeys.value);
									checkedRowKeys.value = [];
								},
							},
							{
								label: t("clearTable"),
								key: "clear",
								disabled:
									checkedRowKeys.value.length !== data.value?.result?.length,
								icon: () => h(NIcon, () => h(IconTableMinus)),
								onSelect: async () => {
									await DELETE();
									checkedRowKeys.value = [];
								},
							},
							{
								label: t("columns"),
								key: "columns",
								icon: () => h(NIcon, () => h(IconColumns3)),
								children: table.value.schema?.map(({ id, key }) => ({
									label: t(key),
									key: id,
									// icon: () =>
									// 	h(NIcon, () =>
									// 		hiddenColumns.value[table.value.slug].includes(
									// 			id as string,
									// 		)
									// 			? h(IconEyeOff)
									// 			: h(IconEye),
									// 	),
									onSelect: () => {
										if (
											hiddenColumns.value[table.value.slug].includes(
												id as string,
											)
										)
											hiddenColumns.value[table.value.slug] =
												hiddenColumns.value[table.value.slug].filter(
													(itemID) => itemID !== id,
												);
										else
											hiddenColumns.value[table.value.slug].push(id as string);
									},
								})),
							},
						],
					},
				]
			: []),
		...(table.value.schema
			?.filter(
				({ id }) =>
					!hiddenColumns.value[table.value.slug]?.includes(id as string),
			)
			.map((field) => ({
				title: () =>
					h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
						getField(field).icon(),
						h(NPerformantEllipsis, () => t(field.key)),
					]),
				width: t(field.key).length > 10 ? t(field.key).length * 14 : 150,
				key: field.key,
				sorter: !!data.value?.result,
				ellipsis: {
					tooltip: true,
				},
				resizable:
					(!Array.isArray(field.type) && field.type !== "array") ||
					(Array.isArray(field.type) && !field.type.includes("array")),
				sortOrder: sortObject.value[field.key]
					? `${sortObject.value[field.key]}end`
					: undefined,
				render: (row: Item) =>
					field.render
						? field.render(row)
						: h(Column, { value: row[field.key], field }),
			})) ?? []),
		...(isSlotEmpty("itemActions")
			? []
			: [
					{
						title: t("actions"),
						align: "center",
						width:
							150 +
							(slots.itemExtraButtons
								? (slots.itemExtraButtons as any)().length * 20
								: 0),
						key: "actions",
						fixed: "right",
						render: (row: any) =>
							slots.itemActions
								? slots.itemActions(row)
								: [
										slots.itemExtraActions
											? slots.itemExtraActions(row)
											: undefined,
										h(NButtonGroup, () =>
											[
												slots.itemExtraButtons
													? slots.itemExtraButtons(row)
													: undefined,
												table.value.allowedMethods?.includes("r")
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
																			to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value.slug}/${row.id}`,
																		},
																		() => h(NIcon, () => h(IconEye)),
																	),
															},
														)
													: null,
												table.value.allowedMethods?.includes("u")
													? h(
															NButton,
															{
																tag: "a",
																href: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value.slug}/${row.id}/edit`,
																onClick: (e) => {
																	e.preventDefault();
																	if (!isMobile)
																		openDrawer(
																			table.value.slug,
																			row.id,
																			structuredClone(toRaw(row)),
																		);
																	else
																		navigateTo(
																			`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value.slug}/${row.id}/edit`,
																		);
																},
																secondary: true,
																circle: true,
																type: "info",
															},
															{ icon: () => h(NIcon, () => h(IconPencil)) },
														)
													: null,
												table.value.allowedMethods?.includes("d")
													? h(
															NPopconfirm,
															{
																onPositiveClick: () => DELETE(row.id),
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
																default: () =>
																	t("theFollowingActionIsIrreversible"),
															},
														)
													: null,
											].filter((i) => i !== null),
										),
									],
					},
				]),
	] as DataTableColumns;

	tableWidth.value = columns.value.reduce(
		(accumulator: number, { width }) =>
			accumulator + ((width as number | undefined) ?? 0),
		40,
	);
}
watch(Language, setColumns, { immediate: true });

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>