<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NColorPicker :modes="['hex']" :actions="['clear']" v-model:value="modelValue" v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}" />
    </FieldWrapper>
</template>

<script lang="ts" setup>
import { NColorPicker, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
	type: "hex",
	required: field.required,
	validator() {
		if (!modelValue.value && field.required)
			return new Error(`${t(field.key)} ${t("isRequired")}`);
	},
};
</script>
