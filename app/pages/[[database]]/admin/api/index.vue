<template></template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: ["database", "user", "dashboard", "global"],
})

const route = useRoute()

await navigateTo(
    `${route.params.database ? `/${route.params.database}` : ""}/admin/api/tables`,
)
</script>
