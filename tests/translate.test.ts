import { strict as assert } from "node:assert";
import { test } from "node:test";

import translate from "../app/composables/Translation/translate.ts";

/**
 * `useState` / `useScopedCookie` are Nuxt auto-imports — runtime globals in
 * the Nuxt bundle. Reproduce them so the composable can run under node:test.
 * These tests pin the inidot integration (`getProperty` / `hasProperty` /
 * `setProperty` path semantics) that translate.ts depends on.
 */
function mockNuxt(translations: unknown, language = "en") {
	const unfound: Record<string, unknown> = {};

	(globalThis as any).useState = (name: string) => {
		if (name === "translations") return { value: translations };
		if (name === "unfoundTranslations") return { value: unfound };
		if (name === "database") return { value: { slug: "en" } };
		return { value: undefined };
	};
	(globalThis as any).useScopedCookie = () => ({ value: language });

	return unfound;
}

test("translate resolves a simple key from the current locale", () => {
	mockNuxt({ en: { greeting: "Hello" } });
	assert.equal(translate("greeting"), "Hello");
});

test("translate resolves dotted keys against nested translation objects", () => {
	mockNuxt({ en: { form: { label: "Name" } } });
	assert.equal(translate("form.label"), "Name");
});

test("translate reaches literal dotted keys stored flat via an escaped path", () => {
	// fetch.ts stores translations as flat records keyed by the original
	// string, so a literal dot in a key must be escaped to resolve.
	mockNuxt({ en: { "form.label": "Name" } });
	assert.equal(translate("form\\.label"), "Name");
});

test("a plain dot is a path separator: flat dotted keys do not resolve", () => {
	const unfound = mockNuxt({ en: { "form.label": "Name" } });
	assert.equal(translate("form.label"), "Label");
	// The miss is recorded through setProperty, which builds a nested path.
	assert.deepEqual(unfound, { form: { label: null } });
});

test("translate interpolates {{variables}}", () => {
	mockNuxt({ en: { welcome: "Hello {{name}}!" } });
	assert.equal(translate("welcome", { name: "Bob" }), "Hello Bob!");
});

test("translate pluralizes with count (one / other)", () => {
	mockNuxt({
		en: { items: { one: "One item", other: "{{count}} items" } },
	});
	assert.equal(translate("items", { count: 1 }), "One item");
	assert.equal(translate("items", { count: 3 }), "3 items");
});

test("translate returns objects when returnObjects is set", () => {
	mockNuxt({
		en: { items: { one: "One item", other: "{{count}} items" } },
	});
	assert.deepEqual(translate("items", { returnObjects: true }), {
		one: "One item",
		other: "{{count}} items",
	});
});

test("translate returns the key itself for parent nodes holding nested data", () => {
	const unfound = mockNuxt({ en: { form: { label: "Name" } } });
	assert.equal(translate("form"), "form");
	assert.deepEqual(unfound, {});
});

test("missing keys are formatted and recorded as unfound", () => {
	const unfound = mockNuxt({ en: { greeting: "Hello" } });
	assert.equal(translate("missingKey"), "Missing Key");
	assert.equal(translate("form.missing.label"), "Label");
	assert.deepEqual(unfound, {
		missingKey: null,
		form: { missing: { label: null } },
	});
});

test("prototype-polluting paths are rejected (inidot safety)", () => {
	const unfound = mockNuxt({ en: {} });
	assert.equal(translate("__proto__.polluted"), "Polluted");
	assert.deepEqual(unfound, {});
	assert.equal(({} as any).polluted, undefined);
});

test("translate handles empty and non-string keys", () => {
	mockNuxt({ en: {} });
	assert.equal(translate(""), "");
	assert.equal(translate(null), "");
	assert.equal(translate(undefined), "");
	assert.equal(translate(0), "");
	assert.equal(translate(false), "");
	assert.equal(translate(42), "42");
});