<template>
	<BlockS v-if="page" v-model="page.content" />
</template>

<script lang="ts" setup>
import Inison from "inison";

definePageMeta({ middleware: ["database", "user"] });

const route = useRoute();
const database = useState<Database>("database");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const currentPage = useState<Page | null>("currentPage", () => null);
if (database.value.slug === "inicontent") await navigateTo("/");

const { data: page } = await useFetch<Page>(
	`${config.public.apiBase}${database.value.slug}/pages`,
	{
		query: {
			where: Inison.stringify({ slug: "/" }),
			locale: Language,
			[`${database.value.slug}_sid`]: sessionID,
		},
		watch: [Language],
		transform: (res) => res.result?.[0],
		credentials: "include",
	},
);
// Per-locale block-config overlays are applied client-side (the API only
// overlays page slug/SEO fields; block `config` is a JSON column).
if (page.value) {
	const merged = await useTranslationOverlay().applyPageBlockOverlays(
		page.value,
		Language.value,
	);
	if (merged) page.value = merged;
}
currentPage.value = page.value ?? null;
watch(page, (v) => {
	currentPage.value = v ?? null;
});
if (!page.value) {
	await navigateTo(
		database.value.slug === "inicontent"
			? "/auth"
			: `/${route.params.database ? `${route.params.database}/` : ""}auth`,
	);
} else {
	useSeoMeta({
		title: page.value.seo?.title || page.value.name,
		description: page.value.seo?.description,
		ogTitle: page.value.seo?.title || page.value.name,
		ogDescription: page.value.seo?.description,
		ogImage: page.value.seo?.image?.publicURL,
	});
}
</script>
