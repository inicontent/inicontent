<template>
	<div>
		<LazyFormCard v-if="data" v-model="data" />
		<LazyTableLogs v-if="table.config?.log && data" :id="data.id" />
	</div>
</template>

<script lang="ts" setup>
import Inison from "inison"

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
})

const route = useRoute()
const appConfig = useAppConfig()
const database = useState<Database>("database")
const table = useState<Table>("table")

const { data } = await useFetch<Item>(
	`${appConfig.apiBase}${database.value.slug}/${table.value.slug
	}/${route.params.id}`,
	{
		query: {
			options: Inison.stringify({
				columns: table.value.columns,
			}),
		},
		transform: (input) => input.result,
		credentials: "include",
	},
)

if (!data.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "item",
		fatal: true,
	})
</script>
