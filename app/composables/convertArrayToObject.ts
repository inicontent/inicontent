export function convertArrayToObject(
	array: any[],
	schema: Schema,
): Record<string, any> {
	if (!Array.isArray(array)) return array || undefined; // Base case for recursion

	const obj: Record<string, any> = {};
	for (let index = 0; index < schema.length; index++) {
		const field = schema[index];
		const raw = array[index];
		// `convertObjectToArray` stores unset fields as `null`, so skip those
		// slots here — leaving keys out lets block components fill in defaults
		// for anything the stored config doesn't actually set.
		if (raw === undefined || raw === null) continue;
		if (field.table === "assets")
			obj[field.key] = Array.isArray(raw)
				? raw.map((publicURL: string) => ({
						publicURL,
					}))
				: { publicURL: raw };
		else if (field.type === "array" && Array.isArray(raw))
			obj[field.key] = raw.map((item: any) =>
				field.children
					? convertArrayToObject(item, field.children as Schema)
					: item,
			);
		else if (field.type === "object" && field.children)
			obj[field.key] = convertArrayToObject(raw, field.children as Schema);
		else obj[field.key] = raw;
	}
	return obj;
}
