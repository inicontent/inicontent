import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
	buildComputedPlan,
	buildFieldIndex,
	evaluateComputedRow,
	resolveFramePath,
} from "../app/composables/computedEval.ts";

/** Build a compiled AST for a literal (no field references). */
const num = (value: number) => ({ kind: "num" as const, value });
/** Build a compiled AST path node for one field id. */
const path = (ids: number[], arrayFieldId: number | null = null) => ({
	kind: "path" as const,
	ids,
	arrayFieldId,
});
const bin = (op: any, left: any, right: any) => ({
	kind: "bin" as const,
	op,
	left,
	right,
});
const fn = (name: any, arrayFieldId: number, arg: any) => ({
	kind: "fn" as const,
	name,
	arrayFieldId,
	arg,
});

const orders: Schema = [
	{ id: 1, key: "status", type: "string" },
	{
		id: 2,
		key: "items",
		type: "array",
		children: [
			{ id: 3, key: "product", type: "table", table: "products" },
			{ id: 4, key: "quantity", type: "number" },
			{
				id: 5,
				key: "lineTotal",
				type: "number",
				computed: { expr: "4 * 3.2", ast: bin("mul", path([4]), path([3, 2])) },
			},
		],
	},
	{
		id: 6,
		key: "total",
		type: "number",
		computed: { expr: "sum(5)", ast: fn("sum", 2, path([5], 2)) },
	},
];

const products: Schema = [
	{ id: 1, key: "name", type: "string" },
	{ id: 2, key: "price", type: "number" },
];

const evaluate = (
	schema: Schema,
	row: Record<string, any>,
	extra: Record<string, any> = {},
) => evaluateComputedRow(schema, row, { table: "orders", ...extra });

test("resolveFramePath walks dotted paths and bails on arrays", () => {
	const row = { items: [{ quantity: 2 }] };
	assert.equal(resolveFramePath(row, "items.quantity"), undefined);
	assert.equal(resolveFramePath({ meta: { age: 3 } }, "meta.age"), 3);
	assert.equal(
		resolveFramePath({ meta: { age: 3 } }, "meta.age.deep"),
		undefined,
	);
	assert.equal(resolveFramePath(null as any, "a"), undefined);
});

test("buildFieldIndex resolves dotted keys and the array ancestor", () => {
	const index = buildFieldIndex(orders);
	assert.equal(index.get(4)?.key, "items.quantity");
	assert.equal(index.get(4)?.arrayAncestor?.key, "items");
	// A computed child is scoped to the array; a top-level column is not.
	assert.equal(index.get(5)?.key, "items.lineTotal");
	assert.equal(index.get(5)?.arrayAncestor?.key, "items");
	assert.equal(index.get(6)?.key, "total");
	assert.equal(index.get(6)?.arrayAncestor, null);
});

test("buildComputedPlan skips raw (uncompiled) expressions", () => {
	const schema: Schema = [
		{ id: 1, key: "a", type: "number" },
		// Typed into the schema editor but never saved — no AST to evaluate.
		{ id: 2, key: "b", type: "number", computed: "1 + 1" },
	];
	assert.equal(buildComputedPlan(schema), null);

	const compiled: Schema = [
		{ id: 1, key: "a", type: "number" },
		{
			id: 2,
			key: "b",
			type: "number",
			computed: { expr: "1 + 1", ast: bin("add", path([1]), num(1)) },
		},
	];
	assert.equal(buildComputedPlan(compiled)?.fields.length, 1);
});

test("computed fields evaluate in dependency order", async () => {
	const schema: Schema = [
		{ id: 1, key: "qty", type: "number" },
		{ id: 2, key: "price", type: "number" },
		// `total` is declared BEFORE the `gross` it depends on, so ordering can
		// only come from the AST, never from declaration order.
		{
			id: 4,
			key: "total",
			type: "number",
			computed: { expr: "3 * 100", ast: bin("mul", path([3]), num(100)) },
		},
		{
			id: 3,
			key: "gross",
			type: "number",
			computed: { expr: "1 * 2", ast: bin("mul", path([1]), path([2])) },
		},
	];
	const out = await evaluate(schema, { qty: 4, price: 5 });
	// gross = qty * price = 20, then total = gross * 100 = 2000
	assert.equal(out.gross, 20);
	assert.equal(out.total, 2000);
});

test("CONTEXT §8.3 order total: sum(quantity × price) over every item", async () => {
	const schema: Schema = [
		{
			id: 1,
			key: "items",
			type: "array",
			children: [
				{ id: 2, key: "quantity", type: "number" },
				{ id: 3, key: "price", type: "number" },
			],
		},
		{
			id: 4,
			key: "total",
			type: "number",
			computed: {
				expr: "sum(2 * 3)",
				ast: fn("sum", 1, bin("mul", path([2], 1), path([3], 1))),
			},
		},
	];
	const out = await evaluate(schema, {
		items: [
			{ quantity: 2, price: 250 },
			{ quantity: 1, price: 100 },
		],
	});
	// (2 × 250) + (1 × 100) = 600
	assert.equal(out.total, 600);
});

test("aggregates: count is the element count, avg/min/max use values", async () => {
	const schema: Schema = [
		{
			id: 1,
			key: "items",
			type: "array",
			children: [{ id: 2, key: "price", type: "number" }],
		},
		{
			id: 3,
			key: "c",
			type: "number",
			computed: { expr: "count(2)", ast: fn("count", 1, path([2], 1)) },
		},
		{
			id: 4,
			key: "a",
			type: "number",
			computed: { expr: "avg(2)", ast: fn("avg", 1, path([2], 1)) },
		},
		{
			id: 5,
			key: "lo",
			type: "number",
			computed: { expr: "min(2)", ast: fn("min", 1, path([2], 1)) },
		},
		{
			id: 6,
			key: "hi",
			type: "number",
			computed: { expr: "max(2)", ast: fn("max", 1, path([2], 1)) },
		},
		{
			id: 7,
			key: "s",
			type: "number",
			computed: { expr: "sum(2)", ast: fn("sum", 1, path([2], 1)) },
		},
	];
	const out = await evaluate(schema, {
		items: [{ price: 10 }, { price: 20 }, { price: 30 }],
	});
	assert.equal(out.c, 3);
	assert.equal(out.s, 60);
	assert.equal(out.a, 20);
	assert.equal(out.lo, 10);
	assert.equal(out.hi, 30);
});

test("count counts elements even when they hold no usable value", async () => {
	const schema: Schema = [
		{
			id: 1,
			key: "items",
			type: "array",
			children: [{ id: 2, key: "p", type: "number" }],
		},
		{
			id: 3,
			key: "c",
			type: "number",
			computed: { expr: "count(2)", ast: fn("count", 1, path([2], 1)) },
		},
		{
			id: 4,
			key: "s",
			type: "number",
			computed: { expr: "sum(2)", ast: fn("sum", 1, path([2], 1)) },
		},
	];
	const out = await evaluate(schema, { items: [{ p: null }, {}, { p: 5 }] });
	assert.equal(out.c, 3);
	assert.equal(out.s, 5);
});

test("computed children evaluate per element and feed a top-level sum", async () => {
	const row = {
		items: [
			{ product: "p1", quantity: 2 },
			{ product: "p2", quantity: 1 },
		],
	};
	const out = await evaluate(orders, row, {
		getTableIndex: async (table: string) =>
			buildFieldIndex(table === "products" ? products : orders),
		resolveLinkedRow: async (_table: string, column: string, id: string) =>
			column === "price"
				? id === "p1"
					? { price: 250 }
					: { price: 100 }
				: null,
	});
	// lineTotal = quantity × product.price → [500, 100]; total = sum → 600
	assert.deepEqual(out["items.lineTotal"], [500, 100]);
	assert.equal(out.total, 600);
});

test("link hops resolve each distinct triple once and cache it", async () => {
	const seen: string[] = [];
	const row = {
		items: [
			{ product: "p1", quantity: 1 },
			{ product: "p1", quantity: 2 },
			{ product: "p2", quantity: 3 },
		],
	};
	await evaluate(orders, row, {
		getTableIndex: async (table: string) =>
			buildFieldIndex(table === "products" ? products : orders),
		resolveLinkedRow: async (_table: string, column: string, id: string) => {
			seen.push(`${column}:${id}`);
			return column === "price" ? { price: 10 } : null;
		},
	});
	// p1 appears twice but is fetched once (deduped per table+column).
	assert.deepEqual([...new Set(seen)].sort(), ["price:p1", "price:p2"]);
	assert.equal(seen.length, 2);
});

test("an already-embedded linked row needs no fetch", async () => {
	const row = { items: [{ product: { id: "p1", price: 250 }, quantity: 2 }] };
	let calls = 0;
	const out = await evaluate(orders, row, {
		getTableIndex: async (table: string) =>
			buildFieldIndex(table === "products" ? products : orders),
		resolveLinkedRow: async () => {
			calls++;
			return { price: 999 };
		},
	});
	assert.equal(calls, 0);
	assert.deepEqual(out["items.lineTotal"], [500]);
});

test("no decimals: 314 / 100 is a division, 3.14 is a link hop", async () => {
	const literal: Schema = [
		{
			id: 1,
			key: "v",
			type: "number",
			computed: { expr: "314 / 100", ast: bin("div", num(314), num(100)) },
		},
	];
	assert.equal((await evaluate(literal, {})).v, 3.14);
});

test("operator precedence: * / % bind tighter than + -", async () => {
	const schema: Schema = [
		{
			id: 1,
			key: "a",
			type: "number",
			computed: {
				expr: "2 * 3 + 4",
				ast: bin("add", bin("mul", num(2), num(3)), num(4)),
			},
		},
		{
			id: 2,
			key: "b",
			type: "number",
			computed: {
				expr: "2 * (3 + 4)",
				ast: bin("mul", num(2), bin("add", num(3), num(4))),
			},
		},
	];
	const out = await evaluate(schema, {});
	assert.equal(out.a, 10);
	assert.equal(out.b, 14);
});

test("division and modulo by zero raise an arithmetic error", async () => {
	const div: Schema = [
		{
			id: 1,
			key: "v",
			type: "number",
			computed: { expr: "1 / 0", ast: bin("div", num(1), num(0)) },
		},
	];
	await assert.rejects(
		() => evaluate(div, {}),
		(e: any) => e.code === "COMPUTED_FIELD_ARITHMETIC",
	);
});

test("a top-level null operand fails, but an element child reads it as 0", async () => {
	// Top level: missing operand → COMPUTED_FIELD_ARITHMETIC.
	const strict: Schema = [
		{ id: 1, key: "qty", type: "number" },
		{
			id: 2,
			key: "v",
			type: "number",
			computed: { expr: "1 + 1", ast: bin("add", path([1]), num(1)) },
		},
	];
	await assert.rejects(
		() => evaluate(strict, {}),
		(e: any) => e.code === "COMPUTED_FIELD_ARITHMETIC",
	);

	// Element child: the same missing operand yields 0 (CONTEXT §8.4).
	const lenient: Schema = [
		{
			id: 1,
			key: "items",
			type: "array",
			children: [
				{ id: 2, key: "quantity", type: "number" },
				{
					id: 3,
					key: "lineTotal",
					type: "number",
					computed: { expr: "2 * 2", ast: bin("mul", path([2]), num(2)) },
				},
			],
		},
	];
	const out = await evaluate(lenient, { items: [{ quantity: 3 }, {}] });
	assert.deepEqual(out["items.lineTotal"], [6, 0]);
});

test("a dangling link raises rather than silently yielding a wrong number", async () => {
	await assert.rejects(
		() =>
			evaluate(
				orders,
				{ items: [{ product: "gone", quantity: 1 }] },
				{
					getTableIndex: async (t: string) =>
						buildFieldIndex(t === "products" ? products : orders),
					resolveLinkedRow: async () => null,
				},
			),
		(e: any) => e.code === "COMPUTED_FIELD_DANGLING_LINK",
	);
});

test("a non-numeric operand raises an arithmetic error", async () => {
	const schema: Schema = [
		{ id: 1, key: "label", type: "string" },
		{
			id: 2,
			key: "v",
			type: "number",
			computed: { expr: "1 + 1", ast: bin("add", path([1]), num(1)) },
		},
	];
	await assert.rejects(
		() => evaluate(schema, { label: "abc" }),
		(e: any) => e.code === "COMPUTED_FIELD_ARITHMETIC",
	);
});

test("an empty array makes avg/min/max raise", async () => {
	const schema: Schema = [
		{
			id: 1,
			key: "items",
			type: "array",
			children: [{ id: 2, key: "p", type: "number" }],
		},
		{
			id: 3,
			key: "a",
			type: "number",
			computed: { expr: "avg(2)", ast: fn("avg", 1, path([2], 1)) },
		},
	];
	await assert.rejects(
		() => evaluate(schema, { items: [] }),
		(e: any) => e.code === "COMPUTED_FIELD_ARITHMETIC",
	);
	// sum over nothing is 0, not an error.
	const sum: Schema = [
		{
			id: 1,
			key: "items",
			type: "array",
			children: [{ id: 2, key: "p", type: "number" }],
		},
		{
			id: 3,
			key: "s",
			type: "number",
			computed: { expr: "sum(2)", ast: fn("sum", 1, path([2], 1)) },
		},
	];
	assert.equal((await evaluate(sum, { items: [] })).s, 0);
});

test("the input row is never mutated", async () => {
	const row = {
		items: [{ product: "p1", quantity: 2 }],
		total: 999,
	};
	const before = JSON.stringify(row);
	await evaluate(orders, row, {
		getTableIndex: async (t: string) =>
			buildFieldIndex(t === "products" ? products : orders),
		resolveLinkedRow: async () => ({ price: 250 }),
	});
	assert.equal(JSON.stringify(row), before);
	// The element object itself must be untouched too (no lineTotal written in).
	assert.equal("lineTotal" in row.items[0], false);
});
