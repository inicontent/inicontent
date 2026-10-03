import { strict as assert } from "node:assert";
import { test } from "node:test";
import { convertArrayToObject } from "../app/composables/convertArrayToObject.ts";
import { convertObjectToArray } from "../app/composables/convertObjectToArray.ts";
import {
	type BlockRegistryEntry,
	mergeCustomBlocks,
} from "../app/composables/customBlockRegistry.ts";

// A stand-in for the built-in registry. `blockTypes.ts` itself can't be loaded
// here: it statically imports the block list through the `#inicontent/custom-blocks`
// alias, which only resolves inside a Nuxt build. The merge is factored out so
// it can be tested on its own.

const builtIns = {
	Hero: { total: 4, schema: [{ key: "heading", type: "string" }] },
	Footer: { total: 1, schema: [] },
} satisfies Record<string, BlockRegistryEntry>;

test("an empty custom list leaves the built-ins untouched", () => {
	const merged = mergeCustomBlocks(builtIns);
	assert.deepEqual(Object.keys(merged).sort(), ["Footer", "Hero"]);
	assert.equal(merged.Hero.total, 4);
	// The point of the whole feature: built-ins must not gain a `custom` key,
	// or the renderer would try to render them from a template.
	assert.equal(merged.Hero.custom, undefined);
});

test("omitting the custom list is the same as passing an empty one", () => {
	assert.deepEqual(
		mergeCustomBlocks(builtIns),
		mergeCustomBlocks(builtIns, []),
	);
});

test("a custom block is added with its definition attached", () => {
	const block = {
		type: "Promo",
		schema: [{ key: "heading", type: "string" }],
		file: "<p>{{ heading }}</p>",
	};
	const merged = mergeCustomBlocks(builtIns, [block]);
	assert.equal(merged.Promo.total, 1); // defaults to a single design
	assert.deepEqual(merged.Promo.schema, block.schema);
	// `custom` is what Block/index.vue dispatches on.
	assert.equal(merged.Promo.custom, block);
});

test("a custom block may declare several designs", () => {
	const merged = mergeCustomBlocks(builtIns, [
		{ type: "Promo", total: 3, schema: [], template: "" },
	]);
	assert.equal(merged.Promo.total, 3);
});

test("custom blocks do not disturb the built-in entries", () => {
	const merged = mergeCustomBlocks(builtIns, [{ type: "Promo", schema: [] }]);
	assert.equal(merged.Hero.total, 4);
	assert.deepEqual(merged.Hero.schema, builtIns.Hero.schema);
});

test("a custom block shadowing a built-in throws", () => {
	// The renderer dispatches built-ins through an explicit `block === "Hero"`
	// chain, so a shadowed type would save happily and then render as nothing.
	assert.throws(
		() => mergeCustomBlocks(builtIns, [{ type: "Hero", schema: [] }]),
		/shadows a built-in block type/,
	);
});

test("a custom block without a type throws", () => {
	assert.throws(
		() => mergeCustomBlocks(builtIns, [{ schema: [] } as CustomBlock]),
		/has no `type`/,
	);
});

test("two custom blocks with the same type throws", () => {
	assert.throws(
		() =>
			mergeCustomBlocks(builtIns, [
				{ type: "Promo", schema: [] },
				{ type: "Promo", schema: [] },
			]),
		/shadows a built-in block type/,
	);
});

// A custom block reuses the built-ins' positional-array storage because its
// `schema` is the same vocabulary — which is why it needs no bespoke save path.
// Note `table: "assets"` (not `type: "asset"`): that is the field flag
// `convertObjectToArray`/`convertArrayToObject` branch on to collapse an asset
// to its URL string on the way into storage and rehydrate `{ publicURL }` on the
// way out.

const promoSchema = [
	{ key: "heading", type: "string" },
	{ key: "body", type: "string", subType: "textarea" },
	{ key: "image", type: "asset", table: "assets" },
] as unknown as Schema;

test("a custom block config round-trips through positional storage", () => {
	const config = {
		heading: "Hello",
		body: "<p>World</p>",
		image: { publicURL: "https://cdn.test/a.png" },
	};
	const stored = convertObjectToArray(config, promoSchema);
	// Stored positionally, with the asset collapsed to its URL string.
	assert.deepEqual(stored, ["Hello", "<p>World</p>", "https://cdn.test/a.png"]);
	assert.deepEqual(convertArrayToObject(stored as any[], promoSchema), config);
});

test("a custom block config survives unset fields", () => {
	// Unset fields become `undefined` slots, which `convertArrayToObject` skips —
	// so the key is absent from the config and block defaults still apply.
	const stored = convertObjectToArray({ heading: "Only" }, promoSchema);
	assert.deepEqual(stored, ["Only", undefined, undefined]);
	assert.deepEqual(convertArrayToObject(stored as any[], promoSchema), {
		heading: "Only",
	});
});
