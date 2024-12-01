import { FormatObjectCriteriaValue } from "inibase/utils";
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

export const generateSearchArray = (searchQuery: any) => {
	const RETURN: any = {};
	for (const [condition, items] of Object.entries(searchQuery)) {
		if (!RETURN[condition]) RETURN[condition] = [];
		for (const [key, value] of Object.entries(items)) {
			if (["and", "or"].includes(key))
				RETURN[condition].push({ [key]: generateSearchArray(value) });
			else RETURN[condition].push([key, ...FormatObjectCriteriaValue(value)]);
		}
	}
	return RETURN;
};

export const generateSearchInput = (searchArray: any) => {
	const RETURN: Record<string, any> = {};
	for (const condition in searchArray) {
		for (const item of searchArray[condition]) {
			if (!RETURN[condition]) RETURN[condition] = {};
			if (Array.isArray(item) && item[0])
				RETURN[condition][item[0]] = `${item[1]}${item[2]}`;
			else RETURN[condition] = generateSearchInput(item);
		}
	}
	return RETURN;
};
