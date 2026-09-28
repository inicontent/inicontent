import Inison from "inison";
import { rebuildLocalizedSlug } from "./translationOverlay";

// Module-level cache: which locales actually have a translation for a given
// page, keyed by `${databaseSlug}:${pageId}` — shared across every Header
// instance so switching pages/re-rendering doesn't refetch needlessly.
const availableLocalesCache = new Map<string, string[]>();
const inFlight = new Map<string, Promise<string[]>>();

export function usePageLanguages() {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);
	const currentPage = useState<Page | null>("currentPage", () => null);
	const route = useRoute();

	const siteLanguages = computed<LanguagesType[]>(() =>
		[
			database.value?.primaryLanguage,
			...(database.value?.secondaryLanguages ?? []),
		].filter((lang): lang is LanguagesType => Boolean(lang)),
	);

	const translatedLocales = ref<string[]>([]);

	async function loadTranslatedLocales() {
		const pageId = currentPage.value?.id;
		const databaseSlug = database.value?.slug;
		const pagesTableId = database.value?.tables?.find(
			(table) => table.slug === "pages",
		)?.id;
		if (!databaseSlug || !pageId || !pagesTableId) {
			translatedLocales.value = [];
			return;
		}

		const key = `${databaseSlug}:${pageId}`;
		const cached = availableLocalesCache.get(key);
		if (cached) {
			translatedLocales.value = cached;
			return;
		}
		const existing = inFlight.get(key);
		if (existing) {
			translatedLocales.value = await existing;
			return;
		}

		const request = (async () => {
			try {
				const res = await $fetch<apiResponse<{ locale?: string }[]>>(
					`${config.public.apiBase}${databaseSlug}/translations`,
					{
						params: {
							where: Inison.stringify({ table: pagesTableId, item: pageId }),
							options: Inison.stringify({
								columns: ["locale"],
								perPage: 500,
							}),
							[`${databaseSlug}_sid`]: sessionID.value,
						},
						credentials: "include",
					},
				);
				const locales = [
					...new Set(
						(res.result ?? [])
							.map((record) => record.locale)
							.filter((locale): locale is string => Boolean(locale)),
					),
				];
				availableLocalesCache.set(key, locales);
				return locales;
			} catch (e) {
				console.error("[usePageLanguages] fetch translated locales error", e);
				return [];
			} finally {
				inFlight.delete(key);
			}
		})();
		inFlight.set(key, request);
		translatedLocales.value = await request;
	}

	watch(() => currentPage.value?.id, loadTranslatedLocales, {
		immediate: true,
	});

	// The primary language is the authored content — always available.
	// Secondary languages only show once the page actually has a translation.
	const availableLanguages = computed<LanguagesType[]>(() => {
		const primary = database.value?.primaryLanguage;
		const translated = new Set(translatedLocales.value);
		return siteLanguages.value.filter(
			(lang) => lang === primary || translated.has(lang),
		);
	});

	/**
	 * The target locale's slug for a page. `GET /{db}/pages/{id}?locale=<lang>`
	 * returns the canonical slug for the primary language and the localized
	 * slug otherwise (falling back to canonical when untranslated).
	 */
	async function slugForPage(
		pageId: string | number,
		lang: LanguagesType,
	): Promise<string | undefined> {
		if (!database.value?.slug) return undefined;
		try {
			const res = await $fetch<apiResponse<Page>>(
				`${config.public.apiBase}${database.value.slug}/pages/${String(pageId)}`,
				{
					params: {
						locale: lang,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			);
			return res.result?.slug;
		} catch (error) {
			console.error("[usePageLanguages] localized slug lookup failed", error);
			return undefined;
		}
	}

	/**
	 * Rebuild the current URL path for the target locale: static slug segments
	 * are replaced with the target slug; dynamic `[segment]` values keep their
	 * captured values (e.g. `articles/my-post` + `articulos/[slug]` →
	 * `articulos/my-post`). The optional `/{database}` route prefix is kept.
	 */
	async function targetPath(
		page: Page,
		lang: LanguagesType,
	): Promise<string | undefined> {
		const targetSlug = await slugForPage(page.id, lang);
		if (typeof targetSlug !== "string") return undefined;
		const urlSegments = ([] as string[]).concat(route.params.slug ?? []);
		const rebuilt = rebuildLocalizedSlug(urlSegments, targetSlug);
		const path = rebuilt ? `/${rebuilt}` : "/";

		const raw = Array.isArray(route.params.database)
			? route.params.database[0]
			: route.params.database;
		const prefix =
			typeof raw === "string" && raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";
		if (!prefix) return path;
		return path === "/" ? prefix : `${prefix}${path}`;
	}

	function switchLanguage(lang: LanguagesType) {
		Language.value = lang;
		const page = currentPage.value;
		if (!page?.id) return; // Not on a resolved page — cookie-only switch.
		void targetPath(page, lang)
			.then((target) => {
				if (target) void navigateTo(target);
			})
			.catch(() => {});
	}

	return { siteLanguages, availableLanguages, switchLanguage };
}
