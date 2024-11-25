<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NPopover trigger="manual" v-model:show="showPopover" :onClickoutside>
            <template #trigger>
                <NInput :inputProps="{ class: 'IconPickerInput' }" @focus="showPopover = true"
                    v-model:value="modelValue" :placeholder="t(field.key)" clearable v-bind="field.inputProps
                        ? typeof field.inputProps === 'function'
                            ? field.inputProps(modelValue) ?? {}
                            : field.inputProps
                        : {}">
                    <template #prefix>
                        <NIcon>
                            <DataIcon v-if="modelValue && iconsList.includes(modelValue)" :value="modelValue" />
                            <IconQuestionMark v-else />
                        </NIcon>
                    </template>

                    <template #suffix>
                        <NIcon>
                            <IconIcons />
                        </NIcon>
                    </template>
                </NInput>
            </template>
            <NVirtualList v-if="formatedIconsList.length" style="max-height: 250px" :item-size="42" :distance="0"
                :items="formatedIconsList" ignore-item-resize>
                <template #default="{ item }">
                    <NButton :key="item.key" strong :secondary="modelValue === item.value"
                        :quaternary="modelValue !== item.value" round
                        :type="modelValue === item.value ? 'primary' : 'default'" @click="modelValue = item.value"
                        class="IconPickerItem">
                        <template #icon>
                            <NIcon>
                                <DataIcon :value="item.value" />
                            </NIcon>
                        </template>
                        <span> {{ item.value }}</span>
                    </NButton>
                </template>
            </NVirtualList>
            <NEmpty v-else />
        </NPopover>
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
import { IconIcons, IconQuestionMark } from "@tabler/icons-vue";
import {
	NButton,
	NFlex,
	NIcon,
	NTooltip,
	NEmpty,
	NFormItem,
	NInput,
	NPopover,
	NVirtualList,
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
function IconsListSingle(icon: string) {
	return {
		key: icon,
		value: icon,
	};
}

function getIconsList(search?: string) {
	if (!search) return iconsList.map(IconsListSingle);
	const filteredIconsList = iconsList.filter((icon) => icon.includes(search));
	if (!filteredIconsList.length) return [];
	if (filteredIconsList.length === 1)
		return [
			...filteredIconsList.map(IconsListSingle),
			...iconsList.filter((icon) => icon !== search).map(IconsListSingle),
		];
	return [
		...filteredIconsList.map(IconsListSingle),
		...iconsList.filter((icon) => !icon.includes(search)).map(IconsListSingle),
	];
}
const formatedIconsList = computed(() => getIconsList(modelValue.value));
const showPopover = ref(false);
function onClickoutside(event: MouseEvent) {
	if (!(event.target as HTMLElement).classList.contains("IconPickerInput"))
		showPopover.value = false;
}
</script>

<style scoped>
.IconPickerItem {
    display: flex;
    justify-content: start;
    width: 100%;
    height: 42px;
    margin-top: 5px;
}
</style>