<template>
    <TableFlows />
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["dashboard", "table"],
    layout: "table",
});
</script>