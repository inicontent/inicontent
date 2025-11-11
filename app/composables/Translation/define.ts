import { deepMerge } from "inibase/utils"

// Cache for translation hashes to avoid unnecessary merges
const translationCache = new Map<string, boolean>()

/**
 * Generate a simple hash for a translations object
 */
function hashTranslations(translations: TranslationsType): string {
	return JSON.stringify(translations)
}

export default function (translations: TranslationsType) {
	const translationsState = useState<TranslationsType>("translations")

	// Generate hash of incoming translations
	const hash = hashTranslations(translations)

	// Check if we've already merged these exact translations
	if (translationCache.has(hash)) {
		return
	}

	// Mark this translation set as processed
	translationCache.set(hash, true)

	// Merge translations
	if (translationsState.value) {
		translationsState.value = deepMerge(translationsState.value, translations)
	} else {
		translationsState.value = translations
	}

	// Clean up cache if it gets too large (prevent memory leaks)
	if (translationCache.size > 1000) {
		const keysToDelete = Array.from(translationCache.keys()).slice(0, 500)
		for (const key of keysToDelete) {
			translationCache.delete(key)
		}
	}
}
