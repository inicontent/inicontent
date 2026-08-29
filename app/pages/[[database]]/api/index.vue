<template>
    <main>
        <NFlex vertical size="large" style="padding: 24px 0">
            <NCard :bordered="false" style="background:none">
                <template #header>
                    <NH1 style="margin: 0">{{ t('apiDocs.publicApi.title') }}</NH1>
                </template>
                <NText type="secondary">{{ t('apiDocs.publicApi.description') }}</NText>
                <NAlert type="info" :show-icon="false" style="margin-top: 12px">
                    {{ t('publicApiHint') }}
                    <NuxtLink :to="authPath" style="margin-inline-start: 6px">
                        {{ t('loginLink') }}
                    </NuxtLink>
                </NAlert>
            </NCard>

            <NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:3">
                <NGridItem v-for="tableOption in publicTables" :key="tableOption.slug">
                    <NCard hoverable>
                        <template #header>
                            <NFlex align="center">
                                <NIconWrapper :border-radius="50" style="font-style: normal">
                                    <LazyTableIcon :table="tableOption" />
                                </NIconWrapper>
                                <NH4 style="margin: 0">{{ t(tableOption.slug) }}</NH4>
                            </NFlex>
                        </template>
                        <NFlex vertical :size="8">
                            <NText strong>{{ t('readAccess') }}</NText>
                            <NText type="secondary">{{ t('apiDocs.publicApi.collectionEndpoint') }}</NText>
                            <code class="api-endpoint">{{ `${tableOption.http} ${tableOption.collectionPath}` }}</code>
                            <NText type="secondary">{{ t('apiDocs.publicApi.singleEndpoint') }}</NText>
                            <code class="api-endpoint">{{ `${tableOption.http} ${tableOption.singlePath}` }}</code>
                        </NFlex>
                    </NCard>
                </NGridItem>
            </NGrid>
        </NFlex>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "default",
	middleware: ["database", "global"],
});

const config = useRuntimeConfig();
const database = useState<Database>("database");
const route = useRoute();
const sessionID = useSessionCookie();

const authPath = computed(
	() => `${route.params.database ? `/${route.params.database}` : ""}/auth`,
);

const shouldRedirect = await useAsyncData("api-doc-auth", async () => {
	if (!database.value?.slug || !sessionID.value) return false;
	try {
		const data = await $fetch<{ result: boolean }>(
			`${config.public.apiBase}${database.value.slug}/auth/current`,
			{
				credentials: "include",
				query: {
					isSignedIn: true,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		);
		return data.result;
	} catch (error) {
		return false;
	}
});

if (shouldRedirect.data.value) {
	await navigateTo(
		`${route.params.database ? `/${route.params.database}` : ""}/admin/api`,
	);
}

const publicTables = computed(() =>
	(database.value?.tables ?? [])
		.filter(
			({ allowedMethods, show }) =>
				allowedMethods?.includes("r") && show !== false,
		)
		.map((tableItem) => {
			const baseSlug = database.value?.slug ?? "inicontent";
			const basePath = `${config.public.apiBase}${baseSlug}/${tableItem.slug}`;
			return {
				...tableItem,
				http: "GET",
				collectionPath: `${basePath}?page=1&limit=25`,
				singlePath: `${basePath}/{id}`,
			};
		}),
);

useHead({
	title: `${t(database.value?.slug ?? "inicontent")} | ${t("publicApiTitle")}`,
	meta: [
		{
			name: "description",
			content: `Public read-only API for ${database.value?.slug ?? "inicontent"}. Browse publicly accessible table endpoints.`,
		},
	],
});
</script>

<style scoped>
.api-endpoint {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 6px 8px;
    overflow-x: auto;
    display: block;
    font-family: inherit;
}
</style>
