<template>
	<NCollapse :triggerAreas="['main', 'arrow']" accordion default-expanded-names="0">
		<NCollapseItem v-for="(_items, condition, index) in modelValue" :key="condition" :name="index.toString()"
			:title="t(`${condition}Group`)">
			<template #header-extra>
				<NButtonGroup>
					<NDropdown :options="conditionDropdownOptions" style="max-height: 200px;" scrollable
						@select="(value: 'and' | 'or') => modelValue[condition]?.push({ [value]: [[null, '=', null]] })">
						<NButton round type="primary" secondary @click="modelValue[condition]?.push([null, '=', null])"
							circle size="small">
							<template #icon>
								<NIcon>
									<IconPlus />
								</NIcon>
							</template>
						</NButton>
					</NDropdown>

					<NTooltip :delay="500">
						<template #trigger>
							<NButton round type="info" secondary @click="() => toggleCondition(condition)" circle
								size="small">
								<template #icon>
									<NIcon>
										<IconSwitchHorizontal />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t(
							`convertTo_"${condition === "and" ? "or" : "and"}"_group`,
						) }}
					</NTooltip>
					<NButton round type="error" secondary @click="delete modelValue[condition]" circle size="small">
						<template #icon>
							<NIcon>
								<IconTrash />
							</NIcon>
						</template>
					</NButton>
				</NButtonGroup>
			</template>
			<TableSearchItems v-model="modelValue[condition]" :callback />
		</NCollapseItem>
	</NCollapse>
</template>

<script lang="ts" setup>
import {
	IconPlus,
	IconTrash,
	IconSwitchHorizontal,
	IconArrowMerge,
	IconArrowFork,
} from "@tabler/icons-vue";
import {
	NButton,
	NTooltip,
	NCollapse,
	NCollapseItem,
	NDropdown,
	NIcon,
	NButtonGroup,
} from "naive-ui";

defineTranslation({
	ar: {
		andGroup: "مجموعة و",
		orGroup: "مجموعة أو",
	},
});

const { callback } = defineProps<{ callback: CallableFunction }>();

const modelValue = defineModel<searchType>({
	default: { and: [[null, "=", null]] },
});

const conditionDropdownOptions = [
	{
		key: "and",
		label: t("andGroup"),
		icon: () => h(NIcon, () => h(IconArrowMerge)),
	},
	{
		key: "or",
		label: t("orGroup"),
		icon: () => h(NIcon, () => h(IconArrowFork)),
	},
];

function toggleCondition(oldCondition: "and" | "or") {
	modelValue.value[oldCondition === "and" ? "or" : "and"] =
		modelValue.value[oldCondition];
	delete modelValue.value[oldCondition];
}
</script>
