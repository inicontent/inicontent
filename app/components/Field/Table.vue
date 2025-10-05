<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NSelect :placeholder="t(field.key)" :value="selectValue" @update:value="onUpdateSelectValue" :options remote
			clearable :filterable="!!searchIn && searchIn.length > 0" :loading="Loading[`options_${field.key}`]"
			:multiple="!!field.isArray" :consistent-menu-width="false" max-tag-count="responsive"
			@update:show="(show) => show && loadOptions()" @scroll="handleScroll" @search="debouncedLoadOptions" v-bind="field.inputProps
				? typeof field.inputProps === 'function'
					? field.inputProps(modelValue) ?? {}
					: field.inputProps
				: {}">
			<template #action>
				<NFlex justify="center">
					<NButton :disabled="!table?.allowedMethods?.includes('c')" round strong secondary type="primary"
						@click="() => openDrawer(field.table as string)">
						<template #icon>
							<Icon name="tabler:plus" />
						</template>
					</NButton>
				</NFlex>
			</template>
		</NSelect>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import type { pageInfo } from "inibase"
import { isArrayOfObjects, isObject, isValidID } from "inibase/utils"
import Inison from "inison"
import type { FormItemRule } from "naive-ui"

const { field } = defineProps<{ field: Field }>()
const modelValue = defineModel<Item | Item[]>()
const options = ref<tableOption[]>()
const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)
watch(
	modelValue,
	(value) => {
		if (value && !options.value)
			options.value = ([] as Item[]).concat(value).map(singleOption)
	},
	{ immediate: true },
)

const selectValue = computed<null | string | string[]>(() =>
	modelValue.value
		? field.isArray && Array.isArray(modelValue.value)
			? isArrayOfObjects(modelValue.value)
				? modelValue.value.map(({ id }) => id as string)
				: modelValue.value
			: isObject(modelValue.value)
				? ((modelValue.value as Item).id as string)
				: modelValue.value
		: null,
)

const rule: FormItemRule = {
	trigger: ["blur", "change"],
	type: !field.isArray ? "string" : "array",
	required: field.required,
	min: field.isArray ? field.min : undefined,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))

type tableOption = {
	label: string
	value: string
	raw: Item
}

function singleOption(option: Item): tableOption {
	return {
		label: renderLabel(table, option),
		value: option.id as string,
		raw: option,
	}
}

async function onUpdateSelectValue(
	_id: string | string[],
	option: tableOption | tableOption[],
) {
	modelValue.value = option
		? Array.isArray(option)
			? option.map(({ raw }) => raw)
			: option.raw
		: undefined
	await nextTick()
	if (
		options.value &&
		modelValue.value &&
		modelValue.value.length === options.value.length
	)
		options.value = options.value.filter(({ value }) =>
			Array.isArray(_id) ? _id.includes(value) : _id === value,
		)
}

const searchIn = table?.defaultSearchableColumns
	? table.defaultSearchableColumns.map((columnID) =>
		getPath(table.schema ?? [], columnID),
	)
	: field.searchIn

const pagination = ref<pageInfo>()
const where = ref<string>()

const debouncedLoadOptions = debounce(async (searchValue) => {
	await loadOptions(searchValue)
}, 1000)

async function loadOptions(searchValue?: string | number) {
	Loading.value[`options_${field.key}`] = true
	const searchOrObject =
		searchValue &&
			(typeof searchValue !== "string" || searchValue.trim().length) &&
			searchIn
			? (searchIn.reduce((result, searchKey) => {
				Object.assign(result, {
					[searchKey]: `*%${searchValue}%`,
				})
				return result
			}, {}) ?? false)
			: false

	let _where = ""
	if (field.where) {
		if (searchOrObject)
			_where = Inison.stringify({
				...((typeof field.where === "string"
					? Inison.unstringify(renderLabel({ ...(table as Table), label: field.where }))
					: field.where) as any),
				or: searchOrObject,
			})
		else
			_where =
				typeof field.where === "string"
					? renderLabel({ ...(table as Table), label: field.where })
					: renderLabel({ ...(table as Table), label: Inison.stringify(field.where) })
	} else if (searchOrObject)
		_where = Inison.stringify({
			or: searchOrObject,
		})

	// Add direct ID search if the searchValue is a valid ID
	if (searchValue && isValidID(searchValue))
		_where = Inison.stringify({ id: searchValue })

	if (_where) {
		if (!where.value || where.value !== _where) where.value = _where
		else {
			Loading.value[`options_${field.key}`] = false
			return
		}
	} else where.value = undefined

	const request = await $fetch<apiResponse<tableOption[]>>(
		`${appConfig.apiBase}${database.value.slug}/${field.table}`,
		{
			params: {
				where: where.value,
				options: Inison.stringify({
					columns: table?.columns,
				}),
			},
			cache: "no-cache",
			credentials: "include",
		},
	)
	pagination.value = request.options

	if (modelValue.value) {
		const currentSelectedOptions = (options.value ?? []).filter(({ value }) =>
			selectValue.value?.includes(value),
		)
		options.value = [
			...currentSelectedOptions,
			...(request.result
				?.map(singleOption)
				.filter(({ value }) => !selectValue.value?.includes(value)) ?? []),
		]
	} else options.value = request.result?.map(singleOption) ?? []
	Loading.value[`options_${field.key}`] = false
}

async function handleScroll(e: Event) {
	const currentTarget = e.currentTarget as HTMLElement
	if (
		!pagination.value ||
		!pagination.value.page ||
		!pagination.value.totalPages
	)
		return
	if (
		currentTarget.scrollTop + currentTarget.offsetHeight >=
		currentTarget.scrollHeight &&
		pagination.value.page < pagination.value.totalPages
	) {
		Loading.value[`options_${field.key}`] = true
		const request = await $fetch<apiResponse<tableOption[]>>(
			`${appConfig.apiBase}${database.value.slug}/${field.table}`,
			{
				params: {
					where: where.value,
					options: Inison.stringify({
						page: pagination.value.page + 1,
						columns: table?.columns,
					}),
				},
				cache: "no-cache",
				credentials: "include",
			},
		)
		if (request.result) request.result = request.result.map(singleOption)
		pagination.value = request.options
		if (options.value) options.value.push(...request.result)
		Loading.value[`options_${field.key}`] = false
	}
}

if (
	modelValue.value &&
	(typeof modelValue.value === "string" ||
		(Array.isArray(modelValue.value) &&
			modelValue.value.length &&
			modelValue.value.every((value) => typeof value === "string")))
) {
	Loading.value[`options_${field.key}`] = true
	await useLazyFetch<apiResponse<Item[]>>(
		`${appConfig.apiBase}${database.value.slug}/${field.table}`,
		{
			cache: "no-cache",
			query: {
				where: Inison.stringify({
					id: `[]${([] as string[]).concat(modelValue.value as string | string[]).join(",")}`,
				}),
			},
			onResponse: ({ response }) => {
				options.value = response._data?.result.map(singleOption)
				Loading.value[`options_${field.key}`] = false
			},
			credentials: "include",
		},
	)
}

if (
	field.inputProps &&
	typeof field.inputProps === "object" &&
	field.inputProps.show
)
	loadOptions()
</script>
