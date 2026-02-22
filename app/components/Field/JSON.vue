<template>
    <FieldWrapper :field :rule v-model="internalValue">
        <NInput v-model:value="internalValue" :placeholder="t(field.key)" clearable type="textarea"
            :rows="field.isTable ? 1 : undefined" :autosize="field.isTable ? false : {
                minRows: 5,
                maxRows: 20,
            }" :status="hasError ? 'error' : undefined" v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(internalValue) ?? {}
                    : field.inputProps
                : {}">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </NInput>
        <div v-if="hasError" style="color: var(--error-color); font-size: 12px; margin-top: 4px;">
            {{ t("invalidJSON") }}
        </div>
        <template v-if="!field.isTable && internalValue" #footer>
            <NFlex justify="space-between" align="center">
                <span style="font-size: 12px; color: var(--text-color-3);">
                    {{ formattedSize }}
                </span>
                <NFlex gap="small">
                    <NButton text type="primary" size="small" @click="formatJSON" :disabled="hasError">
                        {{ t("format") }}
                    </NButton>
                </NFlex>
            </NFlex>
        </template>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui";
import { NButton, NFlex } from "#components";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<any>();

// Convert parsed object to JSON string for display
const stringifyValue = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
};

const internalValue = ref<string>(stringifyValue(modelValue.value));

const hasError = computed(() => {
    if (!internalValue.value) return false;
    try {
        JSON.parse(internalValue.value);
        return false;
    } catch {
        return true;
    }
});

const formattedSize = computed(() => {
    if (!internalValue.value) return "0 B";
    const bytes = new Blob([internalValue.value]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
});

const rule: FormItemRule = {
    trigger: ["blur", "input"],
    required: field.required,
    validator: async () => {
        await nextTick();
        if (field.required && !internalValue.value) {
            return false;
        }
        if (internalValue.value && hasError.value) {
            return false;
        }
        return fieldValidator(field, internalValue.value);
    },
};

const formatJSON = () => {
    try {
        const parsed = JSON.parse(internalValue.value);
        internalValue.value = JSON.stringify(parsed, null, 2);
        modelValue.value = parsed;
    } catch (error) {
        console.error("JSON formatting failed:", error);
    }
};

watch(internalValue, (newValue) => {
    if (!newValue) {
        modelValue.value = null;
        return;
    }
    try {
        const parsed = JSON.parse(newValue);
        modelValue.value = parsed;
    } catch {
        // Don't update modelValue if JSON is invalid - keep previous value
    }
});

watch(modelValue, (newValue) => {
    const stringified = stringifyValue(newValue);
    if (stringified !== internalValue.value) {
        internalValue.value = stringified;
    }
});
</script>
