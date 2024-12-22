<template>
	<Table></Table>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["database", "user", "dashboard", "table"],
	layout: "table",
});
</script>