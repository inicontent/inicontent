<template>
	<PlatformFeatureLanding feature="billing" />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
});

const database = useState<Database>("database");

useHead({
	title: `${t("billing")} | ${t(database.value.slug)} | ${t("dashboard")}`,
});
</script>