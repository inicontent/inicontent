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
import { isNumber } from "inibase/utils";
import { NInputNumber, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<number>();

const rule: FormItemRule = {
	required: field.required,
	trigger: ["blur", "input"],
	validator() {
		if (modelValue.value === null || modelValue.value === undefined)
			return field.required
				? new Error(`${t(field.key)} ${t("isRequired")}`)
				: true;
		if (!isNumber(modelValue.value))
			return new Error(`${t(field.key)} ${t("isNotValid")}`);
	},
};
</script>
