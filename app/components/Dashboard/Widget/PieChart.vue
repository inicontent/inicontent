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
		trigger: "item",
		formatter: "{b}: {c} ({d}%)",
	},
	legend: {
		orient: "vertical",
		right: 10,
		top: "center",
		textStyle: {
			color: Theme.value === "dark" ? "#aaa" : "#666",
		},
	},
	series: [
		{
			type: "pie",
			radius: ["40%", "70%"],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 6,
				borderColor: Theme.value === "dark" ? "#1e1e1e" : "#fff",
				borderWidth: 2,
			},
			label: {
				show: false,
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 14,
					fontWeight: "bold",
				},
			},
			data: groups.value.map((g, i) => ({
				value: g.value,
				name: g.name,
				...(props.widget.color && i === 0
					? { itemStyle: { color: props.widget.color } }
					: {}),
			})),
		},
	],
}));

onMounted(refresh);
</script>
