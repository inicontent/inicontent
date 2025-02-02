<template>
	<NCollapse :default-expanded-names="field.expand ? field.id : undefined" display-directive="show"
		arrow-placement="right" :trigger-areas="['main', 'arrow']" accordion>
		<NCollapseItem style="margin: 0 0 20px;" display-directive="show" :path="field.id" :name="field.id">
			<template #header>
				<NDropdown size="small" :placement="Language === 'ar' ? 'left' : 'right'" show-arrow trigger="hover"
					:delay="500" :options="dropdownOptions" @select="handleSelect">
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
import { isObject, isStringified } from "inibase/utils";
import Inison from "inison";
import {
	NCollapse,
	NCollapseItem,
	NDropdown,
	NIcon,
	type DropdownOption,
} from "naive-ui";

const Language = useCookie<LanguagesType>("language", { sameSite: true });

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<Record<string | number, any>>();

const localVModelValue = ref<Record<string | number, any>>(
	toRaw(modelValue.value ?? {}),
);
watch(
	localVModelValue,
	(v) => {
		modelValue.value = v;
	},
	{ deep: true },
);

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
				if (!unstringifiedItem && !isObject(unstringifiedItem)) {
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