<template>
	<main v-if="currentTable" class="api-table-doc-page">
		<section class="api-table-doc-page__hero">
			<NFlex wrap justify="space-between" align="center" :size="24">
				<NFlex align="center" :size="16">
					<NIconWrapper :size="64" :border-radius="50">
						<LazyTableIcon size="34" :table="currentTable" />
					</NIconWrapper>
					<div>
						<NH2 style="margin: 0">{{ t(currentTable.slug) }}</NH2>
						<NText depth="3">{{ t('table') }} &middot; {{ currentTable.slug }}</NText>
					</div>
				</NFlex>
				<div class="api-table-doc-page__methods">
					<NText strong>{{ t('apiDocs.availableMethods') }}</NText>
					<NFlex wrap :size="8">
						<NTag v-for="method in availableMethods" :key="method.key" :type="method.type" size="large" round>
							{{ method.label.toUpperCase() }}
						</NTag>
					</NFlex>
				</div>
			</NFlex>
		</section>

		<section class="api-table-doc-page__session">
			<NCard :bordered="false">
				<template #header>
					<NFlex align="center" :size="8">
						<Icon name="tabler:shield-lock" size="18" />
						<span>{{ t('apiDocs.sessionNoticeTitle') }}</span>
					</NFlex>
				</template>
				<NFlex vertical :size="12">
					<NP>
						{{ t('apiDocs.sessionNoticeDescription', { param: sessionParamName }) }}
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
		</section>

		<section class="api-table-doc-page__endpoints">
			<ApiEndpointCard
				v-if="hasMethod('r')"
				:endpoint="listEndpoint"
				method="GET"
				:description="t('apiDocs.tableEndpoints.listDescription', { table: currentTable.slug })"
				:response-example="listResponse"
				:params="listParams"
			/>

			<ApiEndpointCard
				v-if="hasMethod('r')"
				:endpoint="singleEndpoint"
				method="GET"
				:description="t('apiDocs.tableEndpoints.singleDescription', { table: currentTable.slug })"
				:response-example="singleResponse"
			/>

			<ApiEndpointCard
				v-if="hasMethod('c')"
				:endpoint="createEndpoint"
				method="POST"
				:description="t('apiDocs.tableEndpoints.createDescription', { table: currentTable.slug })"
				:request-example="createRequest"
				:response-example="createResponse"
			/>

			<ApiEndpointCard
				v-if="hasMethod('u')"
				:endpoint="updateEndpoint"
				method="PUT"
				:description="t('apiDocs.tableEndpoints.updateDescription', { table: currentTable.slug })"
				:request-example="updateRequest"
				:response-example="updateResponse"
			/>

			<ApiEndpointCard
				v-if="hasMethod('d')"
				:endpoint="deleteEndpoint"
				method="DELETE"
				:description="t('apiDocs.tableEndpoints.deleteDescription', { table: currentTable.slug })"
				:response-example="deleteResponse"
			/>
		</section>

		<section class="api-table-doc-page__schema">
			<NCard :bordered="false">
				<template #header>
					<NFlex align="center" :size="8">
						<Icon name="tabler:list-details" size="18" />
						<NH3 style="margin: 0">{{ t('apiDocs.schemaTitle') }}</NH3>
					</NFlex>
				</template>
				<ApiSchemaDocsTable :schema="currentTable.schema" size="large" />
			</NCard>
		</section>

		<section v-if="showAssetsUploadDoc" class="api-table-doc-page__assets">
			<NCard :bordered="false">
				<template #header>
					<NFlex align="center" :size="8">
						<Icon name="tabler:upload" size="18" />
						<NH3 style="margin: 0">{{ t('apiDocs.assetsUploadTitle') }}</NH3>
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
		</section>
	</main>

	<NResult v-else status="404" :title="t('apiDocs.tableNotFoundTitle')" :description="t('apiDocs.tableNotFoundDescription')">
		<template #footer>
			<NuxtLink :to="tablesListUrl" class="api-table-doc-page__link">
				{{ t('apiDocs.backToTables') }}
			</NuxtLink>
		</template>
	</NResult>
</template>

<script setup lang="ts">
import { Icon, LazyTableIcon, NuxtLink } from "#components";

definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();
const database = useState<Database>("database");
const config = useRuntimeConfig();

const basePath = computed(() =>
	route.params.database ? `/${route.params.database}` : "",
);
const tablesListUrl = computed(() => `${basePath.value}/admin/api/tables`);

const tableSlug = computed(() => route.params.table as string);
const currentTable = computed(() =>
	database.value?.tables?.find(
		(tableItem) => tableItem.slug === tableSlug.value,
	),
);

const methodMeta = {
	c: { key: "post", type: "success" as const, label: t("post") },
	r: { key: "get", type: "info" as const, label: t("get") },
	u: { key: "put", type: "warning" as const, label: t("put") },
	d: { key: "delete", type: "error" as const, label: t("delete") },
} as const;

type MethodOption = (typeof methodMeta)[keyof typeof methodMeta];

const availableMethods = computed<MethodOption[]>(() => {
	if (!currentTable.value?.allowedMethods) return [];
	return (
		currentTable.value.allowedMethods.split("") as (keyof typeof methodMeta)[]
	)
		.map((methodKey) => methodMeta[methodKey])
		.filter((method): method is MethodOption => Boolean(method));
});

function hasMethod(key: string): boolean {
	return !!currentTable.value?.allowedMethods?.includes(key);
}

const sessionParamName = computed(() => {
	const slug =
		(route.params.database as string | undefined) ||
		database.value?.slug ||
		"inicontent";
	return `${slug}_sid`;
});

const dbSlug = computed(
	() =>
		(route.params.database as string | undefined) ||
		database.value?.slug ||
		"inicontent",
);

const authDocsUrl = computed(() => `${basePath.value}/admin/api/auth`);

const listEndpoint = computed(
	() => `/${dbSlug.value}/${currentTable.value?.slug}`,
);
const singleEndpoint = computed(
	() => `/${dbSlug.value}/${currentTable.value?.slug}/{id}`,
);
const createEndpoint = computed(
	() => `/${dbSlug.value}/${currentTable.value?.slug}`,
);
const updateEndpoint = computed(
	() => `/${dbSlug.value}/${currentTable.value?.slug}/{id}`,
);
const deleteEndpoint = computed(
	() => `/${dbSlug.value}/${currentTable.value?.slug}/{id}`,
);

const listParams = computed(() => [
	{
		name: "page",
		type: "number",
		required: false,
		description: t("apiDocs.pageParam"),
	},
	{
		name: "limit",
		type: "number",
		required: false,
		description: t("apiDocs.limitParam"),
	},
	{
		name: "locale",
		type: "string",
		required: false,
		description: t("apiDocs.localeParam"),
	},
	{
		name: "search",
		type: "string",
		required: false,
		description: t("apiDocs.searchParam"),
	},
	{
		name: "columns",
		type: "string",
		required: false,
		description: t("apiDocs.columnsParam"),
	},
]);

const listResponse = computed(
	() => `{
  "result": [
    {
      "id": "abc123",
      ...fields
    }
  ],
  "message": "",
  "options": {
    "page": 1,
    "limit": 25,
    "total": 100,
    "totalPages": 4
  },
  "code": 200
}`,
);

const singleResponse = computed(
	() => `{
  "result": {
    "id": "abc123",
    "createdBy": {
      "id": "user123",
      "username": "admin"
    },
    ...fields
  },
  "message": "",
  "options": {},
  "code": 200
}`,
);

const createRequest = computed(() => {
	const schema = currentTable.value?.schema;
	if (!schema?.length) return `{\n  ...fields\n}`;
	const lines = schema.map(
		(field) => `  "${field.key}": ${getExampleValue(field)}`,
	);
	return `{\n${lines.join(",\n")}\n}`;
});

const createResponse = computed(
	() => `{
  "result": {
    "id": "new_id_abc123",
    "createdBy": "current_user_id",
    ...fields
  },
  "message": "Item created successfully",
  "options": {},
  "code": 200
}`,
);

const updateRequest = computed(() => {
	const schema = currentTable.value?.schema;
	if (!schema?.length) return `{\n  ...fields\n}`;
	const fields = schema
		.slice(0, 3)
		.map((field) => `  "${field.key}": ${getExampleValue(field)}`);
	return `{\n${fields.join(",\n")}\n}`;
});

const updateResponse = computed(
	() => `{
  "result": {
    "id": "abc123",
    ...updatedFields
  },
  "message": "Item updated successfully",
  "options": {},
  "code": 200
}`,
);

const deleteResponse = computed(
	() => `{
  "result": true,
  "message": "Item deleted successfully",
  "options": {},
  "code": 200
}`,
);

function getExampleValue(field: Field): string {
	const t = field.type as string;
	if (t === "string" || t === "text" || t === "textarea" || t === "html")
		return `"example"`;
	if (t === "number") return "0";
	if (t === "boolean") return "true";
	if (t === "date") return `"2025-01-01"`;
	if (t === "email") return `"user@example.com"`;
	if (t === "url") return `"https://example.com"`;
	if (t === "json") return "{}";
	if (t === "array") return "[]";
	if (t === "object") return "{}";
	if (t === "select" || t === "radio") return `"option"`;
	if (t === "tags") return `["tag"]`;
	return `"value"`;
}

const showAssetsUploadDoc = computed(() => {
	if (!currentTable.value?.schema) return false;
	if (currentTable.value.slug === "assets") return true;
	return currentTable.value.schema.some(
		(field: Field) =>
			field.type === "table" && "table" in field && field.table === "assets",
	);
});

const assetsUploadSnippet = `POST /assets
[
  {
    "name": "logo.png",
    "size": 204800,
    "type": "image/png",
    "extension": "png"
  }
]`;

const jsonLd = computed(() => ({
	"@context": "https://schema.org",
	"@type": "WebAPI",
	name: `${currentTable.value?.slug ?? ""} API`,
	description: `CRUD API endpoints for the ${currentTable.value?.slug ?? ""} table`,
	baseUrl: `${config.public.apiBase}${dbSlug.value}/${currentTable.value?.slug ?? ""}`,
	endpoints: [
		...(hasMethod("r")
			? [
					{
						"@type": "EntryPoint",
						name: "List items",
						httpMethod: "GET",
						urlTemplate: `${config.public.apiBase}${dbSlug.value}/${currentTable.value?.slug}`,
					},
					{
						"@type": "EntryPoint",
						name: "Get item",
						httpMethod: "GET",
						urlTemplate: `${config.public.apiBase}${dbSlug.value}/${currentTable.value?.slug}/{id}`,
					},
				]
			: []),
		...(hasMethod("c")
			? [
					{
						"@type": "EntryPoint",
						name: "Create item",
						httpMethod: "POST",
						urlTemplate: `${config.public.apiBase}${dbSlug.value}/${currentTable.value?.slug}`,
					},
				]
			: []),
		...(hasMethod("u")
			? [
					{
						"@type": "EntryPoint",
						name: "Update item",
						httpMethod: "PUT",
						urlTemplate: `${config.public.apiBase}${dbSlug.value}/${currentTable.value?.slug}/{id}`,
					},
				]
			: []),
		...(hasMethod("d")
			? [
					{
						"@type": "EntryPoint",
						name: "Delete item",
						httpMethod: "DELETE",
						urlTemplate: `${config.public.apiBase}${dbSlug.value}/${currentTable.value?.slug}/{id}`,
					},
				]
			: []),
	],
}));

useHead(() => ({
	title: currentTable.value
		? `${t(currentTable.value.slug)} | ${t("apiDocumentation")}`
		: `${t("apiDocs.tableNotFoundTitle")} | ${t("apiDocumentation")}`,
	meta: [
		{
			name: "description",
			content: currentTable.value
				? `API documentation for the ${currentTable.value.slug} table. Available methods: ${currentTable.value.allowedMethods?.toUpperCase() ?? ""}`
				: t("apiDocs.tableNotFoundDescription"),
		},
	],
	script: [
		...(currentTable.value
			? [
					{
						type: "application/ld+json",
						innerHTML: JSON.stringify(jsonLd.value),
					},
				]
			: []),
	],
}));
</script>

<style scoped>
.api-table-doc-page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.api-table-doc-page__hero {
	background: var(--n-card-color-modal);
	border-radius: 8px;
	padding: 20px;
}

.api-table-doc-page__methods {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.api-table-doc-page__endpoints {
	display: flex;
	flex-direction: column;
	gap: 16px;
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
