/**
 * Locale-file selection for `loadTranslations.ts`.
 *
 * Kept separate so it can be unit tested: `loadTranslations.ts` calls
 * `import.meta.glob` and `useState`, so it only loads inside a Nuxt build,
 * while this module is plain data in, plain data out (`customBlockRegistry.ts`
 * is the same split for custom blocks).
 */

/** An `import.meta.glob` result: module path -> dynamic import. */
export type LocaleFiles = Record<string, () => Promise<unknown>>;

/** One directory of locale files. Order here is the merge order. */
export interface LocaleSource {
	/**
	 * Where the files come from, for error messages only. `"core"` is this
	 * layer's own `app/locales`, `"layer"` the consuming app's.
	 */
	name: string;
	files: LocaleFiles;
}

export interface ResolvedLocale {
	source: string;
	/** The `import.meta.glob` key the file was found under. */
	path: string;
	load: () => Promise<unknown>;
}

/**
 * The file name a language is expected to live under. Locales are one file per
 * language (`en.ts`, `fr.ts`), each exporting `{ <lang>: { … } }`.
 */
export function localeFileName(lang: string) {
	return `${lang}.ts`;
}

/**
 * Every loader for `lang`, in source order — core first, then the app's, so the
 * app's strings are merged last and win any key collision (`define.ts` merges
 * the incoming object over the existing state).
 *
 * Matching is on the file's basename rather than on a whole glob key. Keys come
 * out relative to the build root and in two shapes — `/locales/en.ts` for a
 * directory inside the app, `../../inicontent/app/locales/en.ts` for the layer's
 * — so the two maps' keys are not comparable even when they name one file.
 *
 * A file already seen is skipped. `modules/layer-locales.ts` keeps the two
 * aliases off each other's directory, so this should never fire; it is here so
 * that a same-directory setup costs one merge instead of two.
 */
export function resolveLocaleLoaders(
	sources: readonly LocaleSource[],
	lang: string,
): ResolvedLocale[] {
	const wanted = localeFileName(lang);
	const seen = new Set<string>();
	const resolved: ResolvedLocale[] = [];

	for (const { name, files } of sources) {
		for (const [path, load] of Object.entries(files)) {
			const basename = path.slice(path.lastIndexOf("/") + 1);
			if (basename !== wanted || seen.has(path)) continue;
			seen.add(path);
			resolved.push({ source: name, path, load });
		}
	}

	return resolved;
}
