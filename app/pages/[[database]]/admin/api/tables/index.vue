<template>
    <NCard :title="t('apiDocumentation')" style="background:none" :bordered="false">
        <template #header-extra>
            <NuxtLink :to="authDocsUrl">{{ t('apiDocs.viewAuthDocs') }}</NuxtLink>
        </template>
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
                    <NFlex vertical size="small">
                        <NFlex wrap :size="6">
                            <NTag v-for="method in tableOption.methods" :key="method.key" :type="method.type" round>
                                {{ method.label }}
                            </NTag>
                        </NFlex>
                    </NFlex>
                </NCard>
            </NGridItem>
        </NGrid>
    </NCard>
</template>

<script setup lang="ts">
import { LazyTableIcon, NuxtLink } from "#components"

definePageMeta({
    layout: "dashboard",
    middleware: ["database", "user", "dashboard", "global"],
})

const route = useRoute()
const database = useState<Database>("database")
const basePath = computed(() => (route.params.database ? `/${route.params.database}` : ""))
const authDocsUrl = computed(() => `${basePath.value}/admin/api/auth`)

const methodMeta = {
    c: { key: "post", type: "success", label: t("post") },
    r: { key: "get", type: "info", label: t("get") },
    u: { key: "put", type: "warning", label: t("put") },
    d: { key: "delete", type: "error", label: t("delete") },
} as const

const documentedTables = computed(() =>
    (database.value?.tables ?? [])
        .map((tableItem) => {
            const methods = tableItem.allowedMethods ? tableItem.allowedMethods.split("")
                .map((methodKey) => methodMeta[methodKey as keyof typeof methodMeta]) : []
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
