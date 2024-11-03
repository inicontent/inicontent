<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NInput v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? { ...(field.inputProps(modelValue) ?? {}), type: 'url' }
                : { ...field.inputProps, type: 'url' }
            : { type: 'url' }">
            <template #suffix>
                <component :is="getField(
                    field.subType ?? field.type,
                    modelValue,
                ).icon" />
            </template>
        </NInput>
    </NFormItem>
</template>

<script lang="ts" setup>
import { isURL } from "inibase/utils";
import { NFormItem, NInput, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>()


const modelValue = defineModel<string>()

const rule: FormItemRule = {
    required: field.required,
    trigger: ['blur', 'input'],
    validator() {
        if (!modelValue.value)
            return field.required ? new Error(`${t(field.key)} ${t('isRequired')}`) : true
        if (!isURL(modelValue.value))
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
    }
}
</script>
