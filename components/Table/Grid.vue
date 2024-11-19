<template>
    <NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:4">
        <NGridItem v-for="table in filteredTables" :key="table.slug">
            <NuxtLink :to="getTableUrl(table.slug)">
                <NCard hoverable>
                    <template #header>
                        <NFlex align="center">
                            <NIconWrapper :border-radius="50">
                                <NIcon style="font-style: normal">
                                    <component :is="getTableIcon(table)" />
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
                                    <IconArrowRight
                                        v-if="Hover[table.slug] || (table.slug === 'assets' && user?.role !== 'd7b3d61a582e53ee29b5a1d02a436d55')" />
                                    <IconDots v-else />
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
                                        <IconPlus />
                                    </NIcon>
                                </NFlex>
                            </NCard>
                        </template>
                        <NInputGroup>
                            <NInput v-model:value="newTableSlug" @keydown.enter.prevent="createTable"
                                :placeholder="t('tableSlug')">
                                <template #suffix>
                                    <NIcon>
                                        <IconLetterCase />
                                    </NIcon>
                                </template>
                            </NInput>
                            <NButton @click="createTable" :loading="Loading.Table">
                                <template #icon>
                                    <NIcon>
                                        <IconChevronRight />
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
    IconAppWindow,
    IconArrowRight,
    IconChevronRight,
    IconDots,
    IconFingerprint,
    IconFolders,
    IconLanguage,
    IconLetterCase,
    IconPlus,
    IconSettings,
    IconTournament,
    IconUsers,
    IconWebhook,
} from "@tabler/icons-vue";
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
import { NuxtLink } from "#components";

const modelValue = defineModel<Database>({ required: true })

defineTranslation({
    ar: {
        newTable: "جدول جديد",
        newItem: "عنصر جديد",
        tableFlows: "تدفقات الجدول",
        tableSlug: "إسم الجدول"
    }
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

const getDropdownOptions = (table: Table) => [
    {
        key: `${getTableUrl(table.slug)}/new`,
        label: t("newItem"),
        icon: () => h(NIcon, () => h(IconPlus)),
        show: table.slug !== "assets" && table.allowedMethods?.includes("c"),
    },
    {
        key: `${getTableUrl(table.slug)}/settings`,
        label: t("tableSettings"),
        icon: () => h(NIcon, () => h(IconSettings)),
        show: !["sessions", "translations", "assets"].includes(table.slug) && user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55",
    },
    {
        key: `${getTableUrl(table.slug)}/flows`,
        label: t("tableFlows"),
        icon: () => h(NIcon, () => h(IconWebhook)),
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