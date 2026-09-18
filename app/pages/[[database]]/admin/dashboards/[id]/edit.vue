<template>
	<NCard :title="t('editDashboard')" style="background:none" :bordered="false">
		<NSpin :show="loading">
			<DashboardEditor
				v-if="dashboard"
				:dashboard="dashboard"
				@saved="onSaved"
			/>
		</NSpin>
	</NCard>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const database = useState<Database>("database");

const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const dashboard = ref<Dashboard | null>(null);
const currentDashboard = useState<Dashboard | null>("currentDashboard", () => null);
const loading = ref(true);

onMounted(async () => {
	try {
		const res = await $fetch<apiResponse<Dashboard>>(
			`${config.public.apiBase}${database.value.slug}dashboards/${route.params.id}`,
			{
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
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
