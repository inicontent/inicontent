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
import { NInput, type FormItemRule } from "naive-ui"

defineTranslation({
    ar: {
        isInvalidFormat: "غير صالح",
    },
})

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string | number>()

const rule: FormItemRule = {
    required: field.required,
    trigger: "input",
    validator() {
        if (!modelValue.value && field.required) {
            return new Error(`${t(field.key)} ${t("isRequired")}`)
        }
        if (field.regex && modelValue.value) {
            try {
                const regex = new RegExp(field.regex)
                const isValid = (() => {
                    let result = false
                    const timeout = setTimeout(() => {
                        throw new Error("Regex evaluation timeout")
                    }, 1000) // 1-second timeout
                    result = regex.test(String(modelValue.value))
                    clearTimeout(timeout)
                    return result
                })()
                if (!isValid) {
                    return new Error(`${t(field.key)} ${t("isInvalidFormat")}`)
                }
            } catch (error) {
                return new Error(`${t(field.key)} ${t("isInvalidFormat")}`)
            }
        }
    },
}
</script>
