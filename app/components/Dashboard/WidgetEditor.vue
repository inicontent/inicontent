<template>
	<NForm ref="formRef" :model="model" label-placement="left" label-width="120">
		<NFormItem :label="t('widgetTitle')" path="title">
			<NInput v-model:value="model.title" :placeholder="t('widgetTitle')" />
		</NFormItem>

		<NFormItem :label="t('type')" path="type">
			<NSelect
				v-model:value="model.type"
				:options="typeOptions"
				:placeholder="t('selectType')"
			/>
		</NFormItem>

		<NFormItem :label="t('sourceTable')" path="table">
			<NSelect
				v-model:value="model.table"
				:options="tableOptions"
				:placeholder="t('selectTable')"
				filterable
			/>
		</NFormItem>

		<NFormItem
			v-if="model.type === 'counter'"
			:label="t('operation')"
			path="operation"
		>
			<NSelect
				v-model:value="model.operation"
				:options="operationOptions"
				:placeholder="t('operation')"
			/>
		</NFormItem>

		<NFormItem
			v-if="showFieldPicker"
			:label="t('field')"
			path="field"
		>
			<NSelect
				v-model:value="model.field"
				:options="fieldOptions"
				:placeholder="t('selectField')"
				filterable
				clearable
			/>
		</NFormItem>

		<NFormItem
			v-if="model.type === 'bar' || model.type === 'pie'"
			:label="t('groupBy')"
			path="groupBy"
		>
			<NSelect
				v-model:value="model.groupBy"
				:options="fieldOptions"
				:placeholder="t('groupBy')"
				filterable
			/>
		</NFormItem>

		<NFormItem
			v-if="model.type === 'line'"
			:label="t('dateField')"
			path="dateField"
		>
			<NSelect
				v-model:value="model.dateField"
				:options="dateFieldOptions"
				:placeholder="t('dateField')"
				clearable
			/>
		</NFormItem>

		<NFormItem :label="t('dateRange')" path="dateRange">
			<NSelect
				v-model:value="model.dateRange"
				:options="dateRangeOptions"
				:placeholder="t('dateRange')"
				clearable
			/>
		</NFormItem>

		<NFormItem
			v-if="model.type === 'recent'"
			:label="t('limit')"
			path="limit"
		>
			<NInputNumber
				v-model:value="model.limit"
				:min="1"
				:max="100"
				:placeholder="t('limit')"
			/>
		</NFormItem>

		<NFormItem v-if="model.table" :label="t('filter')" path="searchArray">
			<LazyTableSearch v-model="model.searchArray" v-model:schema="widgetSchema" />
		</NFormItem>

		<NFormItem :label="t('size')" path="size">
			<NSelect
				v-model:value="model.size"
				:options="sizeOptions"
				:placeholder="t('size')"
			/>
		</NFormItem>

		<NFormItem :label="t('color')" path="color">
			<NColorPicker v-model:value="model.color" :modes="['hex']" clearable />
		</NFormItem>
	</NForm>
</template>

<script lang="ts" setup>
import { LazyTableSearch } from "#components";

const props = defineProps<{
	modelValue: Widget;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: Widget];
}>();

const database = useState<Database>("database");

const model = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

// Schema for the search builder, synced from the selected source table.
// LazyTableSearch writes to its schema model only when empty, so a local
// ref synced via watcher is safe.
const widgetSchema = ref<Schema | undefined>(
	database.value?.tables?.find((t) => t.slug === model.value.table)?.schema,
);

watch(
	() => model.value.table,
	(newTable, oldTable) => {
		widgetSchema.value = database.value?.tables?.find(
			(t) => t.slug === newTable,
		)?.schema;
		// Source table changed → previously picked fields are invalid
		if (newTable !== oldTable && oldTable !== undefined) {
			model.value.searchArray = { and: [[null, "=", null]] };
		}
		if (!model.value.searchArray) {
			model.value.searchArray = { and: [[null, "=", null]] };
		}
	},
);

if (!model.value.searchArray) {
	model.value.searchArray = { and: [[null, "=", null]] };
}

const typeOptions = [
	{ label: t("counter"), value: "counter" },
	{ label: t("lineChart"), value: "line" },
	{ label: t("barChart"), value: "bar" },
	{ label: t("pieChart"), value: "pie" },
	{ label: t("recentActivity"), value: "recent" },
];

const operationOptions = [
	{ label: t("count"), value: "count" },
	{ label: t("sum"), value: "sum" },
	{ label: t("max"), value: "max" },
	{ label: t("min"), value: "min" },
];

const sizeOptions = [
	{ label: t("small"), value: "small" },
	{ label: t("medium"), value: "medium" },
	{ label: t("large"), value: "large" },
];

const dateRangeOptions = [
	{ label: t("last7Days"), value: "7d" },
	{ label: t("last30Days"), value: "30d" },
	{ label: t("last90Days"), value: "90d" },
	{ label: t("lastYear"), value: "1y" },
	{ label: t("allTime"), value: "all" },
];

const tableOptions = computed(
	() =>
		database.value?.tables
			?.filter(
				({ slug, allowedMethods }) =>
					allowedMethods?.includes("r") && slug !== "dashboards",
			)
			.map((table) => ({ label: t(table.slug), value: table.slug })) ?? [],
);

const selectedTable = computed(() =>
	database.value?.tables?.find((t) => t.slug === model.value.table),
);

const fieldOptions = computed(
	() =>
		selectedTable.value?.schema?.map((f) => ({
			label: f.label || f.key,
			value: f.key,
		})) ?? [],
);

const dateFieldOptions = computed(() => [
	{ label: "createdAt", value: "createdAt" },
	{ label: "updatedAt", value: "updatedAt" },
	...(selectedTable.value?.schema
		?.filter((f) => f.type === "date" || f.date)
		.map((f) => ({ label: f.label || f.key, value: f.key })) ?? []),
]);

const showFieldPicker = computed(() => {
	if (model.value.type === "counter")
		return model.value.operation && model.value.operation !== "count";
	return false;
});
</script>
