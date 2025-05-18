<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NInput type="password" show-password-on="click" v-model:value="modelValue" :placeholder="t(field.key)"
            clearable v-bind="field.inputProps
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
import { NInput, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
    trigger: ['blur', 'input'],
    required: field.required,
    validator() {
        if (!modelValue.value && field.required && !alreadyRun)
            return new Error(`${t(field.key)} ${t("isRequired")}`);
    },
};

const alreadyRun = ref(false);
if (
    modelValue.value !== undefined &&
    modelValue.value !== "" &&
    modelValue.value !== null
) {
    alreadyRun.value = true;
    modelValue.value = undefined;
}
</script>
