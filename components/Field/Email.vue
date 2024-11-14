<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NAutoComplete :options v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? { ...(field.inputProps(modelValue) ?? {}), type: 'email', autocomplete: 'disabled' }
                : { ...field.inputProps, type: 'email', autocomplete: 'disabled' }
            : { type: 'email', autocomplete: 'disabled' }">
            <template #suffix>
                <component :is="getField(
                    field.subType ?? field.type,
                    modelValue,
                ).icon" />
            </template>
        </NAutoComplete>
    </NFormItem>
</template>

<script lang="ts" setup>
import { isEmail } from "inibase/utils";
import { NFormItem, NAutoComplete, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string>()

const rule: FormItemRule = {
    type: "email",
    required: field.required,
    validator() {
        if (!modelValue.value)
            return field.required ? new Error(`${t(field.key)} ${t('isRequired')}`) : true
        if (!isEmail(modelValue.value))
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
    }
}
const emailProviders = [
    "@gmail.com",
    "@outlook.com",
    "@yahoo.com",
    "@hotmail.com",
    "@protonmail.com",
    "@qq.com",
];
const options = computed(() => emailProviders.map((suffix) => ({
    label: modelValue.value + suffix,
    value: modelValue.value + suffix,
})))
</script>
