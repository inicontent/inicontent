<template>
    <div class="flex flex-col" size="large">
        <UCard :bordered="false" style="background:none">
            <template #header>
                <div class="flex" justify="space-between" align="center">
                    <h3 class="font-semibold"2 style="margin:0">{{ tableTitle }}</NH2>
                    <UBadge type="info">{{ t('apiDocumentation') }}</UBadge>
                </div>
            </template>
            <span type="secondary">{{ overviewText }}</span>
            <hr class="my-4" />
            <div class="flex flex-col" :size="8">
                <span strong>{{ t('availableMethods') }}</span>
                <div class="flex" wrap :size="8">
                    <UBadge v-for="method in allowedMethodTags" :key="method.key" :type="method.type" round>
                        {{ method.http }}
                    </UBadge>
                </div>
            </div>
        </UCard>

        <UCard v-for="section in sections" :key="section.key" :id="section.key"
            :class="['api-section', { 'api-section--active': section.key === activeSectionKey }]">
            <template #header>
                <div class="flex" align="center" justify="space-between">
                    <h3 class="font-semibold"3 style="margin:0">{{ section.title }}</NH3>
                    <UBadge v-if="section.http" :type="section.tagType" round>{{ section.http }}</UBadge>
                </div>
            </template>
            <div class="flex flex-col" size="small">
                <span>{{ section.description }}</span>
                <ul class="list" v-if="section.endpoints.length" bordered>
                    <ul class="list"Item v-for="endpoint in section.endpoints" :key="endpoint.path">
                        <code class="api-endpoint">{{ endpoint.display }}</code>
                    </li>
                </ul>
                <alert v-if="section.note" type="info" :show-icon="false">
                    {{ section.note }}
                </NAlert>
                <div v-if="section.fields.length" class="api-fields">
                    <span strong>{{ t('availableFields') }}</span>
                    <UTable size="small" :single-line="false">
                        <thead>
                            <tr>
                                <th>{{ t('fieldKey') }}</th>
                                <th>{{ t('fieldLabel') }}</th>
                                <th>{{ t('fieldType') }}</th>
                                <th>{{ t('fieldRequired') }}</th>
                                <th>{{ t('fieldDescription') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="field in section.fields" :key="field.path">
                                <td><code>{{ field.path }}</code></td>
                                <td>{{ field.label }}</td>
                                <td>{{ field.type }}</td>
                                <td>{{ field.required ? t('yes') : t('no') }}</td>
                                <td>{{ field.description ?? 'N/A' }}</td>
                            </tr>
                        </tbody>
                    </UTable>
                </div>
                <div v-if="section.example" class="api-example">
                    <span strong>{{ t('exampleCurl') }}</span>
                    <pre><code>{{ section.example }}</code></pre>
                </div>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "api" as never,
    middleware: ["database", "user", "dashboard", "table", "global"],
})

defineTranslation({
    ar: {
        apiDocumentation: "توثيق الواجهة البرمجية",
        overview: "نظرة عامة",
        overviewDescription: "توفر هذه الصفحة نظرة عامة على نقاط النهاية الخاصة بالجدول {table} بناءً على صلاحياتك الحالية.",
        availableMethods: "الطرق المتاحة",
        sessionCookieNote: "قم بتمرير ملف تعريف الارتباط {cookie} للحفاظ على جلسة صالحة عند تنفيذ الطلبات المحمية.",
        listEndpoint: "قائمة العناصر",
        singleEndpoint: "عنصر محدد",
        postSummary: "استخدم هذا الطلب لإضافة عنصر جديد إلى الجدول.",
        getSummary: "استخدم هذا الطلب لجلب العناصر أو عنصر محدد.",
        putSummary: "استخدم هذا الطلب لتحديث عنصر موجود.",
        deleteSummary: "استخدم هذا الطلب لحذف عنصر موجود بشكل نهائي.",
        exampleCurl: "مثال cURL",
        availableFields: "الحقول المتاحة",
        fieldKey: "المسار",
        fieldLabel: "الاسم",
        fieldType: "النوع",
        fieldRequired: "إجباري",
        fieldDescription: "الوصف",
        yes: "نعم",
        no: "لا",
        unspecified: "غير محدد",
    },
})

type MethodKey = "post" | "get" | "put" | "delete"

type DocField = {
    path: string
    label: string
    type: string
    required: boolean
    description?: string
}

type EndpointDoc = {
    display: string
    path: string
}

type DocSection = {
    key: "overview" | MethodKey
    title: string
    description: string
    http?: string
    tagType: TagType
    endpoints: EndpointDoc[]
    note?: string
    example?: string
    fields: DocField[]
}

const route = useRoute()
const appConfig = useAppConfig()
const database = useState<Database>("database")
const table = useState<Table>("table")
const Language = useCookie<LanguagesType>("language", { sameSite: true })
const sessionID = useCookie<string | null>("sessionID", { sameSite: true })

type TagType = "default" | "info" | "error" | "warning" | "success" | "primary"
const methodDefinitions: Record<MethodKey, { letter: string; http: string; tagType: TagType; summaryKey: string }> = {
    post: { letter: "c", http: "POST", tagType: "success", summaryKey: "postSummary" },
    get: { letter: "r", http: "GET", tagType: "info", summaryKey: "getSummary" },
    put: { letter: "u", http: "PUT", tagType: "warning", summaryKey: "putSummary" },
    delete: { letter: "d", http: "DELETE", tagType: "error", summaryKey: "deleteSummary" },
}

const methodOrder: MethodKey[] = ["post", "get", "put", "delete"]
const methodAliases: Record<string, MethodKey> = {
    create: "post",
    read: "get",
    update: "put",
    post: "post",
    get: "get",
    put: "put",
    delete: "delete",
}

const formatMessage = (message: string, replacements: Record<string, string>) =>
    Object.entries(replacements).reduce(
        (acc, [key, value]) => acc.replace(new RegExp(`{${key}}`, "g"), value),
        message,
    )

const filterDefaultColumns = (field: Field) =>
    !["id", "createdAt", "createdBy", "updatedAt", "updatedBy"].includes(field.key as string)

const sanitizeSchema = (schema?: Schema): Schema => (schema ?? []).filter(filterDefaultColumns)

const resolveFieldLabel = (field: Field, fallback: string) => {
    const rawLabel = (field as Record<string, unknown>).label
    if (typeof rawLabel === "string" && rawLabel.trim()) return rawLabel
    const labelProps = (field.labelProps ?? {}) as Record<string, unknown>
    const labelText = labelProps?.text
    if (typeof labelText === "string" && labelText.trim()) return labelText
    return fallback
}

const flattenSchema = (schema?: Schema, parent = ""): DocField[] => {
    if (!schema) return []
    const fields: DocField[] = []
    for (const field of schema) {
        const key = typeof field.key === "string" ? field.key : String(field.key ?? "field")
        const path = parent ? `${parent}.${key}` : key
        const typeValue = Array.isArray(field.type)
            ? field.type.join(" | ")
            : (field.type as string | undefined) ?? ""
        fields.push({
            path,
            label: resolveFieldLabel(field, key),
            type: typeValue,
            required: !!field.required,
            description: field.description as string | undefined,
        })
        if (Array.isArray(field.children))
            fields.push(...flattenSchema(field.children as Schema, path))
    }
    return fields
}

const tableTitle = computed(() => (table.value?.slug ? t(table.value.slug) : t("unspecified")))
const overviewText = computed(() =>
    formatMessage(t("overviewDescription"), { table: tableTitle.value }),
)

const allowedLetters = computed(() =>
    new Set((table.value?.allowedMethods ?? "").split("").filter(Boolean)),
)

const sessionCookieKey = computed(
    () => `${database.value?.slug ? `${database.value.slug}_sid` : "sessionID"}`,
)

const baseTableSchema = computed<Schema>(() => sanitizeSchema(table.value?.schema))
const postSchema = ref<Schema>([])
const putSchema = ref<Schema>([])
const schemaCache = reactive<Record<string, Schema>>({})
const sampleItem = ref<Item | undefined>()

async function getSampleItem(slug: string, dbSlug: string) {
    if (sampleItem.value) return sampleItem.value
    try {
        const response = await $fetch<apiResponse<Item[]>>(
            `${appConfig.apiBase}${dbSlug}/${slug}`,
            {
                credentials: "include",
                params: {
                    page: 1,
                    limit: 1,
                    locale: Language.value,
                    [`${dbSlug}_sid`]: sessionID.value,
                },
            },
        )
        const firstItem = Array.isArray(response.result) ? response.result[0] : undefined
        sampleItem.value = firstItem
        return firstItem
    } catch (error) {
        console.warn(`[api-docs] Failed to fetch sample item for ${dbSlug}/${slug}`, error)
        return undefined
    }
}

async function fetchSchemaForMethod(method: Extract<MethodKey, "post" | "put">): Promise<Schema> {
    const slug = table.value?.slug
    const dbSlug = database.value?.slug
    if (!slug || !dbSlug) return []
    const cacheKey = `${dbSlug}-${slug}-${method}`
    if (schemaCache[cacheKey]) return schemaCache[cacheKey]

    const httpMethod = methodDefinitions[method].http as "POST" | "PUT"
    let body: Record<string, any> = {}

    if (httpMethod === "PUT") {
        const sample = await getSampleItem(slug, dbSlug)
        body = sample ? JSON.parse(JSON.stringify(sample)) : {}
    }

    try {
        const response = await $fetch<apiResponse<{ schema: Schema; data: Item }>>(
            `${appConfig.apiBase}${dbSlug}/${slug}/schema`,
            {
                method: httpMethod,
                body,
                credentials: "include",
                params: {
                    locale: Language.value,
                    [`${dbSlug}_sid`]: sessionID.value,
                },
            },
        )
        const sanitized = sanitizeSchema(response.result?.schema)
        schemaCache[cacheKey] = sanitized
        return sanitized
    } catch (error) {
        console.warn(`[api-docs] Failed to fetch ${httpMethod} schema for ${dbSlug}/${slug}`, error)
        schemaCache[cacheKey] = []
        return []
    }
}

let schemaLoadPromise: Promise<void> | null = null
async function ensureMethodSchemas() {
    if (!table.value?.slug || !database.value?.slug) {
        postSchema.value = []
        putSchema.value = []
        return
    }
    if (schemaLoadPromise) return schemaLoadPromise
    schemaLoadPromise = (async () => {
        if (allowedLetters.value.has("c")) {
            const schema = await fetchSchemaForMethod("post")
            postSchema.value = schema.length ? schema : baseTableSchema.value
        } else {
            postSchema.value = []
        }
        if (allowedLetters.value.has("u")) {
            const schema = await fetchSchemaForMethod("put")
            putSchema.value = schema.length ? schema : baseTableSchema.value
        } else {
            putSchema.value = []
        }
    })()
    try {
        await schemaLoadPromise
    } finally {
        schemaLoadPromise = null
    }
}

watch(
    () => [table.value?.slug, database.value?.slug, table.value?.allowedMethods],
    () => {
        void ensureMethodSchemas()
    },
    { immediate: true },
)

const methodFields = computed(() => ({
    post: flattenSchema(postSchema.value.length ? postSchema.value : baseTableSchema.value),
    get: flattenSchema(baseTableSchema.value),
    put: flattenSchema(putSchema.value.length ? putSchema.value : baseTableSchema.value),
}))

const allowedMethodTags = computed(() =>
    methodOrder
        .filter((method) => allowedLetters.value.has(methodDefinitions[method].letter))
        .map((method) => ({
            key: method,
            http: methodDefinitions[method].http,
            type: methodDefinitions[method].tagType,
        }))
)

useHead(() => ({
    title: `${t(database.value?.slug ?? "inicontent")} | ${tableTitle.value} | ${t("apiDocumentation")}`,
}))

const sections = computed<DocSection[]>(() => {
    if (!database.value?.slug || !table.value?.slug) return []
    const dbSlug = database.value.slug
    const tableSlug = table.value.slug
    const basePath = `${appConfig.apiBase}${dbSlug}/${tableSlug}`
    const fields = methodFields.value

    const list: DocSection[] = [
        {
            key: "overview",
            title: t("overview"),
            description: overviewText.value,
            http: undefined,
            tagType: "default",
            endpoints: [
                {
                    display: `${methodDefinitions.get.http} ${basePath}`,
                    path: `${basePath}#list`,
                },
                {
                    display: `${methodDefinitions.get.http} ${basePath}/{id}`,
                    path: `${basePath}/{id}`,
                },
            ],
            note: undefined,
            example: undefined,
            fields: [],
        },
    ]

    for (const method of methodOrder) {
        if (!allowedLetters.value.has(methodDefinitions[method].letter)) continue
        switch (method) {
            case "post":
                list.push({
                    key: method,
                    title: t(`methods.${method}`),
                    description: t(methodDefinitions[method].summaryKey),
                    http: methodDefinitions[method].http,
                    tagType: methodDefinitions[method].tagType,
                    endpoints: [
                        {
                            display: `${methodDefinitions[method].http} ${basePath}`,
                            path: basePath,
                        },
                    ],
                    note: formatMessage(t("sessionCookieNote"), { cookie: sessionCookieKey.value }),
                    example: `curl -X ${methodDefinitions[method].http} ${basePath} \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: ${sessionCookieKey.value}=YOUR_SESSION' \\
  -d '{"field": "value"}'`,
                    fields: fields.post,
                })
                break
            case "get":
                list.push({
                    key: method,
                    title: t(`methods.${method}`),
                    description: t(methodDefinitions[method].summaryKey),
                    http: methodDefinitions[method].http,
                    tagType: methodDefinitions[method].tagType,
                    endpoints: [
                        {
                            display: `${methodDefinitions[method].http} ${basePath}?page=1&limit=25`,
                            path: `${basePath}?page=1&limit=25`,
                        },
                        {
                            display: `${methodDefinitions[method].http} ${basePath}/{id}`,
                            path: `${basePath}/{id}`,
                        },
                    ],
                    note: undefined,
                    example: `curl ${basePath} \\
  -H 'Cookie: ${sessionCookieKey.value}=YOUR_SESSION'`,
                    fields: fields.get,
                })
                break
            case "put":
                list.push({
                    key: method,
                    title: t(`methods.${method}`),
                    description: t(methodDefinitions[method].summaryKey),
                    http: methodDefinitions[method].http,
                    tagType: methodDefinitions[method].tagType,
                    endpoints: [
                        {
                            display: `${methodDefinitions[method].http} ${basePath}/{id}`,
                            path: `${basePath}/{id}`,
                        },
                    ],
                    note: formatMessage(t("sessionCookieNote"), { cookie: sessionCookieKey.value }),
                    example: `curl -X ${methodDefinitions[method].http} ${basePath}/{id} \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: ${sessionCookieKey.value}=YOUR_SESSION' \\
  -d '{"field": "updated"}'`,
                    fields: fields.put,
                })
                break
            case "delete":
                list.push({
                    key: method,
                    title: t(`methods.${method}`),
                    description: t(methodDefinitions[method].summaryKey),
                    http: methodDefinitions[method].http,
                    tagType: methodDefinitions[method].tagType,
                    endpoints: [
                        {
                            display: `${methodDefinitions[method].http} ${basePath}/{id}`,
                            path: `${basePath}/{id}`,
                        },
                    ],
                    note: formatMessage(t("sessionCookieNote"), { cookie: sessionCookieKey.value }),
                    example: `curl -X ${methodDefinitions[method].http} ${basePath}/{id} \\
  -H 'Cookie: ${sessionCookieKey.value}=YOUR_SESSION'`,
                    fields: [],
                })
                break
        }
    }

    return list
})

const activeSectionKey = computed(() => {
    const rawMethod = (route.query.method as string | undefined)?.toLowerCase()
    if (!rawMethod || rawMethod === "overview") return "overview"
    const normalized = methodAliases[rawMethod]
    if (normalized && sections.value.some((section) => section.key === normalized)) return normalized
    return "overview"
})
</script>

<style scoped>
.api-section {
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.api-section--active {
    border-color: rgba(var(--primaryColor, 255, 152, 0), 0.6);
    box-shadow: 0 0 0 1px rgba(var(--primaryColor, 255, 152, 0), 0.25);
}

.api-endpoint {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 6px 8px;
    overflow-x: auto;
    font-family: "Cairo", monospace;
}

.api-fields {
    margin-top: 12px;
}

.api-fields code {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    padding: 2px 4px;
}

.api-example pre {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 12px;
    overflow-x: auto;
    margin: 0;
    font-family: "Cairo", monospace;
}
</style>
