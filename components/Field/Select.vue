<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NSelect v-model:value="modelValue" :placeholder="t(field.key)" :options :tag="!!field.custom"
			max-tag-count="responsive" :consistent-menu-width="false" :multiple="!!field.isArray" filterable clearable
			v-bind="field.inputProps
				? typeof field.inputProps === 'function'
					? field.inputProps(modelValue) ?? {}
					: field.inputProps
				: {}" />
	</FieldWrapper>
</template>

<script lang="ts" setup>
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils"
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string | string[]>()

const rule: FormItemRule = {
	trigger: "change",
	type: field.isArray ? "array" : "any",
	required: field.required,
	min: field.isArray ? field.min : undefined,
	max: field.isArray ? field.max : undefined,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}

const options = computed(() =>
	field.options
		? isArrayOfArrays(field.options)
			? (field.options as [string | number, string][]).map(([value]) => ({
					value: value,
					label: t(value),
				}))
			: isArrayOfObjects(field.options)
				? field.options
				: (field.options as string[]).map((value) => ({
						value: value,
						label: t(value),
					}))
		: [],
)
</script>
