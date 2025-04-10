export default function (field: Field, item: Item, index: number): string {
	const firstStringField = (field.children as Schema).find(({ type }) =>
		typeof type === "string" ? type === "string" : type.includes("string"),
	);
	if (firstStringField && item[firstStringField.key])
		return item[firstStringField.key];

	return `${t(field.key)} ${index + 1}`;
}
