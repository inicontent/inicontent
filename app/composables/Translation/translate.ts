import { getProperty, hasProperty, setProperty } from "inidot"

function formatUnfoundTranslation(
	input: string,
	language: LanguagesType,
): string {
	input = decodeURI(input)
	if (input.includes(".")) {
		if (input.includes("..")) return input;
		input = input.split(".").pop() ?? ""
	}

	if (language !== "en" || input.toUpperCase() === input) return input

	const lowercaseWords = [
		"is",
		"and",
		"or",
		"but",
		"the",
		"an",
		"a",
		"as",
		"at",
		"to",
		"in",
		"on",
	]

	if (input.length === 2)
		return lowercaseWords.includes(input.toLowerCase())
			? input.toLowerCase()
			: input.toUpperCase()

	// Split by capital letters and underscores
	const words = input.split(/_(?![A-Z]+)|(?<=[a-z])(?=[A-Z])/)

	// Process each word
	const formattedWords = words.map((word, index) => {
		if (word.charAt(0) === "_") word = word.slice(1)

		if (word.toUpperCase() === word) return word.trim()

		// Capitalize the first character
		if (index === 0 || !lowercaseWords.includes(word.toLowerCase()))
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

		// Check if the word is in the linking or lowercase words and convert to lowercase
		if (lowercaseWords.includes(word.toLowerCase())) return word.toLowerCase()

		// Replace underscores with space
		const wordWithoutUnderscore = word.replace("_", " ")

		// Add space before each capitalized character
		return wordWithoutUnderscore
			.replace(/([A-Z])/g, " $1")
			.trim()
			.toLowerCase()
	})

	// Join the formatted words with spaces
	return formattedWords.join(" ")
}

/**
 * Interpolate variables into a translation string
 * Supports both {{variable}} and {variable} syntax
 */
function interpolate(
	text: string,
	params: Record<string, any>,
): string {
	return text.replace(/\{\{?\s*(\w+)\s*\}?\}/g, (_, key) => {
		return params[key] !== undefined ? String(params[key]) : `{${key}}`
	})
}

/**
 * Get plural form based on count and language rules
 */
function getPluralForm(
	count: number,
	language: LanguagesType,
): "zero" | "one" | "two" | "few" | "many" | "other" {
	// English pluralization rules
	if (language === "en") {
		if (count === 0) return "zero"
		if (count === 1) return "one"
		return "other"
	}

	// Arabic pluralization rules
	if (language === "ar") {
		if (count === 0) return "zero"
		if (count === 1) return "one"
		if (count === 2) return "two"
		const mod100 = count % 100
		if (mod100 >= 3 && mod100 <= 10) return "few"
		if (mod100 >= 11 && mod100 <= 99) return "many"
		return "other"
	}

	// French pluralization rules
	if (language === "fr") {
		if (count === 0 || count === 1) return "one"
		return "other"
	}

	// Spanish pluralization rules
	if (language === "es") {
		if (count === 1) return "one"
		return "other"
	}

	// Default
	return count === 1 ? "one" : "other"
}

/**
 * Handle plural translations
 */
function handlePlural(
	translation: any,
	count: number,
	language: LanguagesType,
	params?: Record<string, any>,
): string {
	if (typeof translation === "string") return translation

	const pluralForm = getPluralForm(count, language)
	const forms = ["zero", "one", "two", "few", "many", "other"]

	// Try to find the exact form, then fallback to more general forms
	for (const form of [pluralForm, "other", "one"]) {
		if (translation[form]) {
			let result = translation[form]
			if (params) {
				result = interpolate(result, { ...params, count })
			}
			return result
		}
	}

	return String(translation)
}

type TranslationParams = Record<string, any> & {
	count?: number
}

export default function (
	key: string | number | null | undefined,
	params?: TranslationParams,
): string {
	if (!key) return ""
	if (typeof key !== "string") return String(key)

	const translationsState = useState<TranslationsType>("translations")
	const Language = useCookie<LanguagesType>("language", { sameSite: true })

	if (!hasProperty(translationsState.value ?? {}, `${Language.value}.${key}`)) {
		const unfoundTranslationsState = useState<TranslationsType>(
			"unfoundTranslations",
		)
		if (!unfoundTranslationsState.value) unfoundTranslationsState.value = {}
		setProperty(unfoundTranslationsState.value, key, null)
	}

	let translation =
		getProperty(translationsState.value ?? {}, `${Language.value}.${key}`) ??
		formatUnfoundTranslation(key, Language.value)

	// Handle pluralization if count is provided
	if (params?.count !== undefined) {
		translation = handlePlural(translation, params.count, Language.value, params)
	}
	// Handle interpolation if params are provided
	else if (params) {
		translation = interpolate(translation, params)
	}

	return translation
}
