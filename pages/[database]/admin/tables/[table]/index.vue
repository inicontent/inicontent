<template>
    <LazyTableDrawer v-if="isMobile" />
    <NCard :title="t(table.slug) ?? '--'" style="background:none" :header-style="{ paddingRight: 0, paddingLeft: 0 }"
        content-style="padding: 0" :bordered="false">
        <template #header-extra>
            <NButtonGroup>
                <NPopover :disabled="!searchQuery &&
                    (!data?.result ||
                        !database.tables?.find(
                            ({ slug }) => slug === table.slug,
                        )?.schema)" :style="{
                            maxHeight: '240px',
                            width: isMobile ? '350px' : '500px',
                        }" placement="bottom-end" trigger="click" scrollable>
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
                            <NButton :loading="Loading.data" :disabled="searchArray.and?.length === 1 &&
                                searchArray.and[0][0] === null" @click="() => {
                                    searchArray = {
                                        and: [[null, '=', null]],
                                    };
                                    if (searchQuery) {
                                        searchQuery = undefined;
                                        refresh();
                                    }
                                }">
                                <template #icon>
                                    <NIcon>
                                        <IconX />
                                    </NIcon>
                                </template>
                                {{ t("reset") }}
                            </NButton>
                            <NButton :loading="Loading.data" :disabled="searchArray.and?.length === 1 &&
                                searchArray.and[0][0] === null" @click="() => {
                                    searchQuery = searchArray
                                        ? generateSearchInput(searchArray)
                                        : undefined;
                                    pagination.page = 1;
                                }">
                                <template #icon>
                                    <NIcon>
                                        <IconSearch />
                                    </NIcon>
                                </template>
                                {{ t("search") }}
                            </NButton>
                        </NFlex>
                    </template>
                    <LazyRenderSearch />
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
                            :href="table.schema ? `/${database.slug}/admin/tables/${table.slug}/new` : ''"
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
                                    navigateTo(`/${database.slug}/admin/tables/${table.slug}/new`,
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
        <NDataTable :scroll-x="tableWidth" resizable id="DataTable" remote ref="dataRef" :columns="tableColumns"
            :data="data?.result ?? []" :loading="Loading.data" :pagination="{
                simple: isMobile,
                showSizePicker: data?.options && (!data.options.perPage || (
                    data.options.total as number >= data.options.perPage)),
                pageSizes: [15, 30, 60, 100, 500],
                prefix: ({ itemCount }) => itemCount, ...pagination
            }" :row-key="(row) => row.id" :checked-row-keys="checkedRowKeys"
            @update-checked-row-keys="(keys) => checkedRowKeys = keys" @update:page="onUpdatePage"
            @update:page-size="onUpdatePageSize" @update:sorter="handleSorterChange" />
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
    useMessage,
} from "naive-ui";
import {
    LazyRenderColumn,
} from "#components";

onBeforeMount(() => {
    clearNuxtState(["Drawer", "searchArray", "searchQuery"]);
});

definePageMeta({
    middleware: ["dashboard", "table"],
    layout: "table",
});

const route = useRoute(),
    router = useRouter(),
    database = useState<Database>("database"),
    table = useState<Table>("table");

useLanguage({
    ar: {
        clickToCopy: "نسخ",
        textCopied: "تم نسخ النص",
        viewTheItem: "مُعاينة العنصر",
        new: "جديد",
        createdAt: "أُضيف",
        updatedAt: "عُدِّل",
        update: "تحديث",
        create: "إنشاء",
        delete: "حذف",
        theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
        edit: "تعديل",
        published: "المنشورة",
        trash: "سلة المهملات",
        id: "المُعرف",
        actions: "الأوامر",
        tableSettings: "إعدادات الجدول",
        search: "بحث",
        reset: "إفراغ",
        tools: "الأدوات",
        andGroup: "مجموعة و",
        orGroup: "مجموعة أو",
    },
    en: {},
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({})),
    { isMobile } = useDevice(),
    searchQuery = useState<string | undefined>("searchQuery", () =>
        route.query.search as string | undefined,
    ),
    searchArray = useState<{
        and?: [string | null, string, any][];
        or?: [string | null, string, any][];
    }>("searchArray", () =>
        route.query.search
            ? generateSearchArray(
                Inison.unstringify(route.query.search as string),
            )
            : { and: [[null, "=", null]] },
    );

const message = useMessage(),
    Drawer = useState<{
        show: boolean;
        id: null | string;
        table: null | string;
        data: any;
    }>("Drawer", () => ({
        show: false,
        id: null,
        table: null,
        data: {},
    })),
    dataRef = ref(null),
    checkedRowKeys = ref<any>([]),
    pagination = useState("pagination", () => ({
        page: route.query.page ? Number(route.query.page) : 1,
        pageCount: 1,
        pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
        itemCount: 0,
    })),
    queryOptions = ref(
        Inison.stringify({
            page: pagination.value.page,
            perPage: pagination.value.pageSize,
            columns: [],
        }),
    );
function onUpdatePage(currentPage: number) {
    pagination.value.page = currentPage;
    let { page, ...Query }: any = route.query;
    Query = {
        ...Query,
        page: currentPage !== 1 ? currentPage : undefined,
    };
    router.push({ query: Query });
    queryOptions.value = Inison.stringify({
        ...Inison.unstringify(queryOptions.value),
        page: pagination.value.page,
    });
}
function onUpdatePageSize(pageSize: number) {
    const OLD_pageSize = JSON.parse(
        JSON.stringify(pagination.value.pageSize),
    );
    pagination.value.pageSize = pageSize;
    let { perPage, page, ...Query }: any = route.query;
    if (pageSize !== 15) {
        pagination.value.page = Math.round(
            OLD_pageSize < pageSize
                ? page / (pageSize / OLD_pageSize)
                : page * (pageSize / OLD_pageSize),
        );
        Query = {
            ...Query,
            perPage: pageSize,
            page:
                pagination.value.page === 1 ? undefined : pagination.value.page,
        };
    }
    router.push({ query: Query });
    queryOptions.value = Inison.stringify({
        ...Inison.unstringify(queryOptions.value),
        perPage: pageSize,
        page:
            pagination.value.page === 1 ? undefined : pagination.value.page,
    });
}

const { data, refresh } = await useLazyFetch<
    apiResponse<Item[]>
>(
    `${useRuntimeConfig().public.apiBase}${database.value.slug}/${table.value.slug
    }`,
    {
        query: {
            options: queryOptions,
            where: searchQuery,
        },
        onRequest() {
            Loading.value.data = true;
        },
        onResponse({ response }) {
            Loading.value.data = false;
            if (response._data.options.total && response._data.options.totalPages) {
                pagination.value.pageCount = response._data.options.totalPages;
                pagination.value.itemCount = response._data.options.total;
            }
        },
    },
);

const DELETE = async (id: string) => {
    Loading.value.data = true;
    const deleteResponse = await $fetch<apiResponse>(
        `${useRuntimeConfig().public.apiBase}${database.value.slug}/${table.value.slug
        }/${id}`,
        {
            method: "DELETE",
        },
    );
    if (data.value)
        data.value.result = data.value.result.filter(
            (item) => item.id && item.id !== id,
        );
    pagination.value.itemCount--
    message.success(deleteResponse?.message ?? t("error"));
    Loading.value.data = false;
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
]

const sortObject = ref<Record<string, "asc" | "desc">>({})

function handleSorterChange({ columnKey }: { columnKey: string }) {
    sortObject.value[columnKey] = sortObject.value[columnKey] === "desc" ? "desc" : "asc"
    console.log(sortObject.value[columnKey])
}

const tableColumns: any = [
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
                            Loading.value.data = true;
                            await $fetch<apiResponse>(
                                `${useRuntimeConfig().public.apiBase}${database.value.slug
                                }/${table.value.slug}`,
                                {
                                    method: "DELETE",
                                    body: checkedRowKeys.value,
                                } as any,
                            );
                            message.success("Deleted Successfully");
                            await refresh();
                        },
                    },
                ],
            },
        ]
        : []),
    ...(table.value.schema ?? []).map((field) => ({
        title: () =>
            h(NFlex, { align: "center", justify: "start" }, () => [
                getField(
                    Array.isArray(field.subType ?? field.type) &&
                        (field.subType ?? field.type).includes("table")
                        ? "table"
                        : field.subType ?? field.type,
                ).icon(),
                t(field.key),
            ]),
        width: t(field.key).length > 10 ? t(field.key).length * 13 : 130,
        key: field.key,
        sorter: true,
        sortOrder: Object.hasOwn(sortObject.value, field.key) ? (sortObject.value[field.key] === "asc" ? "ascend" : "descend") : false,
        render: (row: { [x: string]: any }) =>
            h(LazyRenderColumn, { value: row[field.key], field }),
    })),
    {
        title: t("actions"),
        fixed: !isMobile ? "right" : false,
        align: "center",
        width: 150,
        key: "actions",
        render(row: { id: any }) {
            return h(NButtonGroup, () => [
                table.value.allowedMethods?.includes("r")
                    ? h(
                        NPopover,
                        {},
                        {
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                        tag: "a",
                                        href: `/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}`,
                                        onClick: (e) => {
                                            e.preventDefault();
                                            navigateTo(
                                                `/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}`,
                                            );
                                        },
                                        secondary: true,
                                        circle: true,
                                        type: "primary",
                                    },
                                    { icon: () => h(NIcon, () => h(IconEye)) },
                                ),
                            default: () => t("viewTheItem"),
                        },
                    )
                    : null,
                table.value.allowedMethods?.includes("u")
                    ? h(
                        NPopover,
                        {},
                        {
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                        tag: "a",
                                        href: `/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}/edit`,
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
                                                    `/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}/edit`,
                                                );
                                        },
                                        secondary: true,
                                        circle: true,
                                        type: "info",
                                    },
                                    { icon: () => h(NIcon, () => h(IconPencil)) },
                                ),
                            default: () => t("edit"),
                        },
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
                                    NPopover,
                                    {},
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
                                        default: () => t("delete"),
                                    },
                                ),
                            default: () => t("theFollowingActionIsIrreversible"),
                        },
                    )
                    : null,
            ]);
        },
    },
].filter((i) => i !== null)

const tableWidth = tableColumns.reduce((accumulator: number, value: any) => (accumulator + (value.width ?? 0)), 40)

watch(searchQuery, (v) => {
    const { search, page, ...Query }: any = route.query;
    return v
        ? router.push({
            query: {
                ...(Query ?? {}),
                search: Inison.stringify(v),
            },
        })
        : router.push({
            query: Query ?? {},
        });
});

useHead({
    title: `${database.value.slug} | ${t(
        table.value.slug ?? "",
    )} ${t("Table")}`,
    link: [{ rel: "icon", href: database.value?.icon ?? "" }],
});

</script>