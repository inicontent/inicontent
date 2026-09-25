import { strict as assert } from "node:assert";
import { test } from "node:test";
import { nextOfflineMutation } from "../app/composables/offlineOrder.ts";
import {
	mapOfflineReferences,
	replaceTemporaryReference,
	resolveOfflineReference,
} from "../app/composables/offlineReferences.ts";

const mutation = (
	id: string,
	timestamp: number,
	body = {},
	status = "pending",
) => ({
	id,
	timestamp,
	body,
	status,
	database: "db",
	url: "https://example.test/db/items",
});

test("FIFO holds while only dependencies of the oldest item move ahead", () => {
	const parent = mutation("parent", 1, { author: "pending__child" });
	const unrelated = mutation("unrelated", 2);
	const child = mutation("child", 3);
	assert.equal(nextOfflineMutation([child, unrelated, parent]), child);
	assert.equal(
		nextOfflineMutation([unrelated, { ...parent, body: { author: "123" } }])
			?.id,
		"parent",
	);
});
test("a persisted blocked dependency pins the entire queue after reload", () => {
	const queue = [
		mutation("parent", 1),
		mutation("failed", 3, {}, "conflict"),
		mutation("later", 4),
	];
	assert.equal(
		nextOfflineMutation(JSON.parse(JSON.stringify(queue)))?.id,
		"failed",
	);
	queue.splice(1, 1);
	assert.equal(nextOfflineMutation(queue)?.id, "parent");
});
test("missing dependencies and cycles stop ordering", () => {
	assert.throws(
		() => nextOfflineMutation([mutation("a", 1, { x: "pending__missing" })]),
		/offlineMissingDependency/,
	);
	assert.throws(
		() =>
			nextOfflineMutation([
				mutation("a", 1, { x: "pending__b" }),
				mutation("b", 2, { x: "pending__a" }),
			]),
		/offlineDependencyCycle/,
	);
});
test("nested table arrays resolve without touching ordinary text", async () => {
	const body = { text: "Alice", rows: [{ refs: ["Alice", { id: "42" }] }] };
	const schema = [
		{
			key: "rows",
			type: "array",
			children: [{ key: "refs", type: ["array", "table"] }],
		},
	];
	assert.deepEqual(
		await mapOfflineReferences(body, schema, async (value) => value.id ?? "43"),
		{ text: "Alice", rows: [{ refs: ["43", "42"] }] },
	);
	assert.deepEqual(body.rows[0].refs, ["Alice", { id: "42" }]);
});
test("raw ids bypass search; text uses configured searchable columns", async () => {
	const noSearch = async () => {
		throw new Error("unexpected search");
	};
	assert.equal(
		await resolveOfflineReference("123", {}, {}, noSearch, () => ""),
		"123",
	);
	let where = "";
	const result = await resolveOfflineReference(
		"Alice",
		{ searchIn: ["name"] },
		{},
		async (query) => {
			where = query;
			return { result: [{ id: "123" }] };
		},
		() => "",
	);
	assert.equal(result, "123");
	assert.match(where, /name/);
	assert.match(where, /Alice/);
});
test("unsearchable, absent, ambiguous and paginated matches block sync", async () => {
	const resolve = (field: any, response: any) =>
		resolveOfflineReference(
			"Alice",
			field,
			{},
			async () => response,
			() => "name",
		);
	await assert.rejects(resolve({}, {}), /offlineNoSearchColumns/);
	await assert.rejects(
		resolve({ searchIn: ["name"] }, { result: [] }),
		/offlineReferenceNotFound/,
	);
	await assert.rejects(
		resolve({ searchIn: ["name"] }, { result: [{ id: "1" }, { id: "2" }] }),
		/offlinePickManually/,
	);
	await assert.rejects(
		resolve(
			{ searchIn: ["name"] },
			{ result: [{ id: "1" }], options: { totalPages: 2 } },
		),
		/offlinePickManually/,
	);
});
test("temporary ids substitute exactly throughout nested parent bodies", () => {
	const body = {
		refs: ["pending__a", { id: "pending__a" }],
		text: "prefix pending__a",
	};
	assert.deepEqual(replaceTemporaryReference(body, "pending__a", "123"), {
		refs: ["123", { id: "123" }],
		text: "prefix pending__a",
	});
});

test("array references collect all matching ids across pages", async () => {
	const pages: number[] = [];
	const result = await resolveOfflineReference(
		"Alice",
		{ isArray: true, searchIn: ["name"] },
		{},
		async (_where, page) => {
			pages.push(page!);
			return { result: [{ id: String(page) }], options: { totalPages: 2 } };
		},
		() => "name",
	);
	assert.deepEqual(result, ["1", "2"]);
	assert.deepEqual(pages, [1, 2]);
});
