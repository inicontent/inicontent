<template>
	<NFlex vertical :size="16">
		<NPageHeader :title="t('editDashboard')" />
		<NSpin :show="loading">
			<DashboardEditor
				v-if="dashboard"
				:dashboard="dashboard"
				:database-slug="databaseSlug"
				@saved="onSaved"
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
const router = useRouter();
const config = useRuntimeConfig();
const database = useState<Database>("database");

const databaseSlug = computed(() =>
	(route.params.database as string) || database.value?.slug || "",
);

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useCookie<string | null>("sessionID", { sameSite: true });

const dashboard = ref<Dashboard | null>(null);
const currentDashboard = useState<Dashboard | null>("currentDashboard", () => null);
const loading = ref(true);

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

function onSaved(saved: Dashboard) {
	const base = route.params.database ? `/${route.params.database}` : "";
	router.push(`${base}/admin/dashboards/${saved.id}`);
}

useHead({
	title: computed(() => `${t("editDashboard")} | ${dashboard.value?.name ?? ""}`),
});
</script>
