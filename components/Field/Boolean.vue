<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NSwitch v-model:value="modelValue" v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}" />
    </FieldWrapper>
</template>

<script lang="ts" setup>
import { NSwitch, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<boolean>();

const rule: FormItemRule = {
	required: field.required,
	validator() {
		if (!modelValue.value && field.required)
			return new Error(`${t(field.key)} ${t("isRequired")}`);
	},
};
</script>
