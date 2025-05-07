import { flattenSchema } from "inibase/utils"

export default function renderLabel(
	table?: Table,
	item?: Item,
	defaulValue = "--",
): string {
	if (!table || !table.label || !table.schema)
		return `${item?.id ?? defaulValue}`

	if (table.customLabel) return table.customLabel(item)

	const flattenTableSchema = flattenSchema(table.schema as any)
	return table.label.replace(/@(\w+)/g, (_match, capturedString: string) => {
		const field = flattenTableSchema.find(({ id }) => id === capturedString)
		if (!field || !item || !item[field.key]) return defaulValue
		if (field.table) {
			const database = useState<Database>("database")
			const fieldTable = database.value.tables?.find(
				({ slug }) => slug === field.table,
			)
			return renderLabel(fieldTable, item[field.key])
		}
		return item[field.key]
	})
}
