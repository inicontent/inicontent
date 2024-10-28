<template></template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["database", "user", "dashboard"],
});

const database = useState<Database>("database");
await navigateTo(
    database.value.slug === "inicontent" ? "admin" : "admin/tables",
);
</script>
