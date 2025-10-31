<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <UInput type="date" :month-format="field.date && field.date === 'month' ? 'MMM' : 'MM'" format="dd-MM-yyyy"
            :type="field.date ?? 'date'" :actions="null" v-model:value="modelValue" clearable
            :placeholder="t(field.key)" v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}" />
    </FieldWrapper>
</template>

<script lang="ts" setup>

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
