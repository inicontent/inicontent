<template>
	<article
		class="endpoint-card"
		:data-endpoint="endpoint"
		:data-method="method"
		:data-description="description"
	>
		<header class="endpoint-card__header">
			<NFlex align="center" wrap :size="8">
				<NTag :type="methodType" size="small" round>
					{{ method }}
				</NTag>
				<NCode :code="endpoint" language="bash" />
			</NFlex>
			<NText v-if="description" depth="3" class="endpoint-card__desc">
				{{ description }}
			</NText>
		</header>

		<section
			v-if="$slots.params || params?.length"
			class="endpoint-card__section"
			data-section="params"
		>
			<NH5>{{ t('apiDocs.queryParams') }}</NH5>
			<slot name="params">
				<NDataTable
					v-if="params?.length"
					:columns="paramColumns"
					:data="params"
					:bordered="false"
					:single-line="false"
					size="small"
					:pagination="false"
				/>
			</slot>
		</section>

		<section
			v-if="$slots.request || requestExample"
			class="endpoint-card__section"
			data-section="request"
		>
			<NH5>{{ t('apiDocs.requestExample') }}</NH5>
			<slot name="request">
				<NCode
					v-if="requestExample"
					:code="requestExample"
					language="json"
					word-wrap
				/>
			</slot>
		</section>

		<section
			v-if="$slots.response || responseExample"
			class="endpoint-card__section"
			data-section="response"
		>
			<NH5>{{ t('apiDocs.responseExample') }}</NH5>
			<slot name="response">
				<NCode
					v-if="responseExample"
					:code="responseExample"
					language="json"
					word-wrap
				/>
			</slot>
		</section>

		<section v-if="$slots.extra" class="endpoint-card__section" data-section="extra">
			<slot name="extra" />
		</section>
	</article>
</template>

<script setup lang="ts">
import type { DataTableColumns } from "naive-ui";

interface ParamRow {
	name: string;
	type: string;
	required: boolean;
	description: string;
}

const props = withDefaults(
	defineProps<{
		endpoint: string;
		method: string;
		description?: string;
		requestExample?: string;
		responseExample?: string;
		params?: ParamRow[];
	}>(),
	{
		description: "",
		requestExample: "",
		responseExample: "",
		params: () => [],
	},
);

const methodType = computed(() => {
	const map: Record<string, "success" | "info" | "warning" | "error"> = {
		POST: "success",
		GET: "info",
		PUT: "warning",
		DELETE: "error",
	};
	return map[props.method.toUpperCase()] ?? "default";
});

const paramColumns: DataTableColumns<ParamRow> = [
	{
		title: t("key"),
		key: "name",
		width: 160,
	},
	{
		title: t("type"),
		key: "type",
		width: 100,
	},
	{
		title: t("required"),
		key: "required",
		width: 90,
		render: (row) => (row.required ? t("required") : t("optional")),
	},
	{
		title: t("description"),
		key: "description",
		minWidth: 200,
	},
];
</script>

<style scoped>
.endpoint-card {
	border: 1px solid var(--n-border-color);
	border-radius: 8px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.endpoint-card__header {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.endpoint-card__desc {
	margin-top: 4px;
	display: block;
}

.endpoint-card__section {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.endpoint-card__section h5 {
	margin: 0;
}
</style>
