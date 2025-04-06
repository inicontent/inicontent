<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NRadioGroup v-model:value="modelValue" v-bind="field.inputProps
			? typeof field.inputProps === 'function'
				? field.inputProps(modelValue) ?? {}
				: field.inputProps
			: {}">
			<NFlex>
				<NRadio v-for="{ label, value } in options" :value :label />
			</NFlex>
		</NRadioGroup>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils";
import { NFlex, NRadio, NRadioGroup, type FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string | number>();

const rule: FormItemRule = {
	required: field.required,
	validator() {
		if (!modelValue.value && field.required)
			return new Error(`${t(field.key)} ${t("isRequired")}`);
	},
};

const options = computed(() =>
	field.options
		? isArrayOfObjects(field.options)
			? field.options
			: (field.options as string[]).map((value) => ({
				value: value,
				label: t(value),
			}))
		: [],
);
</script>
