<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NInput v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? { ...(field.inputProps(modelValue) ?? {}), type: 'url' }
                : { ...field.inputProps, type: 'url' }
            : { type: 'url' }">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </NInput>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import { isURL } from "inibase/utils"
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string>()

const rule: FormItemRule = {
	trigger: ["blur", "input"],
	required: field.required,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value, isURL)
	},
}
</script>
