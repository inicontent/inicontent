<template>
	<NGrid :x-gap="12" :y-gap="12" :cols="24" responsive="screen">
		<NGridItem
			v-for="widget in dashboard.widgets"
			:key="widget.id + dateRangeKey"
			:span="getSpan(widget.size)"
		>
				<NCard
					:title="widget.title"
					size="small"
					:style="widget.color ? `border-left: 3px solid ${widget.color}` : ''"
				>
					<template #header-extra>
						<NTag size="small" :bordered="false" type="info">
							{{ t(widget.type) }}
						</NTag>
					</template>
					<DashboardWidgetCounter
						v-if="widget.type === 'counter'"
						:widget="widget"
						:database-slug="databaseSlug"
						:date-range-override="dateRangeOverride"
					/>
					<DashboardWidgetLineChart
						v-else-if="widget.type === 'line'"
						:widget="widget"
						:database-slug="databaseSlug"
						:date-range-override="dateRangeOverride"
					/>
					<DashboardWidgetBarChart
						v-else-if="widget.type === 'bar'"
						:widget="widget"
						:database-slug="databaseSlug"
						:date-range-override="dateRangeOverride"
					/>
					<DashboardWidgetPieChart
						v-else-if="widget.type === 'pie'"
						:widget="widget"
						:database-slug="databaseSlug"
						:date-range-override="dateRangeOverride"
					/>
					<DashboardWidgetRecentActivity
						v-else-if="widget.type === 'recent'"
						:widget="widget"
						:database-slug="databaseSlug"
						:date-range-override="dateRangeOverride"
					/>
				</NCard>
			</NGridItem>
			<NGridItem v-if="!dashboard.widgets?.length">
				<NEmpty :description="t('noWidgets')" />
			</NGridItem>
	</NGrid>
</template>

<script lang="ts" setup>
const props = defineProps<{
	dashboard: Dashboard;
	databaseSlug: string;
	dateRangeOverride?: WidgetDateRange;
}>();

const dateRangeKey = computed(() => props.dateRangeOverride ?? "default");

const windowWidth = ref(0);

const smallWidgetsCount = computed(() =>
	(props.dashboard.widgets ?? []).filter(
		(widget) => widget.size === "small" || !widget.size,
	).length,
);

const desktopSmallWidgetsPerLine = computed(() => {
	if (windowWidth.value < 1024) {
		return 2;
	}

	let maxPerLine = 3;

	if (windowWidth.value >= 2160) {
		maxPerLine = 8;
	} else if (windowWidth.value >= 1920) {
		maxPerLine = 7;
	} else if (windowWidth.value >= 1600) {
		maxPerLine = 6;
	} else if (windowWidth.value >= 1366) {
		maxPerLine = 5;
	} else if (windowWidth.value >= 1200) {
		maxPerLine = 4;
	}

	if (smallWidgetsCount.value === 0) {
		return 3;
	}

	if (smallWidgetsCount.value < 3) {
		return smallWidgetsCount.value;
	}

	return Math.min(maxPerLine, smallWidgetsCount.value);
});

const smallWidgetSpan = computed(() =>
	Math.max(3, Math.floor(24 / Math.max(1, desktopSmallWidgetsPerLine.value))),
);

function updateWindowWidth() {
	windowWidth.value = window.innerWidth;
}

onMounted(() => {
	updateWindowWidth();
	window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", updateWindowWidth);
});

function getSpan(size?: WidgetSize): number {
	switch (size) {
		case "large":
			return 24;
		case "medium":
			return 12;
		default:
			return smallWidgetSpan.value;
	}
}
</script>
