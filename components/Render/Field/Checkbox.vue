<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NCheckboxGroup v-model:value="modelValue" v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}">
            <NFlex>
                <NCheckbox v-for="value in field.options" :value="value" :label="t(value)" />
            </NFlex>
        </NCheckboxGroup>
    </NFormItem>
</template>

<script lang="ts" setup>
import { NFormItem, NCheckbox, NCheckboxGroup, NFlex, type FormItemRule } from "naive-ui";

const { field } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    }
})

const modelValue = defineModel({
    type: String,
})

const rule: FormItemRule = {
    type: "array",
    required: field.required,
    trigger: "change",
    validator() {
        if (!modelValue.value && field.required)
            return new Error(`${t(field.key)} ${t('isRequired')}`)
    }
}
</script>
