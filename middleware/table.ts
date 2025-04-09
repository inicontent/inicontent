import { flattenSchema } from "inibase/utils";

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const table = useState<Table>("table");
	let currentTableInPath: string | undefined = decodeURIComponent(
		(to.params.table as string) ||
			to.path.split("/admin/tables/")[1]?.split("/")[0],
	);

	if (currentTableInPath === "undefined") currentTableInPath = undefined;

	if (!currentTableInPath && to.path.replace(/\/$/, "").endsWith("/auth"))
		currentTableInPath = "users";

	if (
		!database.value.tables ||
		!currentTableInPath ||
		!database.value.tables?.find(({ slug }) => slug === currentTableInPath)
	)
		throw createError({
			statusCode: 404,
			statusMessage: "table",
		});

	if (database.value.tables) {
		const formatTable = (table: Table) => {
			if (table.columns) return table;

			if (table.schema && (table.label || table.customLabel)) {
				const columns = flattenSchema(table.schema)
					.filter((field) => !!field.table && field.table !== "assets")
					.flatMap((field) => {
						const fieldTable = database.value.tables?.find(
							({ slug }) => slug === field.table,
						);

						if (
							!fieldTable?.schema ||
							(!fieldTable?.label && !fieldTable?.customLabel)
						)
							return undefined;

						if (fieldTable.customLabel && !fieldTable.customLabelColumns)
							return `${field.key}.*`;

						if (fieldTable.customLabelColumns)
							return fieldTable.customLabelColumns.map(
								(label) => `${field.key}.${label}`,
							);

						const fieldTableFlattedSchema = flattenSchema(fieldTable.schema);
						const lastItemInKey = field.key.split(".").pop();
						return [
							field.key,
							...(fieldTable.label as string)
								.split(/(@\w+)/g)
								.filter((value: string) => value.startsWith("@"))
								.flatMap((label: string) => {
									const labelField = fieldTableFlattedSchema.find(
										({ id }) => id === label.slice(1),
									);
									if (!labelField) return undefined;

									if (labelField?.table && labelField?.table !== field.table) {
										const labelFieldTable = database.value.tables?.find(
											({ slug }) => slug === labelField.table,
										);
										if (!labelFieldTable) return undefined;

										if (labelFieldTable.customLabelColumns)
											return (
												labelFieldTable.customLabelColumns?.flatMap(
													(column) =>
														`${lastItemInKey}.${labelField.key}.${column}`,
												) ?? undefined
											);

										if (labelFieldTable.customLabel)
											return `${lastItemInKey}.${labelField.key}.*`;

										if (labelFieldTable?.columns)
											return (
												labelFieldTable.columns?.flatMap(
													(column) =>
														`${lastItemInKey}.${labelField.key}.${column}`,
												) ?? undefined
											);
									}
									return `${lastItemInKey}.${labelField.key ?? "*"}`;
								}),
						];
					})
					.filter((field) => field);
				table.columns = columns.length
					? ["*", ...(columns as string[])]
					: ["*"];
			}
			return table;
		};
		database.value.tables = database.value.tables.map(formatTable);
	}

	table.value = database.value.tables.find(
		({ slug }) => slug === currentTableInPath,
	) as Table;
});
