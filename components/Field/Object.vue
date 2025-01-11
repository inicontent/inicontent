<template>
    <NCollapse :default-expanded-names="field.expand ? field.id : undefined" display-directive="show"
        style="margin: 0 0 20px;" arrow-placement="right" :trigger-areas="['main', 'arrow']" accordion>
        <NCollapseItem display-directive="show" :path="field.id" :name="field.id">
            <template #header>
                <NDropdown trigger="hover" :delay="500" :options="dropdownOptions" @select="handleSelect">
                    {{ t(field.key) }}
                </NDropdown>
            </template>
            <div class="collapseContentPadding">
                <FieldS :schema="(field.children as Schema)" v-model="modelValue" />
            </div>
        </NCollapseItem>
    </NCollapse>
</template>

<script setup lang="ts">
import { IconClipboard, IconCopy } from "@tabler/icons-vue";
import { isStringified } from "inibase/utils";
import Inison from "inison";
import {
	NCollapse,
	NCollapseItem,
	NDropdown,
	NIcon,
	type DropdownOption,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<Record<string | number, any>>({
	default: () => reactive({}),
});

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
				if (!unstringifiedItem && !Array.isArray(unstringifiedItem)) {
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
const dropdownOptions: DropdownOption[] = [
	{
		label: t("copyItem"),
		key: "copy",
		icon: () => h(NIcon, () => h(IconCopy)),
	},
	{
		label: t("pasteItem"),
		key: "paste",
		icon: () => h(NIcon, () => h(IconClipboard)),
	},
];
</script>