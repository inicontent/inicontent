<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NAutoComplete :options v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? { ...(field.inputProps(modelValue) ?? {}), type: 'email', autocomplete: 'disabled' }
                : { ...field.inputProps, type: 'email', autocomplete: 'disabled' }
            : { type: 'email', autocomplete: 'disabled' }">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </NAutoComplete>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import { isEmail } from "inibase/utils";
import {
    NAutoComplete,
    type FormItemRule,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
    type: "email",
    required: field.required,
    validator() {
        if (!modelValue.value)
            return field.required
                ? new Error(`${t(field.key)} ${t("isRequired")}`)
                : true;
        if (!isEmail(modelValue.value))
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
    },
};
const emailProviders = [
    "@gmail.com",
    "@outlook.com",
    "@yahoo.com",
    "@hotmail.com",
    "@protonmail.com",
    "@qq.com",
];

const options = computed(() => {
    return emailProviders.map((suffix) => {
        const value = modelValue.value === null ? "" : modelValue.value;
        const prefix = value?.split("@")[0];
        return {
            label: prefix + suffix,
            value: prefix + suffix,
        };
    });
});
</script>
