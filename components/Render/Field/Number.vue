<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NInputNumber v-model:value="modelValue" :placeholder="t(field.key)" :show-button="false" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}">
            <template #suffix>
                <component :is="getField(
                    field.subType ?? field.type,
                    modelValue,
                ).icon" />
            </template>
        </NInputNumber>
    </NFormItem>
</template>

<script lang="ts" setup>
import { isNumber } from "inibase/utils";
import { NFormItem, NInputNumber, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel({
    type: Number,
})

const rule: FormItemRule = {
    required: field.required,
    trigger: ['blur', 'input'],
    validator() {
        if (!modelValue.value)
            return field.required ? new Error(`${t(field.key)} ${t('isRequired')}`) : true
        if (!isNumber(modelValue.value))
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
    }
}
</script>
