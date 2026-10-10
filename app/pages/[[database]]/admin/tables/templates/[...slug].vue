<template>
	<EmailTemplatesEditor v-if="template" :template="template" />
</template>

<script lang="ts" setup>
import Inison from "inison";

interface EmailTemplate {
	id?: string;
	name?: string;
	subject?: string;
	content?: string;
}

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const route = useRoute();
const database = useState<Database>("database");
const table = useState<Table>("table");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const templateName = ([] as string[]).concat(route.params.slug || []).join("/");

// A name containing `[segment]` placeholders (e.g. `order/[locale]`) must
// never be sent inside a `where` value — Inison reserves brackets for arrays
// and the API errors. Fetch all templates and pick the exact match instead.
const isTemplatePatternName = isTemplatePattern(templateName);

const { data: template } = await useFetch<EmailTemplate>(
	`${useApiBase()}${database.value.slug}/templates`,
	{
		params: isTemplatePatternName
			? {
					locale: Language.value,
					options: Inison.stringify({
						perPage: 1000,
						columns: ["*"],
					}),
				}
			: {
					locale: Language.value,
					where: Inison.stringify({ name: templateName }),
				},
		transform: (res) =>
			isTemplatePatternName
				? (res.result ?? []).find((item) => item.name === templateName)
				: res.result?.[0],
		deep: true,
		credentials: "include",
	},
);

if (!template.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "template",
		fatal: true,
	});

useHead({
	title: `${t(database.value.slug)} | ${t(table.value?.slug)} > ${template.value.name}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>