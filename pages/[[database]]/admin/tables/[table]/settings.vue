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
			)
				throw createError({
					statusCode: 403,
				})
		},
	],
	layout: "table",
})
</script>