<template>
    <FieldWrapper ref="dynamicTags" :field :rule>
        <NFlex align="center" :wrap="true">
            <NTag v-for="(value, index) in field.defaultValue" :key="'default-' + index" round>
                {{ t(value) }}
            </NTag>
            <NTag v-for="(value, index) in nonDefaultValues" :key="'user-' + index" round closable
                @close="removeValue(index)">
                {{ value }}
            </NTag>
            <NInput v-if="showInput" ref="inputRef" v-model:value="inputValue" size="small" round autofocus autosize style="min-width: 150px"
                :placeholder="t(field.key)" clearable @keyup.enter="addValue" @keyup.esc="cancel"
                @blur="cancel" v-bind="field.inputProps
                    ? typeof field.inputProps === 'function'
                        ? field.inputProps(modelValue) ?? {}
                        : field.inputProps
                    : {}">
                <template #suffix>
                    <NTooltip :disabled="!fieldChildrenLabels" :delay="1500">
                        <template #trigger>
                            <component :is="getField(field).icon" />
                        </template>
                        <template v-if="fieldChildrenLabels" #default>
                            {{ t('thisInputSupports') }}: {{ fieldChildrenLabels }}
                        </template>
                    </NTooltip>
                </template>
            </NInput>
            <NButton v-if="!showInput" type="primary" size="small" dashed :disabled="disabled" @click="showInput = true">
                <template #icon>
                    <Icon name="tabler:plus" />
                </template>
            </NButton>
        </NFlex>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormInst, FormItemRule, InputInst } from "naive-ui"

import { validateFieldType } from "inibase/utils"
import { NTag } from "#components"

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<(string | number)[]>()

const showInput = ref(false)
const inputValue = ref()
const inputRef = ref<InputInst>()

const disabled = computed(() => field.max ? (modelValue.value?.length ?? 0) >= field.max : false)

const nonDefaultValues = computed(() =>
    modelValue.value?.filter((value) => !field.defaultValue || !field.defaultValue.includes(value)) ?? [],
)

const fieldChildrenLabels = field.children
    ? flatFieldsList()
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

function addValue() {
    if (inputValue.value) {
        modelValue.value = [...(modelValue.value ?? []), inputValue.value]
        inputValue.value = null
        inputRef.value?.focus()
    }
}

function cancel() {
    showInput.value = false
    inputValue.value = null
}

function removeValue(index: number) {
    const nonDefault = modelValue.value?.filter(
        (value) => !field.defaultValue || !field.defaultValue.includes(value),
    ) ?? []
    const valueToRemove = nonDefault[index]
    modelValue.value = modelValue.value?.filter((v) => v !== valueToRemove) ?? []
}

watch(modelValue, () => {
    try {
        dynamicTags.value?.validate()
    } catch {}
})

watch(showInput, (value) => {
    if (value) {
        nextTick(() => inputRef.value?.focus())
    }
})
</script>
