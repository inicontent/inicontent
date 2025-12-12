<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NInputNumber v-model:value="modelValue" :placeholder="t(field.key)" :show-button="false" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </NInputNumber>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui";
const { field } = defineProps<{ field: Field }>();
const modelValue = defineModel<number>();
const rule: FormItemRule = {
	trigger: ["blur", "input"],
	required: field.required,
	validator: async () => {
		await nextTick();
		return fieldValidator(field, modelValue.value);
	},
};
</script>
