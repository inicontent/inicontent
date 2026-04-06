<template>
	<TableSchedules />
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
})
</script>