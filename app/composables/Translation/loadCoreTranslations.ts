import defineTranslation from "./define"

// Track which languages have been loaded
const loadedLanguages = new Set<string>()

const locales = import.meta.glob("../../locales/*.ts")

/**
 * Load centralized translation files
 * This should be called once in app initialization
 * @param lang - The initial language to load (default: 'en')
 */
export default async function (
	lang: LanguagesType = "en",
	prevLang?: LanguagesType,
) {
	// Skip if already loaded
	if (loadedLanguages.has(lang)) return

	try {
		const loader = locales[`../../locales/${lang}.ts`]
		if (!loader) throw new Error(`Locale ${lang} not found`)

		// Dynamically import the language file
		const translations = (await loader()) as any

		// Register the translations
		defineTranslation(translations.default)

		// Mark as loaded
		loadedLanguages.add(lang)

		if (prevLang && loadedLanguages.has(prevLang))
			loadedLanguages.delete(prevLang)
	} catch (error) {
		console.error(`Failed to load ${lang} translations:`, error)
	}
}
