import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	computePlacements,
	getSpan,
	isTall,
} from "../app/composables/dashboardLayout.ts";

function w(
	id: string,
	type: Widget["type"],
	size: Widget["size"] = "small",
): Widget {
	return { id, type, size };
}

test("span and tallness rules", () => {
	assert.equal(getSpan(w("a", "pie", "small")), 8);
	assert.equal(getSpan(w("a", "pie")), 8); // no size reads as small
	assert.equal(getSpan(w("a", "pie", "medium")), 16);
	assert.equal(getSpan(w("a", "pie", "large")), 24);
	assert.equal(isTall(w("a", "counter")), false);
	assert.equal(isTall(w("a", "table")), true);
	assert.equal(isTall(w("a", "line")), true);
});

// The real "Tableaux de bord" dashboard: three small charts and a large
// counter. Every tall used to be anchored at column 1 on its own fresh row,
// so the three charts stacked one per line instead of sharing one row.
test("three small talls share one line; the large counter wraps", () => {
	const p = computePlacements([
		w("p1", "pie", "small"),
		w("p2", "pie", "small"),
		w("l1", "line", "small"),
		w("c1", "counter", "large"),
	]);
	assert.deepEqual(p.p1, { colStart: 1, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.p2, { colStart: 9, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.l1, { colStart: 17, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.c1, { colStart: 1, rowStart: 2, colSpan: 24, rowSpan: 1 });
});

test("a fourth small wraps to the second line", () => {
	const p = computePlacements([
		w("a", "pie"),
		w("b", "pie"),
		w("c", "line"),
		w("d", "line"),
	]);
	assert.deepEqual(p.d, { colStart: 1, rowStart: 2, colSpan: 8, rowSpan: 1 });
});

test("a medium after two smalls wraps instead of overflowing the line", () => {
	const p = computePlacements([
		w("a", "pie"),
		w("b", "pie"),
		w("m", "table", "medium"),
	]);
	assert.deepEqual(p.m, { colStart: 1, rowStart: 2, colSpan: 16, rowSpan: 1 });
});

test("a tall with shorts after it stacks them beside it", () => {
	const p = computePlacements([
		w("t", "table", "medium"),
		w("s1", "counter"),
		w("s2", "counter"),
	]);
	assert.deepEqual(p.t, { colStart: 1, rowStart: 1, colSpan: 16, rowSpan: 2 });
	assert.deepEqual(p.s1, { colStart: 17, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.s2, { colStart: 17, rowStart: 2, colSpan: 8, rowSpan: 1 });
});

test("shorts before a tall stack in the tall's free column", () => {
	const p = computePlacements([
		w("s1", "counter"),
		w("s2", "counter"),
		w("t", "table", "medium"),
	]);
	assert.deepEqual(p.s1, { colStart: 1, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.s2, { colStart: 1, rowStart: 2, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.t, { colStart: 9, rowStart: 1, colSpan: 16, rowSpan: 2 });
});

test("shorts after flowed talls fill the rest of the line, then wrap", () => {
	const p = computePlacements([
		w("a", "pie"),
		w("b", "pie"),
		w("s1", "counter"),
		w("s2", "counter"),
	]);
	assert.deepEqual(p.a, { colStart: 1, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.b, { colStart: 9, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.s1, { colStart: 17, rowStart: 1, colSpan: 8, rowSpan: 1 });
	assert.deepEqual(p.s2, { colStart: 1, rowStart: 2, colSpan: 8, rowSpan: 1 });
});
