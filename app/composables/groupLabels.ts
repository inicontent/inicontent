// Pure grouping logic for bar/pie widgets. Kept free of Nuxt auto-imports and
// `~` imports so `node --test` can load it directly (see
// tests/dashboard-grouping.test.ts), mirroring computedField.ts.

/** Label used for rows whose grouped value is null, undefined or an empty
 *  array — the pre-existing missing-value fallback, now also covering rows
 *  that simply have no relation entries. */
export const UNKNOWN_GROUP_LABEL = "unknown";

const TEXT_LABEL_TYPES = new Set(["string", "text", "number"]);

export type GroupLabelContext = {
	/** Schema definition of the grouped field (top-level, or the flattened
	 *  leaf for a dotted key). Drives relation (`table`) and inline-array
	 *  (`children`) element labelling. */
	fieldDef?: Field;
	/** All database tables, used to resolve a relation field's target table. */
	tables?: Table[];
	/** Item-label renderer (`renderLabel`), injected so this module stays free
	 *  of Nuxt auto-imports and importable under `node --test`. */
	renderLabel: (table: Table | undefined, item: Item) => string;
};

function findRefTable(
	ctx: GroupLabelContext,
	slug: unknown,
): Table | undefined {
	if (typeof slug !== "string") return undefined;
	return ctx.tables?.find((t) => t.slug === slug);
}

/** Label a related item — `renderLabel` applies the referenced table's label
 *  template and falls back to its first text field when there is none. */
function relationLabel(
	ctx: GroupLabelContext,
	slug: unknown,
	item: Item,
): string {
	return ctx.renderLabel(findRefTable(ctx, slug), item) || String(item);
}

/** Walk a dotted path (`quantity` inside `items.quantity`) from a row. */
function readPath(value: unknown, path: string[]): unknown {
	let current = value;
	for (const key of path) {
		if (typeof current !== "object" || current === null) return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

/** Collect the text-like fields of an inline array-of-objects `children`
 *  schema, depth-first, with their path from the row root. Mirrors
 *  `renderLabel`'s fallback rule (first string/text/number field wins). */
function textLikeFields(
	children: unknown,
	path: string[] = [],
): { path: string[]; field: Field }[] {
	if (!Array.isArray(children)) return [];
	const out: { path: string[]; field: Field }[] = [];
	for (const child of children) {
		if (typeof child !== "object" || child === null) continue;
		const field = child as Field;
		const types = Array.isArray(field.type) ? field.type : [field.type];
		if (types.some((t) => TEXT_LABEL_TYPES.has(String(t).toLowerCase()))) {
			out.push({ path: [...path, String(field.key)], field });
			continue;
		}
		if (Array.isArray(field.children)) {
			out.push(...textLikeFields(field.children, [...path, String(field.key)]));
		}
	}
	// Lowest field id first — same order `renderLabel`'s fallback uses. A
	// stable sort keeps the declaration order for fields without an id.
	out.sort(
		(a, b) =>
			Number(a.field.id ?? Number.MAX_SAFE_INTEGER) -
			Number(b.field.id ?? Number.MAX_SAFE_INTEGER),
	);
	return out;
}

/** Label one value of the grouped field. Returns `undefined` for empty slots
 *  (`null` array entries) so they don't create a slice. */
function labelOfLeaf(
	value: unknown,
	ctx: GroupLabelContext,
): string | undefined {
	if (value === null || value === undefined) return undefined;
	if (typeof value !== "object" || Array.isArray(value)) return String(value);

	const def = ctx.fieldDef;
	// Related table row → its item label.
	if (def?.table) return relationLabel(ctx, def.table, value as Item);

	// Inline array-of-objects row → the first text-like child's value. Walks
	// candidates in id order and skips empty/non-primitive values so a
	// relation-typed child never collapses into "[object Object]".
	const record = value as Record<string, unknown>;
	for (const { path } of textLikeFields(def?.children)) {
		const childValue = readPath(record, path);
		if (childValue === null || childValue === undefined) continue;
		if (typeof childValue === "object") continue;
		if (String(childValue).trim() === "") continue;
		return String(childValue);
	}
	return String(value);
}

/** Labels one row contributes to a bar/pie grouping. An array value yields
 *  one label per distinct element, so a row with several diagnostics counts
 *  in several slices; null/undefined/empty → the `unknown` label. Dotted
 *  keys (`items.quantity`) group by that value inside each array row. */
export function itemGroupLabels(
	item: Item,
	field: string,
	ctx: GroupLabelContext,
): string[] {
	const dot = field.indexOf(".");
	const rootKey = dot === -1 ? field : field.slice(0, dot);
	const path = dot === -1 ? [] : field.slice(dot + 1).split(".");
	const raw = item[rootKey];
	if (raw === null || raw === undefined) return [UNKNOWN_GROUP_LABEL];

	// A plain value is a one-element "rows" list, so scalars, single objects
	// and arrays all fall through the same labelling path.
	const rows = Array.isArray(raw) ? raw : [raw];
	const labels = new Set<string>();
	for (const row of rows) {
		const label = labelOfLeaf(readPath(row, path), ctx);
		if (label !== undefined) labels.add(label);
	}
	// Every element was an empty slot → still a row without a value.
	return labels.size ? Array.from(labels) : [UNKNOWN_GROUP_LABEL];
}

/** Group rows by a field's label(s), most frequent first — the payload shape
 *  `useDashboardData` exposes as `groups` for the bar and pie widgets. */
export function groupItemsByField(
	items: Item[],
	field: string,
	ctx: GroupLabelContext,
): { name: string; value: number }[] {
	const map = new Map<string, number>();
	for (const item of items) {
		for (const label of itemGroupLabels(item, field, ctx)) {
			map.set(label, (map.get(label) ?? 0) + 1);
		}
	}
	return Array.from(map.entries())
		.sort(([, a], [, b]) => b - a)
		.map(([name, value]) => ({ name, value }));
}

/** Max real slices/bars per widget size — everything past it is folded into
 *  one bucket, so a widget never renders more than `limit + 1` entries. */
export const GROUP_LIMITS: Record<WidgetSize, number> = {
	small: 5,
	medium: 7,
	large: 10,
};

/** Effective slice limit for a widget size; widgets without an explicit size
 *  default to `small`. */
export function groupLimitForSize(size?: WidgetSize): number {
	return GROUP_LIMITS[size ?? "small"] ?? GROUP_LIMITS.small;
}

/** Keep only the first `limit` groups (input must already be sorted, as
 *  `groupItemsByField` returns) and fold the remainder into a single
 *  `otherName` bucket, preserving the total so chart percentages stay
 *  truthful. Up to `limit + 1` groups pass through unchanged — they're no
 *  more crowded than limit + bucket, and nothing gets hidden. */
export function topGroups(
	groups: { name: string; value: number }[],
	limit: number,
	otherName: string,
): { name: string; value: number }[] {
	if (groups.length <= limit + 1) return groups;
	const top = groups.slice(0, limit);
	let rest = 0;
	for (const group of groups.slice(limit)) rest += group.value;
	return [...top, { name: otherName, value: rest }];
}
