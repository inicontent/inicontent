import Inison from "inison"

export default async function () {
	const appConfig = useAppConfig()
	const Language = useCookie<keyof TranslationsType>("language", {
		sameSite: true,
	})
	const route = useRoute()
	const translationsState = useState<TranslationsType>("translations")
	const unfoundTranslationsState = useState<TranslationsType>(
		"unfoundTranslations",
	)

	if (Language.value && unfoundTranslationsState.value) {
		const fetchResult = (
			await $fetch<apiResponse<Item[]>>(
				`${appConfig.apiBase}${
					route.params?.database || "inicontent"
				}/translation`,
				{
					params: {
						where: Inison.stringify({
							original: `[]${Object.keys(unfoundTranslationsState.value).join(",")}`,
							locale: Language.value,
						}),
						credentials: "include",
					},
				},
			)
		).result
		if (fetchResult)
			for (const translation of fetchResult) {
				if (!translationsState.value[Language.value])
					// @ts-ignore
					translationsState.value[Language.value] = {}
				// @ts-ignore
				translationsState.value[Language.value][translation.original] =
					translation.translated
			}
	}
}
