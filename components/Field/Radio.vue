<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NRadioGroup v-model:value="modelValue" v-bind="field.inputProps
            ? typeof field.inputProps === 'function'
                ? field.inputProps(modelValue) ?? {}
                : field.inputProps
            : {}">
            <NFlex>
                <NRadio v-for="{ label, value } in options" :value :label />
            </NFlex>
        </NRadioGroup>
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
import { isArrayOfObjects } from "inibase/utils";
import {
	NButton,
	NFlex,
	NIcon,
	NTooltip,
	NFormItem,
	NRadio,
	NRadioGroup,
	type FormItemRule,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string | number>();

const rule: FormItemRule = {
	required: field.required,
	trigger: ["blur", "input"],
	validator() {
		if (!modelValue.value && field.required)
			return new Error(`${t(field.key)} ${t("isRequired")}`);
	},
};

const options = computed(() =>
	field.options
		? isArrayOfObjects(field.options)
			? field.options
			: (field.options as string[]).map((value) => ({
					value: value,
					label: t(value),
				}))
		: [],
);
</script>
