<template>
	<div>
		<NFlex justify="end" align="center" wrap :size="8" style="padding: 12px 0">
			<NButton
				v-if="table.allowedMethods?.includes('c')"
				type="primary"
				round
				tag="a"
				:href="newPath"
				@click.prevent="navigateTo(newPath)"
			>
				<template #icon>
					<NIcon>
						<Icon name="tabler:plus" />
					</NIcon>
				</template>
				{{ t("emailTemplatesUi.new") }}
			</NButton>
		</NFlex>

		<NGrid v-if="templates?.length" :x-gap="12" :y-gap="12" cols="1 400:2 800:3">
			<NGridItem v-for="template in templates" :key="template.id">
				<NCard content-style="display:flex;flex-direction:column">
					<template #header>
						<NFlex vertical :size="4">
							<NText code class="Slug">{{ template.name }}</NText>
							<NText
								v-if="template.subject"
								depth="3"
								style="font-size: 12px"
							>
								{{ template.subject }}
							</NText>
						</NFlex>
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
								<NButton
									v-if="table.allowedMethods?.includes('u')"
									tertiary
									type="info"
									tag="a"
									:href="editPath(template.name)"
									@click.stop.prevent="navigateTo(editPath(template.name))"
								>
									<template #icon>
										<NIcon>
											<Icon name="tabler:pencil" />
										</NIcon>
									</template>
									{{ t("edit") }}
								</NButton>
								<NPopconfirm
									v-if="table.allowedMethods?.includes('d')"
									:onPositiveClick="() => remove(template)"
								>
									<template #trigger>
										<NButton tertiary type="error">
											<template #icon>
												<NIcon>
													<Icon name="tabler:trash" />
												</NIcon>
											</template>
											{{ t("delete") }}
										</NButton>
									</template>
									{{ t("theFollowingActionIsIrreversible") }}
								</NPopconfirm>
							</NButtonGroup>
						</NPopover>
					</template>
					<NText depth="3" style="font-size: 12px">
						{{ t("emailTemplatesUi.rowsHint") }}
					</NText>
					<OnVisible :min-height="'220px'" style="margin-top: 10px">
						<EmailTemplatesFullPreview
							v-if="template.content"
							:content="template.content"
						/>
						<NEmpty
							v-else
							:description="t('emailTemplates.previewEmpty')"
							style="padding: 18px 0"
						/>
					</OnVisible>
				</NCard>
			</NGridItem>
		</NGrid>
		<NEmpty v-else-if="!pending" :description="t('emailTemplatesUi.empty')" />
	</div>
</template>

<script setup lang="ts">
import Inison from "inison";
import { Icon, NIcon } from "#components";

interface EmailTemplate {
	id?: string;
	name?: string;
	subject?: string;
	content?: string;
}

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
});

const route = useRoute();
const database = useState<Database>("database");
const table = useState<Table>("table");
const config = useRuntimeConfig();
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const tablePath = `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/templates`;
const newPath = `${tablePath}/new`;

const editPath = (name: string) => `${tablePath}/${encodeURIComponent(name)}`;

const { data: templates, pending } = await useFetch<EmailTemplate[]>(
	`${config.public.apiBase}${database.value.slug}/templates`,
	{
		params: {
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
			options: Inison.stringify({ perPage: 1000 }),
		},
		transform: (res) => res.result ?? [],
		credentials: "include",
	},
);

async function remove(template: EmailTemplate) {
	const res = await $fetch<apiResponse<boolean>>(
		`${config.public.apiBase}${database.value.slug}/templates/${template.id}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	);

	if (res.result) {
		window.$message?.success(res.message);
		templates.value = (templates.value ?? []).filter(
			(item) => item.id !== template.id,
		);
	} else {
		window.$message?.error(res.message);
	}
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