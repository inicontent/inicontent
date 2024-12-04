<template>
    <NFormItem :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NInput v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </NInput>
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
                    {{ t(field.description) }}
                </NTooltip>
            </NFlex>
            <template v-else>{{ t(field.key) }}</template>
        </template>
    </NFormItem>
</template>

<script lang="ts" setup>
import { IconQuestionMark } from "@tabler/icons-vue";
import {
    NButton,
    NFlex,
    NFormItem,
    NIcon,
    NInput,
    NTooltip,
    type FormItemRule,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
    required: field.required,
    trigger: ["blur", "input"],
    validator() {
        if (!modelValue.value && field.required)
            return new Error(`${t(field.key)} ${t("isRequired")}`);
    },
};
</script>
