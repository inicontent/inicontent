<template>
    <NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:4">
        <NGridItem v-for="table in filteredTables" :key="table.slug">
            <NCard @click="navigateTo(`/${modelValue.slug}/admin/tables/${table.slug}`)" style="cursor: pointer"
                hoverable>
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
                    <NDropdown :options="getDropdownOptions(table)" :renderLabel="(renderLabel as any)">
                        <NButton circle @mouseover="Hover[table.slug] = true" @mouseleave="Hover[table.slug] = false">
                            <NIcon>
                                <component
                                    :is="Hover[table.slug] || (table.slug === 'asset' && user?.role !== 'd7b3d61a582e53ee29b5a1d02a436d55') ? IconArrowRight : IconDots" />
                            </NIcon>
                        </NButton>
                    </NDropdown>
                </template>
            </NCard>
        </NGridItem>

        <NGridItem>
            <NPopover placement="bottom">
                <template #trigger>
                    <NPopover trigger="click">
                        <template #trigger>
                            <NCard style="cursor: pointer" content-style="padding: 18px 0" hoverable>
                                <NFlex justify="center" align="center">
                                    <NIcon size="36">
                                        <IconPlus />
                                    </NIcon>
                                </NFlex>
                            </NCard>
                        </template>
                        <NInputGroup>
                            <NInput v-model:value="Table" @keydown.enter="createTable" :placeholder="t('tableSlug')">
                                <template #suffix>
                                    <NIcon>
                                        <IconLetterCase />
                                    </NIcon>
                                </template>
                            </NInput>
                            <NButton @click="createTable">
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
    IconArrowRight,
    IconChevronRight,
    IconDots,
    IconFingerprint,
    IconFolders,
    IconLanguage,
    IconLetterCase,
    IconPlus,
    IconSettings,
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
    NFlex
} from "naive-ui";

const modelValue = defineModel({
    type: Object as PropType<Database>,
    required: true
})

useLanguage({
    ar: {
        newTable: "جدول جديد",
        newItem: "عنصر جديد",
        tableSettings: "إعدادات الجدول",
        tableFlows: "تدفقات الجدول",
    },
    en: {},
});
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const user = useState<User>("user");
const Hover = ref<Record<string, boolean>>({});
const Table = ref(null);

const createTable = async () => {
    if (Table.value) {
        const bodyContent: string = toRaw(Table.value);
        Loading.value.Table = true;

        const data = await $fetch<apiResponse<Table>>(`${appConfig.apiBase}inicontent/database/${modelValue.value.slug}/${bodyContent}`, {
            method: "POST",
        });

        if (data.result) {
            modelValue.value.tables?.push(data.result);
            window.$message.success(data.message);
            Table.value = null;
        } else {
            window.$message.error(data.message ?? t("error"));
        }
        Loading.value.Table = false;
    } else {
        window.$message.error(t("inputsAreInvalid"));
    }
};

const filteredTables = computed(() =>
    modelValue.value.tables
        ?.filter(({ allowedMethods }) => allowedMethods?.includes("r"))
        .sort((a, b) =>
            Number(["user", "session", "translation", "asset"].includes(b.slug)) -
            Number(["user", "session", "translation", "asset"].includes(a.slug))
        )
);

const getTableIcon = (slug: string) => {
    switch (slug) {
        case "asset":
            return IconFolders;
        case "translation":
            return IconLanguage;
        case "user":
            return IconUsers;
        case "session":
            return IconFingerprint;
        default:
            return () => t(slug).charAt(0).toUpperCase();
    }
};

const getDropdownOptions = (table: Table) => [
    {
        key: `/${modelValue.value.slug}/admin/tables/${table.slug}/new`,
        label: t("newItem"),
        icon: () => h(NIcon, () => h(IconPlus)),
        show: table.slug !== "asset" && table.allowedMethods?.includes("c"),
    },
    {
        key: `/${modelValue.value.slug}/admin/tables/${table.slug}/settings`,
        label: t("tableSettings"),
        icon: () => h(NIcon, () => h(IconSettings)),
        show: table.slug !== "asset" && user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55",
    },
    {
        key: `/${modelValue.value.slug}/admin/tables/${table.slug}/flows`,
        label: t("tableFlows"),
        icon: () => h(NIcon, () => h(IconWebhook)),
        show: user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55",
    },
];

function renderLabel(option: { key: string; label: string }) {
    return h(
        "a",
        {
            href: option.key,
            onClick: (e) => {
                e.preventDefault();
                navigateTo(option.key);
            },
        },
        option.label as string,
    )
}
</script>