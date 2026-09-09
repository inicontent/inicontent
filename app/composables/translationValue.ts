import { isObject } from "inibase/utils";
import Inison from "inison";

// Matches the translatable field rules used by the translation drawer
// (app/components/Table/TranslateDrawer.vue).
const NOT_TRANSLATABLE = new Set([
	"password",
	"email",
	"color",
	"icon",
	"link",
	"role",
]);
const TRANSLATABLE_TYPES = new Set(["string", "text", "textarea", "html"]);
const EXTRA_TRANSLATABLE = new Set([
	"url",
	"table",
	"asset",
	"array-table",
	"array-asset",
]);

/** Resolve the effective type of a field (subType wins, first type for unions). */
export function fieldTypeOf(field: Field): string {
	const type = Array.isArray(field.type) ? field.type[0] : field.type;
	return (field.subType ?? type) as string;
}

/** True when the field value is an array (repeater, tags, multi-select, array refs…). */
export function isArrayLikeField(field: Field): boolean {
	const type = Array.isArray(field.type) ? field.type[0] : field.type;
	const resolved = fieldTypeOf(field);
	return (
		field.isArray === true ||
		type === "array" ||
		resolved === "array-table" ||
		resolved === "array-asset" ||
		(type === "multiple" && field.subType !== "select")
	);
}

/** True for table/asset references (single or array). */
export function isReferenceField(field: Field): boolean {
	const resolved = fieldTypeOf(field);
	return (
		["table", "asset", "array-table", "array-asset"].includes(resolved) ||
		field.table === "assets"
	);
}

/** True for array reference fields (array refs / asset folders). */
export function isReferenceArrayField(field: Field): boolean {
	return isArrayLikeField(field) && !!field.table;
}

/** Whether a field should be translated at all (mirrors the drawer rules). */
export function isTranslatableField(field: Field): boolean {
	const resolved = fieldTypeOf(field);
	if (NOT_TRANSLATABLE.has(resolved)) return false;
	if (["ids", "id"].includes(field.key)) return false;
	if (TRANSLATABLE_TYPES.has(resolved)) return true;
	if (EXTRA_TRANSLATABLE.has(resolved)) return true;
	return isArrayLikeField(field);
}

/** True when the value should be treated as "no translation". */
export function isEmptyTranslationValue(value: unknown): boolean {
	if (value === undefined || value === null) return true;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	return false;
}

/** Extract the id from a reference value (object → id, otherwise the scalar). */
export function extractReferenceId(value: unknown): string {
	if (value === undefined || value === null) return "";
	if (isObject(value) && !Array.isArray(value)) {
		const id = (value as Item).id;
		return id === undefined || id === null ? "" : String(id);
	}
	return String(value);
}

/**
 * Serialize a draft value into the string stored on the translations table:
 * - table/asset references are stored as their id / array of ids
 * - arrays (and objects) are stored with Inison
 * - scalars are stored as-is
 */
export function normalizeTranslationValue(
	field: Field,
	value: unknown,
): string {
	if (isEmptyTranslationValue(value)) return "";

	// Reference arrays (array refs / asset folders) → Inison list of ids.
	if (isReferenceArrayField(field)) {
		const ids = (Array.isArray(value) ? value : [value])
			.map((entry) => extractReferenceId(entry))
			.filter((id) => id.length > 0);
		return Inison.stringify(ids);
	}

	// Single table/asset reference → its id.
	if (isReferenceField(field)) {
		return extractReferenceId(value);
	}

	if (Array.isArray(value)) return Inison.stringify(value);
	if (isObject(value)) return Inison.stringify(value);
	return String(value);
}

function tryParseStored(value: string): unknown {
	const trimmed = value.trim();
	if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
		try {
			return JSON.parse(trimmed);
		} catch {
			// fall through to Inison
		}
		try {
			return Inison.unstringify(trimmed);
		} catch {
			return trimmed;
		}
	}
	return trimmed;
}

/** Reduce a stored reference value (plain id, legacy object/array, …) to its id string. */
function resolveReferenceId(value: string): string {
	const trimmed = value.trim();
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
		const parsed = tryParseStored(trimmed);
		if (Array.isArray(parsed))
			return parsed.length ? extractReferenceId(parsed[0]) : "";
		return extractReferenceId(parsed);
	}
	return extractReferenceId(trimmed);
}

/**
 * Convert a stored translation string back into the typed value expected by the
 * field component (id string(s), array, or scalar string).
 */
export function parseTranslationValue(
	field: Field | undefined,
	stored: string | undefined | null,
): unknown {
	if (stored === undefined || stored === null || stored === "") {
		return field && isArrayLikeField(field) ? [] : "";
	}
	const value = stored.trim();

	// Array-like fields (array refs, tags, multi-select, repeaters, …)
	if (field && isArrayLikeField(field)) {
		const parsed = tryParseStored(value);
		return Array.isArray(parsed) ? parsed : [parsed];
	}

	// Single reference field: the drawer stores plain ids; legacy records can
	// hold a serialized object — reduce either form to the id string.
	if (field && isReferenceField(field)) {
		return resolveReferenceId(value);
	}

	return stored;
}
