<template>
	<NForm :model="modelValue" ref="formRef">
		<slot name="default" :data="modelValue" :schema="schema">
			<FieldS v-model="modelValue" v-model:schema="schema" />
		</slot>
	</NForm>
</template>

<script lang="ts" setup>
import { NForm, type FormInst } from "naive-ui";

const props = defineProps<{
	table?: string;
	onBeforeCreate?: (data?: Item) => Item;
	onAfterCreate?: (data?: Item) => Item;
	onBeforeUpdate?: (data?: Item) => Item;
	onAfterUpdate?: (data?: Item) => Item;
	onBeforeDelete?: (data?: Item) => void;
	onAfterDelete?: (data?: Item) => void;
}>();

const schema = defineModel<Schema>("schema");

const slots = defineSlots<{
	default(data?: Item, schema?: Schema): any;
}>();

const isDefaultSlotSet = computed(
	() => !!slots.default(modelValue.value, schema.value)?.[0]?.children?.length,
);

defineExpose<FormRef>({
	create: CREATE,
	update: UPDATE,
	delete: DELETE,
	schema: schema.value ?? [],
});

const modelValue = defineModel<Item>();

const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute();
const database = useState<Database>("database");
const table = useState<Table>("table");

// Fetch schema and data dynamically from the correct endpoint
async function fetchSchemaAndData() {
	Loading.value.SCHEMA = true;
	try {
		const response = await $fetch<apiResponse<{ schema: Schema; data: Item }>>(
			`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}/schema`,
			{
				method: modelValue.value?.id ? "PUT" : "POST",
				body: modelValue.value, // Send the current form data
			},
		);
		// Update the schema
		if (response.result?.schema)
			schema.value = response.result.schema?.filter(
				(field) =>
					!["id", "createdAt", "createdBy", "updatedAt", "updatedBy"].includes(
						field.key,
					),
			);

		// Update data only if the API sends changes
		if (response.result?.data && modelValue.value)
			Object.assign(modelValue.value, response.result.data);
	} catch (error) {
		console.error("Error fetching schema:", error);
		window.$message.error(t("errorFetchingSchema"));
	} finally {
		Loading.value.SCHEMA = false;
	}
}

function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>): void => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Debounced version of fetchSchemaAndData
const debouncedFetchSchemaAndData = debounce(async () => {
	await fetchSchemaAndData();
}, 500);

// Trigger schema fetch on input changes with debounce
watch(
	() => modelValue.value,
	async () => {
		if (!isDefaultSlotSet.value) debouncedFetchSchemaAndData();
	},
	{ deep: true },
);

onMounted(() => {
	// Fetch initial schema and data
	if (!isDefaultSlotSet.value) fetchSchemaAndData();

	// Save on Ctrl+S or Command+S
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return;
		e.preventDefault();
		if (modelValue.value?.id) UPDATE();
		else CREATE();
	};
});

const formRef = ref<FormInst>();

async function UPDATE() {
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			if (props.onBeforeUpdate)
				modelValue.value = props.onBeforeUpdate(modelValue.value);

			const bodyContent = toRaw(modelValue.value);

			Loading.value.UPDATE = true;
			const data = await $fetch<apiResponse<Item>>(
				`${appConfig.apiBase}${database.value.slug}/${
					props.table ?? table.value?.slug ?? route.params.table
				}/${modelValue.value?.id}`,
				{
					method: "PUT",
					body: bodyContent,
				},
			);
			Loading.value.UPDATE = false;

			if (data.result?.id) {
				modelValue.value = data.result;
				window.$message.success(data.message);
				await refreshNuxtData();

				if (props.onAfterUpdate) return props.onAfterUpdate(data.result);
			} else window.$message.error(data.message);
		} else window.$message.error(t("inputsAreInvalid"));
	});
}

async function DELETE() {
	if (props.onBeforeDelete) props.onBeforeDelete(modelValue.value);

	Loading.value.DELETE = true;
	const data = await $fetch<apiResponse<Item>>(
		`${appConfig.apiBase}${database.value.slug}/${
			props.table ?? table.value?.slug ?? route.params.table
		}/${modelValue.value?.id}`,
		{
			method: "DELETE",
		},
	);
	Loading.value.DELETE = false;

	if (data.result) {
		window.$message.success(data.message);
		await refreshNuxtData();

		if (props.onAfterDelete) return props.onAfterDelete(data.result);

		await navigateTo(
			`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${props.table ?? table.value?.slug ?? route.params.table}`,
		);
		return;
	}
	window.$message.error(data.message);
}

// Submit form data
async function CREATE() {
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			if (props.onBeforeCreate)
				modelValue.value = props.onBeforeCreate(modelValue.value);

			const bodyContent = toRaw(modelValue.value);

			Loading.value.CREATE = true;
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}`,
				{
					method: "POST",
					body: bodyContent,
				},
			);
			Loading.value.CREATE = false;

			if (!data.result || !data.result.id)
				return window.$message.error(data.message);

			window.$message.success(data.message);
			await refreshNuxtData();

			if (props.onAfterCreate) return props.onAfterCreate(data.result);

			return navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${props.table ?? table.value?.slug ?? route.params.table}/${data.result.id}/edit`,
			);
		}
		window.$message.error(t("inputsAreInvalid"));
	});
}
</script>