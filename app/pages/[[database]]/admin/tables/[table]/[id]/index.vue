<template>
    <NFlex vertical>
        <LazyFormDrawer v-if="!$device.isMobile" />
        <NCard style="height: fit-content">
            <template #header>
                <NPerformantEllipsis>{{ t(table.slug) }}: {{ itemLabel }}</NPerformantEllipsis>
            </template>
            <template v-if="table.schema && table.schema.length > 4" #header-extra>
                <NButtonGroup>
                    <NTooltip v-if="table.allowedMethods?.includes('u')" :delay="1500">
                        <template #trigger>
                            <NButton secondary round type="info">
                                <template #icon>
                                    <NuxtLink
                                        :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                                        <NIcon>
                                            <Icon name="tabler:pencil" />
                                        </NIcon>
                                    </NuxtLink>
                                </template>
                            </NButton>
                        </template>
                        {{ t('edit') }}
                    </NTooltip>

                    <NTooltip :delay="1500">
                        <template #trigger>
                            <NButton type="primary" @click="PRINT" round secondary>
                                <template #icon>
                                    <NIcon>
                                        <Icon name="tabler:printer" />
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
                    <NButton v-if="table.allowedMethods?.includes('u')" secondary round type="info">
                        <template #icon>
                            <NuxtLink
                                :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                                <NIcon>
                                    <Icon name="tabler:pencil" />
                                </NIcon>
                            </NuxtLink>
                        </template>

                        {{ t('edit') }}
                    </NButton>

                    <NButton type="primary" @click="PRINT" round secondary>
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:printer" />
                            </NIcon>
                        </template>
                        {{ t('print') }}
                    </NButton>
                </NButtonGroup>
            </template>
            <LazyDataS v-if="data && table.schema" :value="data" :schema="table.schema" />
        </NCard>
        <LazyTableLogs v-if="table.config?.log && data" :id="data.id" />
    </NFlex>
</template>

<script lang="ts" setup>
import Inison from "inison"

onBeforeRouteUpdate((route, currentRoute) => {
    if (`${decodeURIComponent(currentRoute.fullPath)}/edit` !== route.fullPath)
        clearNuxtState("currentItem")
})

definePageMeta({
    middleware: ["database", "user", "dashboard", "table", "global"],
    layout: "table",
})

const appConfig = useAppConfig()
const route = useRoute()
const database = useState<Database>("database")
const table = useState<Table>("table")

const sessionID = useCookie<string | null>("sessionID", {
    sameSite: true,
})

const { data } = await useFetch<Item>(
    `${appConfig.apiBase}${database.value.slug}/${table.value.slug
    }/${route.params.id}`,
    {
        query: {
            options: Inison.stringify({
                columns: table.value.columns,
            }),
            [`${database.value.slug}_sid`]: sessionID.value,
        },
        transform: (input) => input.result,
        credentials: "include",
    },
)

if (!data.value?.id)
    throw createError({
        statusCode: 404,
        statusMessage: "item",
        fatal: true,
    })

function PRINT() {
    window.print()
}

const currentItem = useState<Item>("currentItem")
currentItem.value = data.value
const itemLabel = renderLabel(table.value, data.value)

useHead({
    title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${itemLabel}`,
    link: [
        { rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
    ],
})
</script>