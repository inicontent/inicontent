<template>
	<NSpin :show="loading">
		<div style="height: 250px">
			<VChart v-if="timeSeries.length" :option="chartOption" autoresize />
			<NEmpty v-else :description="t('noData')" />
		</div>
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

const { timeSeries, loading, refresh } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true });

const chartOption = computed(() => ({
	tooltip: {
		trigger: "axis",
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
		data: timeSeries.value.map((d) => d.date),
		axisLabel: {
			color: Theme.value === "dark" ? "#aaa" : "#666",
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
			name: props.widget.title,
			type: "line",
			smooth: true,
			areaStyle: {
				opacity: 0.3,
			},
			itemStyle: {
				color: props.widget.color || "#18a058",
			},
			data: timeSeries.value.map((d) => d.value),
		},
	],
}));

onMounted(refresh);
</script>
