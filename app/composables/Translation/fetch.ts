import Inison from "inison";

type TableTranslationOverlay = {
	hadPrevious: boolean;
	previous: unknown;
	applied: string;
};

export default async function (onlyTableTranslations = false) {
	const config = useRuntimeConfig();
	const database = useState<Database>("database");
	const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
	const translationsState = useState<TranslationsType>("translations", () => ({}));
	const tableOverlays = useState<
		Record<string, Record<string, TableTranslationOverlay>>
	>("tableTranslationOverlays", () => ({}));

	const table = useState<Table>("table");
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	if (!Language.value || !database.value) return;

	const locale = Language.value;
	const translationsByLocale = translationsState.value as unknown as Record<
		string,
		Record<string, string>
	>;
	const languageTranslations = () => translationsByLocale[locale] ?? {};

	let fetchResult: Item[] = [];
	let fetchSucceeded = false;
	try {
		const result = (
			await $fetch<apiResponse<Item[]>>(
				`${config.public.apiBase}${database.value.slug
				}/translations`,
				{
					params: {
						where: Inison.stringify({
							locale,
							original: "!=",
							...(table.value ? (onlyTableTranslations ? {table: table.value.id, field: 0} : {
								table: { or: [table.value.id, null] },
								field: 0,
							}) : { table: null }),
						}),
						[`${database.value.slug}_sid`]: sessionID.value,
						options: Inison.stringify({
							perPage: 500,
							columns: ["original", "translation", "table"],
						}),
						credentials: "include",
					},
				},
			)
		).result;
		fetchResult = result ?? [];
		fetchSucceeded = true;
	} catch (e) {
		console.error("[Translation] fetch global translations error", e);
	}

	if (!translationsState.value) translationsState.value = {} as TranslationsType;
	if (!translationsByLocale[locale]) translationsByLocale[locale] = {};
	const currentTranslations = languageTranslations();

	if (onlyTableTranslations && fetchSucceeded) {
		const previousOverlays = tableOverlays.value[locale] ?? {};
		for (const [key, overlay] of Object.entries(previousOverlays)) {
			if (currentTranslations[key] !== overlay.applied) continue;
			if (overlay.hadPrevious)
				currentTranslations[key] = overlay.previous as string;
			else delete currentTranslations[key];
		}
		delete tableOverlays.value[locale];
	}

	const merged: Record<string, string> = {};
	for (const translation of fetchResult) {
		if (
			!onlyTableTranslations &&
			(translation.table || translation.item || translation.field)
		)
			continue;
		const original = translation.original;
		const value = translation.translation;
		if (!original || typeof value !== "string") continue;
		merged[original] = value;
	}

	if (onlyTableTranslations) {
		const overlays: Record<string, TableTranslationOverlay> = {};
		for (const [key, value] of Object.entries(merged)) {
			overlays[key] = {
				hadPrevious: Object.prototype.hasOwnProperty.call(currentTranslations, key),
				previous: currentTranslations[key],
				applied: value,
			};
		}
		tableOverlays.value[locale] = overlays;
	}

	translationsByLocale[locale] = {
		...currentTranslations,
		...merged,
	};
}
