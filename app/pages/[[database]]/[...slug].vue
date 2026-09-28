<template>
	<BlockS v-if="page?.content" :model-value="page.content" @update:model-value="(value) => { if (page) page.content = value }" />
</template>

<script lang="ts" setup>
import Inison from "inison";
import {
	filterPageContent,
	getPageTemplate,
	isTemplatePattern,
	resolveItemTemplate,
} from "~/composables/pageTemplate";

definePageMeta({ middleware: ["database", "user"] });

const route = useRoute();
const database = useState<Database>("database");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

// The item a dynamic page renders (bound via the page's "Template" block).
const templateItem = useState<Item | null>("templateItem", () => null);
// The resolved page for the current route — exposed so nested blocks (e.g.
// the Header's language switcher) can read the current page id.
const currentPage = useState<Page | null>("currentPage", () => null);

const urlSegments = ([] as string[]).concat(route.params.slug);
const pageTemplate = usePageTemplate();

// A URL whose segments contain `[segment]` placeholders (e.g. `users/[id]`)
// is a template *pattern*, never a stored page slug — skip the exact-match
// fetch below (and never send `[`/`]` inside a `where` value: Inison treats
// them as array delimiters and the API responds with a parse error).
const isTemplatePatternURL = urlSegments.some(isTemplatePattern);

// 1. Exact slug match — a plain page (or a matched dynamic slug that happens
//    to be stored without placeholders).
const { data: page } = isTemplatePatternURL
	? { data: ref<Page>() }
	: await useFetch<Page>(
			`${config.public.apiBase}${database.value.slug}/pages`,
			{
				query: {
					where: Inison.stringify({
						slug: urlSegments.join("/"),
					}),
					locale: Language,
					[`${database.value.slug}_sid`]: sessionID,
				},
				watch: [Language],
				transform: (res) => res.result?.[0],
				credentials: "include",
			},
		);

// 2. Dynamic-page fallback: match the URL against template pages whose slug
//    contains `[segment]` slots, then load the matching item.
if (!page.value?.id) {
	try {
		const matched = await pageTemplate.findTemplatePage(urlSegments);
		if (matched) {
			const template = getPageTemplate(matched.page) ?? {};
			if (template.table) {
				const item = await pageTemplate.findTemplateItem(
					template.table,
					matched.capture,
					template.segments,
				);
				// Dynamic URL without an item → keep `page` undefined → 404.
				if (item?.id) {
					templateItem.value = item;
					page.value = {
						...matched.page,
						content: filterPageContent(matched.page.content),
					};
				}
			} else {
				page.value = {
					...matched.page,
					content: filterPageContent(matched.page.content),
				};
			}
		}
	} catch {
		// Leave `page` undefined → 404 below when the URL matches nothing.
	}
} else {
	// Exact match — a static page, never an item-backed one.
	templateItem.value = null;
}

// A static page that got the invisible "Template" block must not render it.
if (page.value) page.value.content = filterPageContent(page.value.content);

// Per-locale block-config overlays are applied client-side (the API only
// overlays page slug/SEO fields; block `config` is a JSON column). The render
// deep-copies the page, so the canonical `config` is never mutated.
if (page.value) {
	const merged = await useTranslationOverlay().applyPageBlockOverlays(
		page.value,
		Language.value,
	);
	if (merged) page.value = merged;
}

if (!page.value?.content) {
	throw createError({
		statusCode: 404,
		statusMessage: "page",
		fatal: true,
	});
}

currentPage.value = page.value;
watch(page, (v) => {
	currentPage.value = v ?? null;
});

if (page.value?.seo) {
	// Dynamic template pages may use `{{item.<column>}}` bindings (e.g.
	// `{{item.username}} Page`) that resolve against the item being rendered.
	const seoItem = templateItem.value ?? undefined;
	useSeoMeta({
		title:
			resolveItemTemplate(page.value.seo.title, seoItem) || page.value.name,
		description: resolveItemTemplate(page.value.seo.description, seoItem),
		ogTitle:
			resolveItemTemplate(page.value.seo.title, seoItem) || page.value.name,
		ogDescription: resolveItemTemplate(page.value.seo.description, seoItem),
		ogImage: page.value.seo?.image?.publicURL,
	});
}
</script>