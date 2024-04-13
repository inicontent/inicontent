import { isArrayOfObjects } from "inibase/utils";

export function getPath(
	schema: Schema,
	id: string | number | undefined,
	supportWildcard = false,
	listNumbers?: number | number[],
	currentPath?: string,
): string {
	if (!id) return "";

	for (const item of schema) {
		const newPath = currentPath ? `${currentPath}.${item.key}` : item.key;

		if (item.id === id) return newPath;

		if (
			item.type === "array" &&
			item.children &&
			isArrayOfObjects(item.children)
		) {
			let nestedPath = "";
			if (listNumbers) {
				if (!Array.isArray(listNumbers)) listNumbers = [listNumbers];
				const firstItem = listNumbers.shift();
				nestedPath = getPath(
					item.children,
					id,
					supportWildcard,
					listNumbers,
					newPath + (supportWildcard ? ".*" : ".") + firstItem,
				);
			} else
				nestedPath = getPath(
					item.children,
					id,
					supportWildcard,
					undefined,
					newPath + (supportWildcard ? ".*" : "."),
				);
			if (nestedPath) return nestedPath;
		} else if (item.children && isArrayOfObjects(item.children)) {
			const nestedPath = getPath(
				item.children,
				id,
				supportWildcard,
				undefined,
				newPath,
			);
			if (nestedPath) return nestedPath;
		}
	}

	return "";
}
