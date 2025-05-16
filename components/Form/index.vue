<template>
	<NForm :model="modelValue" ref="formValidationRef">
		<slot :data="modelValue" :schema>
			<FieldS v-model="modelValue" v-model:schema="schema" />
		</slot>
	</NForm>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"
import { NForm, type FormInst } from "naive-ui"

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

const mergeItems = (existing: Schema, updated: Schema): Schema =>
	(
		existing
			.map((existedItem) => {
				if (
					!existedItem.id ||
					(typeof existedItem.id === "string" &&
						existedItem.id.startsWith("temp-"))
				)
					return existedItem

				const updatedItem = updated.find((item) => item.id === existedItem.id)

				if (!updatedItem) return null

				if (existedItem.children && isArrayOfObjects(existedItem.children)) {
					if (updatedItem.children && isArrayOfObjects(updatedItem.children)) {
						updatedItem.children = mergeItems(
							existedItem.children as Schema,
							updatedItem.children as Schema,
						)
					} else if (!updatedItem.children && existedItem.children) {
						const existedCustomChildren = existedItem.children.filter(
							(child) => !child.id,
						)
						if (existedCustomChildren.length)
							updatedItem.children = existedCustomChildren
						else delete updatedItem.children
					}
				}

				return { ...updatedItem, ...existedItem }
			})
			.filter(Boolean) as Schema
	).concat(
		updated.filter((item) => !existing.some((e) => e.id === item.id)), // Add new items
	)

const Language = useCookie<LanguagesType>("language", { sameSite: true })

// Fetch schema and data dynamically from the correct endpoint
async function fetchSchemaAndData() {
	Loading.value.SCHEMA = true

	const bodyContent = toRaw(modelValue.value)

	try {
		const response = await $fetch<apiResponse<{ schema: Schema; data: Item }>>(
			`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}/schema`,
			{
				method: bodyContent?.id ? "PUT" : "POST",
				body: bodyContent,
				params: {
					locale: Language.value,
				},
				credentials: "include",
			},
		)
		// Update the schema
		if (response.result?.schema) {
			const filteredSchema = response.result.schema?.filter(
				(field) =>
					!["id", "createdAt", "createdBy", "updatedAt", "updatedBy"].includes(
						field.key,
					),
			)
			if (!schema.value?.length) {
				if (props.table) {
					const targetTable = database.value.tables?.find(
						({ slug }) =>
							slug === (props.table ?? table.value?.slug ?? route.params.table),
					)
					if (targetTable?.schema)
						schema.value = mergeItems(targetTable.schema, filteredSchema)
					else schema.value = filteredSchema
				} else if (table.value?.schema)
					schema.value = mergeItems(table.value.schema, filteredSchema)
			} else if (countItems(schema.value) !== countItems(filteredSchema))
				schema.value = mergeItems(schema.value, filteredSchema)
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
				`${appConfig.apiBase}${database.value.slug}/${
					props.table ?? table.value?.slug ?? route.params.table
				}/${bodyContent?.id}`,
				{
					method: "PUT",
					body: bodyContent,
					params: {
						return: false,
						locale: Language.value,
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
		`${appConfig.apiBase}${database.value.slug}/${
			props.table ?? table.value?.slug ?? route.params.table
		}/${bodyContent?.id}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value,
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