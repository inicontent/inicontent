<template>
	<NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="field.labelProps">
		<slot></slot>
		<template #label>
			<NFlex v-if="field.description" align="center" :size="0">
				<NDropdown
					:disabled="([] as string[]).concat(field.type).every(type => !['table', 'array', 'date'].includes(type))"
					show-arrow placement="top" trigger="hover" :delay="800" :options="dropdownOptions"
					@select="handleSelect">
					{{ t(field.key) }}
				</NDropdown>
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
			<template v-else>
				<NDropdown
					:disabled="([] as string[]).concat(field.type).every(type => !['table', 'array', 'date'].includes(type))"
					show-arrow placement="top" trigger="hover" :delay="500" :options="dropdownOptions" size="small"
					@select="handleSelect">
					{{ t(field.key) }}
				</NDropdown>
			</template>
			<slot name="label"></slot>
		</template>
	</NFormItem>
</template>

<script lang="ts" setup>
import {
	NButton,
	NFlex,
	NIcon,
	NTooltip,
	NFormItem,
	NDropdown,
	type FormItemRule,
	type DropdownOption,
} from "naive-ui";
import { IconClipboard, IconCopy, IconQuestionMark } from "@tabler/icons-vue";
import Inison from "inison";
import { isObject, isStringified } from "inibase/utils";

const { field, rule } = defineProps<{ field: Field; rule: FormItemRule }>();

const modelValue = defineModel<any>();

async function handleSelect(value: string) {
	switch (value) {
		case "copy": {
			if (!modelValue.value) return;
			await copyToClipboard(Inison.stringify(modelValue.value));
			window.$message.success(t("copiedSuccessfully"));
			break;
		}
		case "paste": {
			try {
				const itemFromClipboard = await navigator.clipboard.readText();

				if (!itemFromClipboard) {
					window.$message.error(t("clipboardEmpty"));
					return;
				}
				if (!isStringified(itemFromClipboard)) {
					window.$message.error(t("clipboardItemIsNotCorrect"));
					return;
				}

				const unstringifiedItem = Inison.unstringify<Item[]>(itemFromClipboard);
				if (
					!unstringifiedItem &&
					!Array.isArray(unstringifiedItem) &&
					!isObject(unstringifiedItem)
				) {
					window.$message.error(t("clipboardItemIsNotCorrect"));
					return;
				}

				modelValue.value = unstringifiedItem;
			} catch {
				window.$message.error(t("clipboardItemIsNotCorrect"));
			}
		}
	}
}
const dropdownOptions = computed<DropdownOption[]>(() => [
	{
		label: t("copyItem"),
		key: "copy",
		show: !!modelValue.value,
		icon: () => h(NIcon, () => h(IconCopy)),
	},
	{
		label: t("pasteItem"),
		key: "paste",
		icon: () => h(NIcon, () => h(IconClipboard)),
	},
]);
</script>