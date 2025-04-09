<template>
    <LazyFormDrawer v-if="!$device.isMobile" />
    <NCard style="height: fit-content">
        <template #header>
            <NPerformantEllipsis>{{ t(table.slug) }}: {{ itemLabel }}</NPerformantEllipsis>
        </template>
        <template v-if="table.schema && table.schema.length > 4" #header-extra>
            <NButtonGroup>
                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton disabled round secondary>
                            <template #icon>
                                <NIcon>
                                    <IconSettings />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('settings') }}
                </NTooltip>

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton secondary round type="info">
                            <template #icon>
                                <NuxtLink
                                    :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                                    <NIcon>
                                        <IconPencil />
                                    </NIcon>
                                </NuxtLink>
                            </template>
                        </NButton>
                    </template>
                    {{ t('edit') }}
                </NTooltip>

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton type="primary" @click="PRINT" round secondary>
                            <template #icon>
                                <NIcon>
                                    <IconPrinter />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('print') }}
                </NTooltip>
            </NButtonGroup>
        </template>
        <template #action>
            <NButtonGroup>
                <NButton disabled round secondary>
                    <template #icon>
                        <NIcon>
                            <IconSettings />
                        </NIcon>
                    </template>
                    {{ t('settings') }}
                </NButton>

                <NButton secondary round type="info">
                    <template #icon>
                        <NuxtLink
                            :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}/edit`">
                            <NIcon>
                                <IconPencil />
                            </NIcon>
                        </NuxtLink>
                    </template>

                    {{ t('edit') }}
                </NButton>

                <NButton type="primary" @click="PRINT" round secondary>
                    <template #icon>
                        <NIcon>
                            <IconPrinter />
                        </NIcon>
                    </template>
                    {{ t('print') }}
                </NButton>
            </NButtonGroup>
        </template>
        <LazyDataS v-if="data && table.schema" :value="data" :schema="table.schema" />
    </NCard>
</template>

<script lang="ts" setup>
import {
	NButton,
	NCard,
	NPerformantEllipsis,
	NIcon,
	NTooltip,
	NButtonGroup,
} from "naive-ui";
import { IconPencil, IconPrinter, IconSettings } from "@tabler/icons-vue";
import Inison from "inison";

onBeforeRouteUpdate((route, currentRoute) => {
	if (`${decodeURIComponent(currentRoute.fullPath)}/edit` !== route.fullPath)
		clearNuxtState("itemLabel");
});

definePageMeta({
	middleware: ["database", "user", "dashboard", "table"],
	layout: "table",
});

defineTranslation({
	ar: {
		print: "طباعة",
	},
});

const appConfig = useAppConfig();
const route = useRoute();
const database = useState<Database>("database");
const table = useState<Table>("table");
const { data } = await useFetch<Item>(
	`${appConfig.apiBase}${database.value.slug}/${
		table.value.slug
	}/${route.params.id}`,
	{
		query: {
			options: Inison.stringify({
				columns: table.value.columns ?? "",
			}),
		},
		transform: (input) => input.result,
	},
);

if (!data.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "item",
		fatal: true,
	});

function PRINT() {
	window.print();
}

const itemLabel = useState("itemLabel", () =>
	renderLabel(table.value, data.value ?? undefined),
);

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${itemLabel.value}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>