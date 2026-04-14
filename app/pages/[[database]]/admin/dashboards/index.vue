<template>
	<NCard :title="t('dashboards')" style="background:none" :bordered="false">
		<LazyDashboardGrid v-model="database" />
	</NCard>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
})

const database = useState<Database>("database")
useHead({
	title: `${t(database.value.slug)} | ${t("dashboards")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>