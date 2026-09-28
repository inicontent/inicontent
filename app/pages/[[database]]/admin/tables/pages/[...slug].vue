<template>
	<Builder v-if="page" v-model="page" />
</template>

<script lang="ts" setup>
import Inison from "inison";
import { isTemplatePattern } from "~/composables/pageTemplate";

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const route = useRoute();
const database = useState<Database>("database");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const pageSlug = ([] as string[]).concat(route.params.slug || "/").join("/");

// A slug containing `[segment]` placeholders (e.g. `users/[id]`) is a
// template pattern — never send it inside a `where` value (Inison reserves
// brackets for arrays and the API errors). Fetch all pages and pick the exact
// match instead.
const isTemplatePatternSlug = isTemplatePattern(pageSlug);

const { data: page } = await useFetch<Page>(
	`${config.public.apiBase}${database.value.slug}/pages`,
	{
		params: isTemplatePatternSlug
			? {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
					options: Inison.stringify({
						perPage: 1000,
						columns: ["*"],
					}),
				}
			: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
					where: Inison.stringify({ slug: pageSlug }),
				},
		transform: (res) =>
			isTemplatePatternSlug
				? (res.result ?? []).find((item) => item.slug === pageSlug)
				: res.result?.[0],
		deep: true,
		credentials: "include",
	},
);

if (!page.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "page",
		fatal: true,
	});

useHead({
	title: `${t(database.value.slug)} | ${t("builder")} > ${page.value.slug}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>
