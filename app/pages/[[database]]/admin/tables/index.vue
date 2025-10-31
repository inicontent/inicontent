<template>
	<UCard :title="t('tables')" style="background:none" :bordered="false">
		<LazyTableGrid v-model="database" />
	</UCard>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
})

const database = useState<Database>("database")
useHead({
	title: `${t(database.value.slug)} | ${t("tables")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>