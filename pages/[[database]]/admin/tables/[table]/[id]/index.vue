<template>
    <NCard style="height: fit-content">
        <template #header>
            <NEllipsis>{{ t(table.slug) }}: {{ itemLabel }}</NEllipsis>
        </template>
        <template v-if="table.schema && table.schema.length > 4" #header-extra>
            <NButtonGroup>
                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton disabled round secondary>
                            <template #icon>
                                <NIcon>
                                    <IconSettings />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('settings') }}
                </NTooltip>

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton secondary round type="info" tag="a"
                            :href="`/${database.slug}/admin/tables/${table.slug}/${$route.params.id}/edit`"
                            @click.prevent.stop="() => navigateTo(
                                `/${database.slug}/admin/tables/${table.slug}/${$route.params.id}/edit`,
                            )">
                            <template #icon>
                                <NIcon>
                                    <IconPencil />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('edit') }}
                </NTooltip>

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton type="primary" @click="PRINT" round secondary>
                            <template #icon>
                                <NIcon>
                                    <IconPrinter />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('print') }}
                </NTooltip>
            </NButtonGroup>
        </template>
        <template #actions>
            <NButtonGroup>
                <NButton disabled round secondary>
                    <template #icon>
                        <NIcon>
                            <IconSettings />
                        </NIcon>
                    </template>
                    {{ t('settings') }}
                </NButton>

                <NButton secondary round type="info" tag="a"
                    :href="`/${database.slug}/admin/tables/${table.slug}/${$route.params.id}/edit`" @click.prevent.stop="() => navigateTo(
                        `/${database.slug}/admin/tables/${table.slug}/${$route.params.id}/edit`,
                    )">
                    <template #icon>
                        <NIcon>
                            <IconPencil />
                        </NIcon>
                    </template>

                    {{ t('edit') }}
                </NButton>

                <NButton type="primary" @click="PRINT" round secondary>
                    <template #icon>
                        <NIcon>
                            <IconPrinter />
                        </NIcon>
                    </template>
                    {{ t('print') }}
                </NButton>
            </NButtonGroup>
        </template>
        <LazyRenderDatas v-if="itemObject" v-model="itemObject" :schema="table.schema" />
    </NCard>
</template>

<script lang="ts" setup>
import {
    NButton,
    NCard,
    NEllipsis,
    NIcon,
    NTooltip,
    NButtonGroup,
} from "naive-ui";
import { IconPencil, IconPrinter, IconSettings } from "@tabler/icons-vue";

clearNuxtState("itemLabel");

definePageMeta({
    middleware: ["dashboard", "table"],
    layout: "table",
});

useLanguage({
    ar: {
        print: "طباعة",
        edit: "تعديل"
    },
    en: {},
});

const route = useRoute()
const database = useState<Database>("database")
const table = useState<Table>("table")
const { data: itemObject } = await useFetch<Item>(
    `${useRuntimeConfig().public.apiBase}${database.value.slug}/${table.value.slug
    }/${route.params.id}`,
    {

        transform: (input) => input.result
    }
)

if (!itemObject.value?.id)
    throw createError({
        statusCode: 404,
        statusMessage: "item",
        fatal: true
    });

function PRINT() {
    window.print()
}

const itemLabel = useState("itemLabel", () =>
    renderLabel(table.value.label, table.value.schema, itemObject.value),
)


useHead({
    title: `${database.value.slug} | ${t(table.value.slug)} > ${itemLabel.value}`,
    link: [{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" }],
});
</script>

<style lang="css">
@media only print {
    * {
        max-height: unset !important;
        overflow: visible !important;
        visibility: hidden !important;
        color: #000 !important;
        fill: #000;
    }

    .n-button__icon,
    .n-card-header {
        display: none !important;
    }

    #__nuxt,
    #__nuxt .n-config-provider,
    #__nuxt .n-config-provider .n-layout,
    #__nuxt .n-config-provider .n-layout .n-layout-scroll-container>div:nth-child(2),
    #__nuxt .n-config-provider .n-layout .n-layout-scroll-container>div:nth-child(2) #PRINT_CONTENT * {
        top: 0 !important;
        visibility: visible !important;
    }

    #PRINT_CONTENT {
        position: absolute !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
        left: 0 !important;
        z-index: 9999999 !important;
    }
}
</style>
