<template>
	<NSpin :show="loading">
		<NTooltip :delay="500">
			<template #trigger>
				<NStatistic :value="displayValue">
					<template #prefix>
						<NIcon size="20" v-if="widget.icon">
							<Icon :name="widget.icon" />
						</NIcon>
					</template>
					<template #suffix>
						<NText v-if="widget.operation && widget.operation !== 'count'" depth="3" style="font-size: 14px">
							({{ t(widget.operation) }})
						</NText>
					</template>
					<template v-if="widget.color" #default>
						<span :style="{ color: widget.color, fontSize: '24px', fontWeight: 500 }">
							{{ displayValue }}
						</span>
					</template>
				</NStatistic>
			</template>
			{{ widget.table }}
		</NTooltip>
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

const { value, loading, refresh } = useDashboardData(
	props.widget,
	props.databaseSlug,
	dateRangeRef,
);

const displayValue = computed(() => {
	if (value.value === null) return 0;
	return value.value;
});

onMounted(refresh);
</script>
