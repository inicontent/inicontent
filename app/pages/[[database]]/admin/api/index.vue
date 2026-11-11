<template>
	<NFlex justify="center" align="center" style="min-height: 50vh">
		<NSpin size="large" />
	</NFlex>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();

await navigateTo(
	`${databaseRoutePrefix(route)}/admin/api/tables`,
);
</script>
