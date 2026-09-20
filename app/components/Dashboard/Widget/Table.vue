<template>
	<NSpin :show="loading">
		<NDataTable
			size="small"
			:bordered="false"
			:columns="columns"
			:data="data"
			:loading="loading"
			:scroll-x="tableWidth"
			:max-height="480"
			:row-key="(row: Item) => row.id"
		/>
	</NSpin>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from "naive-ui";
import { h } from "vue";
import { LazyColumn, NFlex, NPerformantEllipsis } from "#components";
import { getField } from "~/composables/fieldsList";
import renderLabel from "~/composables/renderLabel";
import { useDashboardData } from "~/composables/useDashboardData";

const props = defineProps<{
	widget: Widget;
	databaseSlug: string;
	dateRangeOverride?: WidgetDateRange;
}>();

const dateRangeRef = toRef(props, "dateRangeOverride");

const { data, loading, refresh } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const database = useState<Database>("database");

const sourceTable = computed(() =>
	database.value?.tables?.find((t) => t.slug === props.widget.table),
);

// Preferred columns: widget.columns (keys) → table.defaultTableColumns (ids)
// → first 8 schema fields.
const displayedFields = computed<Field[]>(() => {
	const schema = sourceTable.value?.schema ?? [];
	if (!schema.length) return [];

	if (props.widget.columns?.length) {
		const byKey = schema.filter((f) => props.widget.columns?.includes(f.key));
		if (byKey.length) return byKey;
	}

	const defaultIds = sourceTable.value?.defaultTableColumns;
	if (defaultIds?.length) {
		const byId = defaultIds
			.map((id) => schema.find((f) => f.id === id))
			.filter((f): f is Field => !!f);
		if (byId.length) return byId;
	}

	return schema.slice(0, 8);
});

const columns = computed<DataTableColumns>(() =>
	displayedFields.value.map((field) => ({
		title: () =>
			h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
				getField(field).icon(),
				h(NPerformantEllipsis, () => t(field.key)),
			]),
		key: field.key,
		minWidth: 150,
		width: 150,
		ellipsis: field.table !== undefined ? false : { tooltip: true },
		render: (row: Item) =>
			h(LazyColumn, {
				field,
				value: row[field.key],
				itemLabel: renderLabel(sourceTable.value, row),
			}),
	})),
);

const tableWidth = computed(() =>
	columns.value.reduce(
		(acc, column) => acc + ((column.width as number) ?? 0),
		100,
	),
);

onMounted(refresh);
</script>