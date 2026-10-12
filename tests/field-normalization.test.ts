import { strict as assert } from "node:assert";
import { test } from "node:test";
import { normalizeBooleanField } from "../app/composables/fieldNormalization.ts";

test("an ordinary boolean field still normalizes unset to false", () => {
	assert.equal(normalizeBooleanField(undefined, false), false);
	assert.equal(normalizeBooleanField(null, false), false);
	assert.equal(normalizeBooleanField(true, false), true);
	assert.equal(normalizeBooleanField(false, false), false);
});

test("a preserveUnset boolean field keeps undefined as a third state (C1)", () => {
	assert.equal(normalizeBooleanField(undefined, true), undefined);
	assert.equal(normalizeBooleanField(null, true), undefined);
	assert.equal(normalizeBooleanField(true, true), true);
	assert.equal(normalizeBooleanField(false, true), false);
});

test("saving an unrelated setting never classifies an unclassified database as non-PHI", () => {
	// Simulate the Settings form: a database with no `phi` flag, `preserveUnset`
	// on. Rendering the field must not write `false` into the bound model.
	const databaseCopy: { phi?: boolean } = {};
	const rendered = normalizeBooleanField(databaseCopy.phi, true);
	if (rendered !== databaseCopy.phi) databaseCopy.phi = rendered;

	assert.equal(databaseCopy.phi, undefined);
	// The PUT body is a JSON round-trip of the form model, so an unclassified
	// database sends no `phi` key at all and the server preserves it.
	const body = JSON.parse(JSON.stringify(databaseCopy));
	assert.equal("phi" in body, false);
});

test("an explicit classification survives an unrelated save", () => {
	// A database already classified non-PHI: the loaded `false` is retained and
	// an unrelated save round-trips it unchanged.
	const databaseCopy: { phi?: boolean } = { phi: false };
	const rendered = normalizeBooleanField(databaseCopy.phi, true);
	if (rendered !== databaseCopy.phi) databaseCopy.phi = rendered;
	assert.equal(databaseCopy.phi, false);
	assert.equal("phi" in JSON.parse(JSON.stringify(databaseCopy)), true);

	// A PHI database keeps `true` for the same reason.
	const phiDatabaseCopy: { phi?: boolean } = { phi: true };
	assert.equal(normalizeBooleanField(phiDatabaseCopy.phi, true), true);
});
