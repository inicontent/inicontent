<template>
	<div>
		<LazyFormCard v-if="dataObject" v-model="dataObject" />
		<LazyTableLogs v-if="table.config?.log && dataObject" :id="dataObject.id" />
	</div>
</template>

<script lang="ts" setup>
import Inison from "inison"

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
})

onBeforeRouteUpdate((route, currentRoute) => {
	if (route.fullPath !== currentRoute.fullPath.slice(0, -5))
		clearNuxtState("currentItem")
})

const route = useRoute()
const appConfig = useAppConfig()
const database = useState<Database>("database")
const table = useState<Table>("table")
const dataObject = ref<Item>({})
await useFetch<Item>(
	`${appConfig.apiBase}${database.value.slug}/${table.value.slug
	}/${route.params.id}`,
	{
		query: {
			options: Inison.stringify({
				columns: table.value.columns,
			}),
		},
		transform: (input) => {
			dataObject.value = input.result
		},
		credentials: "include",
	},
)

if (!dataObject.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "item",
		fatal: true,
	})

const currentItem = useState<Item>("currentItem")
currentItem.value = dataObject.value
</script>
