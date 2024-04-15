export default function (
	fieldType: string | string[],
	compareAtType: string | string[],
) {
	if (Array.isArray(fieldType))
		return fieldType.some((type) =>
			Array.isArray(compareAtType)
				? compareAtType.includes(type)
				: compareAtType === type,
		);

	return Array.isArray(compareAtType)
		? compareAtType.includes(fieldType)
		: compareAtType === fieldType;
}
