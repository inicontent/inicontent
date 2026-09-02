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

// Accept real URLs (isURL already covers http(s), tel:, mailto:, #anchor) as
// well as site-relative paths (e.g. "/about") — isURL alone rejects those.
const isURLOrRelativePath = (input: unknown) =>
	typeof input === "string" && (input.startsWith("/") || isURL(input))

const rule: FormItemRule = {
	trigger: ["blur", "input"],
	required: field.required,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value, isURLOrRelativePath)
	},
}
</script>
