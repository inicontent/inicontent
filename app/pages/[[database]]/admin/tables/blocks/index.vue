<template>
	<PlatformFeatureLanding feature="blocks" />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
});

const database = useState<Database>("database");

useHead({
	title: `${t("blocks")} | ${t(database.value.slug)} | ${t("dashboard")}`,
});
</script>