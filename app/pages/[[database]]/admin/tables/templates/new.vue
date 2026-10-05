<template>
	<EmailTemplatesEditor />
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const database = useState<Database>("database");
const table = useState<Table>("table");

useHead({
	title: `${t(database.value.slug)} | ${t(table.value?.slug)} > ${t("emailTemplatesUi.new")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>