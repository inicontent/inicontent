<template>
	<div>
		<Table ref="tableRef">
			<template #navbarActions>
				<NButtonGroup>
					<NButton type="primary" secondary round tag="a"
						:href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`"
						@click.prevent="navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`)">
						<template #icon>
							<NIcon>
								<Icon name="tabler:plus" />
							</NIcon>
						</template>
						{{ t('newBlock') }}
					</NButton>
				</NButtonGroup>
			</template>
			<template #default>
				<NGrid v-if="sortedBlocks.length" :x-gap="12" :y-gap="12" cols="1 400:2 800:3">
					<NGridItem v-for="block in sortedBlocks" :key="String(block.id)">
						<NCard content-style="display:flex;justify-content:center;flex-direction:column">
							<template #header>
								<NFlex align="center" justify="space-between" :wrap="false">
									<NText code class="Slug">{{ block.name }}</NText>
									<NTag v-if="isSystemBlock(block)" size="small" type="warning" round>
										<template #icon>
											<Icon name="tabler:lock" />
										</template>
										{{ t('template') }}
									</NTag>
								</NFlex>
							</template>
							<template v-if="!isSystemBlock(block)" #header-extra>
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
										<NButton tertiary type="info" tag="a"
											:href="`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/blocks/${block.id}`"
											@click.stop.prevent="navigateTo(`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/blocks/${block.id}`)">
											<template #icon>
												<NIcon>
													<Icon name="tabler:pencil" />
												</NIcon>
											</template>
											{{ t('edit') }}
										</NButton>
										<NButton tertiary type="warning" @click.stop.prevent="duplicateBlock(block)">
											<template #icon>
												<NIcon>
													<Icon name="tabler:copy" />
												</NIcon>
											</template>
											{{ t('duplicate') }}
										</NButton>
										<NPopconfirm
											:onPositiveClick="() => tableRef?.delete(block.id as string)">
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
							<LazyPreview v-if="!isSystemBlock(block) && !!previewDevice && previewDevice !== 'none'"
								mockup>
								<LazyBlock :model-value="block" />
							</LazyPreview>
							<NEmpty v-else-if="isSystemBlock(block)"
								:description="t('templateHint')" />
						</NCard>
					</NGridItem>
				</NGrid>
				<NEmpty v-else />
			</template>
		</Table>
	</div>
</template>

<script setup lang="ts">
import Inison from "inison";
import { Icon, NIcon } from "#components";

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const tableRef = ref<TableRef>();

const database = useState<Database>("database");
const table = useState<Table>("table");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const previewDevice = useState<Devices>("selectedDevice");

// A row whose `name` is the plain pseudo-block "Template" is a system row the
// page builder manages itself (dynamic-page bindings) — never user-editable.
function isSystemBlock(block: Content) {
	return String(block.name ?? "").split("/")[0] === "Template";
}

// Keep system rows out of the preview grid's edit affordances and push them to
// the end: reusable blocks first (newest first), then Template pseudo-blocks.
// `config` is pre-normalized from its array storage form to an object so the
// read-only preview can render without mutating the row.
const sortedBlocks = computed(() => {
	const rows = [...((tableRef.value?.data?.result ?? []) as Content[])];
	const blockType = (name?: string) => String(name ?? "").split("/")[0] as Blocks;
	return rows
		.map((row) => {
			if (isSystemBlock(row)) return row;
			const type = blockType(row.name);
			if (!Object.hasOwn(blockTypes, type)) return row;
			return {
				...row,
				config: Array.isArray(row.config)
					? convertArrayToObject(
							row.config,
							blockTypes[type].schema,
						)
					: row.config,
			};
		})
		.filter((row) => {
			if (isSystemBlock(row)) return true;
			return Object.hasOwn(blockTypes, blockType(row.name));
		})
		.sort((a, b) => {
			const system = Number(isSystemBlock(a)) - Number(isSystemBlock(b));
			if (system) return system;
			const createdA = Date.parse(String(a.createdAt ?? ""));
			const createdB = Date.parse(String(b.createdAt ?? ""));
			return (Number.isFinite(createdB) ? createdB : 0) -
				(Number.isFinite(createdA) ? createdA : 0);
		});
});

async function duplicateBlock(block: Content) {
	const data = await $fetch<apiResponse<Content[]>>(
		`${config.public.apiBase}${database.value.slug}/blocks`,
		{
			method: "POST",
			body: [{ name: block.name, config: block.config }],
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
				options: Inison.stringify({ columns: "id" }),
			},
			credentials: "include",
		},
	);
	if (!data.result?.length) window.$message.error(data.message);
	tableRef.value?.search({});
}

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