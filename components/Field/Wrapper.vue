<template>
	<NFormItem :label="t(field.key)" :rule :path="field.id" :style="{ flex: fieldFlex }" v-bind="field.labelProps">
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
								<Icon name="tabler:question-mark" />
							</template>
						</NButton>
					</template>
					{{ t(field.description) }}
				</NTooltip>
			</NFlex>
			<template v-else>
				<NDropdown
					:disabled="([] as string[]).concat(field.type).every(type => !['table', 'array', 'date'].includes(type))"
					show-arrow placement="top" trigger="hover" :delay="1500" :options="dropdownOptions" size="small"
					@select="handleSelect">
					{{ t(field.key) }}
				</NDropdown>
			</template>
			<slot name="label"></slot>
		</template>
	</NFormItem>
</template>

<script lang="ts" setup>
import { isObject, isStringified } from "inibase/utils"
import Inison from "inison"
import type { DropdownOption, FormItemRule } from "naive-ui"
import { Icon, NIcon } from "#components"

const { field, rule } = defineProps<{ field: Field; rule: FormItemRule }>()

const modelValue = defineModel<any>()

const { isMobile } = useDevice()
function numberToPercentage(width: number, wrapperWidth?: string | number) {
	if (wrapperWidth && typeof wrapperWidth !== "string") {
		if (wrapperWidth < 350) return "100"
		if (wrapperWidth < 500) return "50"
		if (wrapperWidth < 650 && width !== 2) return "33.33"
	}
	switch (width) {
		case 2:
			return "50"
		case 3:
			return "33.33"
		case 4:
			return "25"
		case 5:
			return "20"
	}
}
const Drawers = useState<DrawerRef>("drawers", () => [])
const fieldFlex = computed(() =>
	field.width && field.width !== 1 && !isMobile
		? `1 1 calc(${numberToPercentage(field.width, Drawers.value.find(({ show }) => !!show)?.width)}% - 12px)`
		: "1 1 100%",
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
				if (
					!unstringifiedItem &&
					!Array.isArray(unstringifiedItem) &&
					!isObject(unstringifiedItem)
				) {
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