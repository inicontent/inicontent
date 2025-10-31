<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <UInput v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? { ...(field.inputProps(modelValue) ?? {}), type: 'url' }
                : { ...field.inputProps, type: 'url' }
            : { type: 'url' }">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </UInput>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import { isURL } from "inibase/utils"

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
