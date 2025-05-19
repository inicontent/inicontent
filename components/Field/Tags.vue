<template>
    <FieldWrapper ref="dynamicTags" :field :rule>
        <NFlex v-if="field.defaultValue" style="margin-right: 8px;">
            <NTag v-for="value in field.defaultValue" size="large">{{ t(value) }}</NTag>
        </NFlex>
        <NDynamicTags size="large"
            :value="modelValue?.filter((value) => !field.defaultValue || !field.defaultValue.includes(value))"
            @update:value="(value: string[]) => modelValue = [...value, ...(field.defaultValue ?? [])]"
            :placeholder="t(field.key)" clearable v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}">
            <template #input="{ deactivate }">
                <NInput v-model:value="inputValue" @keyup.enter="addValue" @keyup.esc="deactivate" @blur="deactivate"
                    :placeholder="t(field.key)" clearable v-bind="field.inputProps
                        ? typeof field.inputProps === 'function'
                            ? field.inputProps(modelValue) ?? {}
                            : field.inputProps
                        : {}">
                    <template #suffix>
                        <NTooltip :delay="1500">
                            <template #trigger>
                                <component :is="getField(
                                    field
                                ).icon" />
                            </template>
                            <template v-if="fieldChildrenLabels" #default>
                                {{ t('thisInputSupports') }}: {{ fieldChildrenLabels }}
                            </template>
                        </NTooltip>
                    </template>
                </NInput>
            </template>
            <template #trigger="{ activate, disabled }">
                <NButton type="primary" dashed :disabled="disabled" @click="activate()">
                    <template #icon>
                        <Icon name="tabler:plus" />
                    </template>
                </NButton>
            </template>
        </NDynamicTags>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import type {
	 FormItemRule,
	 FormInst,
} from "naive-ui"

import { validateFieldType } from "inibase/utils"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string[]>()

const fieldChildrenLabels = field.children
	? flatFieldsList
			.filter(({ key }) =>
				([] as string[])
					.concat(field.children as string | string[])
					.includes(key),
			)
			.map(({ label }) => label)
			.join(" | ")
	: undefined

const rule: FormItemRule = {
	type: "array",
	required: field.required,
	min: field.min,
	max: field.max,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value, validateFieldType)
	},
}
const dynamicTags = ref<FormInst>()
const inputValue = ref()
function addValue() {
	if (inputValue.value) {
		modelValue.value = [...(modelValue.value ?? []), inputValue.value]
		inputValue.value = undefined
	}
}
watch(modelValue, () => {
	try {
		dynamicTags.value?.validate()
	} catch {}
})
</script>
