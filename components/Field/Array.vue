<template>
	<LazyField v-if="field.subType" :field="{
		...field,
		isArray: true,
	}" v-model="modelValue" />
	<LazyField v-else-if="!isArrayOfObjects(field.children)" :field="{
		...field,
		subType: field.children === 'table' ? 'array-table' : 'tags',
		isArray: true,
	}" v-model="modelValue" />
	<NCollapse v-else-if="field.isTable === false || field.children.filter(
		(f: any) => f.type === 'array' && isArrayOfObjects(f.children),
	).length" display-directive="show" arrow-placement="right" :trigger-areas="['main', 'arrow']"
		:expanded-names="field.expand || expandedNames ? field.id : undefined" accordion>
		<template #arrow>
			<NIcon>
				<IconChevronRight v-if="modelValue && modelValue.length > 0" />
			</NIcon>
		</template>
		<NCollapseItem style="margin: 0 0 20px;" display-directive="show" :name="field.id"
			:disabled="!modelValue?.length">
			<template #header>
				<NDropdown size="small" :placement="Language === 'ar' ? 'left' : 'right'" show-arrow trigger="hover"
					:delay="500" :options="dropdownOptions" @select="handleSelect">
					{{ t(field.key) }}
				</NDropdown>
			</template>
			<template #header-extra>
				<NButton size="small" round @click="handleAddNewItem">
					<template #icon>
						<NIcon>
							<IconPlus />
						</NIcon>
					</template>
				</NButton>
			</template>
			<NCollapse display-directive="show" accordion v-model:expanded-names="expandedNames"
				:trigger-areas="['main', 'arrow']">
				<NCollapseItem v-if="modelValue" v-for="(_item, index) of modelValue" display-directive="show"
					:title="field.children[0].type === 'string' ? (_item as Item)[field.children[0].key] || `${t(field.key)} ${index + 1}` : `${t(field.key)} ${index + 1}`"
					:name="`${field.id}.${index}`">
					<template #header-extra>
						<NButton size="small" round type="error" quaternary :disabled="field.disabledItems?.includes(
							index,
						)" @click="modelValue.splice(index, 1)">
							<template #icon>
								<NIcon>
									<IconTrash />
								</NIcon>
							</template>
						</NButton>
					</template>
					<div class="collapseContentPadding">
						<LazyFieldS v-model="(modelValue[index] as Item)" :schema="(field.children as Schema).map((child) => ({
							...child,
							...(field.disabledItems
								? {
									inputProps: {
										disabled:
											field.disabledItems?.includes(
												index,
											),
									},
								}
								: {}),
						}))" />
					</div>
				</NCollapseItem>
			</NCollapse>
		</NCollapseItem>
	</NCollapse>
	<NCard v-else :bordered="false" content-style="padding-left: 0; padding-right: 0;"
		header-style="padding-top: 0; padding-left: 0; padding-right: 0;">
		<template #header>
			<NDropdown size="small" :placement="Language === 'ar' ? 'left' : 'right'" show-arrow trigger="hover"
				:delay="500" :options="dropdownOptions" @select="handleSelect">
				{{ t(field.key) }}
			</NDropdown>
		</template>
		<template #header-extra v-if="!field.disableActions">
			<NButton size="small" round @click="handleAddNewItem">
				<template #icon>
					<NIcon>
						<IconPlus />
					</NIcon>
				</template>
			</NButton>
		</template>
		<NDataTable v-if="field.children" :columns="tableColumns" :data="(modelValue as Item[])"
			:scroll-x="tableWidth" />
	</NCard>
</template>

<script setup lang="ts">
import {
	NIcon,
	NCollapse,
	NCollapseItem,
	NButton,
	NCard,
	NDataTable,
	NText,
	NTooltip,
	NDropdown,
	type DataTableColumns,
	type DropdownOption,
} from "naive-ui";
import { isArrayOfObjects, isObject, isStringified } from "inibase/utils";
import {
	IconChevronRight,
	IconClipboard,
	IconCopy,
	IconPlus,
	IconTrash,
} from "@tabler/icons-vue";
import { LazyField } from "#components";
import Inison from "inison";

const Language = useCookie<LanguagesType>("language", { sameSite: true });

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<(string | number | Item)[]>();

const expandedNames = ref();

function handleAddNewItem() {
	let newElementIndex: number;
	if (!modelValue.value) {
		newElementIndex = 0;
		modelValue.value = [
			field.onCreate
				? field.onCreate instanceof Function
					? field.onCreate(newElementIndex)
					: field.onCreate
				: {},
		];
	} else {
		newElementIndex = toRaw(modelValue.value).length;
		modelValue.value.push(
			field.onCreate
				? field.onCreate instanceof Function
					? field.onCreate(newElementIndex)
					: field.onCreate
				: {},
		);
	}
	expandedNames.value = `${field.id}.${newElementIndex}`;
}

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
const dropdownOptions = computed<DropdownOption[]>(() => [
	{
		label: t("copyItem"),
		key: "copy",
		show:
			!!modelValue.value &&
			Array.isArray(modelValue.value) &&
			modelValue.value.length > 0,
		icon: () => h(NIcon, () => h(IconCopy)),
	},
	{
		label: t("pasteItem"),
		key: "paste",
		icon: () => h(NIcon, () => h(IconClipboard)),
	},
]);

const tableWidth = (field.children as Schema).reduce(
	(accumulator: number, child: any) => {
		return (
			accumulator +
			(t(child.key) && child.key.length > 10 ? child.key.length * 15 : 200)
		);
	},
	100,
);

const tableColumns: DataTableColumns = [
	...((field.children as Schema).map((child) => ({
		width: t(child.key) && child.key.length > 10 ? child.key.length * 15 : 200,
		title: () => [
			t(child.key),
			child.required
				? h(
						NText,
						{
							type: "error",
						},
						() => " *",
					)
				: null,
		],
		key: child.id,
		render: (_item: any, index: number) =>
			h(LazyField, {
				field: {
					...child,
					...(field.disabledItems?.includes(index)
						? {
								inputProps: {
									disabled: true,
								},
							}
						: {}),
					labelProps: {
						style: {
							marginTop: "24px",
						},
						showLabel: false,
					},
					isTable: true,
				},
				"onUpdate:modelValue": (newValue) => {
					(modelValue.value as Item[])[index][child.key] = newValue;
				},
				modelValue: (modelValue.value as Item[])[index][child.key],
			}),
	})) as any),
	field.disableActions === true
		? {}
		: {
				title: t("actions"),
				fixed: "right",
				align: "center",
				width: 100,
				key: "actions",
				render(_row: any, index: number) {
					return h(
						NTooltip,
						{ delay: 500 },
						{
							trigger: () =>
								h(
									NButton,
									{
										disabled: field.disabledItems?.includes(index),
										strong: true,
										secondary: true,
										circle: true,
										type: "error",
										onClick: () => modelValue.value?.splice(index, 1),
									},
									{
										icon: () => h(NIcon, () => h(IconTrash)),
									},
								),
							default: () => t("delete"),
						},
					);
				},
			},
];
</script>