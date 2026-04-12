<template>
	<NFlex vertical :size="16">
		<NPageHeader :title="dashboard?.name ?? t('dashboard')">
			<template #extra>
				<NFlex :size="8" align="center">
					<NPopover trigger="click" placement="bottom-end">
						<template #trigger>
							<NButton size="small" secondary :type="dateRangeOverride ? 'primary' : 'default'">
								<template #icon>
									<NIcon>
										<Icon name="tabler:calendar" />
									</NIcon>
								</template>
								{{ t('dateRange') }}
							</NButton>
						</template>
						<NSelect
							v-model:value="dateRangeOverride"
							:options="dateRangeOptions"
							:placeholder="t('dateRange')"
							clearable
							style="width: 200px"
						/>
					</NPopover>
					<NButton
						v-if="user?.role === config.public.idOne"
						size="small"
						type="primary"
						secondary
						@click="navigateTo(`${routeBase}/admin/dashboards/${route.params.id}/edit`)"
					>
						<template #icon>
							<NIcon>
								<Icon name="tabler:edit" />
							</NIcon>
						</template>
						{{ t("edit") }}
					</NButton>
				</NFlex>
			</template>
		</NPageHeader>
		<NSpin :show="loading">
			<DashboardView
				v-if="dashboard"
				:dashboard="dashboard"
				:database-slug="databaseSlug"
				:date-range-override="dateRangeOverride"
			/>
		</NSpin>
	</NFlex>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();
const config = useRuntimeConfig();
const user = useState<User>("user");
const database = useState<Database>("database");

const databaseSlug = computed(() =>
	(route.params.database as string) || database.value?.slug || "",
);

const routeBase = computed(() =>
	route.params.database ? `/${route.params.database}` : "",
);

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useCookie<string | null>("sessionID", { sameSite: true });

const dashboard = ref<Dashboard | null>(null);
const currentDashboard = useState<Dashboard | null>("currentDashboard", () => null);
const loading = ref(true);
const dateRangeOverride = ref<WidgetDateRange | undefined>(undefined);

const dateRangeOptions = [
	{ label: t("last7Days"), value: "7d" },
	{ label: t("last30Days"), value: "30d" },
	{ label: t("last90Days"), value: "90d" },
	{ label: t("lastYear"), value: "1y" },
	{ label: t("allTime"), value: "all" },
];

onMounted(async () => {
	try {
		const slug = databaseSlug.value ? `${databaseSlug.value}/` : "";
		const res = await $fetch<apiResponse<Dashboard>>(
			`${config.public.apiBase}${slug}dashboards/${route.params.id}`,
			{
				params: {
					locale: Language.value,
					[`${databaseSlug.value}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		dashboard.value = res.result;
		currentDashboard.value = res.result;
		if (dashboard.value) {
			if (typeof dashboard.value.widgets === "string") {
				try {
					dashboard.value.widgets = JSON.parse(dashboard.value.widgets);
				} catch {}
			}
		}
	} catch {
		window.$message.error(t("error"));
	}
	loading.value = false;
});

useHead({
	title: computed(() => `${dashboard.value?.name ?? t("dashboard")} | ${t("dashboards")}`),
});
</script>
