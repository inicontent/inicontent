<template>
	<NFlex style="width: 100%;" vertical :size="24">
		<NCard :title="t('tables')" style="background:none" :bordered="false">
			<LazyTableGrid v-model="database" />
		</NCard>
		<NCard v-if="user?.role === config.public.idOne" :title="t('dashboards')" style="background:none" :bordered="false">
			<LazyDashboardGrid v-model="database" />
		</NCard>
	</NFlex>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
})

const database = useState<Database>("database")
const user = useState<User>("user");
const config = useRuntimeConfig();

useHead({
	title: `${t(database.value.slug)} | ${t("dashboard")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>