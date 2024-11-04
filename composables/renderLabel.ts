import { flattenSchema } from "inibase/utils";

export default function (label?: string, schema?: Schema, item?: Item | null) {
	if (!label || !schema) return `#${item?.id ?? "--"}`;
	const flattenTableSchema = flattenSchema(schema as any);
	return label.replace(/@(\w+)/g, (_match, capturedString: string) => {
		const fieldKey = flattenTableSchema.find(
			({ id }) => id === capturedString,
		)?.key;
		return fieldKey && item ? item[fieldKey] : "--";
	});
}
