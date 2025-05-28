<template>
	<Table></Table>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
})
</script>