<template>
    <div class="flex flex-col">
        <LazyFormDrawer v-if="!$device.isMobile" />
        <UCard style="height: fit-content">
            <template #header>
                <div class="truncate">{{ t(table.slug) }}: {{ itemLabel }}</div>
            </template>
            <template v-if="table.schema && table.schema.length > 4" #header-extra>
                <UButtonGroup>
                    <UTooltip v-if="table.allowedMethods?.includes('u')" :delay="1500">
                        <template #trigger>
                            <UButton secondary round type="info">
                                <template #icon>
                                    <NuxtLink
                                        :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                                        <div class="inline-block">
                                            <Icon name="tabler:pencil" />
                                        </div>
                                    </NuxtLink>
                                </template>
                            </UButton>
                        </template>
                        {{ t('edit') }}
                    </UTooltip>

                    <UTooltip :delay="1500">
                        <template #trigger>
                            <UButton type="primary" @click="PRINT" round secondary>
                                <template #icon>
                                    <div class="inline-block">
                                        <Icon name="tabler:printer" />
                                    </div>
                                </template>
                            </UButton>
                        </template>
                        {{ t('print') }}
                    </UTooltip>
                </div>
            </template>
            <template #action>
                <UButtonGroup>
                    <UButton v-if="table.allowedMethods?.includes('u')" secondary round type="info">
                        <template #icon>
                            <NuxtLink
                                :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                                <div class="inline-block">
                                    <Icon name="tabler:pencil" />
                                </div>
                            </NuxtLink>
                        </template>

                        {{ t('edit') }}
                    </UButton>

                    <UButton type="primary" @click="PRINT" round secondary>
                        <template #icon>
                            <div class="inline-block">
                                <Icon name="tabler:printer" />
                            </div>
                        </template>
                        {{ t('print') }}
                    </UButton>
                </div>
            </template>
            <LazyDataS v-if="data && table.schema" :value="data" :schema="table.schema" />
        </UCard>
        <LazyTableLogs v-if="table.config?.log && data" :id="data.id" />
    </div>
</template>

<script lang="ts" setup>
import Inison from "inison"

onBeforeRouteUpdate((route, currentRoute) => {
	if (`${decodeURIComponent(currentRoute.fullPath)}/edit` !== route.fullPath)
		clearNuxtState("currentItem")
})

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
})

defineTranslation({
	ar: {
		print: "طباعة",
	},
})

const appConfig = useAppConfig()
const route = useRoute()
const database = useState<Database>("database")
const table = useState<Table>("table")

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

const { data } = await useFetch<Item>(
	`${appConfig.apiBase}${database.value.slug}/${
		table.value.slug
	}/${route.params.id}`,
	{
		query: {
			options: Inison.stringify({
				columns: table.value.columns,
			}),
			[`${database.value.slug}_sid`]: sessionID.value,
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

function PRINT() {
	window.print()
}

const currentItem = useState<Item>("currentItem")
currentItem.value = data.value
const itemLabel = renderLabel(table.value, data.value)

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${itemLabel}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>