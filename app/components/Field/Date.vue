<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NDatePicker :month-format="field.date && field.date === 'month' ? 'MMM' : 'MM'"
            :format="field.date && ['datetime', 'datetimerange'].includes(field.date) ? 'dd-MM-yyyy HH:mm:ss' : 'dd-MM-yyyy'"
            :type="field.date ?? 'date'" :actions="field.date && ['datetime', 'datetimerange'].includes(field.date) ? ['confirm'] : null" v-model:value="modelValue" clearable
            :placeholder="t(field.key)" v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}" />
    </FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<number>()

const rule: FormItemRule = {
	trigger: "change",
	type: "number",
	required: field.required,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}
</script>
