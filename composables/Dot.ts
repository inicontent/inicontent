import { isNumber, isObject } from "inibase/utils";
/**
 * Regex to test if a string is a valid array index key.
 */
const indexer: RegExp = /^[0-9]+$/;

/**
 * Disallowed keys.
 */
const disallowed: string[] = ["__proto__", "prototype", "constructor"];

/**
 * Get object property value.
 *
 * @param obj Object to get value from.
 * @param path Dot notation string.
 * @param value Optional default value to return if path is not found.
 */
export function getProperty(obj: any, path: string, value?: any): any {
  const defaultValue: any = value !== undefined ? value : undefined;

  const parts: string[] = getParts(path);

  if (parts.length === 0) return;

  for (const key of parts) {
    if (key === "*") continue;

    if (Array.isArray(obj) && !indexer.test(key)) obj = extractArray(obj, key);
    else obj = obj[key];

    if (obj === undefined || obj === null) break;
  }

  return obj === undefined ? defaultValue : obj;
}

/**
 * Set object property value.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 * @param value Value to set at path.
 */
export function setProperty(obj: any, path: string, value: any): void {
  const parts: string[] = getParts(path);

  if (parts.length === 0) return;

  const len: number = parts.length;

  for (let i: number = 0; i < len; i++) {
    const key: string = parts[i];

    // last part in path
    if (i === len - 1) {
      (obj as any)[key] = value;
      return;
    }

    if (key === "*" && Array.isArray(obj)) {
      const remaining: string = parts.slice(i + 1).join(".");

      // recurse to array objects
      for (const item of obj) setProperty(item, remaining, value);

      return;
    }

    if (obj[key] === undefined) obj[key] = {};

    obj = obj[key];
  }
}

/**
 * Check if object has property value.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 */
export function hasProperty(obj: object, path: string): boolean {
  const value: any = getProperty(obj, path);
  return value !== undefined;
}

/**
 * Delete a property from an object.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 */
export function deleteProperty(obj: any, path: string): void {
  const parts: string[] = getParts(path);

  if (parts.length === 0) return;

  const len: number = parts.length;

  for (let i: number = 0; i < len; i++) {
    const key: string = parts[i];

    // last part in path
    if (i === len - 1) {
      if (isNumber(key)) obj.splice(Number(key), 1);
      else delete obj[key];
      return;
    }

    // todo (jbl): support wildcard [*]

    obj = obj[key];
  }
}

/**
 * Get all dot notations paths from an object.
 *
 * @param obj Object to get paths for.
 */
export function paths(obj: object): string[] {
  return _paths(obj, []);
}

/**
 * Split a dot notation string into parts.
 *
 * Examples:
 * - `obj.value` => `['obj', 'value']`
 * - `obj.ary[0].value` => `['obj', 'ary', '0', 'value']`
 * - `obj.ary[*].value` => `['obj', 'ary', 'value']`
 *
 * @param path Dot notation string.
 */
function getParts(path: string): string[] {
  const parts: string[] = path
    .split(/[.]|(?:\[(\d|\*)\])/)
    .filter((item) => !!item);

  if (parts.some((x) => disallowed.indexOf(x) !== -1)) return [];

  return parts;
}

/**
 * Internal recursive method to navigate assemble possible paths.
 *
 * @param obj Object to get paths for.
 * @param lead Array of leading parts for the current iteration.
 */
function _paths(obj: any, lead: string[]): string[] {
  let output: string[] = [];

  for (const key in obj) {
    if (obj[key] === undefined) continue;
    else if (
      typeof obj[key] === "object" &&
      Object.prototype.toString.call(obj[key]) === "[object Object]"
    ) {
      // recurse to child object
      lead.push(key);
      output = output.concat(_paths(obj[key], lead));

      // reset path lead for next object
      lead.pop();
    } else {
      const path: string = lead.length ? `${lead.join(".")}.${key}` : key;
      output.push(path);
    }
  }

  return output;
}

const extractArray = (arr: any[], key: string): any => {
  return arr.map((item) => {
    if (item === undefined || item === null) return item as null | undefined;
    else if (Array.isArray(item)) return extractArray(item, key);
    else return item[key];
  });
};
