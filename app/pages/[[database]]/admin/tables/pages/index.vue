<template>
	<PlatformFeatureLanding feature="pages" />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
});

const database = useState<Database>("database");

useHead({
	title: `${t("pages")} | ${t(database.value.slug)} | ${t("dashboard")}`,
});
</script>