<template>
	<NSpin :show="loading">
		<div style="height: 250px">
			<VChart v-if="groups.length" :option="chartOption" autoresize />
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

const { groups, loading, refresh } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true });

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
		data: groups.value.map((g) => g.name),
		axisLabel: {
			color: Theme.value === "dark" ? "#aaa" : "#666",
			rotate: groups.value.length > 6 ? 30 : 0,
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
			data: groups.value.map((g) => g.value),
		},
	],
}));

onMounted(refresh);
</script>
