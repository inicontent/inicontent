<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NColorPicker :modes="['hex']" :actions="['clear']" v-model:value="modelValue" v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}" />
    </NFormItem>
</template>

<script lang="ts" setup>
import { NFormItem, NColorPicker, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel({
    type: String,
})

const rule: FormItemRule = {
    type: "hex",
    required: field.required,
    trigger: "change",
    validator() {
        if (!modelValue.value && field.required)
            return new Error(`${t(field.key)} ${t('isRequired')}`)
    }
}
</script>
