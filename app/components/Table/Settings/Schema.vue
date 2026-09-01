<template>
	<NCollapse style="margin-top: 15px;" :class="{ 'reorder-enabled': reorderEnabled }" accordion
		:trigger-areas="['main', 'arrow']" v-model:expanded-names="expandedNames">
		<VueDraggable v-model="schema" item-key="id" ghost-class="ghost" handle=".n-collapse-item__header"
			:disabled="!reorderEnabled" :move="onMoveCallback">
			<template v-for="(element, index) in schema">
				<NCollapseItem :name="element.id" :id="`element-${element.id}`" class="element"
					:class="{ 'field-selected': selectedFieldIds.has(element.id as string | number) }"
					:disabled="isDisabled(element.key)"
					:title="getDisplayKey(element) ? (isDisabled(element.key) ? t(element.key as string) : getDisplayKey(element)) : '--'"
					@click.capture="(e) => onFieldClick(e, element)">
					<template #header-extra>
						<NFlex>
							<NButtonGroup>
								<NDropdown
									v-if="['array', 'object'].includes(element.type as string) && isArrayOfObjects(element.children)"
									:options="fieldTypeOptions" style="max-height: 200px;" scrollable
									@select="(type) => pushToChildrenSchema(type, index)">
									<NButton :disabled="!element.key" secondary round size="small"
										@click="pushToChildrenSchema('string', index)">
										<template #icon>
											<NIcon>
												<Icon name="tabler:plus" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NDropdown :disabled="isDisabled(element.key)" :options="fieldTypeOptions"
									style="max-height: 200px" trigger="click" scrollable
									@select="(type) => schema[index] = changeFieldType(element, type)">
									<NButton round strong secondary size="small" type="primary"
										:disabled="isDisabled(element.key)">
										<template #icon>
											<component :is="getFieldCached(element).icon" />
										</template>
										<template v-if="!$device.isMobile" #default>
											{{ getFieldCached(element).label }}
										</template>
									</NButton>
								</NDropdown>
							</NButtonGroup>

							<NButtonGroup v-if="!isDisabled(element.key) && !$device.isMobile">
								<NTooltip :delay="1500">
									<template #trigger>
										<NButton round secondary size="small"
											:type="element.required ? 'error' : 'tertiary'"
											@click="element.required = !element.required">
											<template #icon>
												<NIcon>
													<Icon name="tabler:asterisk" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('required') }}
								</NTooltip>
								<NTooltip :delay="1500">
									<template #trigger>
										<NPopselect v-model:value="element.width" :options="widthOptions" size="small">
											<NButton round strong secondary size="small" type="info">
												<template #icon>
													<NIcon>
														<Icon name="tabler:arrow-autofit-width" />
													</NIcon>
												</template>
												1/{{ element.width ?? 1 }}
											</NButton>
										</NPopselect>
									</template>
									{{ t('width') }}
								</NTooltip>
								<NButton round secondary size="small" type="error" @click="schema.splice(index, 1)">
									<template #icon>
										<NIcon>
											<Icon name="tabler:trash" />
										</NIcon>
									</template>
								</NButton>
							</NButtonGroup>
							<NDropdown v-else-if="!isDisabled(element.key)" trigger="click"
								:options="fieldActionOptions(element)"
								@select="(action) => onFieldAction(action as string, element, index)">
								<NButton round secondary size="small">
									<template #icon>
										<NIcon>
											<Icon name="tabler:dots-vertical" />
										</NIcon>
									</template>
								</NButton>
							</NDropdown>
						</NFlex>
					</template>

					<NFormItem :label="t('fieldName')" style="margin-bottom:20px">
						<template #feedback>
							{{ `#${getPath(table.schema ?? [], element.id, true) ?? '--'}` }} ({{ element.id }})
						</template>
						<NInput :value="getDisplayKey(element)" @update:value="(v) => onKeyInput(element, v)" />
					</NFormItem>

					<NFormItem
						v-if="element.table === 'assets' || !element.children || !isArrayOfObjects(element.children)"
						:label="t('fieldDescription')">
						<NInput v-model:value="element.description" />
					</NFormItem>

					<template v-if="element.table === 'assets'">
						<NFormItem :label="t('allowedFiles')">
							<NSelect multiple :render-label="selectRenderLabelWithIcon" :options="fileTypeSelectOptions"
								v-model:value="element.accept" />
						</NFormItem>
						<NFormItem :label="t('urlSuffix')">
							<NInput v-model:value="element.suffix" />
							<template #feedback>
								{{ t('ie') }}: <strong>/@2/customFolder</strong>
							</template>
						</NFormItem>
						<NFormItem :label="t('optimizeAssets')" label-placement="left">
							<NSwitch v-model:value="element.optimize" :default-value="true" style="margin-top: 4px;" />
							<template #label>
								{{ t('optimizeAssets') }}
								<NTooltip>
									<template #trigger>
										<NIcon style="margin-left: 5px; vertical-align: middle;">
											<Icon name="tabler:info-circle" />
										</NIcon>
									</template>
									{{ t('optimizeAssetsDescription') }}
								</NTooltip>
							</template>
						</NFormItem>
					</template>
					<template v-else-if="element.subType && ['select', 'radio', 'checkbox'].includes(element.subType)">
						<NFormItem :label="t('options')" class="formItemFlex">
							<template v-if="isArrayOfArrays(element.options)">
								<NDataTable :columns="labelsColoringColumns(element)" :data="element.options" />
								<NButton type="primary" secondary style="width:100%"
									@click="(element.options as [string, string][]).push(['', ''])">
									<template #icon>
										<NIcon>
											<Icon name="tabler:plus" />
										</NIcon>
									</template>
									{{ t('add') }}
								</NButton>
							</template>
							<NSelect v-else
								:value="element.options ? (element.options.every(option => typeof option !== 'object') ? element.options : element.options.map(({ value }: any) => value)) : []"
								@update:value="(value: string[]) => handleOptionsUpdate(element, value)" filterable
								multiple tag :show-arrow="false" :show="false" />
						</NFormItem>
						<NFormItem :label="t('labelsColoring')" label-placement="left">
							<NSwitch :value="isArrayOfArrays(element.options)"
								@update:value="(value) => toggleLabelsColoring(element, value)" />
						</NFormItem>
						<NFormItem v-if="element.subType === 'select'" :label="t('allowCustomValues')"
							label-placement="left">
							<NSwitch v-model:value="element.custom" />
						</NFormItem>
					</template>
					<template v-else-if="!Array.isArray(element.type) && element.type === 'object'">
						<NFormItem :label="t('expandByDefault')" label-placement="left">
							<NSwitch v-model:value="element.expand" />
						</NFormItem>
					</template>
					<template v-else-if="Array.isArray(element.type) && !element.subType">
						<NFormItem :label="t('valuesType')">
							<NSelect v-model:value="element.type" filterable multiple :min="1"
								:render-label="selectRenderLabelWithIcon" :options="valuesTypeSelectOptions" />
						</NFormItem>
					</template>
					<template v-else-if="element.subType === 'tags'">
						<NFormItem :label="t('valuesType')">
							<NSelect v-model:value="(element.children as any)" filterable multiple
								:render-label="selectRenderLabelWithIcon" :options="valuesTypeSelectOptions" />
						</NFormItem>
					</template>
					<template
						v-else-if="!Array.isArray(element.type) && ((element.type === 'array' && element.children === 'table') || element.type === 'table')">
						<NFormItem :label="t('tableName')">
							<NSelect filterable v-model:value="element.table" :options="tableSelectOptions" />
						</NFormItem>
						<NFormItem :label="t('extendWhere')">
							<NInput v-model:value="(element.where as string)" />
							<template #feedback>
								{{ t('useInison') }} / {{ t('ie') }}:
								{<strong>subCategory</strong>:<strong>null</strong>}
							</template>
						</NFormItem>
					</template>

					<template v-if="!Array.isArray(element.type) && element.type === 'array'">
						<NGrid :x-gap="12" :y-gap="12" cols="1 500:2">
							<NGridItem>
								<NFormItem :label="t('minimumItems')">
									<NInputNumber :value="element.min"
										@update:value="(value) => { if (value) element.min = value; else delete element.min }" />
								</NFormItem>
							</NGridItem>
							<NGridItem>
								<NFormItem :label="t('maximumItems')">
									<NInputNumber :value="element.max"
										@update:value="(value) => { if (value) element.max = value; else delete element.max }" />
								</NFormItem>
							</NGridItem>
						</NGrid>
					</template>

					<NFormItem :label="t('unique')" label-placement="left"
						v-if="!['array', 'object', 'tags'].includes((element.subType ?? element.type) as string)">
						<NSwitch :value="element.unique ? true : false"
							@update:value="(value) => element.unique = value" :checked-value="true"
							:unchecked-value="false" />
					</NFormItem>
					<NFormItem v-if="element.unique" :label="t('uniqueGroup')">
						<NSelect :value="typeof element.unique === 'boolean' ? undefined : element.unique"
							@update:value="(value) => element.unique = value" :options="uniqueGroupOptions" tag
							filterable clearable />
					</NFormItem>

					<NFormItem v-if="!element.table && (!element.children || !isArrayOfObjects(element.children))"
						:label="t('regex')">
						<NInput v-model:value="element.regex" />
					</NFormItem>

					<LazyTableSettingsSchema
						v-if="!Array.isArray(element.type) && ['array', 'object'].includes(element.type) && isArrayOfObjects(element.children)"
						v-model="element.children" v-model:expanded-names="expandedChildNames"
						:reorder-enabled="reorderEnabled" />
				</NCollapseItem>
			</template>
		</VueDraggable>
	</NCollapse>
</template>

<script lang="ts" setup>
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils";
import type { DataTableColumns, SelectOption } from "naive-ui";
import { VueDraggable } from "vue-draggable-plus";
import { Icon, NButton, NColorPicker, NFlex, NIcon, NInput } from "#components";

const widthOptions = [
	{
		label: "1/1",
		value: 1,
	},
	{
		label: "1/2",
		value: 2,
	},
	{
		label: "1/3",
		value: 3,
	},
	{
		label: "1/4",
		value: 4,
	},
	{
		label: "1/5",
		value: 5,
	},
	{
		label: "1/6",
		value: 6,
	},
];

// Mobile: collapse the required/width/delete button group into a single dropdown
function fieldActionOptions(element: Field) {
	return [
		{
			label: element.required ? `${t("required")} ✓` : t("required"),
			key: "required",
		},
		{
			label: t("width"),
			key: "width",
			children: widthOptions.map((option) => ({
				label: option.value === (element.width ?? 1) ? `${option.label} ✓` : option.label,
				key: `width-${option.value}`,
			})),
		},
		{
			label: t("delete"),
			key: "delete",
		},
	];
}

function onFieldAction(action: string, element: Field, index: number) {
	if (action === "required") element.required = !element.required;
	else if (action === "delete") schema.value.splice(index, 1);
	else if (action.startsWith("width-"))
		element.width = Number(action.slice("width-".length));
}

// ── Copy / cut / paste fields ─────────────────────────────────────────────────

const interactiveSelector = [
	"button",
	"input",
	"textarea",
	"select",
	"a[href]",
	'[contenteditable="true"]',
	"[role='button']",
	".n-input",
	".n-select",
	".n-input-number",
	".n-cascader",
	".n-switch",
	".n-checkbox",
	".n-radio",
	".n-color-picker",
	".n-data-table",
	".n-popover",
	".n-dropdown",
].join(",");

function shouldIgnoreFieldTarget(target: HTMLElement | null) {
	if (!target) return true;
	return Boolean(target.closest(interactiveSelector));
}

// Fields currently selected via ctrl/meta click
const selectedFieldIds = ref<Set<string | number>>(new Set());

function onFieldClick(e: MouseEvent, element: Field) {
	if (e.ctrlKey || e.metaKey) {
		if (shouldIgnoreFieldTarget(e.target as HTMLElement)) return;
		e.preventDefault();
		e.stopPropagation();
		toggleFieldSelection(element.id as string | number);
		return;
	}
	if (selectedFieldIds.value.size) selectedFieldIds.value = new Set();
}

function toggleFieldSelection(id: string | number) {
	const next = new Set(selectedFieldIds.value);
	if (next.has(id)) next.delete(id);
	else next.add(id);
	selectedFieldIds.value = next;
}

const selectedFields = computed<Field[]>(() =>
	schema.value.filter(({ id }) => selectedFieldIds.value.has(id as string | number)),
);

// Add a global keydown handler so that ctrl/cmd+c and ctrl/cmd+x copy/cut the
// currently selected fields. We bail out when focus is inside an editable or
// interactive control so the browser's native copy/cut keeps working there.
function onSchemaKeydown(e: KeyboardEvent) {
	if (
		!(e.ctrlKey || e.metaKey) ||
		!["c", "C", "x", "X"].includes(e.key) ||
		!selectedFieldIds.value.size
	)
		return;

	const target = e.target as HTMLElement | null;
	if (target?.closest(interactiveSelector)) return;

	e.preventDefault();
	void copySelectedFields(e.key.toLowerCase() === "x");
}

onMounted(() => document.addEventListener("keydown", onSchemaKeydown));
onBeforeUnmount(() =>
	document.removeEventListener("keydown", onSchemaKeydown),
);

async function copySelectedFields(cut = false) {
	const fields = selectedFields.value;
	const copyable = fields.filter((element) => !isDisabled(element.key));
	if (!copyable.length) {
		window.$message.warning(t("noFieldsToCopy"));
		if (cut) selectedFieldIds.value = new Set();
		return;
	}
	await copySchemaFields(copyable);
	if (cut) {
		schema.value = schema.value.filter(
			({ id }) => !selectedFieldIds.value.has(id as string | number),
		);
		window.$message.success(t("cutSuccessfully"));
	} else {
		window.$message.success(t("copiedSuccessfully"));
	}
	// Clear the selection outline after copy/cut
	selectedFieldIds.value = new Set();
}

function onMoveCallback(evt: {
	draggedContext: { index: number; futureIndex: number };
}) {
	const disabledIndexes = schema.value
		.map(({ id }, index) => ([0, -1, -2].includes(id as number) ? index : -3))
		.filter((index) => index !== -3);
	return (
		!disabledIndexes.includes(evt.draggedContext.index) &&
		!disabledIndexes.includes(evt.draggedContext.futureIndex)
	);
}

function isDisabled(key?: string) {
	if (!key) return false;
	return disabledKeysSet.value.has(key);
}

// Cache for disabled keys based on current table slug
const disabledKeysSet = computed<Set<string>>(() => {
	const base: string[] = ["id", "createdAt", "updatedAt"];
	switch (table.value.slug) {
		case "users":
			base.push("username", "email", "password", "role", "createdBy", "config");
			break;
		case "pages":
			base.push("slug", "content", "seo");
			break;
		case "blocks":
			base.push("name", "config", "hideOn");
			break;
		default:
			break;
	}
	return new Set(base);
});
const expandedNames = defineModel<(string | number)[]>("expandedNames");
const expandedChildNames = ref<(string | number)[]>();
const { reorderEnabled = false } = defineProps<{ reorderEnabled?: boolean }>();
async function pushToChildrenSchema(type: string, index: number) {
	if (!schema.value[index]) return;
	if (!schema.value[index].children)
		schema.value[index].children = [] as Schema;
	(schema.value[index].children as Schema).push({
		id: `temp-${randomID()}`,
		key: null,
		required: false,
		...handleSelectedSchemaType(type),
	} as any);

	if (!schema.value[index].id) return;

	expandedNames.value = [schema.value[index].id];
	const newElementId = (
		(schema.value[index].children as Schema).at(-1) as Field
	).id;

	if (!newElementId) return;

	expandedChildNames.value = [newElementId];

	setTimeout(
		() => document.getElementById(`element-${newElementId}`)?.scrollIntoView(),
		300,
	);
}
const schema = defineModel<Schema>({
	default: () => reactive([]),
});
const database = useState<Database>("database");
const table = useState<Table>("table");

function changeFieldType(
	{ id, key, required, children, width }: any,
	newType: string,
): any {
	switch (newType) {
		case "object":
		case "array":
			return {
				id,
				key,
				type: newType,
				required,
				children: Array.isArray(children) ? children : [],
			};
		default:
			return {
				id,
				key,
				...(handleSelectedSchemaType(newType) as any),
				width,
				required,
			};
	}
}

function renderIcon(iconName: string) {
	return () => h(NIcon, () => h(Icon, { name: iconName }));
}

const fileTypeSelectOptions = [
	{
		label: t("fileType.image"),
		value: "image",
		icon: renderIcon("tabler:photo"),
	},
	{
		label: t("fileType.video"),
		value: "video",
		icon: renderIcon("tabler:video"),
	},
	{
		label: t("fileType.audio"),
		value: "audio",
		icon: renderIcon("tabler:music"),
	},
	{
		label: t("fileType.document"),
		value: "document",
		icon: renderIcon("tabler:file-description"),
	},
	{
		label: t("fileType.archive"),
		value: "archive",
		icon: renderIcon("tabler:file-zip"),
	},
];
function selectRenderLabelWithIcon(
	option: SelectOption & { icon: CallableFunction },
) {
	return h(NFlex, { align: "center" }, () => [
		option.icon(),
		option.label as string,
	]);
}

const valuesTypeSelectOptions = flatFieldsList()
	?.filter(({ key }) =>
		["string", "number", "password", "email", "url"].includes(key),
	)
	.map((field) => ({
		label: field.label,
		value: field.key,
		icon: field.icon,
	}));

// Cache field type options to avoid recomputing heavy dropdown option lists on each re-render
const fieldTypeOptions = computed(() => fieldsList());

const tableSelectOptions = computed(() =>
	database.value.tables?.map(({ slug }) => ({
		label: t(slug),
		value: slug,
	})),
);

const uniqueGroupOptions = computed(() => {
	// Extract all unique group names from the schema
	const groups = schema.value
		.map((field) => (typeof field.unique === "string" ? field.unique : null))
		.filter((group) => group !== null);
	return [...new Set(groups)].map((group) => ({
		label: group,
		value: group,
	}));
});

function toggleLabelsColoring(schemaItem: Field, value: boolean) {
	if (!schemaItem.options || schemaItem.options.length === 0)
		schemaItem.options = [""];
	if (value) {
		// Convert array of strings to array of arrays of two strings
		if (
			Array.isArray(schemaItem.options) &&
			schemaItem.options.every((option) => typeof option === "string")
		) {
			schemaItem.options = schemaItem.options.map((option) => [option, ""]);
		}
	} else {
		// Convert array of arrays of two strings back to array of strings
		if (
			Array.isArray(schemaItem.options) &&
			schemaItem.options.every(
				(option) => Array.isArray(option) && option.length === 2,
			)
		) {
			schemaItem.options = schemaItem.options
				.map((option) => option[0])
				.filter((option) => option !== "");
		}
	}
}

function labelsColoringColumns(schemaItem: Field): DataTableColumns<any> {
	return [
		{
			title: t("optionLabel"),
			key: "label",
			render(row: [string | number, string], index: number) {
				return h(NInput, {
					value: row[0].toString(),
					onUpdateValue(v) {
						if (!schemaItem.options?.[index]) return;
						(schemaItem.options[index] as [string | number, string])[0] = v;
					},
				});
			},
		},
		{
			title: t("optionColor"),
			key: "color",
			render(row: [string | number, string], index: number) {
				return h(NColorPicker, {
					modes: ["hex"],
					showAlpha: false,
					value: row[1].toString(),
					onUpdateValue(v) {
						if (!schemaItem.options?.[index]) return;
						(schemaItem.options[index] as [string | number, string])[1] = v;
					},
				});
			},
		},
		{
			title: t("actions"),
			key: "actions",
			align: "center",
			render(row: [string | number, string], index: number) {
				return h(
					NButton,
					{
						type: "error",
						size: "small",
						circle: true,
						secondary: true,
						onClick() {
							if (!schemaItem.options || schemaItem.options.length === 1) {
								schemaItem.options = [["", ""]];
								return;
							}
							(schemaItem.options as [string | number, string][]).splice(
								index,
								1,
							);
						},
					},
					{ icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })) },
				);
			},
		},
	];
}

// Normalize select options: support comma-separated values entered at once
function normalizeOptionsInput(values: string[]): string[] {
	const out: string[] = [];
	for (const raw of values) {
		// Split on comma (English, Arabic), semicolon, pipe, trim whitespace around items
		const parts = String(raw)
			.split(/[,،;|]/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		out.push(...parts);
	}
	// Deduplicate while preserving order
	const seen = new Set<string>();
	return out.filter((v) => {
		if (seen.has(v)) return false;
		seen.add(v);
		return true;
	});
}

function handleOptionsUpdate(element: Field, value: string[]) {
	const normalized = normalizeOptionsInput(value);
	element.options = normalized;
}

// Debounced key input handling to avoid committing reactive changes on every keystroke
const keyBuffer = ref<Record<string, string>>({});
const keyCommitTimers = new Map<string, ReturnType<typeof setTimeout>>();
function getDisplayKey(element: Field) {
	const id = String(element.id ?? "");
	const buffered = keyBuffer.value[id];
	return buffered !== undefined ? buffered : (element.key ?? "");
}

// Memoize getField(element) by a stable signature of field-shape properties
const getFieldCache = new Map<string, ReturnType<typeof getField>>();
function getFieldCached(element: Field) {
	const typeKey = Array.isArray(element.type)
		? element.type.join(",")
		: element.type;
	const childrenKey = Array.isArray(element.children)
		? "schema"
		: (element.children ?? "");
	const key = [
		typeKey,
		element.subType ?? "",
		element.date ?? "",
		element.table ?? "",
		childrenKey,
	].join("|");
	const cached = getFieldCache.get(key);
	if (cached) return cached;
	const v = getField(element);
	getFieldCache.set(key, v);
	return v;
}
function onKeyInput(element: Field, v: string) {
	const id = String(element.id ?? "");
	keyBuffer.value[id] = v;
	const existing = keyCommitTimers.get(id);
	if (existing) clearTimeout(existing);
	const timeout = setTimeout(() => {
		element.key = v.trim();
		keyCommitTimers.delete(id);
	}, 200);
	keyCommitTimers.set(id, timeout);
}
</script>

<style scoped>
.reorder-enabled .n-collapse-item:not(.n-collapse-item--disabled) :deep(.n-collapse-item__header-main) {
	cursor: move !important;
}

.field-selected {
	border-radius: 12px;
	outline: 2px solid rgb(var(--primaryColor));
	background-color: rgb(var(--primaryColor), 0.08);
	outline-offset: 2px;
}

.formItemFlex :deep(.n-form-item-blank) {
	flex-direction: column;
	gap: 12px
}
</style>
