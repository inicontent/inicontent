<template>
	<AuthReset />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
})
</script>