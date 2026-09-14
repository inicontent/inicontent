<template>
    <NIcon>
        <Icon
            v-if="table.icon || ['assets', 'translations', 'users', 'sessions', 'pages', 'blocks', 'templates'].includes(table.slug)"
            :name="getTableIcon(table)" />
        <span v-else>{{ t(table.slug).charAt(0).toUpperCase() }}</span>
    </NIcon>
</template>

<script setup lang="ts">
defineProps<{
	table: Table
}>()

function getTableIcon(table: Table) {
	if (table.icon) return `tabler:${table.icon}`
	switch (table.slug) {
		case "assets":
			return "tabler:folder"
		case "translations":
			return "tabler:language"
		case "users":
			return "tabler:users"
		case "sessions":
			return "tabler:fingerprint"
		case "pages":
			return "tabler:template"
		case "blocks":
			return "tabler:layout-2"
		case "templates":
			return "tabler:mail-spark"
		default:
			return "tabler:table"
	}
}
</script>