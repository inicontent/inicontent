import { isArrayOfObjects } from "inibase/utils";

function GenerateSearchInOptions(
	schema: Schema,
	{ key, type, children }: Field,
	path?: string,
): any {
	if ((type === "object" || type === "array") && isArrayOfObjects(children))
		return {
			// type: "group",
			label: t(key),
			value: (path ?? "") + key,
			// key: (path ?? "") + key,
			children: (children as Schema)
				.filter(({ type }) =>
					Array.isArray(type)
						? type.some((t) => !["table", "array", "object"].includes(t))
						: !["table", "array", "object"].includes(type),
				)
				.map((field) =>
					GenerateSearchInOptions(schema, field, `${(path ?? "") + key}.`),
				),
		};
	if (type === "table")
		return {
			// type: "group",
			label: t(key),
			// key: (path ?? "") + key,
			value: (path ?? "") + key,
			children:
				useState<Database>("database")
					.value?.tables?.find(({ slug }) => slug === key)
					?.schema?.map((field, _index, schema) =>
						GenerateSearchInOptions(schema, field, `${(path ?? "") + key}.`),
					) ?? [],
		};

	return {
		label: t(key),
		value: (path ?? "") + key,
		ty: type,
	};
}

export default GenerateSearchInOptions;
