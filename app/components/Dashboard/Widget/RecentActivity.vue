<template>
	<NSpin :show="loading">
		<NList v-if="data.length" hoverable>
			<NListItem v-for="item in data" :key="item.id">
				<NThing
					:title="getItemLabel(item)"
					:description="item.createdAt ? new Date(item.createdAt).toLocaleString() : ''"
				/>
			</NListItem>
		</NList>
		<NEmpty v-else :description="t('noData')" />
	</NSpin>
</template>

<script lang="ts" setup>
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

function getItemLabel(item: Item): string {
	const table = database.value?.tables?.find(
		(t) => t.slug === props.widget.table,
	);
	if (table?.customLabel) return table.customLabel(item);
	const firstField = table?.schema?.[0];
	if (firstField?.key && item[firstField.key] != null)
		return String(item[firstField.key]);
	return String(item.id ?? "");
}

onMounted(refresh);
</script>
