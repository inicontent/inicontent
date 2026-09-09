import { flattenSchema } from "inibase/utils";

export default function renderLabel(
	table?: Table,
	item?: Item,
	defaulValue = "--",
): string {
	if (!table || !table.schema) return `${item?.id ?? defaulValue}`;

	// Tables created without an explicit Item Label template (e.g. quick
	// "new table" with just a slug) have `label: ""`. Falling back to the raw
	// masked id makes referenced items unreadable and — since translated
	// references can point to a different item per language — the cell value
	// appears to change "randomly" when the UI language switches. Show the
	// item's first text field instead.
	if (!table.label) return fallbackLabel(table, item, defaulValue);

	if (table.customLabel) return table.customLabel(item);

	const flattenTableSchema = flattenSchema(table.schema as any);
	return table.label
		.replace(
			/@([a-zA-Z0-9_]+)\.(\d+)|@(\d+)/g,
			(match, slug, fieldId, capturedNumber) => {
				if (slug && fieldId !== undefined) {
					if (slug === "user") {
						slug = "users";
						item = useState<User>("user").value;
					}

					const database = useState<Database>("database");
					const refTable = database.value.tables?.find(
						({ slug: s }) => s === slug,
					);
					if (!refTable || !refTable.schema) return defaulValue;
					const flattenRefSchema = flattenSchema(refTable.schema as any);
					const field = flattenRefSchema.find(
						({ id }) => id === Number(fieldId),
					);
					if (!field || !item || !item[field.key]) return defaulValue;
					if (field.table) {
						const fieldTable = database.value.tables?.find(
							({ slug }) => slug === field.table,
						);
						return renderLabel(fieldTable, item[field.key]);
					}
					return item[field.key];
				}
				if (capturedNumber) {
					const field = flattenTableSchema.find(
						({ id }) => id === Number(capturedNumber),
					);
					if (!field || !item || !item[field.key]) return defaulValue;
					if (field.table) {
						const database = useState<Database>("database");
						const fieldTable = database.value.tables?.find(
							({ slug }) => slug === field.table,
						);
						return renderLabel(fieldTable, item[field.key]);
					}
					return item[field.key];
				}
				return defaulValue;
			},
		)
		.replaceAll("\\\\", "\\");
}

function fallbackLabel(table: Table, item?: Item, defaulValue = "--"): string {
	if (!item) return `${defaulValue}`;
	const flattened = flattenSchema(table.schema as any);
	const candidates = flattened
		.filter((field) => field.id !== undefined && Number(field.id) > 0)
		.sort((a, b) => Number(a.id) - Number(b.id));
	for (const field of candidates) {
		const types = Array.isArray(field.type) ? field.type : [field.type];
		if (
			!types.some(
				(type) => type === "string" || type === "text" || type === "number",
			)
		)
			continue;
		const value = (item as Record<string, unknown>)[field.key];
		if (value !== undefined && value !== null && String(value).trim() !== "")
			return String(value);
	}
	return `${item?.id ?? defaulValue}`;
}
