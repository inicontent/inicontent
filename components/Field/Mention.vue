<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NMention v-model:value="modelValue" :placeholder="t(field.key)" :options clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}">
            <template #suffix>
                <component :is="getField(field,
                    modelValue,
                ).icon" />
            </template>
        </NMention>
    </NFormItem>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils";
import { NFormItem, NMention, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string>()

const rule: FormItemRule = {
    required: field.required,
    trigger: ['blur', 'input'],
    validator() {
        if (!modelValue.value && field.required)
            return new Error(`${t(field.key)} ${t('isRequired')}`)
    }
}

const options = field.options ? isArrayOfObjects(field.options) ? field.options : (field.options as string[]).map((value) => ({
    value: value,
    label: t(value),
})) : []
</script>
