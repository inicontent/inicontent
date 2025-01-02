<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NAutoComplete :options v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? { ...(field.inputProps(modelValue) ?? {}), type: 'email', autocomplete: 'disabled' }
                : { ...field.inputProps, type: 'email', autocomplete: 'disabled' }
            : { type: 'email', autocomplete: 'disabled' }">
            <template #suffix>
                <component :is="getField(field).icon" />
            </template>
        </NAutoComplete>
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
import { isEmail } from "inibase/utils";
import { IconQuestionMark } from "@tabler/icons-vue";
import {
	NButton,
	NFlex,
	NIcon,
	NTooltip,
	NFormItem,
	NAutoComplete,
	type FormItemRule,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
	type: "email",
	required: field.required,
	validator() {
		if (!modelValue.value)
			return field.required
				? new Error(`${t(field.key)} ${t("isRequired")}`)
				: true;
		if (!isEmail(modelValue.value))
			return new Error(`${t(field.key)} ${t("isNotValid")}`);
	},
};
const emailProviders = [
	"@gmail.com",
	"@outlook.com",
	"@yahoo.com",
	"@hotmail.com",
	"@protonmail.com",
	"@qq.com",
];

const options = computed(() => {
	return emailProviders.map((suffix) => {
		const value = modelValue.value === null ? "" : modelValue.value;
		const prefix = value?.split("@")[0];
		return {
			label: prefix + suffix,
			value: prefix + suffix,
		};
	});
});
</script>
