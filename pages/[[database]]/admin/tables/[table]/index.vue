<template>
    <LazyTableDrawer v-if="!isMobile" />
    <NCard :title="t(table.slug) ?? '--'" style="background:none" :header-style="{ paddingRight: 0, paddingLeft: 0 }"
        content-style="padding: 0" :bordered="false">
        <template #header-extra>
            <NButtonGroup>
                <NPopover :disabled="!whereQuery && (!data?.result || !table?.schema)" style="max-height: 240px;"
                    :style="`width: ${isMobile ? '350px' : '500px'}`" placement="bottom-end" trigger="click" scrollable>
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
                                    :disabled="isSearchDisabled" @click="resetSearch">
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
                    <TableSearch v-model="searchArray" :callback="executeSearch" />
                </NPopover>
                <NDropdown :options="toolsDropdownOptions" trigger="click">
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

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton round :disabled="!table.schema" tag="a"
                            :href="table.schema ? `${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new` : '#'"
                            @click.prevent="() => {
                                if (!isMobile)
                                    Drawer = {
                                        ...Drawer,
                                        table: table.slug,
                                        id: null,
                                        data: {},
                                        show: true,
                                    };
                                else
                                    navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`,
                                    );
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
            </NButtonGroup>
        </template>
        <NDataTable :bordered="false" :scroll-x="tableWidth" resizable id="DataTable" remote ref="dataRef" :columns
            :data="data?.result ?? []" :loading="Loading.data" :pagination="dataTablePagination"
            :row-key="(row) => row.id" v-model:checked-row-keys="checkedRowKeys" @update:sorter="handleSorterChange" />
    </NCard>
</template>

<script setup lang="ts">
import {
	IconEye,
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
	NTooltip,
} from "naive-ui";
import { NuxtLink, Column } from "#components";

onBeforeRouteUpdate(() => {
	clearNuxtState("Drawer");
});

definePageMeta({
	middleware: ["database", "user", "dashboard", "table"],
	layout: "table",
});

defineTranslation({
	ar: {
		search: "بحث",
		reset: "إفراغ",
		tools: "الأدوات",
	},
});

const route = useRoute();
const router = useRouter();
const database = useState<Database>("database");
const table = useState<Table>("table");
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const { isMobile } = useDevice();

const whereQuery = ref<string | undefined>(
	route.query.search as string | undefined,
);
const searchArray = ref<{
	and?: [string | null, string, any][];
	or?: [string | null, string, any][];
}>(
	route.query.search
		? generateSearchArray(Inison.unstringify(route.query.search as string))
		: { and: [[null, "=", null]] },
);
const isSearchDisabled = computed(
	() =>
		searchArray.value.and?.length === 1 && searchArray.value.and[0][0] === null,
);
function resetSearch() {
	searchArray.value = {
		and: [[null, "=", null]],
	};
	if (whereQuery.value) whereQuery.value = undefined;
}
function executeSearch() {
	whereQuery.value = Inison.stringify(generateSearchInput(searchArray.value));
	pagination.onUpdatePage(1);
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

const Drawer = useState<{
	show: boolean;
	id: null | string;
	table: null | string;
	data: any;
}>("Drawer", () => ({
	show: false,
	id: null,
	table: null,
	data: {},
}));
const dataRef = ref(null);
const checkedRowKeys = ref<string[]>([]);
const pagination = reactive({
	page: route.query.page ? Number(route.query.page) : 1,
	pageCount: 1,
	pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
	itemCount: 0,
	onUpdatePage(currentPage: number) {
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
	},
	onUpdatePageSize(pageSize: number) {
		const OLD_pageSize = JSON.parse(JSON.stringify(pagination.pageSize));
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

const { data } = await useLazyFetch<apiResponse<Item[]>>(
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
			if (total && totalPages) {
				pagination.pageCount = totalPages;
				pagination.itemCount = total;
			}
		},
	},
);
const dataTablePagination = computed(() => ({
	disabled: !data.value?.options.total,
	simple: isMobile,
	showSizePicker:
		data.value?.options &&
		(!data.value.options.perPage ||
			(data.value.options.total as number) > data.value.options.perPage),
	pageSizes: [15, 30, 60, 100, 500],
	prefix: ({ itemCount }: { itemCount?: number }) => itemCount,
	...pagination,
}));

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
		disabled: true,
		children: [
			{
				label: t("export_current_data"),
				key: "export_current_data",
			},
			{
				label: t("export_all_data"),
				key: "export_all_data",
			},
		],
	},
];

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

const columns: any = computed(() => [
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
					],
				},
			]
		: []),
	...(table.value.schema ?? []).map((field) => ({
		title: () =>
			h(NFlex, { align: "center", justify: "start" }, () => [
				getField(field).icon(),
				t(field.key),
			]),
		width: t(field.key).length > 10 ? t(field.key).length * 14 : 150,
		key: field.key,
		sorter: !!data.value?.result,
		ellipsis: {
			tooltip: true,
		},
		sortOrder: sortObject.value[field.key]
			? `${sortObject.value[field.key]}end`
			: false,
		render: (row: { [x: string]: any }) =>
			h(Column, { value: row[field.key], field }),
	})),
	{
		title: t("actions"),
		fixed: !isMobile ? "right" : false,
		align: "center",
		width: 150,
		key: "actions",
		render(row: { id: string }) {
			return h(NButtonGroup, () =>
				[
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
											Drawer.value = {
												...Drawer.value,
												id: row.id,
												table: table.value.slug as string,
												data: JSON.parse(JSON.stringify(row)),
												show: true,
											};
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
									default: () => t("theFollowingActionIsIrreversible"),
								},
							)
						: null,
				].filter((i) => i !== null),
			);
		},
	},
]);
const tableWidth = computed(() =>
	columns.value.reduce(
		(accumulator: number, value: any) => accumulator + (value.width ?? 0),
		40,
	),
);

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>