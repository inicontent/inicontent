import type { Schema as InibaseSchema } from "inibase";
import { flattenSchema as flattenInibaseSchema } from "inibase/utils";

/**
 * `flattenSchema` typed against the CMS `Schema` (and returning it).
 *
 * inibase's copy types `Field.type` as its closed `FieldType` union, while the
 * CMS widens it with editor-only widget types (`"select"`, `"page"`, …) that
 * inibase only ever reads as opaque strings. The two schemas are the same
 * runtime objects — `flattenSchema` just re-parents `children` — so the
 * mismatch is collapsed once here instead of at every call site, and callers
 * get the CMS-widened `Field[]` back, which is what the flattened data really
 * is (`label`, `options`, … survive the flattening).
 *
 * Use this instead of importing `flattenSchema` from `"inibase/utils"` when the
 * input is a CMS `Schema`.
 */
export function flattenSchema(schema: Schema, keepParents?: boolean): Schema {
	return flattenInibaseSchema(schema as InibaseSchema, keepParents);
}
