<template>
	<NSpin :show="loading">
		<NCard style="background: none" :bordered="false">
			<template #header>
				<NFlex align="center" :size="8">
					<template v-if="editMode && draft">
						<NPopover trigger="click" placement="bottom-start">
							<template #trigger>
								<NButton circle quaternary size="small">
									<NIcon size="20">
										<Icon
											:name="
												draft.icon
													? `tabler:${draft.icon}`
													: 'tabler:chart-bar'
											"
										/>
									</NIcon>
								</NButton>
							</template>
							<div style="width: 280px">
								<LazyFieldIcon
									v-model="draft.icon"
									:field="{ key: 'icon', type: 'string', subType: 'icon' }"
								/>
							</div>
						</NPopover>
						<NInput
							v-model:value="draft.name"
							size="small"
							:placeholder="t('dashboardName')"
							style="max-width: 360px"
						/>
					</template>
					<template v-else>
						<NIconWrapper :border-radius="50" style="font-style: normal">
							<NIcon size="20">
								<Icon
									:name="
										dashboard?.icon
											? `tabler:${dashboard.icon}`
											: 'tabler:chart-bar'
									"
								/>
							</NIcon>
						</NIconWrapper>
						<NH4 style="margin: 0">{{ dashboard?.name ?? t("dashboard") }}</NH4>
					</template>
				</NFlex>
			</template>
			<template #header-extra>
				<NFlex :size="8" align="center">
					<NPopover v-if="dashboard?.widgets?.length" style="padding:0" trigger="click" placement="bottom-end">
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
					<template v-if="editMode && draft">
						<NButton size="small" secondary @click="addWidget">
							<template #icon>
								<NIcon>
									<Icon name="tabler:plus" />
								</NIcon>
							</template>
							{{ t("addWidget") }}
						</NButton>
						<NButton size="small" secondary @click="cancelEdit">
							{{ t("cancel") }}
						</NButton>
						<NButton size="small" type="primary" secondary :loading="saving" @click="save">
							{{ t("save") }}
						</NButton>
					</template>
					<NButton
						v-else-if="user?.role === config.public.idOne"
						size="small"
						type="primary"
						secondary
						@click="enterEditMode"
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
			<LazyDashboardView
				v-if="dashboard"
				ref="viewRef"
				:dashboard="editMode && draft ? draft : dashboard"
				:database-slug="databaseSlug"
				:date-range-override="dateRangeOverride"
				:edit-mode="editMode && !!draft"
				v-model:widgets="widgetsModel"
			/>
		</NCard>
	</NSpin>
</template>

<script setup lang="ts">
import type { DashboardView } from "#components";

definePageMeta({
	layout: "table",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const user = useState<User>("user");
const database = useState<Database>("database");

const databaseSlug = computed(
	() => (route.params.database as string) || database.value?.slug || "",
);

const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const dashboard = ref<Dashboard | null>(null);
const currentDashboard = useState<Dashboard | null>(
	"currentDashboard",
	() => null,
);
const loading = ref(true);
const dateRangeOverride = ref<WidgetDateRange | undefined>(undefined);

const editMode = ref(false);
const draft = ref<Dashboard | null>(null);
const saving = ref(false);

const widgetsModel = computed({
	get: () => draft.value?.widgets ?? [],
	set: (v) => {
		if (draft.value) draft.value.widgets = v;
	},
});

const dateRangeOptions = [
	{ label: t("last7Days"), value: "7d" },
	{ label: t("last30Days"), value: "30d" },
	{ label: t("last90Days"), value: "90d" },
	{ label: t("lastYear"), value: "1y" },
	{ label: t("allTime"), value: "all" },
];

const canEdit = computed(() => user.value?.role === config.public.idOne);

const viewRef = ref<InstanceType<typeof DashboardView> | null>(null);

function addWidget() {
	viewRef.value?.addWidget();
}

const parseWidgets = (d: Dashboard) => {
	if (typeof d.widgets === "string") {
		try {
			d.widgets = JSON.parse(d.widgets);
		} catch {}
	}
};

function enterEditMode() {
	if (!dashboard.value || editingNow.value) return;
	draft.value = deepClone(dashboard.value) ?? null;
	if (draft.value && !draft.value.widgets) draft.value.widgets = [];
	editMode.value = true;
}

function cancelEdit() {
	editMode.value = false;
	draft.value = null;
}

const editingNow = computed(() => editMode.value && !!draft.value);

async function save() {
	if (!draft.value?.name) {
		window.$message.error(t("inputsAreInvalid"));
		return;
	}
	saving.value = true;
	try {
		const slug = databaseSlug.value ? `${databaseSlug.value}/` : "";
		const res = await $fetch<apiResponse<Dashboard>>(
			`${config.public.apiBase}${slug}dashboards/${route.params.id}`,
			{
				method: "PUT",
				body: {
					name: draft.value.name,
					description: draft.value.description,
					icon: draft.value.icon,
					widgets: draft.value.widgets,
				},
				params: {
					locale: Language.value,
					[`${databaseSlug.value}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		if (res.result) {
			dashboard.value = res.result;
			currentDashboard.value = res.result;
			parseWidgets(dashboard.value);
			window.$message.success(res.message);
			cancelEdit();
		} else {
			window.$message.error(res.message ?? t("error"));
		}
	} catch {
		window.$message.error(t("error"));
	}
	saving.value = false;
}

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
			parseWidgets(dashboard.value);
			if (route.query.edit === "true" && canEdit.value) {
				enterEditMode();
				const query = { ...route.query };
				delete query.edit;
				await router.replace({ query });
			}
		}
	} catch {
		window.$message.error(t("error"));
	}
	loading.value = false;
});

useHead({
	title: computed(
		() => `${dashboard.value?.name ?? t("dashboard")} | ${t("dashboards")}`,
	),
});
</script>