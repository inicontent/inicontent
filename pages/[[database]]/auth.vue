<template>
	<Auth />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "table", "global"],
})
</script>
