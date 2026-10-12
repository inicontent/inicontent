/**
 * Normalize the value of a boolean form field before the form renders.
 *
 * Naive's `NSwitch` and the schema validator both want a concrete `boolean`, so
 * a boolean field normally coerces an unset value to `false`. Some fields carry
 * a meaningful third state, though: the PHI classification (C1) uses
 * `undefined` for *unclassified*, which must stay disabled and must survive an
 * unrelated settings save. Those fields set `preserveUnset` in their schema.
 *
 * Pure, so it can be unit-tested without mounting a component.
 */
export function normalizeBooleanField(
	value: boolean | null | undefined,
	preserveUnset: boolean,
): boolean | undefined {
	if (value === true || value === false) return value;
	return preserveUnset ? undefined : false;
}
