import { isArrayOfObjects } from "inibase/utils";
import Inison from "inison";
import { copyToClipboard, randomID } from "~/composables";

/**
 * Shared clipboard for the table-schema editor.
 *
 * Schema fields are stored on the *system* clipboard (not a module ref) so they
 * can be copied in one table/browser tab and pasted into another. The clipboard
 * value is tagged so it won't collide with normal data item copy/paste.
 */
const CLIPBOARD_TAG = "INISON_SCHEMA_FIELDS";

// Returns a plain, VNode-free copy of a field that is safe to serialize.
function copyableField(field: Field): Record<string, unknown> {
	const { render, onCreate, onDelete, children, ...rest } = field;
	const cleaned = rest as Record<string, unknown>;
	if (children === undefined) return cleaned;
	if (isArrayOfObjects(children))
		return {
			...cleaned,
			children: children.map((child) => copyableField(child)),
		};
	return { ...cleaned, children };
}

/**
 * Writes the given fields to the system clipboard so they can be pasted into
 * another schema editor (including a different table or browser tab).
 */
export async function copySchemaFields(fields: Field[]) {
	const payload = Inison.stringify(fields.map((field) => copyableField(field)));
	await copyToClipboard(`${CLIPBOARD_TAG}:${payload}`);
}

// Deep-clones a copied field and regenerates id (and recursive children ids) so
// pasting does not collide with existing fields.
function cloneFieldWithNewIds(field: Field): Field {
	const clone = { ...field };
	clone.id = `temp-${randomID()}`;
	if (isArrayOfObjects(clone.children)) {
		clone.children = clone.children.map((child) =>
			cloneFieldWithNewIds(child as Field),
		);
	}
	return clone;
}

function isFieldLike(value: unknown): boolean {
	return (
		!!value &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		"type" in (value as object) &&
		"key" in (value as object)
	);
}

/**
 * Reads the system clipboard and returns the copied schema fields, or an empty
 * array when the clipboard doesn't contain schema fields.
 */
export async function readSchemaFieldsFromClipboard(): Promise<Field[]> {
	try {
		const raw = await navigator.clipboard.readText();
		if (!raw?.startsWith(CLIPBOARD_TAG)) return [];
		const payload = raw.slice(CLIPBOARD_TAG.length + 1);
		if (!payload) return [];
		const data = Inison.unstringify<unknown>(payload);
		if (!Array.isArray(data)) return [];
		return data.filter(
			(item): item is Field =>
				isFieldLike(item) &&
				!["id", "createdAt", "updatedAt"].includes(String((item as Field).key)),
		);
	} catch {
		return [];
	}
}

/**
 * Reads the clipboard and inserts the copied fields into `schema` right before
 * `targetIndex`. Returns the newly inserted fields (with fresh temp ids).
 */
export async function pasteSchemaFields(
	schema: Schema,
	targetIndex: number,
): Promise<Field[]> {
	const fields = await readSchemaFieldsFromClipboard();
	const inserted = fields.map((field) => cloneFieldWithNewIds(field));
	if (!inserted.length) return [];
	const index = Math.max(0, Math.min(targetIndex, schema.length));
	schema.splice(index, 0, ...inserted);
	return inserted;
}
