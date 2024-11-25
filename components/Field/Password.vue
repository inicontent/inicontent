<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NInput type="password" show-password-on="click" v-model:value="modelValue" :placeholder="t(field.key)"
            clearable v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}">
            <template #suffix>
                <component :is="getField(field,
                    modelValue,
                ).icon" />
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
	NIcon,
	NTooltip,
	NFormItem,
	NInput,
	type FormItemRule,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
	required: field.required,
	trigger: ["blur", "input"],
	validator() {
		if (!modelValue.value && field.required && !alreadyRun)
			return new Error(`${t(field.key)} ${t("isRequired")}`);
	},
};

const alreadyRun = ref(false);
if (
	modelValue.value !== undefined &&
	modelValue.value !== "" &&
	modelValue.value !== null
) {
	alreadyRun.value = true;
	modelValue.value = undefined;
}
</script>
