import { flattenSchema } from "inibase/utils";

export default function (schema?: Schema, prefix?: string) {
	const database = useState<Database>("database");
	if (!schema) return "";
	const columns = flattenSchema(schema)
		.filter((field) => !!field.table && field.table !== "assets")
		.flatMap(({ key, table }) => {
			const _table = database.value.tables?.find(({ slug }) => slug === table);
			if (!_table?.schema || (!_table?.label && !_table?.customLabel)) return;

			if (_table.customLabel && !_table.customLabelColumns) return `${key}.*`;

			const _tableFlattenSchema = flattenSchema(_table.schema);

			if (_table.customLabelColumns)
				return _table.customLabelColumns.map(
					(label) => (prefix ? `${prefix}.` : "") + label,
				);

			const lastItemInKey = key.split(".").pop();
			return [
				key,
				...(_table.label as string)
					.split(/(@\w+)/g)
					.filter((value: string) => value.startsWith("@"))
					.map(
						(label: string) =>
							`${lastItemInKey}.${
								_tableFlattenSchema.find(({ id }) => id === label.slice(1))
									?.key ?? "*"
							}`,
					),
			];
		})
		.filter((field) => field);
	if (columns.length) return ["*", ...columns];
}
