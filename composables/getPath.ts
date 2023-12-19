import type { Schema } from "inibase";

export function getPath(
  schema: Schema,
  id: string,
  listNumbers?: number | number[],
  currentPath?: string
): string {
  for (const item of schema) {
    const newPath = currentPath ? `${currentPath}.${item.key}` : item.key;

    if (item.id === id) return newPath;

    if (item.type === "array" && item.children) {
      let nestedPath;
      if (listNumbers) {
        if (!Array.isArray(listNumbers)) listNumbers = [listNumbers];
        const firstItem = listNumbers.shift();
        nestedPath = getPath(
          item.children,
          id,
          listNumbers,
          newPath + "." + firstItem
        );
      } else nestedPath = getPath(item.children, id, undefined, newPath + ".");
      if (nestedPath) return nestedPath;
    } else if (item.children) {
      const nestedPath = getPath(item.children, id, undefined, newPath);
      if (nestedPath) return nestedPath;
    }
  }

  return "";
}
