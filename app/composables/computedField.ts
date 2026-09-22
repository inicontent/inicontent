/** Persisted form of a computed expression, as written back by Inibase on
 *  schema change: the raw `expr` plus the compiled, id-based `ast`. */
export type ComputedFieldSpec = {
	expr: string;
	ast: unknown;
};

/** True when the field is a computed column (raw string or persisted spec). */
export function isComputedField(field: Field | undefined | null): boolean {
	return typeof field?.computed !== "undefined";
}

/** Extract the raw expression from a field's `computed` property (string or
 *  the persisted `{ expr, ast }` spec returned by the API). */
export function computedExprOf(
	field: Field | undefined | null,
): string | undefined {
	const computed = field?.computed as string | ComputedFieldSpec | undefined;
	if (typeof computed === "string") return computed;
	return computed?.expr;
}

/** Keys of every computed column in a schema (top-level only in v1). */
export function computedKeysOf(schema: Schema | undefined | null): Set<string> {
	if (!schema?.length) return new Set();
	return new Set(schema.filter(isComputedField).map(({ key }) => key));
}

/** Frontend-only display affixes for a computed column.
 *
 * The engine never sees these — they only decorate the rendered value
 * (`sum(...)` still computes a bare number). They are stored on the field
 * alongside the expression so the decoration survives schema round-trips. */
export function computedAffixesOf(field: Field | undefined | null): {
	prefix?: string;
	suffix?: string;
} {
	const affixes: { prefix?: string; suffix?: string } = {};
	if (!field) return affixes;
	if (field.prefix !== undefined) affixes.prefix = field.prefix;
	if (field.suffix !== undefined) affixes.suffix = field.suffix;
	return affixes;
}

/** Return a copy of `row` without computed keys.
 *
 * Computed columns are derived by the engine at write time — sending their
 * stored values back on POST/PUT is rejected with `COMPUTED_FIELD_SETTABLE`.
 * The input row is never mutated; when there are no computed keys the row is
 * returned as-is. */
export function stripComputedKeys<T extends Record<string, unknown>>(
	schema: Schema | undefined | null,
	row: T,
): T {
	const keys = computedKeysOf(schema);
	if (!keys.size) return row;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(row))
		if (!keys.has(key)) out[key] = value;
	return out as T;
}
