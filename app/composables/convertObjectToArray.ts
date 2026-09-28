import { isArrayOfObjects } from "inibase/utils";

/**
 * Serialize an object-shaped block config into the array form the `blocks`
 * table stores. Inverse of `convertArrayToObject` (see
 * `app/composables/convertArrayToObject.ts`). Every field of `obj` is mapped
 * onto the slot at the same index of `schema`; unset fields become `undefined`
 * so `convertArrayToObject` skips them and lets block components fill in
 * defaults.
 */
export function convertObjectToArray(
	obj: any,
	schema: Schema,
): any[] | undefined {
	if (typeof obj !== "object" || obj === null) return undefined; // Base case for recursion

	return schema?.map((field) => {
		const key = field.key;
		if (!obj[key]) return undefined;

		if (field.table === "assets") {
			if (Array.isArray(obj[key]))
				return obj[key].map((item) => item.publicURL);
			else return obj[key].publicURL;
		}

		if (isArrayOfObjects(field.children))
			return Array.isArray(obj[key])
				? obj[key].map((item) =>
						convertObjectToArray(item, field.children as Schema),
					)
				: convertObjectToArray(obj[key], field.children);

		return obj[key];
	});
}
