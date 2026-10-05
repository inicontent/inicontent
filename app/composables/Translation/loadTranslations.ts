import defineTranslation from "./define";
import { type LocaleSource, resolveLocaleLoaders } from "./localeSources";

// This layer's own `app/locales`, and the consuming app's. Both are aliased by
// `modules/layer-locales.ts` because a relative glob only sees files next to the
// layer's source — see that module for why the second one may point nowhere.
const coreLocales = import.meta.glob("#inicontent/core-locales/*.ts");
const appLocales = import.meta.glob("#inicontent/layer-locales/*.ts");

// Order is precedence: see the note on `defineTranslation` below.
const sources: LocaleSource[] = [
	{ name: "core", files: coreLocales },
	{ name: "layer", files: appLocales },
];

// Track which languages have been loaded
const loadedLanguages = new Set<string>();

/**
 * Load the translation files for one language into the shared `translations`
 * state: this layer's own `app/locales` plus, when an app extends this repo as a
 * Nuxt layer, that app's own `app/locales`. Called once on app initialization
 * (`app/app.vue`) and again whenever the language changes.
 *
 * Both files are read, not one or the other — the app's file overrides the keys
 * the two share and leaves the rest alone. That falls out of load order:
 * `defineTranslation` merges the incoming object *over* the existing state, so
 * whatever is merged last wins, and the app's file is merged last.
 *
 * Before this was global, an app had to ship its own composable plus a plugin to
 * merge its own strings, duplicated per app.
 *
 * @param lang - The language to load, defaulting to 'en'. `null` is accepted
 *   because a cookie that was never set reads as `null`, not `undefined`.
 * @param prevLang - The language being replaced, dropped from the loaded set so
 *   switching back re-reads its file
 */
export default async function (
	lang?: LanguagesType | null,
	prevLang?: LanguagesType | null,
) {
	const language = lang ?? "en";

	// Skip if already loaded
	if (loadedLanguages.has(language)) return;

	try {
		const resolved = resolveLocaleLoaders(sources, language);
		if (!resolved.length) throw new Error(`Locale ${language} not found`);

		// Sequentially, in source order — core first so the app's translations
		// are merged last and win a collision.
		for (const { source, path, load } of resolved) {
			const translations = (await load()) as { default: TranslationsType };

			if (!translations?.default)
				throw new Error(`${path} (${source}) has no default export`);

			// A locale file is named after the language it holds, so `fr.ts`
			// exporting `{ en: … }` would load and then be invisible to `t()`.
			// Worth a warning: nothing else reports it.
			if (import.meta.dev && !(language in translations.default))
				console.warn(
					`${path} (${source}) exports no "${language}" key — check the file name matches the language`,
				);

			// Register the translations
			defineTranslation(translations.default);
		}

		// Mark as loaded
		loadedLanguages.add(language);

		if (prevLang && loadedLanguages.has(prevLang))
			loadedLanguages.delete(prevLang);
	} catch (error) {
		console.error(`Failed to load ${language} translations:`, error);
	}
}
