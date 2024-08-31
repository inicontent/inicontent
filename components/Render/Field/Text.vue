<template>
    <NFormItem :label="t(field.key)" :path="path" :rule="{
        required: field.required,
        trigger: ['blur', 'input'],
        message: `${t(field.key)} ${t('isRequired')}`,
    }" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(getProperty(modelValue, path)) ?? {}
            : field.labelProps
        : {})">
        <NInput :value="getProperty(modelValue, path)" @update:value="(value) =>
            setProperty(modelValue, path, value.toString())" :placeholder="t(field.key)" clearable v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(getProperty(modelValue.value, path)) ?? {}
                    : field.inputProps
                : {}">
            <template #suffix>
                <component :is="getField(
                    field.subType ?? field.type,
                    getProperty(modelValue, path, ''),
                ).icon" />
            </template>
        </NInput>
    </NFormItem>
</template>

<script lang="ts" setup>
import { getProperty, setProperty } from "inidot";
import { NFormItem, NInput } from "naive-ui";

const { field, path } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    },
    path: {
        type: String,
        required: true,
    }
})


const modelValue = defineModel({
    type: Object as PropType<any>,
    default: {},
})

</script>
