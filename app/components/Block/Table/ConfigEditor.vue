<template>
	<NFlex vertical :size="12">
		<NCard size="small" :title="t('dataTable.heading')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="headingSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('dataTable.columns')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical :size="12">
				<NFlex v-for="(column, index) in columns" :key="column.id ?? index" :size="8" align="center">
					<NInput v-model:value="column.label" :placeholder="t('dataTable.columnLabel')" clearable
						style="flex: 1;" />
					<NSelect v-model:value="column.type" :options="typeOptions" :placeholder="t('dataTable.columnType')"
						style="width: 10rem;" />
					<NButton quaternary circle size="small" :title="t('dataTable.removeColumn')"
						@click="removeColumn(index)">
						<template #icon>
							<NIcon>
								<Icon name="tabler:trash" />
							</NIcon>
						</template>
					</NButton>
				</NFlex>
				<NButton dashed block @click="addColumn">
					<template #icon>
						<NIcon>
							<Icon name="tabler:plus" />
						</NIcon>
					</template>
					{{ t("dataTable.addColumn") }}
				</NButton>
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('dataTable.rows')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical v-if="columns.length && items.length" :size="16">
				<div v-for="(item, rowIndex) in items" :key="rowIndex" class="table-row-editor">
					<NFlex justify="space-between" align="center">
						<NText depth="3" strong>{{ t("dataTable.rows") }} {{ rowIndex + 1 }}</NText>
						<NButton quaternary circle size="small" :title="t('dataTable.removeRow')"
							@click="removeRow(rowIndex)">
							<template #icon>
								<NIcon>
									<Icon name="tabler:trash" />
								</NIcon>
							</template>
						</NButton>
					</NFlex>
					<NDivider style="margin: 8px 0;" />
					<div v-for="column in columns" :key="column.id ?? 0" class="table-cell">
						<NFormItem
							v-if="column.type === 'text' || column.type === 'textarea' || column.type === 'toggle'"
							:label="columnLabelOf(column)"
						>
							<NInput v-if="column.type === 'text'" v-model:value="item[column.id]" clearable />
							<NInput v-else-if="column.type === 'textarea'" v-model:value="item[column.id]"
								type="textarea" :rows="2" />
							<NSwitch v-else :value="!!item[column.id]"
								@update:value="(v) => (item[column.id] = v)" />
						</NFormItem>
						<LazyField v-else-if="column.type === 'image'" :field="imageField(column)"
							v-model="item[column.id]" />
						<LazyField v-else-if="column.type === 'tags'" :field="tagsField(column)"
							v-model="item[column.id]" />
					</div>
				</div>
			</NFlex>
			<NEmpty v-else-if="!columns.length" :description="t('dataTable.addColumnFirstHint')" />
			<NButton dashed block style="margin-top: 12px;" :disabled="!columns.length" @click="addRow">
				<template #icon>
					<NIcon>
						<Icon name="tabler:plus" />
					</NIcon>
				</template>
				{{ t("dataTable.addRow") }}
			</NButton>
		</NCard>

		<NCard size="small" :title="t('dataTable.emptyMessage')" :bordered="false" content-style="padding-top: 0;">
			<NInput v-model:value="modelValue.emptyMessage" :placeholder="t('dataTable.emptyMessage')" clearable />
		</NCard>

		<NCard size="small" :title="t('dataTable.responsive')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="hideOnSchema" v-model="modelValue" />
		</NCard>
	</NFlex>
</template>

<script lang="ts" setup>
type TableEditorColumn = NonNullable<DataTableBlock["columns"]>[number];

const modelValue = defineModel<DataTableBlock>({ default: () => ({}) });

const columns = computed<TableEditorColumn[]>(() =>
	Array.isArray(modelValue.value?.columns) ? modelValue.value.columns : [],
);

const items = computed<Record<number, unknown>[]>(() =>
	Array.isArray(modelValue.value?.items) ? modelValue.value.items : [],
);

// Legacy configs may lack column ids — backfill ascending ids so item values
// can be keyed to them.
watch(
	() => modelValue.value?.columns,
	(cols) => {
		if (!Array.isArray(cols) || !cols.length) return;
		let next =
			cols.reduce(
				(max, column) =>
					Math.max(max, typeof column.id === "number" ? column.id : 0),
				0,
			) + 1;
		for (const column of cols)
			if (typeof column.id !== "number") column.id = next++;
	},
	{ immediate: true, deep: true },
);

function nextColumnId(): number {
	const cols = modelValue.value?.columns ?? [];
	return (
		cols.reduce(
			(max, column) =>
				Math.max(max, typeof column.id === "number" ? column.id : 0),
			0,
		) + 1
	);
}

function addColumn() {
	if (!Array.isArray(modelValue.value?.columns)) modelValue.value.columns = [];
	modelValue.value.columns.push({
		id: nextColumnId(),
		label: "",
		type: "text",
	});
}

function removeColumn(index: number) {
	const cols = modelValue.value?.columns;
	if (!cols) return;
	const [removed] = cols.splice(index, 1);
	if (removed?.id !== undefined && Array.isArray(modelValue.value?.items)) {
		for (const item of modelValue.value.items) delete item[removed.id];
	}
}

function addRow() {
	if (!Array.isArray(modelValue.value?.items)) modelValue.value.items = [];
	modelValue.value.items.push({});
}

function removeRow(index: number) {
	modelValue.value?.items?.splice(index, 1);
}

function columnLabelOf(column: TableEditorColumn): string {
	return column.label?.trim() || String(column.id ?? "");
}

const typeOptions = computed(() => [
	{ label: t("dataTable.typeText"), value: "text" },
	{ label: t("dataTable.typeTextarea"), value: "textarea" },
	{ label: t("dataTable.typeImage"), value: "image" },
	{ label: t("dataTable.typeToggle"), value: "toggle" },
	{ label: t("dataTable.typeTags"), value: "tags" },
]);

// CMS field descriptors for the per-type widgets. Built per render so the
// label tracks edits; LazyField's own FieldWrapper renders the form label.
function imageField(column: TableEditorColumn): Field {
	return {
		key: `column_${column.id ?? 0}`,
		label: columnLabelOf(column),
		type: "table",
		table: "assets",
		accept: ["image"],
	};
}

function tagsField(column: TableEditorColumn): Field {
	return {
		key: `column_${column.id ?? 0}`,
		label: columnLabelOf(column),
		type: "tags",
	};
}

const HEADING_KEYS = [
	"preHeadingLink",
	"preHeading",
	"heading",
	"description",
	"tag",
];

const headingSchema = computed<Schema>(() =>
	(blockTypes.Table.schema as Schema).filter((field) =>
		HEADING_KEYS.includes(field.key),
	),
);

const hideOnSchema: Schema = [
	{ key: "hideOn", type: "array", options: ["mobile", "tablet", "desktop"] },
];
</script>

<style scoped>
.table-row-editor {
	border: 1px solid rgba(128, 128, 128, 0.2);
	border-radius: 0.5rem;
	padding: 0.75rem;
}

.table-cell + .table-cell {
	margin-top: 0.5rem;
}
</style>