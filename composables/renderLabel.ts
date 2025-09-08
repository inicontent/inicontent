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
	return table.label.replace(/@([a-zA-Z0-9_]+)\.(\d+)|@(\d+)/g, (match, slug, fieldId, capturedNumber) => {
		if (slug && fieldId !== undefined) {

			if (slug === 'user') {
				slug = 'users';
				item = useState<User>("user").value
			}

			const database = useState<Database>("database")
			const refTable = database.value.tables?.find(({ slug: s }) => s === slug)
			if (!refTable || !refTable.schema) return defaulValue
			const flattenRefSchema = flattenSchema(refTable.schema as any)
			const field = flattenRefSchema.find(({ id }) => id === Number(fieldId))
			if (!field || !item || !item[field.key]) return defaulValue
			if (field.table) {
				const fieldTable = database.value.tables?.find(({ slug }) => slug === field.table)
				return renderLabel(fieldTable, item[field.key])
			}
			return item[field.key]
		}
		if (capturedNumber) {
			const field = flattenTableSchema.find(({ id }) => id === Number(capturedNumber))
			if (!field || !item || !item[field.key]) return defaulValue
			if (field.table) {
				const database = useState<Database>("database")
				const fieldTable = database.value.tables?.find(({ slug }) => slug === field.table)
				return renderLabel(fieldTable, item[field.key])
			}
			return item[field.key]
		}
		return defaulValue
	}).replaceAll('\\\\', '\\')
}
