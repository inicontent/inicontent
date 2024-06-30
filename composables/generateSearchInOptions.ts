import { isArrayOfObjects } from "inibase/utils";

function generateSearchInOptions(
	schema: Schema,
	{ key, type, children }: Field,
	path?: string,
): any {
	if ((type === "object" || type === "array") && isArrayOfObjects(children))
		return {
			label: t(key),
			value: (path ?? "") + key,
			children: (children as Schema)
				.filter(({ type }) =>
					Array.isArray(type)
						? type.some((t) => !["table", "array", "object"].includes(t))
						: !["table", "array", "object"].includes(type),
				)
				.map((field) =>
					generateSearchInOptions(schema, field, `${(path ?? "") + key}.`),
				),
		};

	return {
		label: t(key),
		value: (path ?? "") + key,
		ty: type,
	};
}

export default generateSearchInOptions;
