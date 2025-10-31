<template>
	<UForm :model="modelValue" ref="formValidationRef">
		<slot :data="modelValue" :schema>
			<FieldS v-model="modelValue" v-model:schema="schema" />
		</slot>
	</UForm>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"
import { debounce } from "~/composables"

const props = defineProps<{
	table?: string
	onBeforeCreate?: (data?: Item) => any
	onAfterCreate?: (data?: Item) => any
	onBeforeUpdate?: (data?: Item) => any
	onAfterUpdate?: (data?: Item) => any
	onBeforeDelete?: (data?: Item) => any
	onAfterDelete?: (data?: Item) => any
}>()

const schema = defineModel<Schema>("schema", { default: () => reactive([]) })

defineSlots<{
	default(data?: Item, schema?: Schema): any
}>()

const modelValue = defineModel<Item>({ default: () => reactive({}) })

defineExpose<FormRef>({
	create: CREATE,
	update: UPDATE,
	delete: DELETE,
	schema: schema as unknown as Schema,
	data: modelValue.value,
})

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const route = useRoute()
const database = useState<Database>("database")
const table = useState<Table>("table")

function countItems(items: Schema): number {
	return items.reduce((count, item) => {
		return (
			count +
			1 +
			(item.children && isArrayOfObjects(item.children)
				? countItems(item.children)
				: 0)
		)
	}, 0)
}

function mergeItems(existing: Schema, updated: Schema): Schema {
	const mergedSchema: Schema = []
	const customItemsIndex = existing
		.map((item, index) =>
			item.id === undefined ||
				(typeof item.id === "string" && (item.id as string).startsWith("temp-"))
				? index
				: -1,
		)
		.filter((index) => index !== -1)

	for (let index = 0; index < updated.length; index++) {
		const item = updated[index]
		if (!item) continue
		const existingItem = existing.find((_item) => _item.id === item.id)

		if (
			item.children &&
			isArrayOfObjects(item.children) &&
			existingItem?.children &&
			isArrayOfObjects(existingItem.children)
		)
			item.children = mergeItems(
				existingItem.children as Schema,
				item.children as Schema,
			)

		mergedSchema.push({ ...item, ...existingItem, children: item.children })
	}

	for (let index = 0; index < customItemsIndex.length; index++) {
		const elementIndex = customItemsIndex[index]

		if (elementIndex === undefined || !existing[elementIndex]) continue

		if (elementIndex === 0) mergedSchema.unshift(existing[elementIndex])
		else if (
			existing[elementIndex - 1] &&
			!updated.some((item) => item.key === existing[elementIndex]?.key)
		) {
			const prevItemIndex = mergedSchema.findIndex(
				(item) => item.id === existing[elementIndex - 1]?.id,
			)
			if (prevItemIndex !== -1)
				mergedSchema.splice(prevItemIndex + 1, 0, existing[elementIndex])
		}
	}

	return mergedSchema
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })
const POSTSchemasResp = useState<
	Record<string, apiResponse<{ schema: Schema; data: Item }>>
>("POSTSchemas", () => ({}))
const filterDefaultColumns = (field: Field) =>
	!["id", "createdAt", "createdBy", "updatedAt", "updatedBy"].includes(
		field.key,
	)

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

// Fetch schema and data dynamically from the correct endpoint
async function fetchSchemaAndData() {
	const bodyContent = toRaw(modelValue.value)

	let response: apiResponse<{ schema: Schema; data: Item }>
	let setSchema = false

	try {
		const currentPOSTSchemaResp =
			POSTSchemasResp.value[
			props.table ?? table.value?.slug ?? route.params.table
			]

		if (
			currentPOSTSchemaResp &&
			(Object.keys(bodyContent).length === 0 ||
				JSON.stringify(bodyContent) ===
				JSON.stringify(currentPOSTSchemaResp?.result.data))
		) {
			response = currentPOSTSchemaResp as apiResponse<{
				schema: Schema
				data: Item
			}>
		} else {
			Loading.value.SCHEMA = true

			response = await $fetch<apiResponse<{ schema: Schema; data: Item }>>(
				`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}/schema`,
				{
					method: bodyContent?.id ? "PUT" : "POST",
					body: bodyContent,
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			)

			if (Object.keys(bodyContent).length === 0) setSchema = true
		}

		const currentSchema = toRaw(schema.value).filter(filterDefaultColumns)

		// Update the schema
		if (response.result?.schema) {
			response.result.schema =
				response.result.schema.filter(filterDefaultColumns)
			if (!currentSchema?.length) {
				if (props.table) {
					const targetTableSchema = database.value.tables
						?.find(
							({ slug }) =>
								slug ===
								(props.table ?? table.value?.slug ?? route.params.table),
						)
						?.schema?.filter(filterDefaultColumns)
					if (targetTableSchema)
						response.result.schema = mergeItems(
							targetTableSchema,
							response.result.schema,
						)
				} else if (table.value?.schema)
					response.result.schema = mergeItems(
						table.value.schema.filter(filterDefaultColumns),
						response.result.schema,
					)
			} else if (
				countItems(currentSchema) !== countItems(response.result.schema)
			)
				response.result.schema = mergeItems(
					currentSchema,
					response.result.schema,
				)

			if (setSchema)
				POSTSchemasResp.value[
					props.table ?? table.value?.slug ?? route.params.table
				] = response

			schema.value = response.result.schema
		}

		// Update data only if the API sends changes
		if (response.result?.data) {
			if (modelValue.value)
				Object.assign(modelValue.value, response.result.data)
			else modelValue.value = response.result.data
		}
	} catch (error) {
		console.error("Error fetching schema:", error)
		window.$message.error(t("errorFetchingSchema"))
	} finally {
		Loading.value.SCHEMA = false
	}
}

// Debounced version of fetchSchemaAndData
const debouncedFetchSchemaAndData = debounce(async () => {
	await fetchSchemaAndData()
}, 1000)

// Trigger schema fetch on input changes with debounce
watch(
	modelValue,
	(v) => {
		if (v) debouncedFetchSchemaAndData()
	},
	{ deep: true, immediate: true },
)

onMounted(async () => {
	// Save on Ctrl+S or Command+S
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return
		e.preventDefault()
		if (modelValue.value?.id) UPDATE()
		else CREATE()
	}
})

const formValidationRef = ref<FormInst>()

async function UPDATE() {
	formValidationRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(modelValue.value)

			if (props.onBeforeUpdate)
				modelValue.value = props.onBeforeUpdate(bodyContent)

			Loading.value.UPDATE = true
			const data = await $fetch<apiResponse<Item | boolean>>(
				`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table
				}/${bodyContent?.id}`,
				{
					method: "PUT",
					body: bodyContent,
					params: {
						return: false,
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			)
			Loading.value.UPDATE = false

			if (
				(typeof data.result === "boolean" && data.result === true) ||
				(typeof data.result !== "boolean" && data.result?.id)
			) {
				window.$message.success(data.message)
				if (props.onAfterUpdate) return props.onAfterUpdate(bodyContent)
			} else window.$message.error(data.message)
		} else window.$message.error(t("inputsAreInvalid"))
	})
}

async function DELETE() {
	const bodyContent = toRaw(modelValue.value)

	if (props.onBeforeDelete) props.onBeforeDelete(bodyContent)

	Loading.value.DELETE = true
	const data = await $fetch<apiResponse<Item>>(
		`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table
		}/${bodyContent?.id}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	)
	Loading.value.DELETE = false

	if (data.result) {
		window.$message.success(data.message)
		await refreshNuxtData(
			`${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}`,
		)

		if (props.onAfterDelete) return props.onAfterDelete(data.result)

		await navigateTo(
			`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${props.table ?? table.value?.slug ?? route.params.table}`,
		)
		return
	}
	window.$message.error(data.message)
}

// Submit form data
async function CREATE() {
	formValidationRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(modelValue.value)

			if (props.onBeforeCreate)
				modelValue.value = props.onBeforeCreate(bodyContent)

			Loading.value.CREATE = true
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}`,
				{
					method: "POST",
					body: bodyContent,
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			)
			Loading.value.CREATE = false

			if (!data.result || !data.result.id)
				return window.$message.error(data.message)

			window.$message.success(data.message)
			await refreshNuxtData(
				`${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}`,
			)

			if (props.onAfterCreate) return props.onAfterCreate(data.result)

			return navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${props.table ?? table.value?.slug ?? route.params.table}/${data.result.id}/edit`,
			)
		}
		window.$message.error(t("inputsAreInvalid"))
	})
}
</script>