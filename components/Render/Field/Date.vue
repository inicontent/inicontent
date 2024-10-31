<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NDatePicker :month-format="field.date && field.date === 'month' ? 'MMM' : 'MM'" format="dd-MM-yyyy"
            :type="field.date ?? 'date'" :actions="null" v-model:value="modelValue" clearable
            :placeholder="t(field.key)" v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}" />
    </NFormItem>
</template>

<script lang="ts" setup>
import { NFormItem, NDatePicker, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel({
    type: Number,
})

const rule: FormItemRule = {
    type: "number",
    required: field.required,
    trigger: ["blur", "change"],
    validator() {
        if (!modelValue.value && field.required)
            return new Error(`${t(field.key)} ${t('isRequired')}`)
    }
}
</script>
