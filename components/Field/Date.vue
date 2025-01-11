<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NDatePicker :month-format="field.date && field.date === 'month' ? 'MMM' : 'MM'" format="dd-MM-yyyy"
            :type="field.date ?? 'date'" :actions="null" v-model:value="modelValue" clearable
            :placeholder="t(field.key)" v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}" />
    </FieldWrapper>
</template>

<script lang="ts" setup>
import { NDatePicker, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<number>();

const rule: FormItemRule = {
	type: "number",
	required: field.required,
	trigger: ["blur", "change"],
	validator() {
		if (!modelValue.value && field.required)
			return new Error(`${t(field.key)} ${t("isRequired")}`);
	},
};
</script>
