<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <UToggle v-model:value="modelValue" v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}" />
    </FieldWrapper>
</template>

<script lang="ts" setup>

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<boolean>()
if (modelValue.value === null || modelValue.value === undefined) modelValue.value = false;

const rule: FormItemRule = {
    required: field.required,
    validator: async () => {
        await nextTick()
        return fieldValidator(field, modelValue.value)
    },
}
</script>
