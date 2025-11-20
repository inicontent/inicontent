<template>
    <div class="api-table-doc-page" v-if="currentTable">
        <NCard class="api-table-doc-page__hero" :bordered="false">
            <NFlex wrap justify="space-between" align="center" :size="24">
                <NFlex align="center" :size="16">
                    <NIconWrapper :size="64">
                        <LazyTableIcon :table="currentTable" />
                    </NIconWrapper>
                    <div>
                        <NH2 class="api-table-doc-page__title">
                            {{ tableTitle }}
                        </NH2>
                        <NP class="api-table-doc-page__subtitle">
                            {{ t('table') }} · {{ currentTable.slug }}
                        </NP>
                    </div>
                </NFlex>
                <div class="api-table-doc-page__methods">
                    <NText strong>{{ t('apiDocs.availableMethods') }}</NText>
                    <NFlex wrap :size="8">
                        <NTag v-for="method in availableMethods" :key="method.key" :type="method.type" size="large"
                            round>
                            {{ method.label.toUpperCase() }}
                        </NTag>
                    </NFlex>
                </div>
            </NFlex>
        </NCard>

        <NCard :bordered="false">
            <template #header>
                <NFlex align="center" :size="8">
                    <Icon name="tabler:shield-lock" size="18" />
                    <span>{{ t('apiDocs.sessionNoticeTitle') }}</span>
                </NFlex>
            </template>
            <NFlex vertical :size="12">
                <NP>
                    {{
                        t('apiDocs.sessionNoticeDescription', {
                            param: sessionParamName,
                        })
                    }}
                </NP>
                <NFlex wrap :size="12">
                    <NTag type="info" size="large">{{ sessionParamName }}</NTag>
                    <NText>{{ t('apiDocs.sessionAsQuery') }}</NText>
                    <NCode :code="`?${sessionParamName}=SESSION_ID`" language="bash" />
                </NFlex>
                <NP>{{ t('apiDocs.sessionAsCookie') }}</NP>
                <NAlert type="success" :show-icon="false">
                    <span>
                        {{ t('apiDocs.sessionAuthLinkPrefix') }}
                        <NuxtLink :to="authDocsUrl" class="api-table-doc-page__link">
                            {{ t('apiDocs.viewAuthDocs') }}
                        </NuxtLink>
                        .
                    </span>
                </NAlert>
            </NFlex>
        </NCard>

        <NCard :bordered="false">
            <template #header>
                <NFlex align="center" :size="8">
                    <Icon name="tabler:list-details" size="18" />
                    <span>{{ t('apiDocs.schemaTitle') }}</span>
                </NFlex>
            </template>
            <ApiSchemaDocsTable :schema="currentTable.schema" size="large" />
        </NCard>

        <NCard v-if="showAssetsUploadDoc" :bordered="false">
            <template #header>
                <NFlex align="center" :size="8">
                    <Icon name="tabler:upload" size="18" />
                    <span>{{ t('apiDocs.assetsUploadTitle') }}</span>
                </NFlex>
            </template>
            <div class="api-table-doc-page__assets-doc">
                <NP>{{ t('apiDocs.assetsUploadIntro') }}</NP>
                <NCode :code="assetsUploadSnippet" language="json" word-wrap />
                <NList>
                    <NListItem>{{ t('apiDocs.assetsUploadStep1') }}</NListItem>
                    <NListItem>{{ t('apiDocs.assetsUploadStep2') }}</NListItem>
                    <NListItem>{{ t('apiDocs.assetsUploadStep3') }}</NListItem>
                </NList>
                <NAlert type="warning" :show-icon="false">
                    {{ t('apiDocs.assetsUploadCustomEndpoint') }}
                </NAlert>
            </div>
        </NCard>
    </div>

    <NResult v-else status="404" :title="t('apiDocs.tableNotFoundTitle')"
        :description="t('apiDocs.tableNotFoundDescription')">
        <template #footer>
            <NuxtLink :to="tablesListUrl" class="api-table-doc-page__link">
                {{ t('apiDocs.backToTables') }}
            </NuxtLink>
        </template>
    </NResult>
</template>

<script setup lang="ts">
import { LazyTableIcon, NuxtLink, Icon } from "#components"

definePageMeta({
    layout: "dashboard",
    middleware: ["database", "user", "dashboard", "global"],
})

const route = useRoute()
const database = useState<Database>("database")

const basePath = computed(() =>
    route.params.database ? `/${route.params.database}` : "",
)
const tablesListUrl = computed(() => `${basePath.value}/admin/api/tables`)

const tableSlug = computed(() => route.params.table as string)
const currentTable = computed(() =>
    database.value?.tables?.find((tableItem) => tableItem.slug === tableSlug.value),
)

const tableTitle = computed(() =>
    currentTable.value
        ? t(currentTable.value.label ?? currentTable.value.slug)
        : "",
)

const methodMeta = {
    c: { key: "post", type: "success", label: t("post") },
    r: { key: "get", type: "info", label: t("get") },
    u: { key: "put", type: "warning", label: t("put") },
    d: { key: "delete", type: "error", label: t("delete") },
} as const

type MethodOption = (typeof methodMeta)[keyof typeof methodMeta]

const availableMethods = computed<MethodOption[]>(() => {
    if (!currentTable.value?.allowedMethods) return []
    return (currentTable.value.allowedMethods.split("") as (keyof typeof methodMeta)[])
        .map((methodKey) => methodMeta[methodKey])
        .filter((method): method is MethodOption => Boolean(method))
})

const sessionParamName = computed(() => {
    const slug =
        (route.params.database as string | undefined) || database.value?.slug || "inicontent"
    return `${slug}_sid`
})

const authDocsUrl = computed(() => `${basePath.value}/admin/api/auth`)

const showAssetsUploadDoc = computed(() => {
    if (!currentTable.value?.schema) return false
    if (currentTable.value.slug === "assets") return true
    return currentTable.value.schema.some(
        (field: Field) => field.type === "table" && "table" in field && field.table === "assets",
    )
})

const assetsUploadSnippet = computed(
    () => `POST /assets
[
  {
    "name": "logo.png",
    "size": 204800,
    "type": "image/png",
    "extension": "png"
  }
]`
)

useHead(() => ({
    title: currentTable.value
        ? `${t(currentTable.value.slug)} | ${t("apiDocumentation")}`
        : `${t("apiDocs.tableNotFoundTitle")} | ${t("apiDocumentation")}`,
}))
</script>

<style scoped>
.api-table-doc-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.api-table-doc-page__hero {
    background: var(--n-card-color-modal);
}

.api-table-doc-page__title {
    margin: 0;
}

.api-table-doc-page__subtitle {
    margin: 4px 0 0;
    color: var(--n-text-color-3);
}

.api-table-doc-page__methods {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.api-table-doc-page__assets-doc {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.api-table-doc-page__link {
    color: var(--n-primary-color);
    font-weight: 600;
}
</style>
