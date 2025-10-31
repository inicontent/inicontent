<template>
	<UAccordion :default-expanded-names="field.expand ? field.id : undefined" display-directive="show"
		arrow-placement="right" :trigger-areas="['main', 'arrow']" accordion>
		<UAccordionItem style="margin: 0 0 20px;" display-directive="show" :path="String(field.id)" :name="field.id">
			<template #header>
				<UDropdown size="small" :placement="Language === 'ar' ? 'left' : 'right'" show-arrow trigger="hover"
					:delay="1500" :options="dropdownOptions" @select="handleSelect">
					{{ t(field.key) }}
				</UDropdown>
			</template>
			<div class="collapseContentPadding">
				<div class="flex">
					<LazyField v-for="childField of (field.children as Schema)" :field="childField"
						v-model="localModelValue[childField.key]" />
				</div>
			</div>
		</UAccordionItem>
	</UAccordion>
</template>

<script setup lang="ts">
import { isObject, isStringified } from "inibase/utils"
import Inison from "inison"
import type { DropdownOption } from "naive-ui"
import { Icon, NIcon } from "#components"

const Language = useCookie<LanguagesType>("language", { sameSite: true })

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<Record<string | number, any>>()

const localModelValue = ref<Record<string | number, any>>(
	toRaw(modelValue.value ?? {}),
)
watch(
	localModelValue,
	(v) => {
		modelValue.value = v
	},
	{ deep: true },
)

async function handleSelect(value: string) {
	switch (value) {
		case "copy": {
			if (!modelValue.value) return
			await copyToClipboard(Inison.stringify(modelValue.value))
			window.$message.success(t("copiedSuccessfully"))
			break
		}
		case "paste": {
			try {
				const itemFromClipboard = await navigator.clipboard.readText()

				if (!itemFromClipboard) {
					window.$message.error(t("clipboardEmpty"))
					return
				}
				if (!isStringified(itemFromClipboard)) {
					window.$message.error(t("clipboardItemIsNotCorrect"))
					return
				}

				const unstringifiedItem = Inison.unstringify<Item[]>(itemFromClipboard)
				if (!unstringifiedItem && !isObject(unstringifiedItem)) {
					window.$message.error(t("clipboardItemIsNotCorrect"))
					return
				}

				modelValue.value = unstringifiedItem
			} catch {
				window.$message.error(t("clipboardItemIsNotCorrect"))
			}
		}
	}
}
const dropdownOptions = computed<DropdownOption[]>(() => [
	{
		label: t("copyItem"),
		key: "copy",
		show: !!modelValue.value,
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:copy" })),
	},
	{
		label: t("pasteItem"),
		key: "paste",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:clipboard" })),
	},
])
</script>