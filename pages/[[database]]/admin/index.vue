<template>
	<NCard :title="t('databases')" style="background: none" :bordered="false">
		<template #header-extra>
			<NButton :circle="$device.isMobile" :round="!$device.isMobile"
				@click="DatabaseModal = {}, showDatabaseModal = true">
				<template #icon>
					<NIcon>
						<IconPlus />
					</NIcon>
				</template>
				<template v-if="!$device.isMobile">
					{{ t('addNewDatabase') }}
				</template>
			</NButton>
		</template>
		<NDrawer v-model:show="showDatabaseModal" :placement="Language === 'ar' ? 'left' : 'right'"
			:width="$device.isMobile ? '100%' : 350">
			<NDrawerContent :title="t('createDatabase')" closable>
				<template #footer>
					<NFlex justify="end">
						<NButton round :loading="Loading.Database" @click="saveDatabase">
							<template #icon>
								<NIcon>
									<IconDeviceFloppy />
								</NIcon>
							</template>
							{{ t("create") }}
						</NButton>
					</NFlex>
				</template>
				<NForm ref="DatabaseRef" :model="DatabaseModal">
					<LazyFieldS v-model="DatabaseModal" :schema="databaseSchema" />
				</NForm>
			</NDrawerContent>
		</NDrawer>
		<NCollapse v-if="databases?.result?.length" v-model:expanded-names="expandedNames"
			:triggerAreas="['main', 'arrow']" accordion>
			<NCollapseItem v-for="(database, index) in databases?.result" :title="t(database.slug)"
				:name="database.slug">
				<template #header-extra>
					<NButtonGroup>
						<NButton round>
							<template #icon>
								<NuxtLink :to="`/${database.slug}/admin/settings`">
									<NIcon>
										<IconSettings />
									</NIcon>
								</NuxtLink>
							</template>
						</NButton>
						<NButton round>
							<template #icon>
								<NuxtLink :to="`/${database.slug}/admin/tables`">
									<NIcon>
										<IconArrowRight />
									</NIcon>
								</NuxtLink>
							</template>
						</NButton>
					</NButtonGroup>
				</template>
				<LazyTableGrid v-model="databases.result[index]" />
			</NCollapseItem>
		</NCollapse>
		<NEmpty v-else />
	</NCard>
</template>

<script setup lang="ts">
import {
	IconArrowRight,
	IconDeviceFloppy,
	IconPlus,
	IconSettings,
} from "@tabler/icons-vue";
import {
	type FormInst,
	NButton,
	NButtonGroup,
	NCard,
	NCollapse,
	NCollapseItem,
	NEmpty,
	NForm,
	NIcon,
	NDrawer,
	NDrawerContent,
	NFlex,
} from "naive-ui";

definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();
const database = useState<Database>("database");

const Language = useCookie<LanguagesType>("language", { sameSite: true });

onBeforeRouteLeave((route) => {
	if (route.params.database) clearNuxtState(["database", "table", "user"]);
});

defineTranslation({
	ar: {
		newItem: "عنصر جديد",
		databases: "قواعد البيانات",
		createDatabase: "إنشاء قاعدة بيانات جديدة",
	},
});
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

const { data: databases, execute } = await useFetch<apiResponse<Database[]>>(
	`${appConfig.apiBase}inicontent/databases`,
	{
		immediate: false,
		onResponse({ response }: { response: { _data: apiResponse<Database[]> } }) {
			if (response._data.result?.length)
				expandedNames.value = [response._data.result.at(-1)?.slug as string];
		},
	},
);
const expandedNames = ref<string[]>();
const showDatabaseModal = ref(false);
const DatabaseRef = ref<FormInst | null>(null);
const DatabaseModal = ref<Database>();
const databaseSchema: Schema = [
	{
		key: "slug",
		type: "string",
		required: true,
	},
	{
		key: "icon",
		type: "table",
		table: "assets",
		accept: ["image"],
		params: "format=avif&fit=94",
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
	},
	{
		key: "primaryColor",
		type: "string",
		subType: "color",
	},
];
async function saveDatabase() {
	DatabaseRef.value?.validate(async (errors: any) => {
		if (!errors) {
			const bodyContent = JSON.parse(JSON.stringify(DatabaseModal.value));
			Loading.value.Database = true;
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}inicontent/databases/${bodyContent.slug}`,
				{
					method: bodyContent.id ? "PUT" : "POST",
					body: bodyContent,
				},
			);
			Loading.value.Database = false;

			if (!data.result) return window.$message.error(data.message);

			if (databases.value) {
				if (databases.value.result) databases.value.result.push(data.result);
				else databases.value.result = [data.result];
				expandedNames.value = [data.result.slug];
			}
			showDatabaseModal.value = false;
			window.$message.success(data.message);
		} else window.$message.error(t("inputsAreInvalid"));
	});
}

if (database.value.slug !== "inicontent")
	await navigateTo(
		`/${route.params.database ? `${database.value.slug}/` : ""}admin/tables`,
	);
else await execute();

useHead({
	title: `${t(database.value.slug)} | ${t("dashboard")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>