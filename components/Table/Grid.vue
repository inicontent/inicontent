<template>
    <NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:4">
        <NGridItem v-for="table in filteredTables" :key="table.slug">
            <NuxtLink :to="getTableUrl(table.slug)">
                <NCard hoverable>
                    <template #header>
                        <NFlex align="center">
                            <NIconWrapper :border-radius="50">
                                <NIcon style="font-style: normal">
                                    <component :is="getTableIcon(table.slug)" />
                                </NIcon>
                            </NIconWrapper>
                            <NH4 style="margin: 0">{{ t(table.slug) }}</NH4>
                        </NFlex>
                    </template>
                    <template #header-extra>
                        <NDropdown :options="getDropdownOptions(table)" :renderLabel>
                            <NButton circle @mouseover="Hover[table.slug] = true"
                                @mouseleave="Hover[table.slug] = false">
                                <NIcon>
                                    <DataIcon value="arrow-right"
                                        v-if="Hover[table.slug] || (table.slug === 'assets' && user?.role !== 'd7b3d61a582e53ee29b5a1d02a436d55')" />
                                    <DataIcon value="dots" v-else />
                                </NIcon>
                            </NButton>
                        </NDropdown>
                    </template>
                </NCard>
            </NuxtLink>
        </NGridItem>

        <NGridItem>
            <NPopover placement="bottom">
                <template #trigger>
                    <NPopover trigger="click" v-model:show="showPopover">
                        <template #trigger>
                            <NCard style="cursor: pointer" content-style="padding: 18px 0" hoverable
                                @click="showPopover = !showPopover">
                                <NFlex justify="center" align="center">
                                    <NIcon size="36">
                                        <DataIcon value="plus" />
                                    </NIcon>
                                </NFlex>
                            </NCard>
                        </template>
                        <NInputGroup>
                            <NInput v-model:value="newTableSlug" @keydown.enter.prevent="createTable"
                                :placeholder="t('tableSlug')">
                                <template #suffix>
                                    <NIcon>
                                        <DataIcon value="leter-case" />
                                    </NIcon>
                                </template>
                            </NInput>
                            <NButton @click="createTable" :loading="Loading.Table">
                                <template #icon>
                                    <NIcon>
                                        <DataIcon value="chevron-right" />
                                    </NIcon>
                                </template>
                            </NButton>
                        </NInputGroup>
                    </NPopover>
                </template>
                {{ t('newTable') }}
            </NPopover>
        </NGridItem>
    </NGrid>
</template>

<script lang="ts" setup>
import {
    NButton,
    NCard,
    NDropdown,
    NGridItem,
    NGrid,
    NH4,
    NIcon,
    NIconWrapper,
    NInput,
    NInputGroup,
    NPopover,
    NFlex,
    type DropdownOption
} from "naive-ui";
import { DataIcon, NuxtLink } from "#components";

const modelValue = defineModel<Database>({ required: true })

useLanguage({
    ar: {
        newTable: "جدول جديد",
        newItem: "عنصر جديد",
        tableFlows: "تدفقات الجدول",
        tableSlug: "إسم الجدول"
    },
    en: {},
});

const showPopover = ref(false)

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const user = useState<User>("users");
const Hover = ref<Record<string, boolean>>({});
const newTableSlug = ref();
const route = useRoute()
const database = useState<Database>("database");

function getTableUrl(slug: string) {
    if (!route.params.database && database.value?.slug !== 'inicontent')
        return `/admin/tables/${slug}`

    return `/${modelValue.value.slug}/admin/tables/${slug}`
}

const createTable = async () => {
    if (newTableSlug.value) {
        const bodyContent: string = toRaw(newTableSlug.value);
        Loading.value.Table = true;

        const data = await $fetch<apiResponse<Table>>(`${appConfig.apiBase}inicontent/databases/${modelValue.value.slug}/${bodyContent}`, {
            method: "POST",
        });

        if (data.result) {
            modelValue.value.tables?.push(data.result);
            window.$message.success(data.message);
            newTableSlug.value = null;
            showPopover.value = false
        } else
            window.$message.error(data.message ?? t("error"));
        Loading.value.Table = false;
    } else
        window.$message.error(t("inputsAreInvalid"));
};

const filteredTables = computed(() =>
    modelValue.value.tables
        ?.filter(({ allowedMethods }) => allowedMethods?.includes("r"))
        .sort((a, b) =>
            Number(["users", "sessions", "translations", "assets"].includes(b.slug)) -
            Number(["users", "sessions", "translations", "assets"].includes(a.slug))
        )
);

const getTableIcon = (slug: string) => {
    switch (slug) {
        case "assets":
            return h(DataIcon, { value: "folders" });
        case "translations":
            return h(DataIcon, { value: "language" });
        case "users":
            return h(DataIcon, { value: "users" });
        case "sessions":
            return h(DataIcon, { value: "fingerprint" });
        case "pages":
            return h(DataIcon, { value: "app-window" });
        case "components":
            return h(DataIcon, { value: "tournament" });
        default:
            return () => t(slug).charAt(0).toUpperCase();
    }
};

const getDropdownOptions = (table: Table) => [
    {
        key: `${getTableUrl(table.slug)}/new`,
        label: t("newItem"),
        icon: () => h(NIcon, () => h(DataIcon, { value: "plus" })),
        show: table.slug !== "assets" && table.allowedMethods?.includes("c"),
    },
    {
        key: `${getTableUrl(table.slug)}/settings`,
        label: t("tableSettings"),
        icon: () => h(NIcon, () => h(DataIcon, { value: "settings" })),
        show: !["sessions", "translations", "assets"].includes(table.slug) && user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55",
    },
    {
        key: `${getTableUrl(table.slug)}/flows`,
        label: t("tableFlows"),
        icon: () => h(NIcon, () => h(DataIcon, { value: "webhook" })),
        show: !["sessions", "translations"].includes(table.slug) && user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55",
    },
];

function renderLabel(option: DropdownOption) {
    return h(
        NuxtLink,
        {
            to: option.key as string
        },
        () => option.label,
    )
}
</script>