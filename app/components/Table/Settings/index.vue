<template>
	<div class="grid" x-gap="12" cols="12" layout-shift-disabled>
		<div class="grid"Item :span="!$device.isMobile ? 10 : 12">
			<UCard :title="t('tableSettings')" hoverable>
				<template #header-extra>
					<UButtonGroup>
						<UTooltip :delay="1500">
							<template #trigger>
								<UPopover :show-icon="false" @positive-click="deleteTable">
									<template #trigger>
										<UButton :disabled="isUnDeletable" type="error" secondary round
											:loading="Loading.deleteTable">
											<template #icon>
												<div class="inline-block">
													<Icon name="tabler:trash" />
												</div>
											</template>
										</UButton>
									</template>
									{{ t("theFollowingActionIsIrreversible") }}
								</UPopover>
							</template>
							{{ t("deleteTable") }}
						</UTooltip>
						<UButton round type="primary" secondary :loading="Loading.updateTable" @click="updateTable">
							<template #icon>
								<div class="inline-block">
									<Icon name="tabler:device-floppy" />
								</div>
							</template>
							<template v-if="!$device.isMobile" #default>
								{{ t('save') }}
							</template>
						</UButton>
					</div>
				</template>
				<div class="flex flex-col">
					<UCard :title="t('generalSettings')" id="generalSettings" hoverable>
						<UForm ref="settingsFormRef" :model="tableCopy">
							<FieldS v-model="tableCopy" :schema="generalSettingsSchema.slice(0, 3)" />
							<UFormItem path="defaultSearchableColumns" :label="t('defaultSearchableColumns')">
								<USelectMenu multiple clearable filterable expand-trigger="hover" check-strategy="child"
									:cascard="false" v-model:value="tableCopy.defaultSearchableColumns"
									:options="searchInSelectOptions" />
							</UFormGroup>
							<template v-if="tableCopy.displayAs === 'table'">
								<UFormItem path="defaultTableColumns" :label="t('defaultTableColumns')">
									<USelectMenu multiple clearable filterable expand-trigger="hover"
										check-strategy="child" :cascard="false"
										v-model:value="tableCopy.defaultTableColumns"
										:options="searchInSelectOptions" />
								</UFormGroup>
								<UFormItem path="localLabel" :label="t('label')">
									<div class="dynamic-tags" v-model:value="tableCopy.localLabel" :onCreate="onAppendToLabel"
										:render-tag="renderSingleLabel">
										<template #input="{ submit, deactivate }">
											<USelect ref="singleLabelSelect" size="small" clearable filterable show tag
												:options="searchInSelectOptions" @update:value="submit($event)"
												@update:show="(value) => value ? '' : deactivate()" />
										</template>
										<template #trigger="{ activate, disabled }">
											<UButton size="small" tertiary round
												@click="activate(), focusSingleLabelSelect()" :disabled>
												<template #icon>
													<div class="inline-block">
														<Icon name="tabler:plus" />
													</div>
												</template>
											</UButton>
										</template>
									</div>
								</UFormGroup>
							</template>
							<template v-else>
								<UFormItem path="groupBy" :label="t('groupBy')">
									<USelectMenu clearable filterable expand-trigger="hover" check-strategy="child"
										:cascard="false" v-model:value="tableCopy.groupBy"
										:options="groupBySelectOptions" />
								</UFormGroup>
								<FieldMention :field="labelField" v-model="tableCopy.label" />
							</template>
							<FieldS v-model="tableCopy.config" :schema="generalSettingsSchema.slice(3)" />
						</UForm>
					</UCard>
					<UCard :title="t('schemaSettings')" id="schemaSettings" hoverable>
						<template #header-extra>
							<UDropdown :options="fieldsList()" style="max-height: 200px" scrollable
								@select="pushToSchema">
								<UButton secondary type="primary" round @click="pushToSchema('string')">
									<template #icon>
										<div class="inline-block">
											<Icon name="tabler:plus" />
										</div>
									</template>
								</UButton>
							</UDropdown>
						</template>
						<div class="text-center py-8 text-gray-500" v-if="!tableCopy.schema || tableCopy.schema.length === 0" />
						<UForm size="small">
							<LazyTableSettingsSchema v-model="tableCopy.schema"
								v-model:expanded-names="expandedNames" />
						</UForm>
					</UCard>
				</div>
			</UCard>
		</div>
		<div class="grid"Item v-if="!$device.isMobile" span="2">
			<anchor affix listen-to="#container" :top="88" style="z-index: 1;" :bound="90">
				<anchorLink :title="t('generalSettings')" href="#generalSettings" />
				<anchorLink :title="t('schemaSettings')" href="#schemaSettings" />
			</NAnchor>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { flattenSchema, isArrayOfObjects, isNumber } from "inibase/utils"
import { Icon, NTag } from "#components"

onMounted(() => {
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return
		e.preventDefault()
		updateTable()
	}
})

defineTranslation({
	ar: {
		generalSettings: "إعدادات عامة",
		schemaSettings: "إعدادات الأعمدة",
		save: "حِفظ",
		required: "إلزامي",
		changeOrder: "تغيير الترتيب",
		label: "الإسم الظاهري",
		deleteTable: "حذف الجدول",
		defaultSearchableColumns: "الأعمدة الإفتراضية للبحث",
		compression: "ضغط البيانات",
		disableIdEncryption: "إلغاء تشفير المعرف, وإعتماد الأرقام",
		decodeID: "إلغاء تشفير المعرف",
		prepend: "إضافة مقدمة",
		recentItemsAppearAtTheTop: "العناصر الحديثة تظهر في الأعلى",
		cache: "التخزين المؤقت",
		log: "سجل التتبع",
		enableActivityLog: "تفعيل سجل عمليات الجدول",
		defaultTableColumns: "الأعمدة الإفتراضية للجدول",
		displayAs: "إظهار كـ",
		table: "جدول",
		kanban: "كانبان",
		cards: "بطاقات",
		list: "قائمة",
		groupBy: "تقسيم حسب",
	},
})

const expandedNames = ref<string[]>()
function pushToSchema(type: string) {
	tableCopy.value.schema?.splice(-2, 0, {
		id: `temp-${randomID()}`,
		key: "",
		required: false,
		...(handleSelectedSchemaType(type) as any),
	})
	const newElementId = tableCopy.value.schema?.at(-3)?.id as string | undefined
	if (newElementId) expandedNames.value = [newElementId]
	// setTimeout(
	// 	() => document.getElementById(`element-${newElementId}`)?.scrollIntoView(),
	// 	300,
	// )
}

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const route = useRoute()
const router = useRouter()
const database = useState<Database>("database")
const table = useState<Table>("table")
const settingsFormRef = ref<FormInst>()
const tableCopy = ref<
	Table & {
		localLabel?: { value: string; label: string }[]
	}
>({
	...toRaw(table.value),
	displayAs: table.value.displayAs || "table",
	schema: table.value.schema || [],
})
const Language = useCookie<LanguagesType>("language", { sameSite: true })
function removeTempIds(schema: Schema): Schema {
	return schema.map((field) => {
		if (field.id && String(field.id).startsWith("temp-")) delete field.id

		if (isArrayOfObjects(field.children)) {
			return {
				...field,
				children: removeTempIds(field.children),
			}
		}
		return field
	})
}

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function updateTable() {
	settingsFormRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = (({ onRequest, onResponse, ...rest }) => ({
				...rest,
			}))(tableCopy.value)
			Loading.value.updateTable = true

			if (bodyContent.displayAs === "table") bodyContent.displayAs = "" as any

			if (bodyContent.localLabel)
				bodyContent.label = bodyContent.localLabel
					.map(({ value }: { value: string }) => value)
					.join(" ")

			if (bodyContent.schema)
				bodyContent.schema = removeTempIds(bodyContent.schema)

			const data = await $fetch<
				apiResponse<Table & { localLabel?: { value: string; label: string }[] }>
			>(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug
				}/${route.params.table}`,
				{
					method: "PUT",
					body: bodyContent,
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			)
			const tableIndex = database.value.tables?.findIndex(
				({ slug }) => slug === route.params.table,
			)
			if (
				tableIndex !== undefined &&
				tableIndex !== -1 &&
				database.value.tables &&
				data?.result
			) {
				data.result.displayAs = data.result.displayAs || "table"
				database.value.tables[tableIndex] = data.result
				table.value = data.result
				tableCopy.value = data.result

				if (route.params.table !== data.result.slug)
					router.replace({
						params: { table: data.result.slug },
					})
				window.$message.success(data?.message ?? t("success"))
			} else window.$message.error(data?.message ?? t("error"))

			Loading.value.updateTable = false
		} else window.$message.error(t("inputsAreInvalid"))
	})
}

const isUnDeletable = computed(() =>
	["users", "pages", "blocks"].includes(table.value?.slug),
)

async function deleteTable() {
	Loading.value.deleteTable = true
	const data = await $fetch<apiResponse>(
		`${appConfig.apiBase}inicontent/databases/${database.value.slug
		}/${route.params.table}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	)
	if (data?.result) {
		const tableIndex = database.value.tables?.findIndex(
			({ slug }) => slug === route.params.table,
		)
		if (tableIndex !== undefined && tableIndex !== -1)
			database.value.tables = database.value.tables?.toSpliced(tableIndex, 1)
		Loading.value.deleteTable = false
		window.$message.success(data?.message ?? t("success"))
		setTimeout(
			async () =>
				await navigateTo(
					`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables`,
				),
			800,
		)
	} else window.$message.error(data?.message ?? t("error"))
	Loading.value.deleteTable = false
}

const flattenCopySchema = computed<Schema>(() =>
	tableCopy.value.schema ? flattenSchema(tableCopy.value.schema as any) : [],
)
const singleLabelSelect = ref()
function focusSingleLabelSelect() {
	setTimeout(() => singleLabelSelect.value?.focusInput(), 200)
}
watch(
	() => tableCopy.value.displayAs,
	(view) => {
		tableCopy.value.localLabel =
			view !== "kanban"
				? tableCopy.value.label
					?.split(/(@\w+)/g)
					.filter((value: string) => value.trim() != "")
					.map((label: string) => {
						if (label.startsWith("@"))
							return {
								label:
									flattenCopySchema.value.find(
										({ id }) => String(id) === label.slice(1),
									)?.key ?? "",
								value: label,
							}
						return {
							label,
							value: label,
						}
					})
				: undefined
	},
	{ immediate: true },
)
watch(
	() => tableCopy.value?.localLabel,
	(newValue) => {
		if (newValue?.length) {
			const localLabelWithNoEmptys = newValue.filter(
				({ label }) => label.trim() !== "",
			)
			if (localLabelWithNoEmptys.length !== newValue.length)
				tableCopy.value.localLabel = localLabelWithNoEmptys
		}
	},
)
function onAppendToLabel(label: string) {
	if (isNumber(label) && !String(label).startsWith("@")) label = `@${label}`
	if (isNumber(label.slice(1)) && String(label).startsWith("@"))
		return {
			label:
				flattenCopySchema.value.find(({ id }) => String(id) === label.slice(1))
					?.key ?? "undefined",
			value: label,
		}

	return {
		label: label,
		value: label,
	}
}
function renderSingleLabel(
	labelObject: { label: string; value: string },
	index: number,
) {
	return h(
		NTag,
		{
			type:
				labelObject.value.startsWith("@") &&
					isNumber(labelObject.value.slice(1))
					? "primary"
					: "default",
			closable: true,
			round: true,
			bordered: false,
			onClose: () => {
				tableCopy.value.localLabel?.splice(index, 1)
			},
		},
		{
			default: () => labelObject.label,
		},
	)
}

const searchInSelectOptions = computed(() =>
	generateSearchInOptions(table.value?.schema, undefined, true),
)

const groupBySelectOptions = computed(() =>
	generateSearchInOptions(
		table.value?.schema,
		table.value?.schema
			?.filter(
				({ id, subType, options }) =>
					id &&
					(!subType ||
						!["select", "radio"].includes(subType) ||
						!options?.length),
			)
			.map(({ id }) => String(id)),
		true,
	),
)

const generalSettingsSchema = reactive<Schema>([
	{
		key: "slug",
		type: "string",
		required: true,
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 3,
	},
	{
		key: "icon",
		type: "string",
		subType: "icon",
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 3,
	},
	{
		key: "displayAs",
		type: "string",
		subType: "select",
		options: [
			{ label: t("table"), value: "table" },
			{ label: t("kanban"), value: "kanban" },
			{ label: t("list"), value: "list", disabled: true },
			{ label: t("cards"), value: "cards", disabled: true },
		],
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 3,
	},
	{
		key: "compression",
		type: "boolean",
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 5,
	},
	{
		key: "cache",
		type: "boolean",
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 5,
	},
	{
		key: "prepend",
		type: "boolean",
		description: "recentItemsAppearAtTheTop",
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 5,
	},
	{
		key: "decodeID",
		type: "boolean",
		description: "disableIdEncryption",
		inputProps: ["users", "pages", "blocks"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
		width: 5,
	},
	{
		key: "log",
		type: "boolean",
		description: "enableActivityLog",
		width: 5,
	},
])

function generateMentionOptions(
	schema?: Schema,
	prefix?: string,
): {
	label: string
	value: string | number
}[] {
	let RETURN: {
		label: string
		value: string | number
	}[] = []

	if (!schema) return RETURN

	for (const field of schema) {
		if (!field.id || field.id.toString().startsWith("temp-")) continue
		if (
			(Array.isArray(field.type) && field.type.includes("array")) ||
			(field.type === "array" &&
				field.children &&
				Array.isArray(field.children) &&
				isArrayOfObjects(field.children))
		)
			continue
		if (
			field.children &&
			Array.isArray(field.children) &&
			isArrayOfObjects(field.children)
		)
			RETURN = [...RETURN, ...generateMentionOptions(field.children, field.key)]
		else
			RETURN.push({
				label: (prefix ? `${prefix}/` : "") + field.key,
				value: field.id,
			})
	}
	return RETURN
}

const labelField: Field = {
	key: "label",
	type: "string",
	subType: "mention",
	options: generateMentionOptions(tableCopy.value?.schema),
	inputProps: {
		filter: (pattern: string, option: { value: string }) => {
			if (!pattern) return true
			if (typeof option.value === "string") {
				return option.value.startsWith(pattern)
			}
			return pattern === option.value
		},
		type: "textarea",
		autosize: {
			minRows: 3,
		},
	},
}

useHead({
	title: `${t(database.value.slug)} | ${t(table.value?.slug)} : ${t("settings")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>