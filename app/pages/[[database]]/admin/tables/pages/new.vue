<template>
    <Builder v-model="page" />
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const page = ref<Page>({});
const database = useState<Database>("database");

useHead({
	title: `${t(database.value.slug)} | ${t("builder")} > ${t("new")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>
