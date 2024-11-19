import { getProperty, setProperty, hasProperty } from "inidot";

function formatUnfoundTranslation(
	input: string,
	language: LanguagesType,
): string {
	input = decodeURI(input);
	if (input.includes(".")) input = input.split(".").pop() ?? "";

	if (language !== "en" || input.toUpperCase() === input) return input;
	if (input.length === 2) return input.toUpperCase();

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
	];

	// Split by capital letters and underscores
	const words = input.split(/_(?![A-Z]+)|(?<=[a-z])(?=[A-Z])/);

	// Process each word
	const formattedWords = words.map((word, index) => {
		if (word.charAt(0) === "_") word = word.slice(1);

		if (word.toUpperCase() === word) return word.trim();

		// Capitalize the first character
		if (index === 0 || !lowercaseWords.includes(word.toLowerCase()))
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

		// Check if the word is in the linking or lowercase words and convert to lowercase
		if (lowercaseWords.includes(word.toLowerCase())) return word.toLowerCase();

		// Replace underscores with space
		const wordWithoutUnderscore = word.replace("_", " ");

		// Add space before each capitalized character
		return wordWithoutUnderscore
			.replace(/([A-Z])/g, " $1")
			.trim()
			.toLowerCase();
	});

	// Join the formatted words with spaces
	return formattedWords.join(" ");
}

export default function (key: string | number | null | undefined): string {
	if (!key) return "";
	if (typeof key !== "string") return String(key);

	const translationsState = useState<TranslationsType>("translations");
	const Language = useCookie<LanguagesType>("language", { sameSite: true });

	if (!hasProperty(translationsState.value ?? {}, `${Language.value}.${key}`)) {
		const unfoundTranslationsState = useState<TranslationsType>(
			"unfoundTranslations",
		);
		if (!unfoundTranslationsState.value) unfoundTranslationsState.value = {};
		setProperty(unfoundTranslationsState.value, key, null);
	}

	return (
		getProperty(translationsState.value ?? {}, `${Language.value}.${key}`) ??
		formatUnfoundTranslation(key, Language.value)
	);
}
