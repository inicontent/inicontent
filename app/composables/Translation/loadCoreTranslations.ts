import defineTranslation from "./define"

// Track which languages have been loaded
const loadedLanguages = new Set<string>()

/**
 * Load centralized translation files
 * This should be called once in app initialization
 * @param lang - The initial language to load (default: 'en')
 */
export default async function (lang: LanguagesType = "en", prevLang?: LanguagesType) {
    // Skip if already loaded
    if (loadedLanguages.has(lang))
        return

    try {
        // Dynamically import the language file
        const translations = await import(`../../locales/${lang}.ts`)

        // Register the translations
        defineTranslation(translations.default as any)

        // Mark as loaded
        loadedLanguages.add(lang)

        if (prevLang && loadedLanguages.has(prevLang))
            loadedLanguages.delete(prevLang)

    } catch (error) {
        console.error(`Failed to load ${lang} translations:`, error)
    }
}
