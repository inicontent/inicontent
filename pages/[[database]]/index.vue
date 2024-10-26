<template></template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["database", "user", "dashboard"],
});

const route = useRoute()
const database = useState<Database>("database");
await navigateTo(
    `/${route.params.database ? `${database.value.slug}/` : ""}admin${database.value.slug === 'inicontent' ? '' : '/tables'}`,
);
</script>
