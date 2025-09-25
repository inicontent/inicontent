<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NMention v-model:value="modelValue" :placeholder="t(field.key)" :options clearable v-bind="field.inputProps
			? typeof field.inputProps === 'function'
				? field.inputProps(modelValue) ?? {}
				: field.inputProps
			: {}">
		</NMention>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string>()

const rule: FormItemRule = {
	required: field.required,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}

const options = field.options
	? isArrayOfObjects(field.options)
		? field.options
		: (field.options as string[]).map((value) => ({
				value: value,
				label: t(value),
			}))
	: []
</script>
