<template>
	<div>
		<Table ref="tableRef">
			<template #navbarActions>
				<NButtonGroup>
					<PreviewDropdown showHide />
					<NButton v-if="table.allowedMethods?.includes('c')" round :disabled="!table.schema" tag="a"
						:href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`"
						@click.prevent="navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`)">
						<template #icon>
							<NIcon>
								<Icon name="tabler:plus" />
							</NIcon>
						</template>
					</NButton>
				</NButtonGroup>
			</template>
			<template #default="{ data }">
				<NGrid v-if="data?.result?.length" :x-gap="12" :y-gap="12" cols="1 400:2 800:3">
					<NGridItem v-for="page in data.result">
						<NCard content-style="display:flex;justify-content:center;flex-direction:column">
							<template #header>
								<NFlex v-if="page.seo?.title" vertical>
									{{ page.seo.title }}
									<NText code class="Slug">{{ page.slug }}</NText>
								</NFlex>
								<NText v-else code class="Slug">{{ page.slug }}</NText>
							</template>
							<template #header-extra>
								<NPopover trigger="click" style="padding: 0">
									<template #trigger>
										<NButton secondary circle>
											<template #icon>
												<NIcon>
													<Icon name="tabler:dots-vertical" />
												</NIcon>
											</template>
										</NButton>
									</template>
									<NButtonGroup vertical>
										<NButton tertiary type="primary" tag="a"
											:href="`${$route.params.database ? `/${database.slug}` : ''}${page.slug}`"
											target="_blank">
											<template #icon>
												<NIcon>
													<Icon name="tabler:external-link" />
												</NIcon>
											</template>
											{{ t('view') }}
										</NButton>
										<NButton v-if="table.allowedMethods?.includes('u')" tertiary type="info" tag="a"
											:href="`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/pages/${page.slug}`"
											@click.stop.prevent="navigateTo(`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/pages/${page.slug}`)">
											<template #icon>
												<NIcon>
													<Icon name="tabler:pencil" />
												</NIcon>
											</template>
											{{ t('edit') }}
										</NButton>
										<NButton v-if="table.allowedMethods?.includes('c')" tertiary type="warning"
											@click.stop.prevent="clonePageTarget = page;">
											<template #icon>
												<NIcon>
													<Icon name="tabler:copy" />
												</NIcon>
											</template>
											{{ t('duplicate') }}
										</NButton>
										<NPopconfirm v-if="table.allowedMethods?.includes('d')" :onPositiveClick="() => tableRef?.delete(page.id as string)">
											<template #trigger>
												<NButton tertiary type="error">
													<template #icon>
														<NIcon>
															<Icon name="tabler:trash" />
														</NIcon>
													</template>
													{{ t('delete') }}
												</NButton>
											</template>
											{{ t("theFollowingActionIsIrreversible") }}
										</NPopconfirm>
									</NButtonGroup>
								</NPopover>
							</template>
							<LazyPreview v-if="selectedDevice && selectedDevice !== 'none'" mockup>
								<LazyBlockS v-model="page.content" />
							</LazyPreview>
						</NCard>
					</NGridItem>
				</NGrid>
				<NEmpty v-else />
			</template>
		</Table>
		<LazyClonePageModal v-if="clonePageTarget" :show="!!clonePageTarget" :page="clonePageTarget"
			@update:show="clonePageTarget = null"
			@cloned="onCloned" />
	</div>
</template>

<script setup lang="ts">
import { Icon, NIcon } from "#components";

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const tableRef = ref<TableRef>();

const database = useState<Database>("database");
const table = useState<Table>("table");

const clonePageTarget = ref<Page | null>(null);

function onCloned(page: Page) {
	const base = `/${database.value.slug}/admin/tables/pages/${page.slug}`;
	navigateTo(base);
}

const selectedDevice = useState<Devices>("selectedDevice");

useHead({
	title: `${t(database.value.slug)} | ${t(table.value?.slug)}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>

<style scoped>
.Slug {
	border-radius: 8px;
	width: fit-content;
}
</style>
