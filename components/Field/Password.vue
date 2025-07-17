<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NInput type="password" show-password-on="click" v-model:value="localModelValue" :placeholder="t(field.key)"
			clearable v-bind="field.inputProps
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
const modelValue = defineModel<string | null>()
const localModelValue = ref<string | null>(
	modelValue.value !== undefined && modelValue.value !== null
		? String(modelValue.value)
		: null,
)
watch(localModelValue, (v) => {
	modelValue.value = v
})

const rule: FormItemRule = {
	trigger: ["blur", "input"],
	required: field.required,
	validator: async () => {
		if (!alreadyRun.value) {
			await nextTick()
			return fieldValidator(field, localModelValue.value)
		}
		return new Promise((resolve) => {
			resolve()
		})
	},
}

const alreadyRun = ref(false)
onMounted(() => {
	if (
		localModelValue.value !== undefined &&
		localModelValue.value !== "" &&
		localModelValue.value !== null
	) {
		alreadyRun.value = true
		localModelValue.value = null
	}
})
</script>
