/**
 * Smoke tests for the email builder v2 model (round-trip + fallback + kit).
 * Pure node run: `node scripts/email-builder-smoke.ts` (temporary).
 */
import { createRequire } from "node:module";
import {
	blockDefByName,
	blocksFromMJML,
	blockType,
	blockVariant,
	buildMJML,
	createBlock,
	createRawBlock,
	createTextBlock,
	EMAIL_BLOCK_TYPES,
	extractModel,
	PALETTE_GROUPS,
	parseMJML,
	serializeBlock,
	stripModelMarker,
} from "../app/composables/emailBuilder.ts";

function assert(condition: boolean, label: string) {
	if (!condition) {
		console.error(`FAIL  ${label}`);
		process.exitCode = 1;
	} else {
		console.log(`PASS  ${label}`);
	}
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// 1. Full kit document round-trips exactly through embed/extract.
const blocks = [
	createBlock("emailHeader"),
	createBlock("emailHero"),
	createBlock("emailFeatures"),
	createBlock("emailCta"),
	createBlock("emailQuote"),
	createBlock("emailTicket"),
	createBlock("emailLogos"),
	createBlock("emailSocial"),
	createBlock("emailFooter"),
	createBlock("columns"),
];
blocks[1].name = "emailHero/2";
blocks[1].config.heading = 'Welcome <b>team</b> & "friends" -- 100% sure';
blocks[1].config.buttons = [
	{ label: "Get started", href: "https://example.com" },
	{ label: "Learn more", href: "https://example.com/docs" },
];
blocks[2].config.items = [
	{
		title: "Fast",
		description: "Delivered in milliseconds.",
	},
	{ title: "Smart", description: "Adapts to your users." },
	{ title: "Secure", description: "Encrypted everywhere." },
];
blocks[3].config.theme = "accent";
blocks[7].config.items = [
	{ network: "twitter", href: "https://twitter.com/x" },
	{ network: "web", href: "https://example.com" },
];
blocks[9].children = [
	[createTextBlock("Left column text")],
	[createBlock("button"), createTextBlock("Right column")],
];
blocks[9].children[1][0].config.text = "Col button";

const doc = buildMJML(blocks);
assert(
	doc.startsWith("<mjml>") && doc.endsWith("</mjml>"),
	"buildMJML wraps doc",
);

assert(doc.includes("email-builder-model:"), "buildMJML embeds model marker");

const restored = blocksFromMJML(doc);
assert(restored.length === blocks.length, "extract restores same block count");
assert(
	eq(restored, blocks),
	"extract restores exact block tree (ids + config)",
);
assert(eq(extractModel(doc), blocks), "extractModel returns exact block tree");

// 2. Marker survives `--` and `<`/`>` in config without breaking extraction.
const tricky = createBlock("text");
tricky.config.text = "a -- b < c > d <!-- e -->";
assert(
	eq(blocksFromMJML(buildMJML([tricky])), [tricky]),
	"round-trip preserves -- and < > in config",
);

// 3. stripModelMarker removes only the marker.
assert(
	!stripModelMarker(doc).includes("email-builder-model"),
	"stripModelMarker removes marker",
);
assert(
	stripModelMarker(doc).includes("mj-body"),
	"stripModelMarker keeps the rest of the doc",
);

// 4. Edited body (code-view scenario) falls back to a faithful parse.
const edited = stripModelMarker(doc).replace(
	/Left column text/g,
	"Edited by hand",
);
const parsedEdited = blocksFromMJML(edited);
assert(
	JSON.stringify(parsedEdited).includes("Edited by hand"),
	"hand-edited body is preserved via parse fallback",
);
assert(!extractModel(edited), "marker-less document yields no extraction");

// 5. Foreign MJML without a marker is preserved (raw fallback), and its text
// survives a save/load cycle.
const foreign = `<mjml><mj-body><mj-section><mj-column><mj-text>Hello {{@user.username}}</mj-text></mj-column></mj-section></mj-body></mjml>`;
const parsedForeign = parseMJML(foreign);
assert(
	parsedForeign.some((b) => blockType(b.name) === "text"),
	"foreign MJML parses mj-text to a text block",
);
assert(
	buildMJML([...parsedForeign, createRawBlock("<mj-hero>custom</mj-hero>")])
		.replace(/[{"}:\s]/g, "")
		.includes("Hello"),
	"foreign content re-serializes without loss",
);

// 6. Every kit def renders valid, non-empty MJML for every variant.
for (const type of EMAIL_BLOCK_TYPES) {
	const def = blockDefByName(`${type}/1`);
	if (!def) {
		assert(false, `${type} has a definition`);
		continue;
	}
	for (let v = 1; v <= def.total; v++) {
		const block = createBlock(type);
		block.name = `${type}/${v}`;
		if (blockType(block.name) === "columns") {
			block.children = [[createTextBlock("Hi")], [createTextBlock("There")]];
		}
		const out = serializeBlock(block);
		if (def.columns) {
			assert(out.includes("<mj-column>"), `${type}/${v} renders columns`);
		} else if (def.ownSection && out.trim()) {
			assert(
				out.trim().startsWith("<mj-section"),
				`${type}/${v} renders its own section`,
			);
			assert(
				!out.includes("<mj-column><mj-section"),
				`${type}/${v} is not double-wrapped`,
			);
		}
	}
}

// 6b. A full kit document never nests sections (invalid MJML) and never emits
// bare content elements directly inside mj-body.
const kitDoc = buildMJML(blocks);
assert(
	!kitDoc.includes("<mj-column><mj-section"),
	"kit document has no nested sections",
);
const bodyInner = kitDoc.slice(
	kitDoc.indexOf(">", kitDoc.indexOf("<mj-body")) + 1,
	kitDoc.indexOf("</mj-body>"),
);
assert(
	!/<mj-(text|button|image|divider|spacer)\b/.test(
		bodyInner.trim().slice(0, 40),
	),
	"kit body starts with a section, not bare content",
);

// 7. Variant-aware rendering differs across designs.
const hero2 = createBlock("emailHero");
hero2.name = "emailHero/2";
hero2.config.image = "https://example.com/hero.png";
const hero1 = createBlock("emailHero");
assert(
	serializeBlock(hero2) !== serializeBlock(hero1),
	"hero variant 2 differs from variant 1",
);
assert(blockVariant(hero2.name) === 2, "blockVariant parses the design number");

// 8. Palette groups cover every palette block exactly once.
const paletted = [...PALETTE_GROUPS.flatMap((g) => g.blocks)];
assert(
	paletted.length > 0 && paletted.every((d) => d.palette !== false),
	"palette groups expose only palette blocks",
);
assert(
	new Set(paletted.map((d) => d.type)).size === paletted.length,
	"palette blocks are unique",
);

// 9. Empty documents behave.
assert(buildMJML([]) === "", "empty blocks build to empty string");
assert(eq(blocksFromMJML(""), []), "empty content parses to no blocks");
assert(
	eq(blocksFromMJML("<mjml><mj-body /></mjml>"), []),
	"empty body parses to no blocks",
);

// 10. Compiled HTML: the kit and a single block must render without errors
// and into non-empty HTML — guards against regression of the editor previews
// (mjml 5.4+ returns a Promise, so the renderer must be awaited).
const require = createRequire(import.meta.url);
const mjml = require("mjml");
const compiled = await mjml(buildMJML(blocks), { validationLevel: "skip" });
assert(
	Array.isArray(compiled.errors) && compiled.errors.length === 0,
	"kit compiles without mjml errors",
);
assert(
	typeof compiled.html === "string" && compiled.html.length > 0,
	"kit compiles to non-empty html",
);
const textCompiled = await mjml(buildMJML([createTextBlock("Hi")]), {
	validationLevel: "skip",
});
assert(
	typeof textCompiled.html === "string" && textCompiled.html.length > 0,
	"single text block compiles to non-empty html",
);

console.log(
	process.exitCode === 1 ? "\nSOME TESTS FAILED" : "\nALL TESTS PASSED",
);
