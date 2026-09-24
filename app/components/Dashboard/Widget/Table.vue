<template>
	<LazyFormDrawer />
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
import { resolveWidgetTable } from "~/composables/widgetSchema";

const props = defineProps<{
	widget: Widget;
	databaseSlug: string;
	dateRangeOverride?: WidgetDateRange;
}>();

const dateRangeRef = toRef(props, "dateRangeOverride");

const { data, loading, fields } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const database = useState<Database>("database");

const sourceTable = computed(() =>
	resolveWidgetTable(database.value?.tables, props.widget.table),
);

// Preferred columns come from the composable (widget.columns field ids →
// table.defaultTableColumns ids → first 8 schema fields); the fetch requests
// exactly these columns, so rows only carry what's rendered.
const columns = computed<DataTableColumns>(() =>
	fields.value.map((field) => ({
		title: () =>
			h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
				getField(field).icon(),
				h(NPerformantEllipsis, () => t(field.key)),
			]),
		key: field.key,
		minWidth: 150,
		width: 150,
		resizable: true,
		ellipsis: { tooltip: true },
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
</script>