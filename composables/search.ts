import { isArrayOfObjects } from "inibase/utils";

function _generateSearchInOption(
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
					_generateSearchInOption(schema, field, `${(path ?? "") + key}.`),
				),
		};

	return {
		label: t(key),
		value: (path ?? "") + key,
	};
}

export function generateSearchInOptions(
	schema?: Schema,
	excludedKeys?: string[],
) {
	if (!schema) return [];
	const RETURN = schema
		?.map((_item) => _generateSearchInOption(schema, _item))
		.flat(Number.POSITIVE_INFINITY);
	if (excludedKeys)
		return RETURN.filter(({ value }) => !excludedKeys.includes(value));
	return RETURN;
}
