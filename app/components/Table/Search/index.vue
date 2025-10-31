<template>
	<UAccordion :triggerAreas="['main', 'arrow']" accordion default-expanded-names="0">
		<UAccordionItem v-for="(_items, condition, index) in modelValue" :key="condition" :name="index.toString()"
			:title="t(`${condition}Group`)">
			<template #header-extra>
				<UButtonGroup>
					<UDropdown :options="conditionDropdownOptions" style="max-height: 200px;" scrollable
						@select="(value: 'and' | 'or') => modelValue[condition]?.push({ [value]: [[null, '=', null]] })">
						<UButton round type="primary" secondary @click="modelValue[condition]?.push([null, '=', null])"
							circle size="small">
							<template #icon>
								<div class="inline-block">
									<Icon name="tabler:plus" />
								</div>
							</template>
						</UButton>
					</UDropdown>

					<UTooltip :delay="1500">
						<template #trigger>
							<UButton round type="info" secondary @click="() => toggleCondition(condition)" circle
								size="small">
								<template #icon>
									<div class="inline-block">
										<Icon name="tabler:switch-horizontal" />
									</div>
								</template>
							</UButton>
						</template>
						{{ t(
							`convert_to_${condition === "and" ? "or" : "and"}_group`,
						) }}
					</UTooltip>
					<UButton round type="error" secondary @click="delete modelValue[condition]" circle size="small">
						<template #icon>
							<div class="inline-block">
								<Icon name="tabler:trash" />
							</div>
						</template>
					</UButton>
				</div>
			</template>
			<TableSearchItems v-model="modelValue[condition]" :callback />
		</UAccordionItem>
	</UAccordion>
</template>

<script lang="ts" setup>
import { Icon, NIcon } from "#components"

defineTranslation({
	ar: {
		convert_to_and_group: "تحويل إلى مجموعة و",
		convert_to_or_group: "تحويل إلى مجموعة أو",
		andGroup: "مجموعة و",
		orGroup: "مجموعة أو",
	},
})

const { callback } = defineProps<{ callback: CallableFunction }>()

const modelValue = defineModel<searchType>({
	default: { and: [[null, "=", null]] },
})

const conditionDropdownOptions = [
	{
		key: "and",
		label: t("andGroup"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-merge" })),
	},
	{
		key: "or",
		label: t("orGroup"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-fork" })),
	},
]

function toggleCondition(oldCondition: "and" | "or") {
	modelValue.value[oldCondition === "and" ? "or" : "and"] =
		modelValue.value[oldCondition]
	delete modelValue.value[oldCondition]
}
</script>
