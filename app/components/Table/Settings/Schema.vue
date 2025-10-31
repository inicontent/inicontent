<template>
	<UAccordion style="margin-top: 15px;" accordion :trigger-areas="['main', 'arrow']"
		v-model:expanded-names="expandedNames">
		<Draggable :list="schema" item-key="id" ghost-class="ghost" handle=".n-collapse-item__header"
			:move="onMoveCallback">
			<template #item="{ element, index }: { element: Field, index: number }">
				<UAccordionItem :name="element.id" :id="`element-${element.id}`" class="element"
					:disabled="isDisabled(element.key)" :title="element.key ? t(element.key) : '--'">
					<template #header-extra>
						<div class="flex">
							<UButtonGroup>
								<UDropdown
									v-if="['array', 'object'].includes(element.type as string) && isArrayOfObjects(element.children)"
									:options="fieldsList()" style="max-height: 200px;" scrollable
									@select="(type) => pushToChildrenSchema(type, index)">
									<UButton :disabled="!element.key" secondary round size="small"
										@click="pushToChildrenSchema('string', index)">
										<template #icon>
											<div class="inline-block">
												<Icon name="tabler:plus" />
											</div>
										</template>
									</UButton>
								</UDropdown>
								<UDropdown :disabled="isDisabled(element.key)" :options="fieldsList()"
									style="max-height: 200px" trigger="click" scrollable
									@select="(type) => schema[index] = changeFieldType(element, type)">
									<UButton round strong secondary size="small" type="primary"
										:disabled="isDisabled(element.key)">
										<template #icon>
											<component :is="getField(element).icon" />
										</template>
										<template v-if="!$device.isMobile" #default>
											{{ getField(element).label }}
										</template>
									</UButton>
								</UDropdown>
							</div>

							<UButtonGroup v-if="!isDisabled(element.key)">
								<UTooltip :delay="1500">
									<template #trigger>
										<UPopover v-model:value="element.width" :options="widthOptions">
											<UButton round strong secondary size="small" type="info">
												<template v-if="!$device.isMobile" #icon>
													<div class="inline-block">
														<Icon name="tabler:arrow-autofit-width" />
													</div>
												</template>
												1/{{ element.width ?? 1 }}
											</UButton>
										</UPopover>
									</template>
									{{ t('width') }}
								</UTooltip>
								<UTooltip :delay="1500">
									<template #trigger>
										<UButton round secondary size="small"
											:type="element.required ? 'error' : 'tertiary'"
											@click="element.required = !element.required">
											<template #icon>
												<div class="inline-block">
													<Icon name="tabler:asterisk" />
												</div>
											</template>
										</UButton>
									</template>
									{{ t('required') }}
								</UTooltip>
								<UButton round secondary size="small" type="error" @click="schema.splice(index, 1)">
									<template #icon>
										<div class="inline-block">
											<Icon name="tabler:trash" />
										</div>
									</template>
								</UButton>
							</div>
						</div>
					</template>

					<UFormItem :label="t('fieldName')" style="margin-bottom:20px">
						<template #feedback>
							{{ `#${getPath(table.schema ?? [], element.id, true) ?? '--'}` }} ({{ element.id }})
						</template>
						<UInput v-model:value="element.key" />
					</UFormGroup>

					<UFormItem
						v-if="element.table === 'assets' || !element.children || !isArrayOfObjects(element.children)"
						:label="t('fieldDescription')">
						<UInput v-model:value="element.description" />
					</UFormGroup>

					<template v-if="element.table === 'assets'">
						<UFormItem :label="t('allowedFiles')">
							<USelect multiple :render-label="selectRenderLabelWithIcon" :options="fileTypeSelectOptions"
								v-model:value="element.accept" />
						</UFormGroup>
						<UFormItem :label="t('urlSuffix')">
							<UInput v-model:value="element.suffix" />
							<template #feedback>
								{{ t('ie') }}: <strong>/@2?q=</strong>6&<strong>f=</strong>webp&<strong>fit=</strong>100
							</template>
						</UFormGroup>
					</template>
					<template v-else-if="element.subType && ['select', 'radio', 'checkbox'].includes(element.subType)">
						<UFormItem :label="t('options')" class="formItemFlex">
							<template v-if="isArrayOfArrays(element.options)">
								<UTable :columns="labelsColoringColumns(element)" :data="element.options" />
								<UButton type="primary" secondary style="width:100%"
									@click="(element.options as [string, string][]).push(['', ''])">
									<template #icon>
										<div class="inline-block">
											<Icon name="tabler:plus" />
										</div>
									</template>
									{{ t('add') }}
								</UButton>
							</template>
							<USelect v-else
								:value="element.options ? (element.options.every(option => typeof option !== 'object') ? element.options : element.options.map(({ value }: any) => value)) : []"
								@update:value="(value: string[]) => element.options = [...new Set(value)]" filterable
								multiple tag :show-arrow="false" :show="false" />
						</UFormGroup>
						<UFormItem :label="t('labelsColoring')" label-placement="left">
							<UToggle :value="isArrayOfArrays(element.options)"
								@update:value="(value) => toggleLabelsColoring(element, value)" />
						</UFormGroup>
						<UFormItem v-if="element.subType === 'select'" :label="t('allowCustomValues')"
							label-placement="left">
							<UToggle v-model:value="element.custom" />
						</UFormGroup>
					</template>
					<template v-else-if="!Array.isArray(element.type) && element.type === 'object'">
						<UFormItem :label="t('expandByDefault')" label-placement="left">
							<UToggle v-model:value="element.expand" />
						</UFormGroup>
					</template>
					<template v-else-if="Array.isArray(element.type) && !element.subType">
						<UFormItem :label="t('valuesType')">
							<USelect v-model:value="element.type" filterable multiple :min="1"
								:render-label="selectRenderLabelWithIcon" :options="valuesTypeSelectOptions" />
						</UFormGroup>
					</template>
					<template v-else-if="element.subType === 'tags'">
						<UFormItem :label="t('valuesType')">
							<USelect v-model:value="(element.children as any)" filterable multiple
								:render-label="selectRenderLabelWithIcon" :options="valuesTypeSelectOptions" />
						</UFormGroup>
					</template>
					<template
						v-else-if="!Array.isArray(element.type) && ((element.type === 'array' && element.children === 'table') || element.type === 'table')">
						<UFormItem :label="t('tableName')">
							<USelect filterable v-model:value="element.table" :options="tableSelectOptions" />
						</UFormGroup>
						<UFormItem :label="t('extendWhere')">
							<UInput v-model:value="(element.where as string)" />
							<template #feedback>
								{{ t('useInison') }} / {{ t('ie') }}:
								{<strong>subCategory</strong>:<strong>null</strong>}
							</template>
						</UFormGroup>
					</template>

					<template v-if="!Array.isArray(element.type) && element.type === 'array'">
						<UFormItem :label="t('minimumItems')">
							<UInputNumber :value="element.min"
								@update:value="(value) => { if (value) element.min = value; else delete element.min }" />
						</UFormGroup>
						<UFormItem :label="t('maximumItems')">
							<UInputNumber :value="element.max"
								@update:value="(value) => { if (value) element.max = value; else delete element.max }" />
						</UFormGroup>
					</template>

					<UFormItem :label="t('unique')" label-placement="left"
						v-if="!['array', 'object', 'tags'].includes((element.subType ?? element.type) as string)">
						<UToggle :value="element.unique ? true : false"
							@update:value="(value) => element.unique = value" :checked-value="true"
							:unchecked-value="false" />
					</UFormGroup>
					<UFormItem v-if="element.unique" :label="t('uniqueGroup')">
						<USelect :value="typeof element.unique === 'boolean' ? undefined : element.unique"
							@update:value="(value) => element.unique = value" :options="uniqueGroupOptions" tag
							filterable clearable />
					</UFormGroup>

					<UFormItem v-if="!element.table && (!element.children || !isArrayOfObjects(element.children))"
						:label="t('regex')">
						<UInput v-model:value="element.regex" />
					</UFormGroup>

					<LazyTableSettingsSchema
						v-if="!Array.isArray(element.type) && ['array', 'object'].includes(element.type) && isArrayOfObjects(element.children)"
						v-model="element.children" v-model:expanded-names="expandedChildNames" />
				</UAccordionItem>
			</template>
		</Draggable>
	</UAccordion>
</template>

<script lang="ts" setup>
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils"
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
	const disabledIndexes = schema.value
		.map(({ id }, index) => ([0, -1, -2].includes(id as number) ? index : -3))
		.filter((index) => index !== -3)
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
const expandedNames = defineModel<(string | number)[]>("expandedNames")
const expandedChildNames = ref<(string | number)[]>()
async function pushToChildrenSchema(type: string, index: number) {
	if (!schema.value[index]) return
	if (!schema.value[index].children) schema.value[index].children = [] as Schema
	;(schema.value[index].children as Schema).push({
		id: `temp-${randomID()}`,
		key: null,
		required: false,
		...handleSelectedSchemaType(type),
	} as any)

	if (!schema.value[index].id) return

	expandedNames.value = [schema.value[index].id]
	const newElementId = (
		(schema.value[index].children as Schema).at(-1) as Field
	).id

	if (!newElementId) return

	expandedChildNames.value = [newElementId]

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

const valuesTypeSelectOptions = flatFieldsList()
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
						if (!schemaItem.options?.[index]) return
						;(schemaItem.options[index] as [string | number, string])[0] = v
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
						if (!schemaItem.options?.[index]) return
						;(schemaItem.options[index] as [string | number, string])[1] = v
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
							;(schemaItem.options as [string | number, string][]).splice(
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
