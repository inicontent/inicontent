<template>
	<NFlex vertical :size="10">
		<NFormItem :label="t('metric.table')">
			<NSelect :value="modelValue?.table" @update:value="onTableChange"
				:options="tableOptions" :placeholder="t('metric.selectTable')" clearable filterable />
		</NFormItem>

		<template v-if="selectedTable">
			<NFormItem :label="t('metric.productColumn')">
				<NSelect :value="modelValue?.productColumn ?? null"
					@update:value="(v: unknown) => patch('productColumn', v)"
					:options="columnOptions" :placeholder="t('metric.selectColumn')" clearable filterable />
			</NFormItem>

			<NFormItem v-if="!isCount" :label="t('metric.valueColumn')">
				<NSelect :value="modelValue?.valueColumn ?? null"
					@update:value="(v: unknown) => patch('valueColumn', v)"
					:options="columnOptions" :placeholder="t('metric.selectColumn')" clearable filterable />
			</NFormItem>

			<NFormItem :label="t('metric.aggregation')">
				<NSelect :value="modelValue?.aggregation ?? defaultAggregation"
					@update:value="(v: unknown) => patch('aggregation', v)"
					:options="aggregationOptions" clearable />
			</NFormItem>

			<NText depth="3" class="metric-hint">{{ t('metric.hint') }}</NText>
		</template>

		<NEmpty v-else :description="t('metric.noTableSelected')" />
	</NFlex>
</template>

<script lang="ts" setup>
import { flattenSchema } from "inibase/utils";

type MetricSource = AggregateSource;

const modelValue = defineModel<MetricSource>();

const props = withDefaults(
	defineProps<{
		defaultAggregation?: MetricSource["aggregation"];
		aggregations?: MetricSource["aggregation"][];
	}>(),
	{
		defaultAggregation: "avg",
		aggregations: () => ["avg", "sum", "count", "min", "max"],
	},
);

const database = useState<Database>("database");

const internalTableSlugs = new Set([
	"sessions",
	"assets",
	"translations",
	"dashboards",
]);

const tableOptions = computed(() =>
	(database.value?.tables ?? [])
		.filter(({ slug, show }) => show !== false && !internalTableSlugs.has(slug))
		.map((table) => ({
			value: table.slug,
			label: t(table.slug),
		})),
);

const selectedTable = computed(() =>
	(database.value?.tables ?? []).find(
		(table) => table.slug === modelValue.value?.table,
	),
);

const columnOptions = computed(() =>
	selectedTable.value?.schema
		? flattenSchema(selectedTable.value.schema)
				.filter((column) => column.key !== "id" && !column.key.includes("."))
				.map((column) => ({ label: t(column.key), value: column.id }))
		: [],
);

const isCount = computed(() => modelValue.value?.aggregation === "count");

const aggregationOptions = computed(() =>
	props.aggregations.map((aggregation) => ({
		label: t(`metric.${aggregation}`),
		value: aggregation,
	})),
);

/** Write the whole object back so `modelValue` emits to the parent. */
function patch(key: keyof MetricSource, value: unknown) {
	const next: Partial<MetricSource> = { ...(modelValue.value ?? {}) };
	if (value === undefined || value === null || value === "") delete next[key];
	else next[key] = value as MetricSource[keyof MetricSource];
	modelValue.value = Object.keys(next).length ? next : undefined;
}

function onTableChange(slug: string | null) {
	const next: Partial<MetricSource> = { ...(modelValue.value ?? {}) };
	// Column ids belong to the previous table — clear them.
	delete next.productColumn;
	delete next.valueColumn;
	if (slug === null || slug === undefined || slug === "") delete next.table;
	else next.table = slug;
	modelValue.value = Object.keys(next).length ? next : undefined;
}
</script>

<style scoped>
.metric-hint {
	display: block;
	font-size: 0.8125rem;
}
</style>