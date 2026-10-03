import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	renderCustomBlock,
	resolveCustomBlockTemplate,
} from "../app/composables/blockTemplate.ts";

// `outputEscape: "escape"` is the whole security model for custom blocks: config
// values are untrusted (they come from editors, and on a dynamic page from a
// database row), so `{{ x }}` must not emit markup. `| raw` is the deliberate
// opt-out, matching how `v-html` behaves.

test("escapes interpolated values by default", () => {
	assert.equal(
		renderCustomBlock("<p>{{ bio }}</p>", { bio: "<script>alert(1)</script>" }),
		"<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
	);
});

test("| raw opts out of escaping", () => {
	assert.equal(
		renderCustomBlock("<p>{{ bio | raw }}</p>", { bio: "<b>hi</b>" }),
		"<p><b>hi</b></p>",
	);
});

test("escapes values resolved through a template item", () => {
	// The dynamic-page path: `{{ item.x }}` against the row a slug matched.
	assert.equal(
		renderCustomBlock("{{ item.bio }}", {
			item: { bio: "<img src=x onerror=alert(1)>" },
		}),
		"&lt;img src=x onerror=alert(1)&gt;",
	);
});

test("renders an undefined item as empty rather than throwing", () => {
	// Ordinary (non-dynamic) pages have no bound item.
	assert.equal(renderCustomBlock("[{{ item.title }}]", {}), "[]");
});

test("resolves config fields from the scope root", () => {
	assert.equal(
		renderCustomBlock("<h2>{{ heading }}</h2>", { heading: "Welcome" }),
		"<h2>Welcome</h2>",
	);
});

test("| asset resolves a stored asset to its publicURL", () => {
	assert.equal(
		renderCustomBlock("{{ image | asset }}", {
			image: { publicURL: "https://cdn.test/a.png" },
		}),
		"https://cdn.test/a.png",
	);
});

test("| asset passes a plain URL string through unchanged", () => {
	assert.equal(
		renderCustomBlock("{{ image | asset }}", {
			image: "https://cdn.test/b.png",
		}),
		"https://cdn.test/b.png",
	);
});

test("| asset renders nothing for a missing image", () => {
	assert.equal(renderCustomBlock("[{{ image | asset }}]", {}), "[]");
});

test("applies stock filters", () => {
	assert.equal(
		renderCustomBlock("{{ heading | upcase }}", { heading: "sale" }),
		"SALE",
	);
	assert.equal(
		renderCustomBlock("{{ body | truncate: 5 }}", { body: "abcdefghij" }),
		"ab...",
	);
});

test("{% for %} loops over a table column", () => {
	assert.equal(
		renderCustomBlock("{% for tag in tags %}[{{ tag }}]{% endfor %}", {
			tags: ["new", "sale"],
		}),
		"[new][sale]",
	);
});

test("{% for %} exposes loop metadata", () => {
	assert.equal(
		renderCustomBlock(
			"{% for tag in tags %}{{ forloop.index }}:{{ tag }}{% unless forloop.last %},{% endunless %}{% endfor %}",
			{ tags: ["a", "b"] },
		),
		"1:a,2:b",
	);
});

test("{% if %} is falsey for an empty string", () => {
	// `jsTruthy: true` — stock Liquid treats "" as truthy, which reads as a bug.
	assert.equal(
		renderCustomBlock("{% if x %}yes{% else %}no{% endif %}", { x: "" }),
		"no",
	);
});

test("{% if %} / {% else %} selects a branch", () => {
	assert.equal(
		renderCustomBlock("{% if x %}yes{% else %}no{% endif %}", { x: "set" }),
		"yes",
	);
});

test("reads nested item paths", () => {
	assert.equal(
		renderCustomBlock("{{ item.author.name }}", {
			item: { author: { name: "Ada" } },
		}),
		"Ada",
	);
});

test("does not expose prototype-chain properties", () => {
	// `ownPropertyOnly` (the engine default, relied on for CVE-2026-44646)
	// must hold for template items coming from the database.
	const item = Object.create({ secret: "leaked" });
	item.title = "Fine";
	assert.equal(renderCustomBlock("{{ item.title }}", { item }), "Fine");
	assert.equal(renderCustomBlock("{{ item.secret }}", { item }), "");
});

test("a malformed tag yields empty output instead of throwing", () => {
	// Must not propagate: a parse error would otherwise fail the whole page
	// render rather than degrade to one missing section.
	assert.equal(renderCustomBlock("{% if %}", {}), "");
});

test("a runaway loop is bounded by renderLimit", () => {
	assert.equal(
		renderCustomBlock("{% for i in (1..99999999) %}x{% endfor %}", {}),
		"",
	);
});

test("an empty or missing template renders nothing", () => {
	assert.equal(renderCustomBlock(undefined), "");
	assert.equal(renderCustomBlock(""), "");
});

test("a missing scope is optional", () => {
	assert.equal(renderCustomBlock("{{ a }}"), "");
});

test("resolveCustomBlockTemplate prefers the per-design entry", () => {
	const block = {
		type: "Promo",
		schema: [],
		template: "<p>default</p>",
		templates: ["<p>one</p>", "<p>two</p>"],
	};
	assert.equal(resolveCustomBlockTemplate(block, 1), "<p>one</p>");
	assert.equal(resolveCustomBlockTemplate(block, 2), "<p>two</p>");
	// A design past the end falls back rather than rendering nothing.
	assert.equal(resolveCustomBlockTemplate(block, 9), "<p>default</p>");
});

test("resolveCustomBlockTemplate falls back to template then file", () => {
	assert.equal(
		resolveCustomBlockTemplate(
			{ type: "P", schema: [], template: "<p>t</p>" },
			1,
		),
		"<p>t</p>",
	);
	assert.equal(
		resolveCustomBlockTemplate({ type: "P", schema: [], file: "<p>f</p>" }, 1),
		"<p>f</p>",
	);
	assert.equal(
		resolveCustomBlockTemplate({ type: "P", schema: [] }, 1),
		undefined,
	);
});
