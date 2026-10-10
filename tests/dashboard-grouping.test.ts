import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { GroupLabelContext } from "../app/composables/groupLabels.ts";
import {
	groupItemsByField,
	groupLimitForSize,
	itemGroupLabels,
	topGroups,
	UNKNOWN_GROUP_LABEL,
} from "../app/composables/groupLabels.ts";
import renderLabel from "../app/composables/renderLabel.ts";

// The referenced "diagnostics" table: `label: "@1"` points at `nom`, the same
// shape formatDatabase derives label columns from.
const diagnosticsTable: Table = {
	id: "t_diagnostics",
	slug: "diagnostics",
	label: "@1",
	schema: [
		{ id: 1, key: "nom", type: "string" },
		{ id: 2, key: "gravite", type: "string" },
	],
};

const diagnosticField: Field = {
	id: 2,
	key: "diagnostic",
	type: "array",
	table: "diagnostics",
};

const ctx: GroupLabelContext = {
	fieldDef: diagnosticField,
	tables: [diagnosticsTable],
	renderLabel,
};

// The real payload pasted from the patients table: 14 rows whose `diagnostic`
// relation holds 15 entries in total (one row has two).
const sampleRows: Item[] = [
	{
		id: "f01cb3a713e4c0dd2e5fb33f6f4ee4f2",
		diagnostic: [
			{
				id: "98b249298288fcda912cceccdf3b8de1",
				nom: "fracture de la malleole externe",
			},
		],
	},
	{
		id: "13d71fb6b573d178b56ae998c44cca39",
		diagnostic: [
			{ id: "b55560fbcbda8eb9fbc393710c6eb318", nom: "plaie de l'avant bras" },
		],
	},
	{
		id: "dd448666eaeca182de555be11efe5ba8",
		diagnostic: [{ id: "0a066ae67cb4e0cda3daaeaa4b95107a", nom: "PTG" }],
	},
	{
		id: "f7400dfe1489101fbd42f99c929cfb07",
		diagnostic: [
			{ id: "13d71fb6b573d178b56ae998c44cca39", nom: "masse du bras" },
		],
	},
	{
		id: "f1931fc559afaf26663915c3e623ada1",
		diagnostic: [
			{ id: "225e8eb62a856add59f5292a0c075e0e", nom: "pied diabétique" },
		],
	},
	{
		id: "a2cb05371be3fee89fc5467158e3c16c",
		diagnostic: [
			{
				id: "1f7cd962abcdb79d941055a6da81fae3",
				nom: "pseudarthrose du pilon tibial",
			},
		],
	},
	{
		id: "6661cd06190784c3abfb3c57f71c1c5f",
		diagnostic: [
			{ id: "210ef4544ccebecdf91af0eb3dc0fdc2", nom: "fracture du femur" },
		],
	},
	{
		id: "845e1a4182a71cd0e09fab8f03a316fc",
		diagnostic: [
			{
				id: "1eb6704a9ce63dd1b067fcb4b22bc956",
				nom: "fracture diaphyse femorale droit",
			},
		],
	},
	{
		id: "eff000bf9c25ddb55a4b94b20b27226d",
		diagnostic: [
			{
				id: "1854650a10777f1b9b611f50cee8c1d1",
				nom: "infection des parties molles",
			},
		],
	},
	{
		id: "afdfc5cf947493105ceb0d2b1ca288d3",
		diagnostic: [
			{
				id: "31335d9a0e764dc977ed68ab490cb751",
				nom: "fracture du plateau tibial",
			},
			{
				id: "411ee05a18a0096bfdf3aaa764597d6f",
				nom: "fracture du pilon tibial",
			},
		],
	},
	{
		id: "15f9a9fd6c9f9c3b6e124fbf4685dc22",
		diagnostic: [
			{
				id: "d0511c4fab59c79a7689dafb5f575e51",
				nom: "arthrose du genou",
				createdAt: 1774808184847,
			},
		],
	},
	{
		id: "05b45b1542c59e6822282d64a3ee3a47",
		diagnostic: [
			{ id: "f37dd1d7cd42a8938d98ab186b85d1fe", nom: "masse de l'avant-bras" },
		],
	},
	{
		id: "10e599964f1ea47017b87458ebe8eaaa",
		diagnostic: [
			{
				id: "7c7a08b505ee1cbdc4565543e0e79f7d",
				nom: "fracture du col femoral",
			},
		],
	},
	{
		id: "a754ebd7e1d05d9d95ea35f16735119e",
		diagnostic: [
			{ id: "ddcc732d998cf8d554e2df89f0dff733", nom: "fracture bimalleolaire" },
		],
	},
];

const plainCtx = { renderLabel };

test("groups sample rows by related diagnostic labels", () => {
	const groups = groupItemsByField(sampleRows, "diagnostic", ctx);

	// 14 rows, 15 diagnostic entries, all distinct labels.
	assert.equal(groups.length, 15);
	assert.equal(
		groups.reduce((sum, g) => sum + g.value, 0),
		15,
	);

	const byName = new Map(groups.map((g) => [g.name, g.value]));
	assert.equal(byName.get("fracture de la malleole externe"), 1);
	assert.equal(byName.get("fracture du plateau tibial"), 1);
	assert.equal(byName.get("fracture du pilon tibial"), 1);
	assert.equal(byName.get("pseudarthrose du pilon tibial"), 1);
	assert.equal(byName.get("arthrose du genou"), 1);

	// Never raw objects, "--" placeholders or masked ids.
	for (const g of groups) {
		assert.ok(!g.name.includes("[object Object]"), g.name);
		assert.ok(!/^[0-9a-f]{32}$/.test(g.name), g.name);
		assert.notEqual(g.name, "--");
	}
});

test("a row with two diagnostics contributes one label per element", () => {
	assert.deepEqual(itemGroupLabels(sampleRows[9], "diagnostic", ctx), [
		"fracture du plateau tibial",
		"fracture du pilon tibial",
	]);
});

test("counts each element and dedupes repeats within a row", () => {
	const rows = [
		{
			diagnostic: [
				{ id: "a", nom: "PTG" },
				{ id: "a2", nom: "PTG" },
			],
		},
		{
			diagnostic: [
				{ id: "b", nom: "plaie" },
				{ id: "c", nom: "PTG" },
			],
		},
	];
	assert.deepEqual(groupItemsByField(rows, "diagnostic", ctx), [
		{ name: "PTG", value: 2 },
		{ name: "plaie", value: 1 },
	]);
});

test("null, undefined, missing and empty values group as unknown", () => {
	const rows = [
		{ diagnostic: null },
		{ diagnostic: undefined },
		{},
		{ diagnostic: [] },
		{ diagnostic: [null, undefined] },
	];
	assert.deepEqual(groupItemsByField(rows, "diagnostic", ctx), [
		{ name: UNKNOWN_GROUP_LABEL, value: 5 },
	]);
});

test("primitive array values group per element", () => {
	const rows = [{ tags: ["a", "b"] }, { tags: ["a"] }, { tags: "a" }];
	assert.deepEqual(groupItemsByField(rows, "tags", plainCtx), [
		{ name: "a", value: 3 },
		{ name: "b", value: 1 },
	]);
});

test("scalar fields group exactly as before", () => {
	const rows = [
		{ status: "open" },
		{ status: "open" },
		{ status: "closed" },
		{ status: null },
	];
	assert.deepEqual(groupItemsByField(rows, "status", plainCtx), [
		{ name: "open", value: 2 },
		{ name: "closed", value: 1 },
		{ name: UNKNOWN_GROUP_LABEL, value: 1 },
	]);
	assert.deepEqual(groupItemsByField([{ count: 42 }], "count", plainCtx), [
		{ name: "42", value: 1 },
	]);
});

test("a single related object keeps the legacy label", () => {
	const rows = [{ diagnostic: { id: "x", nom: "PTG" } }];
	assert.deepEqual(groupItemsByField(rows, "diagnostic", ctx), [
		{ name: "PTG", value: 1 },
	]);
});

test("falls back to the first text field when the table has no label template", () => {
	const unlabelled: GroupLabelContext = {
		fieldDef: diagnosticField,
		tables: [
			{ slug: "diagnostics", schema: [{ id: 1, key: "nom", type: "string" }] },
		],
		renderLabel,
	};
	const rows = [{ diagnostic: [{ id: "z", nom: "masse du bras" }] }];
	assert.deepEqual(groupItemsByField(rows, "diagnostic", unlabelled), [
		{ name: "masse du bras", value: 1 },
	]);
});

test("inline array-of-objects rows label by their first text child", () => {
	const inlineCtx: GroupLabelContext = {
		fieldDef: {
			id: 5,
			key: "items",
			type: "array",
			children: [
				{ id: 1, key: "nom", type: "string" },
				{ id: 2, key: "qte", type: "number" },
			],
		},
		tables: [],
		renderLabel,
	};
	const rows = [
		{
			items: [
				{ nom: "abc", qte: 3 },
				{ nom: "def", qte: 1 },
			],
		},
		{ items: [{ nom: "abc" }] },
		{ items: [{ qte: 9 }] },
	];
	assert.deepEqual(groupItemsByField(rows, "items", inlineCtx), [
		{ name: "abc", value: 2 },
		{ name: "def", value: 1 },
		{ name: "9", value: 1 },
	]);
});

test("dotted keys group by the value inside each array row", () => {
	const rows = [
		{ items: [{ quantity: 2 }, { quantity: 3 }] },
		{ items: [{ quantity: 2 }] },
	];
	const dottedCtx: GroupLabelContext = {
		fieldDef: { id: 7, key: "quantity", type: "number" },
		tables: [],
		renderLabel,
	};
	assert.deepEqual(groupItemsByField(rows, "items.quantity", dottedCtx), [
		{ name: "2", value: 2 },
		{ name: "3", value: 1 },
	]);
});

test("groupLimitForSize maps widget sizes, defaulting to small", () => {
	assert.equal(groupLimitForSize(undefined), 5);
	assert.equal(groupLimitForSize("small"), 5);
	assert.equal(groupLimitForSize("medium"), 7);
	assert.equal(groupLimitForSize("large"), 10);
});

test("topGroups passes through up to limit + 1 groups unchanged", () => {
	// Six real labels are no more crowded than five + bucket — nothing is
	// hidden and no bucket is created.
	const six = [6, 5, 4, 3, 2, 1].map((value, i) => ({
		name: `g${i}`,
		value,
	}));
	assert.deepEqual(topGroups(six, 5, "Other"), six);
	assert.deepEqual(topGroups(six.slice(0, 5), 5, "Other"), six.slice(0, 5));
	assert.deepEqual(topGroups([], 5, "Other"), []);
});

test("topGroups folds everything past the limit into one bucket", () => {
	// The real sample: 15 distinct labels of 1 each.
	const sample = groupItemsByField(sampleRows, "diagnostic", ctx);
	assert.equal(sample.length, 15);

	const sliced = topGroups(sample, 5, "Other");
	assert.equal(sliced.length, 6);
	assert.deepEqual(sliced.slice(0, 5), sample.slice(0, 5));
	assert.deepEqual(sliced[5], { name: "Other", value: 10 });
	// The total is preserved so tooltip percentages stay truthful.
	assert.equal(
		sliced.reduce((sum, g) => sum + g.value, 0),
		sample.reduce((sum, g) => sum + g.value, 0),
	);
});

test("topGroups buckets exactly the remainder past limit + 1", () => {
	const groups = [7, 6, 5, 4, 3, 2, 1].map((value, i) => ({
		name: `g${i}`,
		value,
	}));
	assert.deepEqual(topGroups(groups, 5, "Autres"), [
		...groups.slice(0, 5),
		{ name: "Autres", value: 3 },
	]);
});
