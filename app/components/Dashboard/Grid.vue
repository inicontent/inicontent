<template>
	<NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:4">
		<NGridItem v-for="dashboard in dashboards" :key="dashboard.id">
			<NCard hoverable>
				<template #header>
					<NuxtLink :to="getDashboardUrl(dashboard.id)">
						<NFlex align="center">
							<NIconWrapper :border-radius="50" style="font-style: normal">
								<NIcon size="20">
									<Icon :name="dashboard.icon ? `tabler:${dashboard.icon}` : 'tabler:chart-bar'" />
								</NIcon>
							</NIconWrapper>
							<NH4 style="margin: 0">{{ dashboard.name }}</NH4>
						</NFlex>
					</NuxtLink>
				</template>
				<template #header-extra>
					<NDropdown
						:options="getDropdownOptions(dashboard)"
						:renderLabel="renderDropdownLabel"
					>
						<NButton circle size="small">
							<template #icon>
								<NIcon>
									<Icon name="tabler:dots" />
								</NIcon>
							</template>
						</NButton>
					</NDropdown>
				</template>
				<NText depth="3">
					{{
						dashboard.description ||
						t("widgetCount", { count: dashboard.widgets?.length ?? 0 })
					}}
				</NText>
			</NCard>
		</NGridItem>

		<NGridItem v-if="user?.role === config.public.idOne">
			<NPopover trigger="click" v-model:show="showPopover">
				<template #trigger>
					<NCard
						style="cursor: pointer"
						content-style="padding: 36.5px 0px"
						hoverable
						@click="showPopover = !showPopover"
					>
						<NFlex justify="center" align="center">
							<NIcon size="36">
								<Icon name="tabler:plus" />
							</NIcon>
						</NFlex>
					</NCard>
				</template>
				<NInputGroup>
					<NInput
						v-model:value="newDashboardName"
						@keydown.enter.prevent="createDashboard"
						:placeholder="t('dashboardName')"
					>
						<template #suffix>
							<NIcon>
								<Icon name="tabler:chart-bar" />
							</NIcon>
						</template>
					</NInput>
					<NButton @click="createDashboard" :loading="Loading.Dashboard">
						<template #icon>
							<NIcon>
								<Icon name="tabler:chevron-right" />
							</NIcon>
						</template>
					</NButton>
				</NInputGroup>
			</NPopover>
		</NGridItem>
	</NGrid>
</template>

<script lang="ts" setup>
import { type DropdownOption, NIcon } from "naive-ui";
import { Icon, NuxtLink } from "#components";

const modelValue = defineModel<Database>({ required: true });

const showPopover = ref(false);
const newDashboardName = ref("");

const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const user = useState<User>("user");
const route = useRoute();
const database = useState<Database>("database");

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useCookie<string | null>("sessionID", { sameSite: true });

const dashboards = ref<Dashboard[]>([]);

const hasDashboardsTable = computed(() =>
	modelValue.value.tables?.some((t) => t.slug === "dashboards"),
);

const ensureDashboardsTable = async () => {
	if (hasDashboardsTable.value) return true;
	if (user.value?.role !== config.public.idOne) return false;
	try {
		const res = await $fetch<apiResponse<Table>>(
			`${config.public.apiBase}inicontent/databases/${modelValue.value.slug}/dashboards`,
			{
				method: "POST",
				body: {
					schema: [
						{ key: "name", type: "string", required: true },
						{ key: "description", type: "string" },
						{ key: "icon", type: "string" },
						{ key: "widgets", type: "json" },
					],
					show: false,
					onRequest: [
						[
							["@user.4", "!=", 1],
							["@method", "!=", "GET"],
							["error", "accessDenied"],
						],
					],
				},
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		if (res.result) {
			modelValue.value.tables?.push(res.result);
			return true;
		}
	} catch {}
	return false;
};

const fetchDashboards = async () => {
	if (!hasDashboardsTable.value) {
		const created = await ensureDashboardsTable();
		if (!created) return;
	}
	try {
		const res = await $fetch<apiResponse<Dashboard[]>>(
			`${config.public.apiBase}${modelValue.value.slug}/dashboards`,
			{
				params: {
					locale: Language.value,
					[`${modelValue.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		dashboards.value = res.result ?? [];
	} catch {
		dashboards.value = [];
	}
};

onMounted(fetchDashboards);

function getDashboardUrl(id?: string | number) {
	return `/${route.params.database || (database.value?.slug === "inicontent" && route.path === "/admin") ? `${modelValue.value.slug}/` : ""}admin/dashboards/${id}`
}

const createDashboard = async () => {
	if (!newDashboardName.value) {
		window.$message.error(t("inputsAreInvalid"));
		return;
	}
	Loading.value.Dashboard = true;
	try {
		const res = await $fetch<apiResponse<Dashboard>>(
			`${config.public.apiBase}${modelValue.value.slug}/dashboards`,
			{
				method: "POST",
				body: {
					name: newDashboardName.value,
					widgets: [],
				},
				params: {
					locale: Language.value,
					[`${modelValue.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		if (res.result) {
			dashboards.value.push(res.result);
			window.$message.success(res.message);
			newDashboardName.value = "";
			showPopover.value = false;
		} else {
			window.$message.error(res.message ?? t("error"));
		}
	} catch {
		window.$message.error(t("error"));
	}
	Loading.value.Dashboard = false;
};

const deleteDashboard = async (id: string | number) => {
	try {
		const res = await $fetch<apiResponse<any>>(
			`${config.public.apiBase}${modelValue.value.slug}/dashboards/${id}`,
			{
				method: "DELETE",
				params: {
					locale: Language.value,
					[`${modelValue.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		if (res.result) {
			dashboards.value = dashboards.value.filter((d) => d.id !== id);
			window.$message.success(res.message);
		} else {
			window.$message.error(res.message ?? t("error"));
		}
	} catch {
		window.$message.error(t("error"));
	}
};

const getDropdownOptions = (dashboard: Dashboard) => {
	const url = getDashboardUrl(dashboard.id);
	return [
		{
			key: url,
			label: t("view"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:eye" })),
		},
		{
			key: `${url}/edit`,
			label: t("edit"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:edit" })),
			show: user.value?.role === config.public.idOne,
		},
		{
			key: `delete-${dashboard.id}`,
			label: t("delete"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
			show: user.value?.role === config.public.idOne,
		},
	];
};

function renderDropdownLabel(option: DropdownOption) {
	const key = String(option.key);
	if (key.startsWith("delete-")) {
		const id = key.replace("delete-", "");
		return h(
			"span",
			{
				style: "color: var(--error-color); cursor: pointer;",
				onClick: () => deleteDashboard(id),
			},
			() => option.label,
		);
	}
	return h(NuxtLink, { to: key }, () => option.label);
}
</script>
