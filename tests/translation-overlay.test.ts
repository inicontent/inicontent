import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	applyConfigOverlay,
	BLOCK_CONFIG_OVERLAY_FIELD,
	collectFieldPathsById,
	collectTranslatablePaths,
	diffConfigs,
	diffConfigsWithReset,
	diffPageFields,
	diffPageFieldsWithReset,
	fieldIdByPath,
	flattenOverlay,
	getConfigValue,
	isStructuralConfigKey,
	isTranslatableConfigField,
	PAGE_TRANSLATABLE_PATHS,
	rebuildLocalizedSlug,
	setConfigValue,
	translatableSchema,
} from "../app/composables/translationOverlay.ts";

// Minimal hero-like block schema (mirrors `HeadingSchema` + `ButtonSchema`).
const heroSchema = [
	{ key: "preHeading", type: "string" },
	{ key: "heading", type: "string" },
	{ key: "description", type: "string", subType: "textarea" },
	{
		key: "tag",
		type: "string",
		subType: "select",
		options: ["h1", "h2", "h3"],
	},
	{
		key: "buttons",
		type: "array",
		children: [
			{ key: "label", type: "string", required: true },
			{ key: "link", type: "string", subType: "page" },
			{ key: "design", type: "number", subType: "select", options: [1, 2] },
		],
	},
];

// Loop-like schema with structural bindings (table, column mappings, demo rows).
const loopSchema = [
	{ key: "heading", type: "string" },
	{ key: "table", type: "string" },
	{ key: "titleField", type: "string" },
	{ key: "label", type: "string" },
	{
		key: "demo",
		type: "array",
		children: [{ key: "title", type: "string" }],
	},
];

const pagesSchema = [
	{ id: 1, key: "name", type: "string" },
	{ id: 2, key: "slug", type: "string" },
	{
		id: 3,
		key: "seo",
		type: "object",
		children: [
			{ id: 11, key: "title", type: "string" },
			{ id: 12, key: "description", type: "string" },
			{ id: 13, key: "image", type: "table", table: "assets" },
		],
	},
];

test("sentinel + page paths", () => {
	assert.equal(BLOCK_CONFIG_OVERLAY_FIELD, 0);
	assert.deepEqual(
		[...PAGE_TRANSLATABLE_PATHS],
		["slug", "seo.title", "seo.description"],
	);
	assert.ok(!PAGE_TRANSLATABLE_PATHS.includes("seo.image"));
});

test("isStructuralConfigKey excludes bindings, keeps text keys", () => {
	assert.ok(isStructuralConfigKey("table"));
	assert.ok(isStructuralConfigKey("titleField"));
	assert.ok(isStructuralConfigKey("linkSegments"));
	assert.ok(isStructuralConfigKey("demo"));
	assert.ok(!isStructuralConfigKey("heading"));
	assert.ok(!isStructuralConfigKey("label"));
});

test("isTranslatableConfigField filters visible text leaves", () => {
	const stringField = { key: "heading", type: "string" };
	const textareaField = {
		key: "description",
		type: "string",
		subType: "textarea",
	};
	const selectField = {
		key: "tag",
		type: "string",
		subType: "select",
		options: [],
	};
	const pageField = { key: "link", type: "string", subType: "page" };
	const iconField = { key: "icon", type: "string", subType: "icon" };
	const numberField = { key: "design", type: "number" };
	const booleanField = { key: "isFeatured", type: "boolean" };
	const jsonField = { key: "cards", type: "json" };
	const assetField = { key: "cover", type: "table", table: "assets" };
	const arrayField = { key: "buttons", type: "array", children: [] };
	const bindingField = { key: "titleField", type: "string" };

	assert.ok(isTranslatableConfigField(stringField as never));
	assert.ok(isTranslatableConfigField(textareaField as never));
	assert.ok(!isTranslatableConfigField(selectField as never));
	assert.ok(!isTranslatableConfigField(pageField as never));
	assert.ok(!isTranslatableConfigField(iconField as never));
	assert.ok(!isTranslatableConfigField(numberField as never));
	assert.ok(!isTranslatableConfigField(booleanField as never));
	assert.ok(!isTranslatableConfigField(jsonField as never));
	assert.ok(!isTranslatableConfigField(assetField as never));
	assert.ok(isTranslatableConfigField(arrayField as never));
	assert.ok(!isTranslatableConfigField(bindingField as never));
});

test("translatableSchema keeps text leaves and drops structural containers", () => {
	const filtered = translatableSchema(heroSchema);
	assert.deepEqual(
		filtered.map((field) => field.key),
		["preHeading", "heading", "description", "buttons"],
	);
	const buttons = filtered.find((field) => field.key === "buttons");
	assert.deepEqual(
		(buttons?.children as Array<{ key: string }>).map((child) => child.key),
		["label"],
	);

	// A container whose only children are structural is dropped entirely.
	const structuralOnly = translatableSchema([
		{
			key: "ratingSource",
			type: "object",
			children: [
				{ key: "table", type: "string" },
				{ key: "valueColumn", type: "string" },
			],
		},
	]);
	assert.deepEqual(structuralOnly, []);

	const loopFiltered = translatableSchema(loopSchema);
	assert.deepEqual(
		loopFiltered.map((field) => field.key),
		["heading", "label"],
	);
});

test("collectTranslatablePaths walks schema for string leaves", () => {
	const config = {
		preHeading: "Welcome",
		heading: "Hello",
		description: "A description",
		tag: "h1", // select → not collected
		buttons: [
			{ label: "Buy", link: 7, design: 1 },
			{ label: "Learn more" },
			{ link: 9 },
		],
	};
	assert.deepEqual(collectTranslatablePaths(config, heroSchema), [
		"preHeading",
		"heading",
		"description",
		"buttons.0.label",
		"buttons.1.label",
	]);

	// No schema → nothing to walk.
	assert.deepEqual(collectTranslatablePaths(config), []);
});

test("diffConfigs reports only changed translatable strings", () => {
	const canonical = {
		heading: "Hello",
		description: "Same",
		buttons: [{ label: "Buy", link: 7 }],
	};
	const edited = {
		heading: "Bonjour",
		description: "Same",
		buttons: [{ label: "Acheter", link: 7 }],
	};
	assert.deepEqual(diffConfigs(canonical, edited, heroSchema), [
		{ path: "heading", from: "Hello", to: "Bonjour" },
		{ path: "buttons.0.label", from: "Buy", to: "Acheter" },
	]);
	// Structural value changes are ignored.
	assert.deepEqual(
		diffConfigs(
			canonical,
			{ ...edited, buttons: [{ label: "Buy", link: 8 }] },
			heroSchema,
		),
		[{ path: "heading", from: "Hello", to: "Bonjour" }],
	);
	// No changes.
	assert.deepEqual(diffConfigs(canonical, canonical, heroSchema), []);
});

test("diffConfigsWithReset flags redundant existing records", () => {
	const canonical = { heading: "Hello", description: "Text" };
	const edited = { heading: "Hello", description: "Texte" };
	const removed = diffConfigsWithReset(
		canonical,
		edited,
		heroSchema,
		new Set(["heading", "description"]),
	);
	assert.deepEqual(removed, [
		{ path: "heading", from: "Hello", to: "Hello" }, // falls back → delete record
		{ path: "description", from: "Text", to: "Texte" },
	]);
	// An existing path absent from both configs is still flagged for cleanup.
	assert.deepEqual(
		diffConfigsWithReset({}, {}, heroSchema, new Set(["ghost"])),
		[{ path: "ghost", from: "", to: "" }],
	);
});

test("flattenOverlay + applyConfigOverlay merge without mutating source", () => {
	const overlay = new Map<string, { translation: string }>([
		["heading", { translation: "Bonjour" }],
		["buttons.0.label", { translation: "Acheter" }],
	]);
	assert.deepEqual(flattenOverlay(overlay), {
		heading: "Bonjour",
		"buttons.0.label": "Acheter",
	});
	assert.deepEqual(flattenOverlay(undefined), {});

	const canonical = {
		heading: "Hello",
		description: "Same",
		buttons: [{ label: "Buy", link: 7 }],
	};
	const merged = applyConfigOverlay(canonical, flattenOverlay(overlay));
	assert.equal(merged.heading, "Bonjour");
	assert.equal(merged.buttons[0].label, "Acheter");
	assert.equal(merged.buttons[0].link, 7); // untranslated field falls back
	assert.equal(merged.description, "Same");

	// Deep copy: canonical stays untouched.
	assert.equal(canonical.heading, "Hello");
	assert.equal(canonical.buttons[0].label, "Buy");

	// Empty overlay → same instance (no copy).
	assert.equal(applyConfigOverlay(canonical, undefined), canonical);
	assert.deepEqual(
		applyConfigOverlay(canonical, { heading: "", buttons: { up: "x" } }),
		{ ...canonical, buttons: { up: "x" } },
	);
});

test("getConfigValue / setConfigValue round-trip", () => {
	const target: Record<string, unknown> = {};
	setConfigValue(target, "seo.title", "Hello");
	setConfigValue(target, "buttons.0.label", "Buy");
	assert.deepEqual(target, {
		seo: { title: "Hello" },
		buttons: [{ label: "Buy" }],
	});
	assert.equal(getConfigValue(target, "seo.title"), "Hello");
	assert.equal(getConfigValue(target, "buttons.0.label"), "Buy");
	assert.equal(getConfigValue(target, "seo.image"), undefined);
});

test("diffPageFields diffs translatable page fields only", () => {
	const canonical = { slug: "home", seo: { title: "Home", description: "D" } };
	const edited = {
		slug: "accueil",
		seo: { title: "Accueil", description: "D" },
	};
	assert.deepEqual(diffPageFields(canonical, edited), [
		{ path: "slug", from: "home", to: "accueil" },
		{ path: "seo.title", from: "Home", to: "Accueil" },
	]);

	// seo.image is not translatable — a difference there yields no change.
	const withImage = {
		...canonical,
		seo: { ...canonical.seo, image: { publicURL: "/a.png" } },
	};
	const changedImage = {
		...edited,
		seo: { ...edited.seo, image: { publicURL: "/b.png" } },
	};
	assert.deepEqual(diffPageFields(withImage, changedImage), [
		{ path: "slug", from: "home", to: "accueil" },
		{ path: "seo.title", from: "Home", to: "Accueil" },
	]);

	assert.deepEqual(diffPageFields(canonical, canonical), []);
	assert.deepEqual(diffPageFields(null, null), []);
});

test("diffPageFieldsWithReset flags redundant existing records", () => {
	const canonical = { slug: "home", seo: { title: "Home" } };
	const edited = { slug: "home", seo: { title: "Accueil" } };
	assert.deepEqual(
		diffPageFieldsWithReset(
			canonical,
			edited,
			new Set(["slug", "seo.title", "seo.description"]),
		),
		[
			{ path: "slug", from: "home", to: "home" }, // falls back → delete
			{ path: "seo.title", from: "Home", to: "Accueil" },
			// Existing record whose canonical+edited values are both unset → delete.
			{ path: "seo.description", from: "", to: "" },
		],
	);
});

test("fieldIdByPath resolves nested schema ids", () => {
	assert.equal(fieldIdByPath(pagesSchema, "slug"), 2);
	assert.equal(fieldIdByPath(pagesSchema, "seo.title"), 11);
	assert.equal(fieldIdByPath(pagesSchema, "seo.image"), 13);
	assert.equal(fieldIdByPath(pagesSchema, "seo.missing"), undefined);
	assert.equal(fieldIdByPath(undefined, "slug"), undefined);
});

test("collectFieldPathsById maps ids to dotted paths", () => {
	assert.deepEqual(
		[...collectFieldPathsById(pagesSchema)],
		[
			["1", "name"],
			["2", "slug"],
			["3", "seo"],
			["11", "seo.title"],
			["12", "seo.description"],
			["13", "seo.image"],
		],
	);
});

test("rebuildLocalizedSlug preserves dynamic segment values", () => {
	// Static slug swap.
	assert.equal(rebuildLocalizedSlug(["home"], "accueil"), "accueil");
	// Dynamic pattern keeps the source value at the matching position.
	assert.equal(
		rebuildLocalizedSlug(["articles", "my-post"], "articulos/[slug]"),
		"articulos/my-post",
	);
	assert.equal(
		rebuildLocalizedSlug(
			["blog", "2026", "post"],
			"articulos/[category]/[slug]",
		),
		"articulos/2026/post",
	);
	// Extra static segments in the pattern are kept.
	assert.equal(rebuildLocalizedSlug(["post"], "docs/guide"), "docs/guide");
	// Missing source segment → empty dynamic slot.
	assert.equal(rebuildLocalizedSlug([], "articulos/[slug]"), "articulos/");
	// Dynamic slots align positionally with the source segments.
	assert.equal(
		rebuildLocalizedSlug(["a", "b", "c"], "x/[one]/[two]/[three]/[four]"),
		"x/b/c//",
	);
	// A `[segment]` slot takes the source value at the same URL position;
	// earlier source segments (matching static prefix positions) are skipped.
	assert.equal(rebuildLocalizedSlug(["a", "b"], "x/[one]/[two]"), "x/b/");
	assert.equal(
		rebuildLocalizedSlug(
			["articulos", "my-post", "extra"],
			"articulos/[slug]/extra",
		),
		"articulos/my-post/extra",
	);
});
