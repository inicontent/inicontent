import { isArrayOfObjects } from "inibase/utils"

function _generateSearchInOption(
	schema: Schema,
	{ id, key, type, children }: Field,
	useIDasValue?: boolean,
	path?: string,
): any {
	if ((type === "object" || type === "array") && isArrayOfObjects(children)) {
		const _children = (children as Schema).filter(({ type }) =>
			Array.isArray(type)
				? type.some((t) => !["table", "array", "object"].includes(t))
				: !["table", "array", "object"].includes(type),
		)
		if (!_children.length) return undefined
		return {
			label: t(key),
			value: useIDasValue ? id : (path ?? "") + key,
			children: _children.map((field) =>
				_generateSearchInOption(
					schema,
					field,
					useIDasValue,
					`${(path ?? "") + key}.`,
				),
			),
		}
	}

	return {
		label: t(key),
		value: useIDasValue ? id : (path ?? "") + key,
	}
}

export function generateSearchInOptions(
	schema?: Schema,
	excludedKeys?: string[],
	useIDasValue?: boolean,
) {
	if (!schema) return []
	const RETURN = schema
		.map((field) => _generateSearchInOption(schema, field, useIDasValue))
		.filter(Boolean)
		.flat(Number.POSITIVE_INFINITY)
	if (excludedKeys)
		return RETURN.filter(({ value }) => !excludedKeys.includes(value))
	return RETURN
}
