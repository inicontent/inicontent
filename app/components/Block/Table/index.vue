<template>
	<section class="table-block">
		<LazyBlockHeading v-if="hasHeading" v-model="localModelValue" :design="1" />
		<div v-if="rows.length" class="table-scroll">
			<table class="data-table">
				<thead>
					<tr>
						<th v-for="column in columns" :key="column.key">
							{{ column.label }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(row, rowIndex) in rows" :key="rowIndex">
						<td v-for="column in columns" :key="column.key">
							<img
								v-if="column.type === 'image' && imageUrl(row[column.key])"
								class="cell-image"
								:src="imageUrl(row[column.key])"
								alt=""
								loading="lazy"
							/>
							<span
								v-else-if="column.type === 'toggle'"
								class="cell-toggle"
								:class="row[column.key] ? 'cell-toggle-on' : 'cell-toggle-off'"
							>
								{{ row[column.key] ? "✓" : "—" }}
							</span>
							<span
								v-else-if="column.type === 'tags' && asTags(row[column.key]).length"
								class="cell-tags"
							>
								<span v-for="tag in asTags(row[column.key])" :key="tag" class="cell-tag">
									{{ tag }}
								</span>
							</span>
							<span v-else>{{ formatValue(row[column.key]) }}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p v-else-if="localModelValue.emptyMessage" class="empty-message">
			{{ localModelValue.emptyMessage }}
		</p>
	</section>
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

type TableColumnConfig = {
	id?: number;
	label?: string;
	type?: TableColumnType;
};

type TableRuntimeConfig = DataTableBlock & {
	repeatItems?: unknown[];
};

type RenderColumn = {
	key: string;
	label: string;
	type: TableColumnType;
};

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const modelValue = defineModel<DataTableBlock>();

const localModelValue = ref<TableRuntimeConfig>({});
watch(
	[() => modelValue.value, Language],
	([v]) => {
		if (isModelValueEmpty(v)) localModelValue.value = defaultConfig.value;
		else
			localModelValue.value = (modelValue.value ||
				defaultConfig.value) as TableRuntimeConfig;
	},
	{ deep: true },
);
if (isModelValueEmpty(modelValue.value))
	localModelValue.value = defaultConfig.value;
else
	localModelValue.value = (modelValue.value ||
		defaultConfig.value) as TableRuntimeConfig;

const hasHeading = computed(
	() =>
		!!localModelValue.value.heading ||
		!!localModelValue.value.preHeading ||
		!!localModelValue.value.preHeadingLink ||
		!!localModelValue.value.description,
);

const repeatItems = computed(() => {
	const items = localModelValue.value.repeatItems;
	return Array.isArray(items) ? items : [];
});

const configuredColumns = computed<TableColumnConfig[]>(() =>
	Array.isArray(localModelValue.value.columns)
		? localModelValue.value.columns
		: [],
);

const columns = computed<RenderColumn[]>(() => {
	if (configuredColumns.value.length) {
		return configuredColumns.value.map((column, index) => ({
			key: columnKey(column, index),
			label: columnLabel(column, index),
			type: column.type ?? "text",
		}));
	}

	const firstObject = repeatItems.value.find(
		(item): item is Record<string, unknown> =>
			!!item && typeof item === "object" && !Array.isArray(item),
	);
	if (!firstObject) return [{ key: "value", label: "Value", type: "text" }];

	return Object.keys(firstObject)
		.filter((key) => key !== "repeatItems")
		.map((key) => ({ key, label: labelFromKey(key), type: "text" }));
});

/** Manual rows edited in the builder — values keyed by column id. */
const manualItems = computed<Record<string, unknown>[]>(() =>
	Array.isArray(localModelValue.value.items)
		? (localModelValue.value.items as Record<string, unknown>[])
		: [],
);

const rows = computed<Record<string, unknown>[]>(() => {
	if (manualItems.value.length) return manualItems.value;
	return repeatItems.value.map((item) => toRow(item));
});

function toRow(item: unknown): Record<string, unknown> {
	if (item && typeof item === "object" && !Array.isArray(item)) {
		const rowConfig = item as { columns?: { value?: unknown }[] };
		// Legacy per-row `{ columns: [{ value }] }` shape produced by older
		// data sources — map each value onto the configured column key.
		if (configuredColumns.value.length && Array.isArray(rowConfig.columns)) {
			return Object.fromEntries(
				configuredColumns.value.map((column, index) => [
					columnKey(column, index),
					rowConfig.columns?.[index]?.value,
				]),
			);
		}
		return item as Record<string, unknown>;
	}
	return { value: item };
}

function columnKey(column: TableColumnConfig, index: number): string {
	return column.id !== undefined ? String(column.id) : `column_${index}`;
}

function columnLabel(column: TableColumnConfig, index: number): string {
	return column.label?.trim() || `Column ${index + 1}`;
}

function labelFromKey(key: string): string {
	return key
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function imageUrl(value: unknown): string {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const record = value as Record<string, unknown>;
		if (typeof record.publicURL === "string") return record.publicURL;
		if (typeof record.url === "string") return record.url;
	}
	return "";
}

function asTags(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String);
	return [];
}

function formatValue(value: unknown): string {
	if (value === null || value === undefined) return "";
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	)
		return String(value);
	if (Array.isArray(value))
		return value.map(formatValue).filter(Boolean).join(" · ");
	if (typeof value === "object") {
		const objectValue = value as Record<string, unknown>;
		if (typeof objectValue.publicURL === "string") return objectValue.publicURL;
		if (typeof objectValue.url === "string") return objectValue.url;
		return JSON.stringify(value);
	}
	return String(value);
}
</script>

<style scoped>
.table-block {
	max-width: 85rem;
	margin-inline: auto;
	padding: 0 1rem 2.5rem;
}

@container (min-width: 640px) {
	.table-block {
		padding-inline: 1.5rem;
	}
}

@container (min-width: 1024px) {
	.table-block {
		padding-inline: 2rem;
	}
}

.table-scroll {
	margin-top: 2rem;
	overflow-x: auto;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	background: #ffffff;
}

.dark .table-scroll {
	border-color: #374151;
	background: #1f1f1f;
}

.data-table {
	width: 100%;
	min-width: 36rem;
	border-collapse: collapse;
}

.data-table th,
.data-table td {
	padding: 0.875rem 1rem;
	text-align: start;
	border-bottom: 1px solid #e5e7eb;
	vertical-align: top;
}

.dark .data-table th,
.dark .data-table td {
	border-color: #374151;
}

.data-table th {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: #4b5563;
	background: #f9fafb;
}

.dark .data-table th {
	color: #d1d5db;
	background: #27272a;
}

.data-table td {
	font-size: 0.875rem;
	line-height: 1.5;
	color: #1f2937;
	white-space: pre-line;
}

.dark .data-table td {
	color: #e5e7eb;
}

.cell-image {
	width: 3rem;
	height: 3rem;
	object-fit: cover;
	border-radius: 0.5rem;
	background: #f3f4f6;
}

.dark .cell-image {
	background: #27272a;
}

.cell-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.5rem;
	height: 1.5rem;
	padding-inline: 0.375rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 700;
	line-height: 1;
}

.cell-toggle-on {
	color: #047857;
	background: #d1fae5;
}

.dark .cell-toggle-on {
	color: #6ee7b7;
	background: #064e3b;
}

.cell-toggle-off {
	color: #6b7280;
	background: #f3f4f6;
}

.dark .cell-toggle-off {
	color: #9ca3af;
	background: #27272a;
}

.cell-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.375rem;
}

.cell-tag {
	padding: 0.125rem 0.5rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	line-height: 1.4;
	color: #1d4ed8;
	background: #dbeafe;
}

.dark .cell-tag {
	color: #93c5fd;
	background: #1e3a8a;
}

.data-table tr:last-child td {
	border-bottom: 0;
}

.empty-message {
	margin: 2rem 0 0;
	color: #6b7280;
}

.dark .empty-message {
	color: #9ca3af;
}
</style>
