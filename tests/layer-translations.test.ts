import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	type LocaleSource,
	resolveLocaleLoaders,
} from "../app/composables/Translation/localeSources.ts";

// A locale file is one language per file (`en.ts`, `fr.ts`), so keys only ever
// differ in the directory. The two maps are reached through different
// specifiers — `#inicontent/core-locales` vs `#inicontent/layer-locales` — which
// is why selection matches on the basename rather than the whole key.
const loader = () => Promise.resolve({ default: {} });

const core: LocaleSource = {
	name: "core",
	files: {
		"/layer/app/locales/en.ts": loader,
		"/layer/app/locales/fr.ts": loader,
	},
};

const app: LocaleSource = {
	name: "layer",
	files: {
		"/saas/app/locales/en.ts": loader,
		"/saas/app/locales/ar.ts": loader,
	},
};

test("a language present in only one source resolves from that source", () => {
	const [resolved] = resolveLocaleLoaders([core, app], "fr");
	assert.equal(resolved.source, "core");
	assert.equal(resolved.path, "/layer/app/locales/fr.ts");

	const [ar] = resolveLocaleLoaders([core, app], "ar");
	assert.equal(ar.source, "layer");
});

test("a language in both sources resolves core first, so the app wins a collision", () => {
	// `defineTranslation` merges the incoming object over the existing state, so
	// load order is precedence: whatever is merged last wins.
	const resolved = resolveLocaleLoaders([core, app], "en");
	assert.deepEqual(
		resolved.map((entry) => entry.source),
		["core", "layer"],
	);
});

test("a key in the layer's shape is matched by basename too", () => {
	// The layer's directory sits outside the app's build root, so its glob keys
	// come out `../../`-prefixed while the app's are root-relative. Selection
	// cannot depend on that difference.
	const outsideRoot: LocaleSource = {
		name: "core",
		files: { "../../inicontent/app/locales/en.ts": loader },
	};

	const resolved = resolveLocaleLoaders([outsideRoot], "en");
	assert.equal(resolved.length, 1);
	assert.equal(resolved[0]?.path, "../../inicontent/app/locales/en.ts");
});

test("an unknown language resolves nothing rather than throwing", () => {
	// The caller turns this into the `Locale <lang> not found` error, so a
	// missing file must not surface as an empty-merge or a crash here.
	assert.deepEqual(resolveLocaleLoaders([core, app], "de"), []);
});

test("a file whose name merely ends with the language is not matched", () => {
	const tricky: LocaleSource = {
		name: "layer",
		files: {
			"/saas/app/locales/legacy-en.ts": loader,
			"/saas/app/locales/en.ts.bak": loader,
			"/saas/app/locales/en.ts": loader,
		},
	};

	assert.equal(resolveLocaleLoaders([tricky], "en").length, 1);
});

test("the same file reached through two sources is loaded once", () => {
	// `modules/layer-locales.ts` keeps the two aliases off each other's
	// directory, so this shape is a safety net rather than an expected build.
	// It is worth pinning anyway: merging one file twice is wasted work, and if
	// the alias ever did resolve back to the layer's own directory the app's
	// copy of the strings would silently start overriding itself.
	const sameFile: LocaleSource = {
		name: "layer",
		files: { "/layer/app/locales/en.ts": loader },
	};

	const resolved = resolveLocaleLoaders([core, sameFile], "en");
	assert.equal(resolved.length, 1);
	assert.equal(resolved[0]?.source, "core");
});

test("an app with no locales of its own resolves only the core file", () => {
	const none: LocaleSource = { name: "layer", files: {} };
	const resolved = resolveLocaleLoaders([core, none], "en");

	assert.equal(resolved.length, 1);
	assert.equal(resolved[0]?.source, "core");
});

test("sources are searched in the order given", () => {
	const reversed = resolveLocaleLoaders([app, core], "en");
	assert.deepEqual(
		reversed.map((entry) => entry.source),
		["layer", "core"],
	);
});
