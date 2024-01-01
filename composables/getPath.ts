import { isArrayOfObjects } from "inibase/utils";
import type { Schema } from "~/types";

export function getPath(
  schema: Schema,
  id: string | number | undefined,
  listNumbers?: number | number[],
  currentPath?: string
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
    } else if (item.children && isArrayOfObjects(item.children)) {
      const nestedPath = getPath(item.children, id, undefined, newPath);
      if (nestedPath) return nestedPath;
    }
  }

  return "";
}
