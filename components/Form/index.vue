<template>
	<NForm :model="modelValue" ref="formValidationRef">
		<slot :data="modelValue" :schema>
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

const schema = defineModel<Schema>("schema", { default: reactive([]) });

defineSlots<{
	default(data?: Item, schema?: Schema): any;
}>();

const modelValue = defineModel<Item>();

defineExpose<FormRef>({
	create: CREATE,
	update: UPDATE,
	delete: DELETE,
	schema: schema as unknown as Schema,
	data: modelValue.value,
});

const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute();
const database = useState<Database>("database");
const table = useState<Table>("table");

// Fetch schema and data dynamically from the correct endpoint
async function fetchSchemaAndData() {
	Loading.value.SCHEMA = true;

	const bodyContent = toRaw(modelValue.value);

	try {
		const response = await $fetch<apiResponse<{ schema: Schema; data: Item }>>(
			`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table}/schema`,
			{
				method: bodyContent?.id ? "PUT" : "POST",
				body: bodyContent, // Send the current form data
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
		if (response.result?.data) {
			if (modelValue.value)
				Object.assign(modelValue.value, response.result.data);
			else modelValue.value = response.result.data;
		}
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
}, 1000);

// Trigger schema fetch on input changes with debounce
watch(
	modelValue,
	(v) => {
		if (v && Object.keys(v).length) debouncedFetchSchemaAndData();
	},
	{ deep: true, immediate: true },
);

onMounted(async () => {
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

const formValidationRef = ref<FormInst>();

async function UPDATE() {
	formValidationRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(modelValue.value);

			if (props.onBeforeUpdate)
				modelValue.value = props.onBeforeUpdate(bodyContent);

			Loading.value.UPDATE = true;
			const data = await $fetch<apiResponse<Item>>(
				`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table
				}/${bodyContent?.id}`,
				{
					method: "PUT",
					body: bodyContent,
				},
			);
			Loading.value.UPDATE = false;

			if (data.result?.id) {
				modelValue.value = data.result;
				window.$message.success(data.message);
				if (props.onAfterUpdate) return props.onAfterUpdate(data.result);
			} else window.$message.error(data.message);
		} else window.$message.error(t("inputsAreInvalid"));
	});
}

async function DELETE() {
	const bodyContent = toRaw(modelValue.value);

	if (props.onBeforeDelete) props.onBeforeDelete(bodyContent);

	Loading.value.DELETE = true;
	const data = await $fetch<apiResponse<Item>>(
		`${appConfig.apiBase}${database.value.slug}/${props.table ?? table.value?.slug ?? route.params.table
		}/${bodyContent?.id}`,
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
	formValidationRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(modelValue.value);

			if (props.onBeforeCreate)
				modelValue.value = props.onBeforeCreate(bodyContent);

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