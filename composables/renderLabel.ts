import { getField as getFieldFromSchema } from "inibase/utils";
import { getProperty } from "inidot";

export default function (label?: string, schema?: Schema, item?: Item | null) {
	if (!label || !schema) return `#${item?.id ?? "--"}`;
	// Use a regular expression to match "@" followed by any string
	const regex = /@([a-zA-ZÀ-Ÿ-.\u0621-\u064A]+)/g;
	// Use the replace method with a callback function
	return label.replace(regex, (_, capturedString) => {
		// Call the provided replacement function with the captured string
		const field = getFieldFromSchema(capturedString, schema as any);
		if (!field) return "";
		return getProperty(item, getPath(schema, field.id)) ?? "";
	});
}
