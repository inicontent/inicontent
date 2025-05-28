import { flattenSchema } from "inibase/utils"

export default function () {
	const database = useState<Database>("database")
	const tables = database.value.tables
	if (!tables) return

	const findTable = (slug: string) => tables.find((t) => t.slug === slug)

	const processField = (field: any): string | string[] | undefined => {
		const fieldTable = findTable(field.table)
		if (!fieldTable?.schema) return
		if (
			!(
				fieldTable.label ||
				fieldTable.customLabel ||
				fieldTable.customLabelColumns
			)
		)
			return

		if (fieldTable.customLabel && !fieldTable.customLabelColumns)
			return `${field.key}.*`

		if (fieldTable.customLabelColumns)
			return fieldTable.customLabelColumns.map(
				(label: string) => `${field.key}.${label}`,
			)

		const fieldTableFlatSchema = flattenSchema(fieldTable.schema as any)
		const keyParts = field.key.split(".")
		const lastKeyPart = keyParts[keyParts.length - 1]
		const results: string[] = [field.key]

		if (typeof fieldTable.label === "string") {
			const tokens = fieldTable.label
				.split(/(@\w+)/g)
				.filter((token) => token.startsWith("@"))
			for (const token of tokens) {
				const labelId = token.slice(1)
				const labelField = fieldTableFlatSchema.find(
					(f: any) => f.id === labelId,
				)
				if (!labelField) continue

				if (labelField.table && labelField.table !== field.table) {
					const labelFieldTable = findTable(labelField.table)
					if (!labelFieldTable) continue

					if (labelFieldTable.customLabelColumns) {
						for (const column of labelFieldTable.customLabelColumns) {
							results.push(`${lastKeyPart}.${labelField.key}.${column}`)
						}
						continue
					}

					if (labelFieldTable.customLabel) {
						results.push(`${lastKeyPart}.${labelField.key}.*`)
						continue
					}

					if (labelFieldTable.columns) {
						for (const column of labelFieldTable.columns) {
							results.push(`${lastKeyPart}.${labelField.key}.${column}`)
						}
					}
				} else {
					results.push(`${lastKeyPart}.${labelField.key ?? "*"}`)
				}
			}
		}
		return results
	}

	const formatTable = (table: Table) => {
		if (table.columns) return table

		if (table.schema && (table.label || table.customLabel)) {
			const flatSchema = flattenSchema(table.schema as any)
			const columns = flatSchema
				.filter(
					(field: any) => Boolean(field.table) && field.table !== "assets",
				)
				.flatMap(processField)
				.filter((col): col is string => col !== undefined)

			table.columns = columns.length ? ["*", ...columns] : ["*"]
		} else table.columns = []

		return table
	}

	database.value.tables = tables.map(formatTable)
}
