<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NInput v-model:value="modelValue" :placeholder="t(field.key)" clearable show-count type="textarea"
			:rows="field.isTable ? 1 : 3" v-bind="field.inputProps
				? typeof field.inputProps === 'function'
					? field.inputProps(modelValue) ?? {}
					: field.inputProps
				: {}">
			<template #suffix>
				<component :is="getField(field).icon" />
			</template>
		</NInput>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string>()

const rule: FormItemRule = {
	trigger: ["blur", "input"],
	required: field.required,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}
</script>
