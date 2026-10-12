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
import type { FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<boolean>();
// Boolean fields normally coerce an unset value to `false`. Fields that carry a
// meaningful "unset" state (e.g. the PHI classification) set `preserveUnset` so
// an unrelated form save cannot silently turn unclassified into `false`.
const normalized = normalizeBooleanField(
	modelValue.value,
	field.preserveUnset === true,
);
if (normalized !== modelValue.value) modelValue.value = normalized;

const rule: FormItemRule = {
	required: field.required,
	validator: async () => {
		await nextTick();
		return fieldValidator(field, modelValue.value);
	},
};
</script>
