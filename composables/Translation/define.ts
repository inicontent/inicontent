import { deepMerge } from "inibase/utils"

export default function (translations: TranslationsType) {
	const translationsState = useState<TranslationsType>("translations")
	if (translationsState.value)
		translationsState.value = deepMerge(translationsState.value, translations)
	else translationsState.value = translations
}
