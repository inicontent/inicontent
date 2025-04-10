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
		:default-expanded-names="field.expand ? field.id : undefined" v-model:expanded-names="parentExpanded" accordion>
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
				<NFlex>
					<component v-if="field.extraActions" :is="field.extraActions"></component>
					<NButtonGroup>
						<NButton size="small" round @click="handleAddNewItem">
							<template #icon>
								<NIcon>
									<IconPlus />
								</NIcon>
							</template>
						</NButton>
						<component v-if="field.extraButtons" :is="field.extraButtons"></component>
					</NButtonGroup>
				</NFlex>
			</template>
			<NCollapse display-directive="show" accordion v-model:expanded-names="expandedNames"
				:trigger-areas="['main', 'arrow']">
				<NCollapseItem v-if="modelValue" v-for="(_item, index) of modelValue" display-directive="show"
					:title="getCollapseItemTitle(field, (_item as Item), index)" :name="`${field.id}.${index}`">
					<template #header-extra>
						<NFlex>
							<component v-if="field.itemExtraActions" :is="field.itemExtraActions(index)"></component>
							<NButtonGroup>
								<NButton size="small" round type="error" quaternary
									:disabled="typeof field.inputProps === 'function' ? field.inputProps(index)?.disabled : field.inputProps?.disabled"
									@click="handleDeleteItem(index)">
									<template #icon>
										<NIcon>
											<IconTrash />
										</NIcon>
									</template>
								</NButton>
								<component v-if="field.itemExtraButtons" :is="field.itemExtraButtons(index)">
								</component>
							</NButtonGroup>
						</NFlex>
					</template>
					<div class="collapseContentPadding">
						<LazyFieldS v-model="(modelValue[index] as Item)" :schema="(field.children as Schema).map((child) => ({
							...child,
							...(typeof child.inputProps === 'function' ? { inputProps: child.inputProps(index) } : {}),
							...(typeof child.labelProps === 'function' ? { labelProps: child.labelProps(index) } : {}),
							...(typeof child.render === 'function' ? { render: child.render(index) } : {})
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
			<NFlex>
				<component v-if="field.extraActions" :is="field.extraActions"></component>
				<NButtonGroup>
					<NButton size="small" round @click="handleAddNewItem">
						<template #icon>
							<NIcon>
								<IconPlus />
							</NIcon>
						</template>
					</NButton>
					<component v-if="field.extraButtons" :is="field.extraButtons"></component>
				</NButtonGroup>
			</NFlex>
		</template>
		<NDataTable v-if="field.children" :columns :data="(modelValue as Item[])" :scroll-x="tableWidth" />
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
	NButtonGroup,
	NFlex,
	NPerformantEllipsis,
} from "naive-ui";
import { isArrayOfObjects, isStringified } from "inibase/utils";
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
const parentExpanded = ref();

const expandedNames = ref();
watch(expandedNames, (v) => {
	if (v) parentExpanded.value = field.id;
});
function handleAddNewItem() {
	let newElementIndex: number;
	if (!modelValue.value) {
		newElementIndex = 0;
		modelValue.value = [
			field.onCreate
				? field.onCreate instanceof Function
					? field.onCreate(newElementIndex) || {}
					: field.onCreate
				: {},
		];
	} else {
		newElementIndex = toRaw(modelValue.value).length;
		modelValue.value.push(
			field.onCreate
				? field.onCreate instanceof Function
					? field.onCreate(newElementIndex) || {}
					: field.onCreate
				: {},
		);
	}
	expandedNames.value = `${field.id}.${newElementIndex}`;
}

function handleDeleteItem(index: number) {
	if (field.onDelete) field.onDelete(index);
	modelValue.value?.splice(index, 1);
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

const columns = ref<DataTableColumns>();
const tableWidth = ref<number>(0);

function setColumns() {
	columns.value = [
		...(field.children as Schema).map((child) => ({
			width: t(child.key).length > 10 ? t(child.key).length * 14 : 150,
			title: () =>
				h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
					getField(child).icon(),
					h(NPerformantEllipsis, () => t(child.key)),
					child.required
						? h(
								NText,
								{
									type: "error",
								},
								() => " *",
							)
						: undefined,
				]),
			key: child.id,
			render: (_item: any, index: number) =>
				h(LazyField, {
					field: {
						...child,
						labelProps: {
							style: {
								marginTop: "24px",
							},
							showLabel: false,
						},
						isTable: true,
						...(typeof child.inputProps === "function"
							? { inputProps: child.inputProps(index) }
							: {}),
						...(typeof child.labelProps === "function"
							? { labelProps: child.labelProps(index) }
							: {}),
						...(typeof child.render === "function"
							? { render: child.render(index) }
							: {}),
					},
					"onUpdate:modelValue": (newValue) => {
						(modelValue.value as Item[])[index][child.key] = newValue;
					},
					modelValue: (modelValue.value as Item[])[index][child.key],
				}),
		})),
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
											disabled:
												typeof field.inputProps === "function"
													? field.inputProps(index)?.disabled
													: field.inputProps?.disabled,
											strong: true,
											secondary: true,
											circle: true,
											type: "error",
											onClick: () => handleDeleteItem(index),
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
	] as DataTableColumns;

	tableWidth.value = columns.value.reduce(
		(accumulator: number, { width }) =>
			accumulator + ((width as number | undefined) ?? 0),
		40,
	);
}

watch(Language, setColumns);
onMounted(() => {
	if (isArrayOfObjects(field.children)) setColumns();
});
</script>