<template>
    <NFormItem ref="dynamicTags" :label="t(field.key)" :path="field.id" :rule v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
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
                        <NTooltip :delay="500">
                            <template #trigger>
                                <component :is="getField(
                                    field,
                                    modelValue,
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
                        <NIcon>
                            <IconPlus />
                        </NIcon>
                    </template>
                </NButton>
            </template>
        </NDynamicTags>
        <template #label>
            <NFlex v-if="field.description" align="center" :size="0">
                {{ t(field.key) }}
                <NTooltip>
                    <template #trigger>
                        <NButton circle text size="tiny">
                            <template #icon>
                                <NIcon>
                                    <IconQuestionMark />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ field.description }}
                </NTooltip>
            </NFlex>
            <template v-else>{{ t(field.key) }}</template>
        </template>
    </NFormItem>
</template>

<script lang="ts" setup>
import {
    NFormItem,
    NDynamicTags,
    NIcon,
    NInput,
    NFlex,
    NTag,
    NButton,
    NTooltip,
    type FormItemRule,
    type FormInst,
} from "naive-ui";
import type { FieldType } from "inibase";
import { validateFieldType } from "inibase/utils";
import { IconPlus } from "@tabler/icons-vue";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string[]>();

const fieldChildrenLabels = field.children
    ? flatFieldsList()
        .filter(({ key }) =>
            ([] as string[])
                .concat(field.children as string | string[])
                .includes(key),
        )
        .map(({ label }) => label)
        .join(" | ")
    : undefined;

const rule: FormItemRule = {
    type: "array",
    required: field.required,
    min: field.min,
    max: field.max,
    validator() {
        if (!Array.isArray(modelValue.value) || modelValue.value.length === 0)
            return field.required
                ? new Error(`${t(field.key)} ${t("isRequired")}`)
                : true;
        for (const value of modelValue.value)
            if (!validateFieldType(value, field.children as FieldType | FieldType[]))
                return new Error(
                    `${t(field.key)} ${t("isNotValid")}${fieldChildrenLabels ? `, ${t("expected")} ${fieldChildrenLabels}` : ""}`,
                );
        return true;
    },
};
const dynamicTags = ref<FormInst>();
const inputValue = ref();
function addValue() {
    if (inputValue.value) {
        modelValue.value = [...(modelValue.value ?? []), inputValue.value];
        inputValue.value = undefined;
    }
}
watch(modelValue, () => {
    try {
        dynamicTags.value?.validate();
    } catch { }
});
</script>
