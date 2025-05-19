<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NInput :value="modelValue !== undefined && modelValue !== null ? String(modelValue) : null"
            @update:value="(value) => modelValue = value" :placeholder="t(field.key)" clearable v-bind="field.inputProps
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

const modelValue = defineModel<string | number>()

const rule: FormItemRule = {
	required: field.required,
	trigger: ["blur", "input"],
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}
</script>
