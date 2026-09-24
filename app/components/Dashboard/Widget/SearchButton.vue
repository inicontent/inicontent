<template>
	<NPopover
		style="max-height: 240px"
		:style="`width: ${isMobile ? '100vw' : '500px'}`"
		placement="bottom-end"
		scrollable
		v-model:show="isSearchPopoverVisible"
		:x="isMobile ? 0 : undefined"
		:y="isMobile ? 180 : undefined"
		:show-arrow="!isMobile"
		trigger="click"
	>
		<template #trigger>
			<NTooltip :delay="1500">
				<template #trigger>
					<NButton
						size="tiny"
						secondary
						round
						:type="isSearchPopoverVisible ? 'primary' : undefined"
					>
						<template #icon>
							<NIcon>
								<Icon v-if="isSearchPopoverVisible" name="tabler:x" />
								<Icon v-else name="tabler:filter" />
							</NIcon>
						</template>
					</NButton>
				</template>
				{{ t("filter") }}
			</NTooltip>
		</template>
		<LazyTableSearch v-model="localSearchArray" :callback="handleApply" v-model:schema="searchSchema" />
		<template #footer>
			<NFlex justify="end" :size="8">
				<NButtonGroup>
					<NButton round type="error" secondary size="small" @click="handleReset">
						<template #icon>
							<NIcon>
								<Icon name="tabler:x" />
							</NIcon>
						</template>
						{{ t("reset") }}
					</NButton>
					<NButton round type="primary" secondary size="small" @click="handleApply">
						<template #icon>
							<NIcon>
								<Icon name="tabler:search" />
							</NIcon>
						</template>
						{{ t("search") }}
					</NButton>
				</NButtonGroup>
			</NFlex>
		</template>
	</NPopover>
</template>

<script lang="ts" setup>
import {
	Icon,
	LazyTableSearch,
	NButton,
	NButtonGroup,
	NFlex,
	NIcon,
	NPopover,
	NTooltip,
} from "#components";
import { deepClone } from "~/composables";

const props = defineProps<{
	/** Schema of the widget's source table, feeding the search builder. */
	schema?: Schema;
}>();

// Live widget filter; updating it refetches the widget (the composable
// watches the widget's searchArray).
const array = defineModel<searchType>("array", {
	default: () => ({ and: [[null, "=", null]] }) as searchType,
});

const isSearchPopoverVisible = ref(false);
const { isMobile } = useDevice();

// Local working copy of the widget filter; synced when the widget's own
// searchArray changes (e.g. the editor updates it on a later visit).
const localSearchArray = ref<searchType>(
	deepClone(array.value) ?? { and: [[null, "=", null]] },
);

const searchSchema = ref<Schema | undefined>(props.schema);

watch(
	() => array.value,
	(newVal) => {
		localSearchArray.value = deepClone(newVal) as searchType;
	},
);

// Apply the edited filter to the widget.
function handleApply() {
	array.value = localSearchArray.value;
	isSearchPopoverVisible.value = false;
}

// Clear the widget's filter back to the empty state ({ and: [[null, "=", null]] }
// encodes to "no filter", so the widget shows all rows).
function handleReset() {
	const resetArray = { and: [[null, "=", null]] } as searchType;
	localSearchArray.value = resetArray;
	array.value = resetArray;
	isSearchPopoverVisible.value = false;
}
</script>