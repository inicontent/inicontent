<template>
	<NCollapse style="margin-top: 15px;" accordion :trigger-areas="['main', 'arrow']"
		v-model:expanded-names="expandedNames">
		<Draggable :list="schema" item-key="id" ghost-class="ghost" handle=".n-collapse-item__header"
			:move="onMoveCallback">
			<template #item="{ element, index }: { element: Field, index: number }">
				<NCollapseItem :name="element.id" :id="`element-${element.id}`" :disabled="isDisabled(element.key)"
					:title="element.key ? t(element.key) : '--'">
					<template #header-extra>
						<NFlex>
							<NButtonGroup>
								<NDropdown
									v-if="['array', 'object'].includes(element.type as string) && isArrayOfObjects(element.children)"
									:options="fieldsList()" style="max-height: 200px;" scrollable
									@select="(type) => pushToChildrenSchema(type, index)">
									<NButton :disabled="!element.key" secondary round size="small">
										<template #icon>
											<NIcon>
												<Icon name="tabler:plus" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NDropdown :disabled="isDisabled(element.key)" :options="fieldsList()"
									style="max-height: 200px" trigger="click" scrollable
									@select="(type) => schema[index] = changeFieldType(element, type)">
									<NButton round strong secondary size="small" type="primary"
										:disabled="isDisabled(element.key)">
										<template #icon>
											<component :is="getField(element).icon" />
										</template>
										<template v-if="!$device.isMobile" #default>
											{{ getField(element).label }}
										</template>
									</NButton>
								</NDropdown>
							</NButtonGroup>

							<NButtonGroup v-if="!isDisabled(element.key)">
								<NTooltip :delay="1500">
									<template #trigger>
										<NPopselect v-model:value="element.width" :options="widthOptions">
											<NButton round strong secondary size="small" type="info">
												<template v-if="!$device.isMobile" #icon>
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
								<NButton round secondary size="small" type="error" @click="schema.splice(index, 1)">
									<template #icon>
										<NIcon>
											<Icon name="tabler:trash" />
										</NIcon>
									</template>
								</NButton>
							</NButtonGroup>
						</NFlex>
					</template>

					<NFormItem :label="t('fieldName')" style="margin-bottom:20px">
						<template #feedback>
							{{ `#${getPath(table.schema ?? [], element.id, true) ?? '--'}` }} ({{ element.id }})
						</template>
						<NInput v-model:value="element.key" />
					</NFormItem>

					<NFormItem
						v-if="element.table === 'assets' || Array.isArray(element.type) || !['array', 'object'].includes(element.type)"
						:label="t('fieldDescription')">
						<NInput v-model:value="element.description" />
					</NFormItem>

					<template v-if="element.table === 'assets'">
						<NFormItem :label="t('allowedFiles')">
							<NSelect multiple :render-label="selectRenderLabelWithIcon" :options="fileTypeSelectOptions"
								v-model:value="element.accept" />
						</NFormItem>
						<NFormItem :label="t('uploadParams')">
							<NInput v-model:value="element.params" />
							<template #feedback>
								{{ t('ie') }}: <strong>q=</strong>6&<strong>f=</strong>webp&<strong>fit=</strong>100
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
								@update:value="(value: string[]) => element.options = [...new Set(value)]" filterable
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
						<NFormItem :label="t('minimumItems')">
							<NInputNumber :value="element.min"
								@update:value="(value) => { if (value) element.min = value; else delete element.min }" />
						</NFormItem>
						<NFormItem :label="t('maximumItems')">
							<NInputNumber :value="element.max"
								@update:value="(value) => { if (value) element.max = value; else delete element.max }" />
						</NFormItem>
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
						v-model="element.children" v-model:expanded-names="expandedChildNames" />
				</NCollapseItem>
			</template>
		</Draggable>
	</NCollapse>
</template>

<script lang="ts" setup>
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils"
import type { DataTableColumns, SelectOption } from "naive-ui"
import Draggable from "vuedraggable"
import { Icon, NButton, NColorPicker, NFlex, NIcon, NInput } from "#components"

defineTranslation({
	ar: {
		fieldName: "إسم الحقل",
		fieldDescription: "وصف الحقل",
		allowedFiles: "الملفات المسموح بها",
		options: "الخيارات",
		valuesType: "نوع القيم",
		// showAsTable: "إظهار كجدول",
		tableName: "إسم الجدول",
		// labelImage: "الصورة", // TO-DO: support image in table field
		expandByDefault: "توسيع بشكل افتراضي",
		dragToMove: "اسحب للتحريك",
		fileType: {
			image: "صورة",
			video: "فيديو",
			audio: "صوت",
			document: "نص",
			archive: "أرشيف",
		},
		allowCustomValues: "السماح بإدخال قيم جديدة",
		username: "إسم المستخدم",
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		role: "الصلاحية",
		createdBy: "أُنشأ من قبل",
		unique: "فريد",
		uniqueGroup: "مجموعة فريدة",
		regex: "التعبير النمطي",
		uploadParams: "إعدادات الرفع",
		minimumItems: "الحد الأدنى للعناصر",
		maximumItems: "الحد الأقصى للعناصر",
		ie: "على سبيل المثال",
		useInison: "إستعمل Inison",
		extendWhere: "توسيع البحث",
		labelsColoring: "تفعيل الألوان",
		optionLabel: "إسم الخيار",
		optionColor: "لون الخيار",
		add: "إضافة",
		width: "العرض",
	},
})

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
]

function onMoveCallback(evt: {
	draggedContext: { index: number; futureIndex: number }
}) {
	const disabledIndexes = schema.value.map(({ id }, index) => [0, -1, -2].includes(id as number) ? index : -3).filter(index => index !== -3)
	return (
		!disabledIndexes.includes(evt.draggedContext.index) &&
		!disabledIndexes.includes(evt.draggedContext.futureIndex)
	)
}

function isDisabled(key?: string) {
	if (key) {
		const defaultFields: string[] = ["id", "createdAt", "updatedAt"]
		switch (table.value.slug) {
			case "users":
				defaultFields.push("username", "email", "password", "role", "createdBy")
				break
			case "pages":
				defaultFields.push("slug", "content", "seo")
				break
			case "blocks":
				defaultFields.push("name", "config", "hideOn")
				break
			default:
				break
		}
		return defaultFields.includes(key)
	}
	return false
}
const expandedNames = defineModel<string[]>("expandedNames")
const expandedChildNames = ref<string[]>()
function pushToChildrenSchema(type: string, index: number) {
	if (!schema.value[index]) return;
	if (!schema.value[index].children) schema.value[index].children = [] as Schema
		; (schema.value[index].children as Schema).push({
			id: `temp-${randomID()}`,
			key: null,
			required: false,
			...handleSelectedSchemaType(type),
		} as any)
	expandedNames.value = [String(schema.value[index].id)]
	const newElementId = ((schema.value[index].children as Schema).at(-1) as Field).id
	expandedChildNames.value = [String(newElementId)]
	setTimeout(
		() => document.getElementById(`element-${newElementId}`)?.scrollIntoView(),
		300,
	)
}
const schema = defineModel<Schema>({
	default: () => reactive([]),
})
const database = useState<Database>("database")
const table = useState<Table>("table")

function changeFieldType(
	{ id, key, required, children, width }: any,
	newType: string,
): any {
	switch (newType) {
		case "object":
		case "array":
			return { id, key, type: newType, required, children }
		default:
			return {
				id,
				key,
				...(handleSelectedSchemaType(newType) as any),
				width,
				required,
			}
	}
}

function renderIcon(iconName: string) {
	return () => h(NIcon, () => h(Icon, { name: iconName }))
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
]
function selectRenderLabelWithIcon(
	option: SelectOption & { icon: CallableFunction },
) {
	return h(NFlex, { align: "center" }, () => [
		option.icon(),
		option.label as string,
	])
}

const valuesTypeSelectOptions = flatFieldsList
	?.filter(({ key }) =>
		["string", "number", "password", "email", "url"].includes(key),
	)
	.map((field) => ({
		label: field.label,
		value: field.key,
		icon: field.icon,
	}))

const tableSelectOptions = computed(() =>
	database.value.tables?.map(({ slug }) => ({
		label: t(slug),
		value: slug,
	})),
)

const uniqueGroupOptions = computed(() => {
	// Extract all unique group names from the schema
	const groups = schema.value
		.map((field) => (typeof field.unique === "string" ? field.unique : null))
		.filter((group) => group !== null)
	return [...new Set(groups)].map((group) => ({
		label: group,
		value: group,
	}))
})

function toggleLabelsColoring(schemaItem: Field, value: boolean) {
	if (!schemaItem.options || schemaItem.options.length === 0)
		schemaItem.options = [""]
	if (value) {
		// Convert array of strings to array of arrays of two strings
		if (
			Array.isArray(schemaItem.options) &&
			schemaItem.options.every((option) => typeof option === "string")
		) {
			schemaItem.options = schemaItem.options.map((option) => [option, ""])
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
				.filter((option) => option !== "")
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
						(schemaItem.options[index] as [string | number, string])[0] = v
					},
				})
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
						(schemaItem.options[index] as [string | number, string])[1] = v
					},
				})
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
								schemaItem.options = [["", ""]]
								return
							}
							; (schemaItem.options as [string | number, string][]).splice(
								index,
								1,
							)
						},
					},
					{ icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })) },
				)
			},
		},
	]
}
</script>

<style scoped>
.n-collapse-item:not(.n-collapse-item--disabled) :deep(.n-collapse-item__header-main) {
	cursor: move !important;
}

.formItemFlex :deep(.n-form-item-blank) {
	flex-direction: column;
	gap: 12px
}
</style>
