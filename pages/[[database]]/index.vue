<template></template>

<script lang="ts" setup>
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard"],
});

const database = useState<Database>("database");
await navigateTo(
	database.value.slug === "inicontent" ? "admin" : "admin/tables",
);
</script>
