<template>
    <TableFlows />
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["database", "user", "dashboard", "table"],
    layout: "table",
});
</script>