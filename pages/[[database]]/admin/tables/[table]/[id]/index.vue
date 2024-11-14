<template>
    <LazyTableDrawer v-if="!isMobile" />
    <NCard style="height: fit-content">
        <template #header>
            <NPerformantEllipsis>{{ t(table.slug) }}: {{ itemLabel }}</NPerformantEllipsis>
        </template>
        <template v-if="table.schema && table.schema.length > 4" #header-extra>
            <NButtonGroup>
                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton disabled round secondary>
                            <template #icon>
                                <NIcon>
                                    <DataIcon value="settings" />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('settings') }}
                </NTooltip>

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton secondary round type="info">
                            <template #icon>
                                <NuxtLink
                                    :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                                    <NIcon>
                                        <DataIcon value="pencil" />
                                    </NIcon>
                                </NuxtLink>
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
                                    <DataIcon value="printer" />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('print') }}
                </NTooltip>
            </NButtonGroup>
        </template>
        <template #action>
            <NButtonGroup>
                <NButton disabled round secondary>
                    <template #icon>
                        <NIcon>
                            <DataIcon value="settings" />
                        </NIcon>
                    </template>
                    {{ t('settings') }}
                </NButton>

                <NButton secondary round type="info">
                    <template #icon>
                        <NuxtLink
                            :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                            <NIcon>
                                <DataIcon value="pencil" />
                            </NIcon>
                        </NuxtLink>
                    </template>

                    {{ t('edit') }}
                </NButton>

                <NButton type="primary" @click="PRINT" round secondary>
                    <template #icon>
                        <NIcon>
                            <DataIcon value="printer" />
                        </NIcon>
                    </template>
                    {{ t('print') }}
                </NButton>
            </NButtonGroup>
        </template>
        <LazyDataS v-if="itemObject && table.schema" :value="itemObject" :schema="table.schema" />
    </NCard>
</template>

<script lang="ts" setup>
import {
    NButton,
    NCard,
    NPerformantEllipsis,
    NIcon,
    NTooltip,
    NButtonGroup,
} from "naive-ui";

onBeforeRouteUpdate((route, currentRoute) => {
    if (`${decodeURIComponent(currentRoute.fullPath)}/edit` !== route.fullPath)
        clearNuxtState("itemLabel");
});

definePageMeta({
    middleware: ["database", "user", "dashboard", "table"],
    layout: "table",
});

useLanguage({
    ar: {
        print: "طباعة",
    },
    en: {},
});

const { isMobile } = useDevice()
const appConfig = useAppConfig()
const route = useRoute()
const database = useState<Database>("database")
const table = useState<Table>("table")
const { data: itemObject } = await useFetch<Item>(
    `${appConfig.apiBase}${database.value.slug}/${table.value.slug
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

const itemLabel = useState("itemLabel", () => renderLabel(table.value.label, table.value.schema, itemObject.value))


useHead({
    title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${itemLabel.value}`,
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
    #__nuxt .n-config-provider .n-layout .n-layout-scroll-container>div:nth-child(2) #Printable * {
        top: 0 !important;
        visibility: visible !important;
    }

    #Printable {
        position: absolute !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
        left: 0 !important;
        z-index: 9999999 !important;
    }
}
</style>
