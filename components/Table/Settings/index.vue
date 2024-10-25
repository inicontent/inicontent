<template>
    <NGrid x-gap="12" cols="12" layout-shift-disabled>
        <NGridItem :span="!isMobile ? 10 : 12">
            <NCard :title="t('tableSettings')" hoverable>
                <template #header-extra>
                    <NFlex>
                        <NTooltip :delay="500">
                            <template #trigger>
                                <NPopconfirm :show-icon="false" @positive-click="deleteTable">
                                    <template #activator>
                                        <NButton type="error" tertiary round :loading="Loading.deleteTable">
                                            <template #icon>
                                                <NIcon>
                                                    <IconTrash />
                                                </NIcon>
                                            </template>
                                        </NButton>
                                    </template>
                                    {{ t("theFollowingActionIsIrreversible") }}
                                </NPopconfirm>
                            </template>
                            {{ t("deleteTable") }}
                        </NTooltip>
                        <NButton round :loading="Loading.updateTable" @click="updateTable">
                            <template #icon>
                                <NIcon>
                                    <IconDeviceFloppy />
                                </NIcon>
                            </template>
                            <template v-if="!isMobile" #default>
                                {{ t('save') }}
                            </template>
                        </NButton>
                    </NFlex>
                </template>
                <NFlex vertical>
                    <NCard :title="t('generalSettings')" id="generalSettings" hoverable>
                        <NForm ref="tableRef" :model="tableCopy">
                            <RenderFieldS v-model="tableCopy" :schema="[
                                {
                                    key: 'slug',
                                    type: 'string',
                                    required: true,
                                },
                                {
                                    key: 'label',
                                    type: 'string',
                                    subType: 'mention',
                                    options: generateMentionOptions(
                                        table?.schema ?? [],
                                    ) as any
                                },
                            ]" />
                        </NForm>
                    </NCard>
                    <NCard :title="t('schemaSettings')" id="schemaSettings" hoverable>
                        <template #header-extra>
                            <NFlex>
                                <NTooltip :delay="500">
                                    <template #trigger>
                                        <NButton round :type="showDraggable ? 'primary' : 'default'" @click="showDraggable =
                                            !showDraggable">
                                            <template #icon>
                                                <NIcon>
                                                    <IconArrowsSort />
                                                </NIcon>
                                            </template>
                                        </NButton>
                                    </template>
                                    {{ t("changeOrder") }}
                                </NTooltip>
                                <NDropdown :options="fieldsList()" stlye="max-height: 200px" scrollable @select="(type) => tableCopy.schema.push({
                                    id: `temp-${randomID()}`,
                                    key: null,
                                    required: false,
                                    ...handleSelectedSchemaType(type),
                                })">
                                    <NButton round>
                                        <template #icon>
                                            <NIcon>
                                                <IconPlus />
                                            </NIcon>
                                        </template>
                                    </NButton>
                                </NDropdown>
                            </NFlex>
                        </template>
                        <NEmpty v-if="!tableCopy.schema || tableCopy.schema.length === 0" />
                        <NForm :class="{ notSortable: !showDraggable }" size="small">
                            <TableSettingsSchema v-model="tableCopy.schema" />
                        </NForm>
                    </NCard>
                </NFlex>
            </NCard>
        </NGridItem>
        <NGridItem v-if="!isMobile" span="2">
            <NAnchor affix listen-to="#container" :top="88" style="z-index: 1;" :bound="90">
                <NAnchorLink :title="t('generalSettings')" href="#generalSettings" />
                <NAnchorLink :title="t('schemaSettings')" href="#schemaSettings" />
            </NAnchor>
        </NGridItem>
    </NGrid>
</template>

<script lang="ts" setup>
import {
    IconArrowsSort,
    IconDeviceFloppy,
    IconPlus,
    IconTrash,
} from "@tabler/icons-vue";
import { isArrayOfObjects } from "inibase/utils";
import {
    type FormInst,
    type MentionOption,
    NAnchor,
    NAnchorLink,
    NButton,
    NCard,
    NDropdown,
    NEmpty,
    NFlex,
    NForm,
    NGridItem,
    NGrid,
    NIcon,
    NPopconfirm,
    NTooltip,
} from "naive-ui";

onMounted(() => {
    document.onkeydown = (e) => {
        if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
        e.preventDefault();
        updateTable();
    };
});

useLanguage({
    ar: {
        tableSettings: "ﻝﻭﺪﺠﻟا ﺕاﺩاﺪﻋﺇ",
        generalSettings: "ﺔﻣﺎﻋ ﺕاﺩاﺪﻋﺇ",
        schemaSettings: "ﺓﺪﻤﻋﻷا ﺕاﺩاﺪﻋﺇ",
        save: "ﻆﻔِﺣ",
        required: "ﻲﻣاﺰﻟﺇ",
        changeOrder: "ﺐﻴﺗﺮﺘﻟا ﺮﻴﻴﻐﺗ",
        theFollowingActionIsIrreversible: "ﻪﻴﻓ ﺔﻌﺟﺭ ﻻ ﻲﻟﺎﺘﻟا ءاﺮﺟﻹا",
    },
    en: {},
});
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
Loading.value.updateTable = false;
Loading.value.deleteTable = false;
const route = useRoute();
const router = useRouter();
const showDraggable = ref(false);
const { isMobile } = useDevice();
const database = useState<Database>("database");
const table = useState<Table>("table");
const tableRef = ref<FormInst | null>(null);
const tableCopy = ref(JSON.parse(JSON.stringify(table.value)));
async function updateTable() {
    tableRef.value?.validate(async (errors) => {
        if (!errors) {
            const bodyContent = JSON.parse(
                JSON.stringify(
                    (({ schema, slug, id, label }) => ({
                        schema,
                        slug,
                        id,
                        label,
                    }))(tableCopy.value),
                ),
            );
            Loading.value.updateTable = true;

            const data = await $fetch<apiResponse<Table>>(
                `${appConfig.apiBase}inicontent/database/${database.value.slug
                }/${route.params.table}`,
                {
                    method: "PUT",
                    body: bodyContent,
                },
            );
            const tableIndex = database.value.tables?.findIndex(
                ({ slug }) => slug === route.params.table,
            );
            if (
                tableIndex !== undefined &&
                tableIndex !== -1 &&
                database.value.tables &&
                data?.result
            ) {
                database.value.tables[tableIndex] = data.result;
                tableCopy.value = data.result;

                if (route.params.table !== data.result.slug)
                    router.replace({
                        params: { table: data.result.slug },
                    });
                window.$message.success(data?.message ?? t("success"));
            } else window.$message.error(data?.message ?? t("error"));

            Loading.value.updateTable = false;
        } else window.$message.error(t("inputsAreInvalid"));
    });
}
async function deleteTable() {
    Loading.value.deleteTable = true;
    const data = await $fetch<apiResponse>(
        `${appConfig.apiBase}inicontent/database/${database.value.slug
        }/${route.params.table}`,
        {
            method: "DELETE",
        },
    );
    if (data?.result) {
        const tableIndex = database.value.tables?.findIndex(
            ({ slug }) => slug === route.params.table,
        );
        if (tableIndex !== undefined && tableIndex !== -1)
            database.value.tables = database.value.tables?.toSpliced(tableIndex, 1);
        Loading.value.deleteTable = false;
        window.$message.success(data?.message ?? t("success"));
        setTimeout(
            async () =>
                await navigateTo(
                    `${route.params.database ? `/${database.value.slug}` : ""}/admin/tables`,
                ),
            800,
        );
    } else window.$message.error(data?.message ?? t("error"));
    Loading.value.deleteTable = false;
}
function generateMentionOptions(
    schema: Schema,
    prefix?: string,
): MentionOption[] {
    let RETURN: MentionOption[] = [];
    for (const field of schema) {
        if (field.id?.toString().startsWith("temp-")) continue;
        if (
            (Array.isArray(field.type) && field.subType !== "tags") ||
            (field.type === "array" &&
                field.children &&
                isArrayOfObjects(field.children)) ||
            field.type === "table"
        )
            continue;
        if (field.children && isArrayOfObjects(field.children))
            RETURN = [
                ...RETURN,
                ...generateMentionOptions(field.children, field.key),
            ];
        else
            RETURN.push({
                label: (prefix ? `${prefix}/` : "") + field.key,
                value: field.key,
            });
    }
    return RETURN;
}

useHead({
    title: `${t(database.value.slug)} | ${t(table.value.slug)} > ${t("settings")}`,
    link: [
        { rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
    ],
});
</script>