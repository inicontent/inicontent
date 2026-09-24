<template>
	<NSpin :show="loading">
		<NStatistic>
			<template #prefix>
				<NIcon size="20" v-if="widgetIcon">
					<Icon :name="widgetIcon" />
				</NIcon>
			</template>
			<template #default>
				<span :style="widget.color ? { color: widget.color, fontSize: '24px', fontWeight: 500 } : undefined">
					<span v-if="fieldPrefix">{{ fieldPrefix }}&nbsp;</span>
					{{ displayValue }}
					<span v-if="fieldSuffix">&nbsp;{{ fieldSuffix }}</span>
				</span>
			</template>
		</NStatistic>
	</NSpin>
</template>

<script lang="ts" setup>
import { useDashboardData } from "~/composables/useDashboardData";
import { resolveWidgetTable } from "~/composables/widgetSchema";

const props = defineProps<{
	widget: Widget;
	databaseSlug: string;
	dateRangeOverride?: WidgetDateRange;
}>();

const dateRangeRef = toRef(props, "dateRangeOverride");

const { value, loading, field } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const sourceTable = computed(() =>
	resolveWidgetTable(
		useState<Database>("database").value?.tables,
		props.widget.table,
	),
);

// Iconify name, normalized to the `tabler:` prefix whether the stored value
// carries it (legacy widgets) or not (picked via the icon field).
const widgetIcon = computed(() => {
	const icon = props.widget.icon;
	if (!icon) return "";
	return icon.startsWith("tabler:") ? icon : `tabler:${icon}`;
});

// Field-level display affixes (e.g. currency or units) — rendered like the
// table cells do, around the aggregated value.
const fieldPrefix = computed(() => field.value?.prefix);
const fieldSuffix = computed(() => field.value?.suffix);

const displayValue = computed(() => {
	if (value.value === null) return 0;
	return value.value;
});
</script>
