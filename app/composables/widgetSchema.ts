import { flattenSchema } from "inibase/utils";

// Resolvers that translate a widget's stored id references (table id, field
// id) back into the live database config — used by the widget editor, the
// data composable and the widget renderers. Widget settings deliberately
// persist ids instead of slugs/keys so renames never orphan a widget.

/** Resolve a widget's stored source-table reference (a table id) to its Table. */
export function resolveWidgetTable(
	tables: Table[] | undefined,
	tableRef: string | undefined,
): Table | undefined {
	if (!tables?.length || tableRef == null) return undefined;
	const ref = String(tableRef);
	return tables.find((t) => t.id != null && String(t.id) === ref);
}

/** Resolve a widget's stored field reference (a field id) to its Field.
 *  Flattened leaves (`items.quantity`) keep their child's id, so one lookup
 *  covers both plain and nested fields. */
export function resolveWidgetField(
	table: Table | undefined,
	fieldRef: string | number | undefined,
): Field | undefined {
	if (!table?.schema?.length || fieldRef == null) return undefined;
	const id = Number(fieldRef);
	if (!Number.isFinite(id)) return undefined;
	return flattenSchema(table.schema as any).find((f: Field) => f.id === id);
}

/** Item keys that exist on every row regardless of the schema, so they have no
 *  field id — the line-chart date picker keeps them as literal keys. */
const SYSTEM_DATE_KEYS = new Set(["createdAt", "updatedAt"]);

/** Resolve a widget's date field: schema fields by id, system timestamps by
 *  their reserved key. */
export function resolveWidgetDateField(
	table: Table | undefined,
	dateFieldRef: string | number | undefined,
): string | undefined {
	if (dateFieldRef == null) return undefined;
	if (typeof dateFieldRef === "string" && SYSTEM_DATE_KEYS.has(dateFieldRef)) {
		return dateFieldRef;
	}
	return resolveWidgetField(table, dateFieldRef)?.key;
}
