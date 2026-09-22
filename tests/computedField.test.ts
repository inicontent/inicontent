import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
	computedAffixesOf,
	computedExprOf,
	computedKeysOf,
	isComputedField,
	stripComputedKeys,
} from "../app/composables/computedField.ts";

const schema: Schema = [
	{ id: 1, key: "name", type: "string" },
	{ id: 2, key: "qty", type: "number" },
	{ id: 3, key: "price", type: "number" },
	{ id: 4, key: "total", type: "number", computed: "2 , 3" },
	{
		id: 5,
		key: "discounted",
		type: "number",
		computed: { expr: "2 , 3 / 100", ast: { kind: "bin" } },
		prefix: "$",
		suffix: " off",
	},
	{
		// Plain number field — affixes are independent decorations, not tied
		// to a computed expression.
		id: 6,
		key: "margin",
		type: "number",
		prefix: "±",
		suffix: " pts",
	},
];

test("isComputedField detects string and persisted spec forms", () => {
	assert.equal(isComputedField(schema[3]), true);
	assert.equal(isComputedField(schema[4]), true);
	assert.equal(isComputedField(schema[0]), false);
	assert.equal(isComputedField(undefined), false);
});

test("computedExprOf returns the raw expression from both forms", () => {
	assert.equal(computedExprOf(schema[3]), "2 , 3");
	assert.equal(computedExprOf(schema[4]), "2 , 3 / 100");
	assert.equal(computedExprOf(schema[0]), undefined);
});

test("computedKeysOf collects computed column keys", () => {
	const keys = computedKeysOf(schema);
	assert.deepEqual([...keys].sort(), ["discounted", "total"]);
	assert.equal(computedKeysOf(undefined).size, 0);
	assert.equal(computedKeysOf([]).size, 0);
});

test("computedAffixesOf returns the frontend-only display affixes", () => {
	assert.deepEqual(computedAffixesOf(schema[4]), {
		prefix: "$",
		suffix: " off",
	});
	// Plain number fields carry affixes too (Number ▸ Prefix / Suffix).
	assert.equal(isComputedField(schema[5]), false);
	assert.deepEqual(computedAffixesOf(schema[5]), {
		prefix: "±",
		suffix: " pts",
	});
	assert.deepEqual(computedAffixesOf(schema[3]), {});
	assert.deepEqual(computedAffixesOf(schema[0]), {});
	assert.deepEqual(computedAffixesOf(undefined), {});
});

test("stripComputedKeys removes computed values from a row", () => {
	const row = {
		id: "row-1",
		name: "widget",
		qty: 2,
		price: 3,
		total: 6,
		discounted: 0.06,
	};
	const stripped = stripComputedKeys(schema, row);
	assert.equal(stripped.id, "row-1");
	assert.equal(stripped.name, "widget");
	assert.equal(stripped.qty, 2);
	assert.equal(stripped.total, undefined);
	assert.equal(stripped.discounted, undefined);
	// Input row is never mutated by the strip.
	assert.equal(row.total, 6);
	assert.equal(row.discounted, 0.06);
});

test("stripComputedKeys returns the row untouched when no computed columns", () => {
	const plainSchema = schema.slice(0, 3);
	const row = { id: "row-2", name: "x", qty: 1, price: 2 };
	assert.equal(stripComputedKeys(plainSchema, row), row);
	assert.equal(stripComputedKeys(undefined, row), row);
});
