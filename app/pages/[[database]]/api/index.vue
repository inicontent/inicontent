<template>
    <div class="flex flex-col" size="large" style="padding: 24px 0">
        <UCard :bordered="false" style="background:none">
            <template #header>
                <h3 class="font-semibold"2 style="margin: 0">{{ t('publicApiTitle') }}</NH2>
            </template>
            <span type="secondary">{{ t('publicApiDescription') }}</span>
            <alert type="info" :show-icon="false" style="margin-top: 12px">
                {{ t('publicApiHint') }}
                <NuxtLink :to="authPath" style="margin-inline-start: 6px">
                    {{ t('loginLink') }}
                </NuxtLink>
            </NAlert>
        </UCard>

        <div class="grid" :x-gap="12" :y-gap="12" cols="1 500:2 800:3">
            <div class="grid"Item v-for="tableOption in publicTables" :key="tableOption.slug">
                <UCard hoverable>
                    <template #header>
                        <div class="flex" align="center">
                            <div class="inline-flex items-center justify-center" :border-radius="50" style="font-style: normal">
                                <LazyTableIcon :table="tableOption" />
                            </div>
                            <h3 class="font-semibold"4 style="margin: 0">{{ t(tableOption.slug) }}</NH4>
                        </div>
                    </template>
                    <div class="flex flex-col" :size="8">
                        <span strong>{{ t('readAccess') }}</span>
                        <span type="secondary">{{ t('listEndpoint') }}</span>
                        <code class="api-endpoint">{{ `${tableOption.http} ${tableOption.collectionPath}` }}</code>
                        <span type="secondary">{{ t('singleEndpoint') }}</span>
                        <code class="api-endpoint">{{ `${tableOption.http} ${tableOption.singlePath}` }}</code>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "default",
    middleware: ["database", "global"],
})

defineTranslation({
    ar: {
        publicApiTitle: "نقاط النهاية العامة",
        publicApiDescription: "يمكن للزوار الوصول إلى نقاط النهاية العامة التالية لقراءة البيانات المتاحة.",
        publicApiHint: "للحصول على توثيق كامل وصلاحيات إضافية يرجى تسجيل الدخول.",
        loginLink: "تسجيل الدخول",
        readAccess: "القراءة (GET)",
        listEndpoint: "قائمة العناصر",
        singleEndpoint: "عنصر محدد",
    },
})

const appConfig = useAppConfig()
const database = useState<Database>("database")
const route = useRoute()
const sessionID = useCookie<string | null>("sessionID", { sameSite: true })

const authPath = computed(
    () => `${route.params.database ? `/${route.params.database}` : ""}/auth`,
)

const shouldRedirect = await useAsyncData("api-doc-auth", async () => {
    if (!database.value?.slug || !sessionID.value) return false
    try {
        const data = await $fetch<{ result: boolean }>(
            `${appConfig.apiBase}${database.value.slug}/auth/current`,
            {
                credentials: "include",
                query: {
                    isSignedIn: true,
                    [`${database.value.slug}_sid`]: sessionID.value,
                },
            },
        )
        return data.result
    } catch (error) {
        return false
    }
})

if (shouldRedirect.data.value) {
    await navigateTo(
        `${route.params.database ? `/${route.params.database}` : ""}/admin/api`,
    )
}

const publicTables = computed(() =>
    (database.value?.tables ?? [])
        .filter(({ allowedMethods, show }) => allowedMethods?.includes("r") && show !== false)
        .map((tableItem) => {
            const baseSlug = database.value?.slug ?? "inicontent"
            const basePath = `${appConfig.apiBase}${baseSlug}/${tableItem.slug}`
            return {
                ...tableItem,
                http: "GET",
                collectionPath: `${basePath}?page=1&limit=25`,
                singlePath: `${basePath}/{id}`,
            }
        })
)

useHead({
    title: `${t(database.value?.slug ?? "inicontent")} | ${t("publicApiTitle")}`,
})
</script>

<style scoped>
.api-endpoint {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 6px 8px;
    overflow-x: auto;
    display: block;
    font-family: "Cairo", monospace;
}
</style>
