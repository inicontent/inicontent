<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NSelect :placeholder="t(field.key)" :value="selectValue" @update:value="onUpdateSelectValue" :options="options" remote
			clearable :filterable="!!searchIn && searchIn.length > 0" :loading="loading"
			:multiple="!!field.isArray" :consistent-menu-width="false" max-tag-count="responsive"
			@update:show="(show) => show && loadOptions()" @scroll="handleScroll" @search="debouncedLoadOptions" v-bind="field.inputProps
				? typeof field.inputProps === 'function'
					? field.inputProps(modelValue) ?? {}
					: field.inputProps
				: {}">
			<template #action v-if="table?.allowedMethods?.includes('c')">
				<NFlex justify="center">
					<NButton round strong secondary type="primary" @click="() => openDrawer(field.table as string)">
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
import type { pageInfo } from "inibase";
import { isObject, isValidID } from "inibase/utils";
import Inison from "inison";
import type { FormItemRule } from "naive-ui";
import { debounce } from "~/composables";

const { field } = defineProps<{ field: Field }>();
const modelValue = defineModel<Item | Item[]>();
const options = ref<tableOption[] | undefined>();
const loading = ref(false);
const database = useState<Database>("database");
const table = database.value.tables?.find(({ slug }) => slug === field.table);

// Id-only model values (translated / stored table refs) are resolved through
// the shared cache which batches all ids of the current page into a single
// request per referenced table. Object values never trigger a fetch.
const referenced = useReferencedItems(field.table);

watch(
	modelValue,
	(value) => {
		if (!value) return;
		const entries = ([] as unknown[])
			.concat(value)
			.filter((entry) => entry !== undefined && entry !== null);
		const objectItems = entries.filter(isObject) as Item[];
		const idEntries = entries
			.filter((entry) => !isObject(entry))
			.map((entry) => String(entry).trim())
			.filter(Boolean);

		if (idEntries.length) referenced.register(idEntries);

		// Resolved entries become select options: id-strings via the cache,
		// objects as-is.
		const resolvedOptions = [
			...idEntries
				.map((id) => referenced.items.value[id])
				.filter((item): item is Item => Boolean(item?.id))
				.map(singleOption),
			...objectItems.map(singleOption),
		];
		if (!resolvedOptions.length) return;
		if (!options.value) {
			options.value = resolvedOptions;
			return;
		}
		const known = new Set(options.value.map(({ value }) => value));
		const fresh = resolvedOptions.filter(({ value }) => !known.has(value));
		if (fresh.length) options.value = [...options.value, ...fresh];
	},
	{ immediate: true },
);

// Rebuild id options once the batched fetch populates the cache.
watch(
	() => referenced.items.value,
	() => {
		const value = modelValue.value;
		if (!value) return;
		const idEntries = ([] as unknown[])
			.concat(value)
			.filter((entry) => !isObject(entry))
			.map((entry) => String(entry).trim())
			.filter(Boolean);
		if (!idEntries.length) return;
		const idOptions = idEntries
			.map((id) => referenced.items.value[id])
			.filter((item): item is Item => Boolean(item?.id))
			.map(singleOption);
		if (!idOptions.length) return;
		const known = new Set((options.value ?? []).map(({ value }) => value));
		const fresh = idOptions.filter(({ value }) => !known.has(value));
		if (fresh.length) options.value = [...(options.value ?? []), ...fresh];
	},
);

const selectValue = computed<null | string | string[]>(() => {
	const value = modelValue.value as unknown;
	if (value === undefined || value === null || value === "") return null;
	const toID = (entry: unknown) =>
		(isObject(entry) ? (entry as Item).id : entry) as string;
	if (field.isArray)
		// the search form stores selected ids as a comma joined string
		return (Array.isArray(value) ? value : String(value).split(","))
			.map(toID)
			.filter(Boolean);
	return toID(Array.isArray(value) ? value[0] : value) ?? null;
});

const rule: FormItemRule = {
	trigger: ["blur", "change"],
	type: !field.isArray ? "string" : "array",
	required: field.required,
	min: field.isArray ? field.min : undefined,
	validator: async () => {
		await nextTick();
		return fieldValidator(field, modelValue.value);
	},
};

const config = useRuntimeConfig();

type tableOption = {
	label: string;
	value: string;
	raw: Item;
};

function singleOption(option: Item): tableOption {
	return {
		label: renderLabel(table, option),
		value: option.id as string,
		raw: option,
	};
}

async function onUpdateSelectValue(
	_id: string | string[],
	option: tableOption | tableOption[],
) {
	modelValue.value = option
		? Array.isArray(option)
			? option.map(({ raw }) => raw)
			: option.raw
		: undefined;
	await nextTick();
	if (
		options.value &&
		modelValue.value &&
		modelValue.value.length === options.value.length
	)
		options.value = options.value.filter(({ value }) =>
			Array.isArray(_id) ? _id.includes(value) : _id === value,
		);
}

const searchIn = table?.defaultSearchableColumns
	? table.defaultSearchableColumns.map((columnID) =>
			getPath(table.schema ?? [], columnID),
		)
	: field.searchIn;

const pagination = ref<pageInfo>();
const where = ref<string>();

const debouncedLoadOptions = debounce(async (searchValue) => {
	await loadOptions(searchValue);
}, 1000);

const sessionID = useSessionCookie();

async function loadOptions(searchValue?: string | number) {
	loading.value = true;
	const searchOrObject =
		searchValue &&
		(typeof searchValue !== "string" || searchValue.trim().length) &&
		searchIn
			? (searchIn.reduce((result, searchKey) => {
					Object.assign(result, {
						[searchKey]: `*%${searchValue}%`,
					});
					return result;
				}, {}) ?? false)
			: false;

	let _where = "";
	if (field.where) {
		if (searchOrObject)
			_where = Inison.stringify({
				...((typeof field.where === "string"
					? Inison.unstringify(
							renderLabel({ ...(table as Table), label: field.where }),
						)
					: field.where) as any),
				or: searchOrObject,
			});
		else
			_where =
				typeof field.where === "string"
					? renderLabel({ ...(table as Table), label: field.where })
					: renderLabel({
							...(table as Table),
							label: Inison.stringify(field.where),
						});
	} else if (searchOrObject)
		_where = Inison.stringify({
			or: searchOrObject,
		});

	// Add direct ID search if the searchValue is a valid ID
	if (searchValue && isValidID(searchValue))
		_where = Inison.stringify({ id: searchValue });

	if (_where) {
		if (!where.value || where.value !== _where) where.value = _where;
		else {
			loading.value = false;
			return;
		}
	} else where.value = undefined;

	const request = await $fetch<apiResponse<tableOption[]>>(
		`${config.public.apiBase}${database.value.slug}/${field.table}`,
		{
			params: {
				where: where.value,
				options: Inison.stringify({
					columns: table?.columns,
				}),
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			cache: "no-cache",
			credentials: "include",
		},
	).finally(() => {
		loading.value = false;
	});
	pagination.value = request.options;

	if (modelValue.value) {
		const currentSelectedOptions = (options.value ?? []).filter(({ value }) =>
			selectValue.value?.includes(value),
		);
		options.value = [
			...currentSelectedOptions,
			...(request.result
				?.map(singleOption)
				.filter(({ value }) => !selectValue.value?.includes(value)) ?? []),
		];
	} else options.value = request.result?.map(singleOption) ?? [];
}

async function handleScroll(e: Event) {
	const currentTarget = e.currentTarget as HTMLElement;
	if (
		loading.value ||
		!pagination.value ||
		!pagination.value.page ||
		!pagination.value.totalPages
	)
		return;
	if (
		currentTarget.scrollTop + currentTarget.clientHeight >=
			currentTarget.scrollHeight - 4 &&
		pagination.value.page < pagination.value.totalPages
	) {
		loading.value = true;
		const request = await $fetch<apiResponse<tableOption[]>>(
			`${config.public.apiBase}${database.value.slug}/${field.table}`,
			{
				params: {
					where: where.value,
					options: Inison.stringify({
						page: pagination.value.page + 1,
						columns: table?.columns,
					}),
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				cache: "no-cache",
				credentials: "include",
			},
		).finally(() => {
			loading.value = false;
		});
		if (request.result) request.result = request.result.map(singleOption);
		pagination.value = request.options;
		if (options.value && request.result) options.value.push(...request.result);
	}
}

if (
	field.inputProps &&
	typeof field.inputProps === "object" &&
	field.inputProps.show
)
	loadOptions();
</script>
