<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NInput v-model:value="modelValue" :placeholder="t(field.key)" clearable show-count type="textarea"
            :rows="field.isTable ? 1 : 3" v-bind="field.inputProps
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
        </NInput>
    </NFormItem>
</template>

<script lang="ts" setup>
import { NFormItem, NInput, type FormItemRule } from "naive-ui";

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
</script>
