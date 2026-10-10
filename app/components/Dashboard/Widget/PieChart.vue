<template>
	<!-- The card content is a flex row, so the widget root is a flex item with
	     content-based width — and a chart contributes no intrinsic width at
	     all, collapsing to 0px (echarts then inits blank: "Can't get DOM
	     width or height"). Anchor it with an explicit 100%. -->
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

// Top N per widget size + one bucket for the rest, so a crowded grouping
// stays readable (and the legend fits). Computed over `groups`, so a size
// change re-slices without refetching.
const displayGroups = computed(() =>
	topGroups(
		groups.value,
		groupLimitForSize(props.widget.size),
		t("otherSlices"),
	),
);

// A small widget is only ~1/3 of the dashboard width, and echarts reserves
// no space for a legend on a pie (there's no grid to contain it) — the
// right-anchored vertical legend grows leftward and lands on top of the
// canvas (measured: ~17k px² of overlap on a 300×250 canvas). Compact mode
// parks the legend in a scrollable bottom row and lifts the pie above it,
// which keeps them apart at any width (the pie radius is height-bound).
// Medium and large are wide enough for the vertical legend to stay clear.
const compact = computed(() => (props.widget.size ?? "small") === "small");

const chartOption = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: "{b}: {c} ({d}%)",
	},
	legend: {
		orient: compact.value ? "horizontal" : "vertical",
		...(compact.value
			? { bottom: 0, left: "center", type: "scroll" }
			: { right: 10, top: "center" }),
		textStyle: {
			color: Theme.value === "dark" ? "#aaa" : "#666",
		},
	},
	series: [
		{
			type: "pie",
			...(compact.value
				? { center: ["50%", "42%"], radius: ["36%", "64%"] }
				: { radius: ["40%", "70%"] }),
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
			data: displayGroups.value.map((g, i) => ({
				value: g.value,
				name: g.name,
				...(props.widget.color && i === 0
					? { itemStyle: { color: props.widget.color } }
					: {}),
			})),
		},
	],
}));
</script>
