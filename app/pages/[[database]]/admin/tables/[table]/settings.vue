<template>
    <TableSettings />
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: [
		"database",
		"user",
		"dashboard",
		"table",
		(route) => {
			if (
				["sessions", "translations", "assets"].includes(
					route.params.table as string,
				)
			) {
				// Same as the table middleware: a thrown error is silently
				// swallowed during client-side navigation, so surface it via
				// showError() and let the navigation complete.
				showError(createError({
					statusCode: 403,
				}))
				return true
			}
		},
	],
	layout: "table",
})
</script>