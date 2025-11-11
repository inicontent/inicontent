<template>
    <NCard :title="t('apiDocumentation')" style="background:none" :bordered="false">
        <NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:3">
            <NGridItem v-for="tableOption in documentedTables" :key="tableOption.slug">
                <NCard hoverable>
                    <template #header>
                        <NuxtLink :to="tableOption.url">
                            <NFlex align="center">
                                <NIconWrapper :border-radius="50" style="font-style: normal">
                                    <LazyTableIcon :table="tableOption" />
                                </NIconWrapper>
                                <NH4 style="margin: 0">{{ t(tableOption.slug) }}</NH4>
                            </NFlex>
                        </NuxtLink>
                    </template>
                    <template #header-extra>
                        <NButton tag="div" size="small" quaternary>
                            <NuxtLink :to="tableOption.url">
                                <NFlex align="center" size="small">
                                    <Icon name="tabler:arrow-up-right" />
                                    <span>{{ t('openDocumentation') }}</span>
                                </NFlex>
                            </NuxtLink>
                        </NButton>
                    </template>
                    <NFlex vertical size="small">
                        <NText type="secondary">{{ t('availableMethods') }}</NText>
                        <NFlex wrap :size="6">
                            <NTag v-for="method in tableOption.methods" :key="method.key" :type="method.type" round>
                                {{ `${method.http} - ${method.label}` }}
                            </NTag>
                        </NFlex>
                    </NFlex>
                </NCard>
            </NGridItem>
        </NGrid>
    </NCard>
</template>

<script setup lang="ts">
import { LazyTableIcon, NuxtLink, Icon } from "#components"

definePageMeta({
    layout: "dashboard",
    middleware: ["database", "user", "dashboard", "global"],
})

const route = useRoute()
const database = useState<Database>("database")

const methodMeta = {
    c: { key: "post", http: "POST", type: "success", label: () => t("post") },
    r: { key: "get", http: "GET", type: "info", label: () => t("get") },
    u: { key: "put", http: "PUT", type: "warning", label: () => t("put") },
    d: { key: "delete", http: "DELETE", type: "error", label: () => t("delete") },
} as const

const documentedTables = computed(() =>
    (database.value?.tables ?? [])
        .filter(({ allowedMethods, show }) => allowedMethods && show !== false)
        .map((tableItem) => {
            const methods = Array.from(new Set((tableItem.allowedMethods ?? "").split("").filter(Boolean)))
                .map((methodKey) => methodMeta[methodKey as keyof typeof methodMeta])
                .filter(Boolean)
                .map((method) => ({
                    key: method.key,
                    http: method.http,
                    type: method.type,
                    label: method.label(),
                }))
            return {
                ...tableItem,
                methods,
                url: `${route.params.database ? `/${route.params.database}` : ""}/admin/api/tables/${tableItem.slug}`,
            }
        })
        .filter(({ methods }) => methods.length > 0),
)

useHead({
    title: `${t(database.value?.slug ?? "inicontent")} | ${t("apiDocumentation")}`,
})
</script>
