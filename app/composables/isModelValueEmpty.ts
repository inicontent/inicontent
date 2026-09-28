import { isObject } from "inibase/utils";

export default function isModelValueEmpty(v: any): boolean {
	return (
		!v ||
		Object.keys(v).length === 0 ||
		Object.values(v).every(
			(value) =>
				!value ||
				(Array.isArray(value) && !value.length) ||
				(isObject(value) && isModelValueEmpty(value)),
		)
	);
}
