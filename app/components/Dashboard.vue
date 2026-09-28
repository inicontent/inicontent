<template>
	<NCard :title="t('databases')" style="background: none" :bordered="false">
		<template #header-extra>
			<NFlex justify="center" align="center">
				<NPagination v-if="pagination.itemCount && pagination.pageCount > 1"
				:simple="!!$device.isMobile" :page="pagination.page" :page-count="pagination.pageCount"
				@update:page="pagination.onUpdatePage" />
				<NButton :circle="$device.isMobile" :round="!$device.isMobile" @click="startDatabaseCreation">
					<template #icon>
						<NIcon>
							<Icon name="tabler:plus" />
						</NIcon>
					</template>
					<template v-if="!$device.isMobile">
						{{ t('createDatabase') }}
					</template>
				</NButton>
			</NFlex>
		</template>

		<NCard v-if="showDatabaseCreation" :title="t('createDatabase')" closable
			@close="showDatabaseCreation = false" style="margin-bottom: 20px;">
			<NForm ref="DatabaseRef" :model="DatabaseModal" style="margin-top: 20px;">
				<LazyFieldS v-model="DatabaseModal" :schema="databaseSchema" />
			</NForm>

			<template #action>
				<NFlex justify="end">
					<NButtonGroup>
						<NButton round secondary type="error" @click="showDatabaseCreation = false">
							{{ t("cancel") }}
							<template #icon>
								<NIcon>
									<Icon name="tabler:x" />
								</NIcon>
							</template>
						</NButton>
						<NButton round secondary type="primary" :loading="Loading.Database" @click="createDatabase">
							<template #icon>
								<NIcon>
									<Icon name="tabler:device-floppy" />
								</NIcon>
							</template>
							{{ t("create") }}
						</NButton>
					</NButtonGroup>
				</NFlex>
			</template>
		</NCard>
		<NSpin v-else-if="databases?.result?.length" size="small" :show="status === 'idle' || status === 'pending'">
			<NCollapse v-model:expanded-names="expandedNames"
				:triggerAreas="['main', 'arrow']" accordion>
				<NCollapseItem v-for="(database, index) in databases?.result" :title="t(database.slug)"
					:name="database.slug">
					<template #header-extra>
						<NButtonGroup round>
							<NButton round>
								<template #icon>
									<NuxtLink :to="`/${database.slug}/admin/settings`" external>
										<NIcon>
											<Icon name="tabler:settings" />
										</NIcon>
									</NuxtLink>
								</template>
							</NButton>
							<NButton round>
								<template #icon>
									<NuxtLink :to="`/${database.slug}/admin/tables`" external>
										<NIcon>
											<Icon name="tabler:arrow-right" />
										</NIcon>
									</NuxtLink>
								</template>
							</NButton>
						</NButtonGroup>
					</template>
					<LazyTableGrid v-model="(databases.result[index] as Database)" />
				</NCollapseItem>
			</NCollapse>
		</NSpin>
	</NCard>
</template>

<script setup lang="ts">
import type { FormInst } from "naive-ui";

onBeforeRouteLeave((route) => {
	if (route.params.database) clearNuxtState(["database", "table", "user"]);
});

const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const pagination = reactive({
	page: 1,
	pageCount: 1,
	perPage: 10,
	itemCount: 0,
	onUpdatePage(currentPage: number) {
		pagination.page = currentPage;
		refresh();
	},
});

const queryOptions = computed(() =>
	JSON.stringify({
		page: pagination.page,
		perPage: pagination.perPage,
	}),
);

const {
	data: databases,
	status,
	refresh,
} = await useLazyFetch<apiResponse<Database[]>>(
	`${config.public.apiBase}inicontent/databases`,
	{
		key: "databases",
		onResponse({ response }: { response: { _data: apiResponse<Database[]> } }) {
			if (response._data.result?.length)
				expandedNames.value = [response._data.result.at(-1)?.slug as string];
			pagination.pageCount = response._data.options?.totalPages ?? 1;
			pagination.itemCount = response._data.options?.total ?? 0;
		},
		transform: (response: apiResponse<Database[]>) => {
			response.result.map(formatDatabase);
			return response;
		},
		params: {
			options: queryOptions,
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		credentials: "include",
	},
);
const expandedNames = ref<string[]>();
const showDatabaseCreation = ref(false);

const DatabaseRef = ref<FormInst>();
const DatabaseModal = ref<Database>({});
const databaseSchema = computed<Schema>(() => [
	{
		key: "slug",
		type: "string",
		required: true,
		regex: "^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669-_]+$",
		width: 2,
	},
	{
		key: "primaryColor",
		type: "string",
		subType: "color",
		width: 2,
	},
	{
		key: "primaryLanguage",
		type: "string",
		subType: "select",
		options: translationLanguages.map((language) => ({
			label: t(`languages.${language}`),
			value: language,
		})),
		required: true,
		width: 2,
	},
	{
		key: "secondaryLanguages",
		type: "array",
		subType: "select",
		options: translationLanguages
			.filter((l) => l !== DatabaseModal.value.primaryLanguage)
			.map((language) => ({
				label: t(`languages.${language}`),
				value: language,
			})),
		required: false,
		width: 2,
	},
	{
		key: "icon",
		type: "table",
		table: "assets",
		accept: ["image"],
		params: "format=avif&fit=94",
	},
]);

function startDatabaseCreation() {
	DatabaseModal.value = {}; // Reset/initialize model
	showDatabaseCreation.value = true;
}

async function createDatabase() {
	DatabaseRef.value?.validate(async (errors: any) => {
		if (errors) return window.$message.error(t("inputsAreInvalid"));
		const bodyContent = toRaw(DatabaseModal.value);
		Loading.value.Database = true;
		const data = await $fetch<apiResponse>(
			`${config.public.apiBase}inicontent/databases/${bodyContent.slug}`,
			{
				method: "POST",
				body: bodyContent,
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		Loading.value.Database = false;
		if (!data.result) return window.$message.error(data.message);
		DatabaseModal.value = data.result;
		if (databases.value) {
			if (databases.value.result) databases.value.result.push(data.result);
			else databases.value.result = [data.result];
			expandedNames.value = [data.result.slug];
		}
		window.$message.success(data.message);
		showDatabaseCreation.value = false;
	});
}
</script>