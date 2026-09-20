<template>
	<PlatformFeatureLanding feature="templates" />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
});

const database = useState<Database>("database");

useHead({
	title: `${t("templates")} | ${t(database.value.slug)} | ${t("dashboard")}`,
});
</script>