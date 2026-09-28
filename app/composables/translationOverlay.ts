// ─── Pure translation-overlay helpers (framework-free, unit-tested) ──────────
//
// Storage convention:
// - Page translations (localized slug + SEO fields) reuse the existing CMS
//   translation records: `{ table: pagesTableId, item: <pageId>, field: <pages
//   schema field id>, locale, original, translation }` — the API's generic
//   `applyLocaleOverlay` applies them on read.
// - Block `config` is a JSON column, so it cannot use per-field ids. Its
//   translations are stored in the same `translations` table but scoped to the
//   blocks table + block row with the `field = 0` sentinel and the dotted config
//   path (e.g. `heading`, `buttons.0.label`) in `original`. The API overlay
//   ignores them (no schema field has id 0, so `getPath` resolves none); the
//   render/app layer applies and saves them.
//
// Fallback rule: a path with no translation record (or a translation equal to
// the canonical value) renders the canonical value — field-by-field fallback.

/** `field` sentinel used by block-config translation records. */
export const BLOCK_CONFIG_OVERLAY_FIELD = 0;

/** Page fields the builder can localize (slug + SEO text). `seo.image` is
 * intentionally excluded: the API overlay breaks its `{publicURL}` shape. */
export const PAGE_TRANSLATABLE_PATHS = [
	"slug",
	"seo.title",
	"seo.description",
] as const;

export type PageFieldChange = { path: string; from?: string; to?: string };
export type ConfigChange = { path: string; from?: string; to?: string };

/** Keys that are structural data bindings, never visible text. */
const STRUCTURAL_CONFIG_KEYS = new Set([
	// Loop / Form / Product: the bound data table + column mappings.
	"table",
	"field",
	"linkSegments",
	// Sample rows shown in builder previews, not published copy.
	"demo",
]);

export function isStructuralConfigKey(key: string): boolean {
	if (STRUCTURAL_CONFIG_KEYS.has(key)) return true;
	// `imageField`, `titleField`, `priceField`, … (column id mappings ending
	// in "Field") or `productColumn`, `valueColumn`, … (ending in "Column").
	return key.endsWith("Field") || key.endsWith("Column");
}

/**
 * True when a builder schema field holds editable visible text that should be
 * translatable. Excludes structural choices (page links, selects, icons,
 * asset/table references, numbers, booleans, JSON and data bindings).
 */
export function isTranslatableConfigField(field: Field): boolean {
	if (isStructuralConfigKey(String(field.key))) return false;
	if (
		field.subType === "page" ||
		field.subType === "select" ||
		field.subType === "icon"
	)
		return false;
	if (field.subType === "json" || field.type === "json") return false;
	if (field.table === "assets") return false;
	if (field.type === "number" || field.type === "boolean") return false;
	if (field.type === "array" || field.type === "object") return true;
	return true; // string / text / textarea / html scalar leaves
}

/**
 * Deep-filter a block schema to only the fields whose leaves are visible text.
 * A container whose children contain no translatable leaf is dropped entirely
 * (e.g. a buttons array with only `label`/`link` keeps `label`, but an object
 * with only a page-link/select keeps nothing).
 */
export function translatableSchema(schema: Schema | undefined): Schema {
	if (!Array.isArray(schema)) return [];
	const out: Schema = [];
	for (const field of schema) {
		if (!isTranslatableConfigField(field)) continue;
		const clone: Field = { ...field };
		if (Array.isArray(field.children)) {
			const children = translatableSchema(field.children as Schema);
			if (!children.length) continue;
			clone.children = children as Field["children"];
		}
		out.push(clone);
	}
	return out;
}

/** Read a value at a dotted path (`seo.title`, `buttons.0.label`). */
export function getConfigValue(
	source: unknown,
	path: string | undefined,
): unknown {
	if (!source || !path) return undefined;
	let cursor: unknown = source;
	for (const segment of path.split(".")) {
		if (cursor === null || typeof cursor !== "object") return undefined;
		cursor = (cursor as Record<string, unknown>)[segment];
	}
	return cursor;
}

/** Write a value at a dotted path, creating missing objects/arrays. */
export function setConfigValue(
	target: unknown,
	path: string,
	value: unknown,
): void {
	if (!target || !path) return;
	const segments = path.split(".");
	let cursor = target as Record<string, unknown>;
	for (let index = 0; index < segments.length - 1; index++) {
		const segment = segments[index];
		const next = cursor[segment];
		if (next === null || typeof next !== "object") {
			const created: unknown = /^\d+$/.test(segments[index + 1]) ? [] : {};
			cursor[segment] = created;
			cursor = created as Record<string, unknown>;
		} else {
			cursor = next as Record<string, unknown>;
		}
	}
	cursor[segments[segments.length - 1]] = value;
}

/**
 * Collect the dotted paths of every string leaf value in a block config,
 * walking the block's schema. Keys whose value is not a present string (unset,
 * numbers, booleans, asset objects) are never collected.
 */
export function collectTranslatablePaths(
	config: unknown,
	schema?: Schema,
	basePath = "",
): string[] {
	const out: string[] = [];
	if (!schema || !config || typeof config !== "object" || Array.isArray(config))
		return out;
	const obj = config as Record<string, unknown>;
	for (const field of schema) {
		if (!isTranslatableConfigField(field)) continue;
		if (isStructuralConfigKey(String(field.key))) continue;
		const path = basePath ? `${basePath}.${field.key}` : field.key;
		const value = obj[field.key];
		const children = Array.isArray(field.children) ? field.children : undefined;

		if (field.type === "array") {
			if (!Array.isArray(value)) continue;
			value.forEach((entry, index) => {
				const entryPath = `${path}.${index}`;
				if (children) {
					if (entry && typeof entry === "object")
						out.push(...collectTranslatablePaths(entry, children, entryPath));
				} else if (typeof entry === "string") {
					out.push(entryPath);
				}
			});
			continue;
		}
		if (field.type === "object" && children) {
			if (value && typeof value === "object")
				out.push(...collectTranslatablePaths(value, children, path));
			continue;
		}
		if (typeof value === "string") out.push(path);
	}
	return out;
}

export type ConfigDiff = {
	path: string;
	from: string;
	to: string;
};

/**
 * Diff two block configs (canonical vs edited) over the block's schema, only
 * for translatable string leaves. `from`/`to` are the string values (empty
 * when the value is missing/not a string). Paths whose values did not change
 * are omitted.
 */
export function diffConfigs(
	from: unknown,
	to: unknown,
	schema?: Schema,
): ConfigDiff[] {
	return diffConfigsWithReset(from, to, schema, new Set());
}

/**
 * Diff two block configs like `diffConfigs`, but additionally flags every path
 * that currently has a translation record whose edited value now equals the
 * canonical value (`from === to`) — the caller deletes those records so the
 * field falls back to canonical. `existingPaths` is the set of translated paths.
 */
export function diffConfigsWithReset(
	from: unknown,
	to: unknown,
	schema: Schema | undefined,
	existingPaths: Iterable<string> | Set<string>,
): ConfigDiff[] {
	const paths = new Set<string>([
		...collectTranslatablePaths(from, schema),
		...collectTranslatablePaths(to, schema),
		...(existingPaths ? [...existingPaths] : []),
	]);
	const existing = new Set(existingPaths);
	const changes: ConfigDiff[] = [];
	for (const path of paths) {
		const fromValue = getConfigValue(from, path);
		const toValue = getConfigValue(to, path);
		const fromStr = typeof fromValue === "string" ? fromValue : "";
		const toStr = typeof toValue === "string" ? toValue : "";
		if (fromStr === toStr) {
			// Redundant record → delete so the field falls back to canonical.
			if (existing.has(path)) changes.push({ path, from: fromStr, to: toStr });
			continue;
		}
		changes.push({ path, from: fromStr, to: toStr });
	}
	return changes;
}

/**
 * Build a flat overlay object from per-path translation values.
 */
export function flattenOverlay(
	overlay: Map<string, { translation: string }> | undefined,
): Record<string, string> {
	const flat: Record<string, string> = {};
	if (!overlay) return flat;
	for (const [path, entry] of overlay) flat[path] = entry.translation;
	return flat;
}

/**
 * Merge a flat overlay (`{ path: translatedValue }`) onto an object without
 * mutating the source: translated paths win, everything else keeps the
 * canonical value (field-by-field fallback). Empty strings are ignored so a
 * cleared translation falls back to canonical.
 */
export function applyConfigOverlay<
	T extends Record<string, unknown> | undefined,
>(config: T, overlay: Record<string, string> | undefined): T {
	const entries = overlay
		? Object.entries(overlay).filter(([, v]) => v !== "")
		: [];
	if (!entries.length) return config;
	const merged = (config ? JSON.parse(JSON.stringify(config)) : {}) as Record<
		string,
		unknown
	>;
	for (const [path, value] of entries) setConfigValue(merged, path, value);
	return merged as T;
}

/**
 * Replace the static path segments of `sourceSegments` with a (possibly
 * localized) target slug pattern, preserving dynamic `[segment]` values from
 * their matching positions — e.g. `["articles", "my-post"]` +
 * `articulos/[slug]` → `articulos/my-post`.
 */
export function rebuildLocalizedSlug(
	sourceSegments: string[],
	targetSlug: string,
): string {
	const pattern = String(targetSlug ?? "")
		.split("/")
		.filter(Boolean);
	const source = (sourceSegments ?? []).filter(Boolean);
	return pattern
		.map((part, index) =>
			part.startsWith("[") && part.endsWith("]") ? (source[index] ?? "") : part,
		)
		.join("/");
}

/** Diff the translatable page fields of a canonical vs an edited page. */
export function diffPageFields(
	from?: Page | null,
	to?: Page | null,
): PageFieldChange[] {
	return diffPageFieldsWithReset(from, to, new Set());
}

/**
 * Diff the translatable page fields like `diffPageFields`, but additionally
 * flags existing-overlay paths whose edited value now equals the canonical
 * value (so the caller can delete the redundant record).
 */
export function diffPageFieldsWithReset(
	from: Page | null | undefined,
	to: Page | null | undefined,
	existingPaths: Iterable<string> | Set<string>,
): PageFieldChange[] {
	const existing = new Set(existingPaths);
	const changes: PageFieldChange[] = [];
	for (const path of PAGE_TRANSLATABLE_PATHS) {
		const fromValue = getConfigValue(from, path);
		const toValue = getConfigValue(to, path);
		const fromStr = typeof fromValue === "string" ? fromValue : "";
		const toStr = typeof toValue === "string" ? toValue : "";
		if (fromStr === toStr) {
			if (existing.has(path)) changes.push({ path, from: fromStr, to: toStr });
			continue;
		}
		changes.push({ path, from: fromStr, to: toStr });
	}
	return changes;
}

/** Find a schema field id by dotted path (`seo.title` → nested field id). */
export function fieldIdByPath(
	schema: Schema | undefined,
	path: string,
): number | undefined {
	if (!schema) return undefined;
	let current = schema;
	let found: number | undefined;
	for (const segment of path.split(".")) {
		const field = current.find((entry) => entry.key === segment);
		if (!field) return undefined;
		found = field.id as number | undefined;
		if (!Array.isArray(field.children)) break;
		current = field.children as Schema;
	}
	return found;
}

/**
 * Map every field id in a (possibly nested) schema to its dotted path, e.g.
 * the pages table schema → `slug`, `seo.title`, `seo.description`.
 */
export function collectFieldPathsById(
	schema: Schema,
	basePath = "",
): Map<string, string> {
	const map = new Map<string, string>();
	for (const field of schema) {
		const path = basePath ? `${basePath}.${field.key}` : field.key;
		if (field.id !== undefined && field.id !== null)
			map.set(String(field.id), path);
		if (Array.isArray(field.children))
			collectFieldPathsById(field.children as Schema, path).forEach(
				(nested, id) => {
					if (!map.has(id)) map.set(id, nested);
				},
			);
	}
	return map;
}
