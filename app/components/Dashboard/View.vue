<template>
	<NGrid :x-gap="12" :y-gap="12" :cols="6" responsive="screen">
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

function getSpan(size?: WidgetSize): number {
	switch (size) {
		case "large":
			return 6;
		case "medium":
			return 3;
		default:
			return 2;
	}
}
</script>
