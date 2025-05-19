<template>
    <FieldWrapper :field :rule v-model="modelValue">
        <NPopover trigger="manual" v-model:show="showPopover" :onClickoutside>
            <template #trigger>
                <NInput :inputProps="{ class: 'IconPickerInput' }" @focus="showPopover = true"
                    v-model:value="searchQuery" :default-value="modelValue" :placeholder="t(field.key)" clearable
                    v-bind="field.inputProps
                        ? typeof field.inputProps === 'function'
                            ? field.inputProps(modelValue) ?? {}
                            : field.inputProps
                        : {}">
                    <template #prefix>
                        <Icon :name="`tabler:${modelValue ?? 'question-mark'}`" />
                    </template>

                    <template #suffix>
                        <NIcon>
                            <Icon name="tabler:icons" />
                        </NIcon>
                    </template>
                </NInput>
            </template>
            <NVirtualList v-if="formatedIconsList.length" style="max-height: 250px" :item-size="42" :distance="0"
                :items="formatedIconsList" ignore-item-resize>
                <template #default="{ item }: { item: { key: string; value: string } }">
                    <NButton :key="item.key" strong :secondary="modelValue === item.value"
                        :quaternary="modelValue !== item.value" round
                        :type="modelValue === item.value ? 'primary' : 'default'" @click="modelValue = item.value"
                        class="IconPickerItem">
                        <template #icon>
                            <Icon :name="`tabler:${item.value}`" />
                        </template>
                        <span> {{ item.value }}</span>
                    </NButton>
                </template>
            </NVirtualList>
            <NEmpty v-else />
        </NPopover>
    </FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()
const searchQuery = ref<string>()
const modelValue = defineModel<string>()

const rule: FormItemRule = {
	required: field.required,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}
function IconsListSingle(icon: string) {
	return {
		key: icon.replace("tabler:", ""),
		value: icon.replace("tabler:", ""),
	}
}
const formatedIconsList = ref<
	{
		key: string
		value: string
	}[]
>([])

watch(
	searchQuery,
	(newValue) => {
		if (newValue !== modelValue.value) getIconsList(newValue)
	},
	{ immediate: true },
)

async function getIconsList(search?: string) {
	if (!search) {
		formatedIconsList.value = []
		return // Return an empty list if no search query is provided
	}

	try {
		const response = await $fetch<{ icons: string[] }>(
			`https://api.iconify.design/search?prefix=tabler&query=${search}`,
		)
		const icons = response.icons || []
		formatedIconsList.value = icons.map(IconsListSingle)
	} catch (error) {
		console.error("Error fetching icons:", error)
		formatedIconsList.value = []
	}
}
const showPopover = ref(false)
watch(modelValue, (newValue) => {
	if (newValue) {
		searchQuery.value = newValue
	}
})
function onClickoutside(event: MouseEvent) {
	if (!(event.target as HTMLElement).classList.contains("IconPickerInput"))
		showPopover.value = false
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