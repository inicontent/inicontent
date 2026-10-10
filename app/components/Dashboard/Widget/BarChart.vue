<template>
	<!-- See PieChart.vue: the chart has no intrinsic width, so the flex-item
	     root must be anchored to 100% or echarts initializes with a 0px
	     canvas. -->
	<NSpin :show="loading" style="width: 100%">
		<div style="height: 250px">
			<VChart v-if="groups.length" :option="chartOption" autoresize />
			<NEmpty v-else :description="t('noData')" />
		</div>
	</NSpin>
</template>

<script lang="ts" setup>
import { groupLimitForSize, topGroups } from "~/composables/groupLabels";
import { useDashboardData } from "~/composables/useDashboardData";
import { VChart } from "~/composables/useEcharts";

const props = defineProps<{
	widget: Widget;
	databaseSlug: string;
	dateRangeOverride?: WidgetDateRange;
}>();

const dateRangeRef = toRef(props, "dateRangeOverride");

const { groups, loading } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const Theme = useCookie<"light" | "dark">("theme", { sameSite: true });

// Top N per widget size + one bucket for the rest, same as the pie — a
// crowded category axis gets unreadable past a handful of bars. Computed
// over `groups`, so a size change re-slices without refetching.
const displayGroups = computed(() =>
	topGroups(
		groups.value,
		groupLimitForSize(props.widget.size),
		t("otherSlices"),
	),
);

const chartOption = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: { type: "shadow" },
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		data: displayGroups.value.map((g) => g.name),
		axisLabel: {
			color: Theme.value === "dark" ? "#aaa" : "#666",
			rotate: displayGroups.value.length > 6 ? 30 : 0,
		},
	},
	yAxis: {
		type: "value",
		axisLabel: {
			color: Theme.value === "dark" ? "#aaa" : "#666",
		},
		splitLine: {
			lineStyle: {
				color: Theme.value === "dark" ? "#333" : "#eee",
			},
		},
	},
	series: [
		{
			type: "bar",
			itemStyle: {
				color: props.widget.color || "#2080f0",
				borderRadius: [4, 4, 0, 0],
			},
			data: displayGroups.value.map((g) => g.value),
		},
	],
}));
</script>
