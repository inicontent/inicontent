import Inison from "inison";

export default async function () {
	const config = useRuntimeConfig();
	const Language = useCookie<keyof TranslationsType>("language", {
		sameSite: true,
	});
	const translationsState = useState<TranslationsType>("translations");

	const database = useState<Database>("database");
	const sessionID = useSessionCookie();

	if (!Language.value || !database.value) return;

	const locale = Language.value;

	let fetchResult: Item[] = [];
	try {
		const result = (
			await $fetch<apiResponse<Item[]>>(
				`${config.public.apiBase}${
					database.value.slug
				}/translations`,
				{
					params: {
						where: Inison.stringify({
							locale,
							original: "!="
						}),
						[`${database.value.slug}_sid`]: sessionID.value,
						options: Inison.stringify({ perPage: 500 }),
						credentials: "include",
					},
				},
			)
		).result;
		fetchResult = result ?? [];
	} catch (e) {
		console.error("[Translation] fetch global translations error", e);
	}

	// Merge only global UI translations (records without a table/item/field)
	// into the translation system so `t()` picks them up.
	const merged: Record<string, string> = {};
	for (const translation of fetchResult) {
		if (translation.table || translation.item || translation.field) continue;
		const original = translation.original;
		const value = translation.translation ?? translation.translated;
		if (!original || typeof value !== "string") continue;
		merged[original] = value;
	}

	if (!Object.keys(merged).length) return;

	if (!translationsState.value)
		translationsState.value = {} as TranslationsType;
	if (!translationsState.value[locale]) translationsState.value[locale] = {};
	translationsState.value[locale] = {
		...translationsState.value[locale],
		...merged,
	} as SingleLanguageTranslations;
}
