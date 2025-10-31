<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<UInput v-model:value="modelValue" :placeholder="t(field.key)" clearable show-count type="textarea"
			:rows="field.isTable ? 1 : undefined" :autosize="field.isTable ? false : {
				minRows: 3,
			}" v-bind="field.inputProps
		? typeof field.inputProps === 'function'
			? field.inputProps(modelValue) ?? {}
			: field.inputProps
		: {}">
			<template #suffix>
				<component :is="getField(field).icon" />
			</template>
		</UInput>
	</FieldWrapper>
</template>

<script lang="ts" setup>

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
