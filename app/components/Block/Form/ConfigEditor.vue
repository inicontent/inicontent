<template>
	<NFlex vertical :size="12">
		<NCard size="small" :title="t('form.dataSource')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical :size="12">
				<NFormItem :label="t('form.table')">
					<NSelect
						:value="modelValue?.table"
						@update:value="onTableChange"
						:options="tableOptions"
						:placeholder="t('form.selectTable')"
						clearable
						filterable />
				</NFormItem>

				<template v-if="selectedTable">
					<NText depth="3" class="columns-hint">{{ t('form.columnsHint') }}</NText>
					<NFlex v-for="column in eligibleColumns" :key="column.id" align="center" :size="8"
						class="column-row">
						<NSwitch :value="isIncluded(column)" @update:value="(v) => toggleField(column, v)"
							size="small" />
						<NText class="column-name">{{ t(column.key) }}</NText>
						<NFlex v-if="isIncluded(column)" vertical :size="6" class="column-options">
							<NInput
								:value="entry(column)?.label"
								@update:value="(v) => patchEntry(column, { label: v ?? undefined })"
								:placeholder="t('form.fieldLabel')"
								size="small" />
							<NCheckbox
								:checked="!!entry(column)?.required"
								@update:checked="(v) => patchEntry(column, { required: !!v })">
								{{ t('form.required') }}
							</NCheckbox>
						</NFlex>
					</NFlex>
				</template>
				<NEmpty v-else :description="t('form.noTableSelected')" />
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('form.media')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="mediaSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('form.heading')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="headingSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('form.submit')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="submitSchema" v-model="modelValue" />
		</NCard>

		<NCard v-if="design === 3" size="small" :title="t('form.steps')" :bordered="false"
			content-style="padding-top: 0;">
			<LazyFieldS :schema="stepsSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('form.responsive')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="hideOnSchema" v-model="modelValue" />
		</NCard>
	</NFlex>
</template>

<script lang="ts" setup>
import { flattenSchema } from "inibase/utils";
import { isFormColumn } from "~/composables/useForm";

const modelValue = defineModel<Form>({ default: () => ({}) });
defineProps<{ design?: number }>();

const database = useState<Database>("database");

const internalTableSlugs = new Set([
	"sessions",
	"assets",
	"translations",
	"dashboards",
]);

const tableOptions = computed(() =>
	(database.value?.tables ?? [])
		.filter(({ slug, show }) => show !== false && !internalTableSlugs.has(slug))
		.map((table) => ({
			value: table.slug,
			label: t(table.slug),
		})),
);

const selectedTable = computed(() =>
	(database.value?.tables ?? []).find(
		(table) => table.slug === modelValue.value?.table,
	),
);

const eligibleColumns = computed(() =>
	selectedTable.value?.schema
		? flattenSchema(selectedTable.value.schema).filter(isFormColumn)
		: [],
);

function entries() {
	if (!modelValue.value.fields) modelValue.value.fields = [];
	return modelValue.value.fields;
}

function entry(column: Field) {
	return entries().find((item) => String(item.field) === String(column.id));
}

function isIncluded(column: Field): boolean {
	return !!entry(column);
}

function toggleField(column: Field, include: boolean) {
	if (include) {
		if (isIncluded(column)) return;
		entries().push({ field: column.id, required: !!column.required });
	} else {
		modelValue.value.fields = entries().filter(
			(item) => String(item.field) !== String(column.id),
		);
	}
}

function patchEntry(
	column: Field,
	patch: Partial<NonNullable<Form["fields"]>[number]>,
) {
	const fields = entries();
	const index = fields.findIndex(
		(item) => String(item.field) === String(column.id),
	);
	if (index === -1) return;
	fields[index] = { ...fields[index], ...patch };
}

function onTableChange(slug: string | null) {
	modelValue.value.table = slug ?? undefined;
	const table = (database.value?.tables ?? []).find(
		({ slug: s }) => s === slug,
	);
	modelValue.value.fields = table?.schema
		? flattenSchema(table.schema)
				.filter(isFormColumn)
				.map((column) => ({
					field: column.id,
					required: !!column.required,
				}))
		: [];
}

const HEADING_KEYS = [
	"preHeadingLink",
	"preHeading",
	"heading",
	"description",
	"tag",
];

const headingSchema = computed<Schema>(() =>
	(blockTypes.Form.schema as Schema).filter((field) =>
		HEADING_KEYS.includes(field.key),
	),
);

const mediaSchema: Schema = [
	{ key: "media", type: "table", table: "assets", accept: ["image", "video"] },
];

const submitSchema: Schema = [
	{ key: "submitLabel", type: "string" },
	{ key: "successMessage", type: "string", subType: "textarea" },
];

const stepsSchema: Schema = [
	{ key: "stepSize", type: "number" },
	{ key: "stepTitles", type: "array", children: "string" },
];

const hideOnSchema: Schema = [
	{ key: "hideOn", type: "array", options: ["mobile", "tablet", "desktop"] },
];
</script>

<style scoped>
.columns-hint {
	display: block;
	font-size: 0.8125rem;
	padding-block-end: 0.25rem;
}

.column-row {
	width: 100%;
	padding-block: 0.375rem;
	border-block-end: 1px solid rgba(128, 128, 128, 0.15);
}

.column-name {
	font-weight: 600;
	min-width: 6rem;
}

.column-options {
	width: 100%;
	flex: 1;
}
</style>