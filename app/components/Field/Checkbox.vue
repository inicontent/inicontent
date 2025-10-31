<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NCheckboxGroup v-model:value="modelValue" v-bind="field.inputProps
			? typeof field.inputProps === 'function'
				? field.inputProps(modelValue) ?? {}
				: field.inputProps
			: {}">
			<NFlex>
				<NCheckbox v-for="{ label, value } in options" :value :label />
			</NFlex>
		</NCheckboxGroup>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string | number | (string | number)[]>()

const rule: FormItemRule = {
	trigger: "change",
	type: "array",
	required: field.required,
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
