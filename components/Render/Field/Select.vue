<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NSelect v-model:value="modelValue" :placeholder="t(field.key)" :options :tag="!!field.custom"
            max-tag-count="responsive" :consistent-menu-width="false" :multiple="!!field.isArray" filterable clearable
            v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}" />
    </NFormItem>
</template>

<script lang="ts" setup>
import { NFormItem, NSelect, type FormItemRule } from "naive-ui";
import type { PropType } from "vue";

const { field } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    },
});

const modelValue = defineModel({
    type: [Array, String] as PropType<string[] | string>,
});

const rule: FormItemRule = {
    type: field.isArray ? "array" : "any",
    required: field.required,
    trigger: "change",
    min: field.isArray ? field.min : undefined,
    max: field.isArray ? field.max : undefined,
    validator() {
        if (
            !modelValue.value ||
            (Array.isArray(modelValue.value) && modelValue.value.length === 0)
        )
            return field.required
                ? new Error(`${t(field.key)} ${t("isRequired")}`)
                : true;
        if (
            Array.isArray(modelValue.value) &&
            field.min &&
            modelValue.value.length < field.min
        )
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
        if (
            Array.isArray(modelValue.value) &&
            field.max &&
            modelValue.value.length > field.max
        )
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
    },
};

const options = field.options ? (field.options.every(option => typeof option !== 'object') ? field.options.map((value) => ({
    value: value,
    label: t(value),
})) : field.options) : []
</script>
