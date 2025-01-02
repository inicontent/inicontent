<template>
	<FormCard v-if="data" v-model="data"></FormCard>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: ["database", "user", "dashboard", "table"],
	layout: "table",
});
const route = useRoute();
const appConfig = useAppConfig();
const database = useState<Database>("database");
const table = useState<Table>("table");

const { data } = await useFetch<Item>(
	`${appConfig.apiBase}${database.value.slug}/${
		table.value.slug
	}/${route.params.id}`,
	{
		transform: (input) => input.result,
	},
);

if (!data.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "item",
		fatal: true,
	});
</script>
