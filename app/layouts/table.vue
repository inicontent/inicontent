<template>
	<NuxtLayout name="dashboard">
		<NLayout position="absolute" has-sider>
			<NLayoutSider v-if="database?.slug" :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
				isMenuOpen = !collapsed" style="z-index: 1000" bordered show-trigger="bar" collapse-mode="width"
				:collapsed-width="$device.isMobile ? 0 : 64" width="240" :native-scrollbar="false">
				<NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="$device.isMobile ? 0 : 64"
					:options="menuOptions" :defaultValue :watch-props="['defaultValue']" accordion />
			</NLayoutSider>
			<NLayoutContent id="pageContent" position="absolute" :content-style="{
				padding: $device.isMobile
					? '24px 12px'
					: Language === 'ar'
						? '24px 88px 24px 24px'
						: '24px 24px 24px 88px',
			}" :native-scrollbar="false">
				<div v-if="isMenuOpen" @mouseover="() => isMenuOpen = false"
					style="width: 100%;height: 100%;right: 0;top: 0;position: absolute;background-color: #0000006e;z-index: 99;cursor: pointer;">
				</div>
				<slot></slot>
			</NLayoutContent>
		</NLayout>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { Icon, LazyTableIcon, NuxtLink, NIcon } from "#components";

const Language = useCookie<LanguagesType>("language", { sameSite: true });

onBeforeUpdate(() => {
	clearNuxtState("isMenuOpen");
});

const config = useRuntimeConfig();
const route = useRoute();
const user = useState<User>("user");
const table = useState<Table>("table");
const isMenuOpen = useState("isMenuOpen", () => false);
const database = useState<Database>("database");
const dashboards = ref<Dashboard[]>([]);
const adminBase = computed(() =>
	route.params.database ? `/${route.params.database}` : "",
);
const defaultValue = computed(() => {
	const pathSegments = route.path.split("/").filter(Boolean);
	const lastPathInRoute = decodeURIComponent(pathSegments.at(-1) ?? "");
	if (route.path.includes("/admin/dashboards")) {
		const dashboardIndex = pathSegments.indexOf("dashboards");
		return decodeURIComponent(
			(pathSegments[dashboardIndex + 1] as string | undefined) ?? "dashboards",
		);
	}
	if (table.value?.slug) {
		if (lastPathInRoute && lastPathInRoute !== table.value.slug)
			return `${table.value.slug}-${lastPathInRoute}`;
		return table.value.slug;
	}
	return decodeURI(lastPathInRoute?.toString() ?? "");
});
const sessionID = useCookie<string | null>("sessionID", { sameSite: true });
const hasDashboardsTable = computed(
	() =>
		database.value?.tables?.some(
			({ slug, allowedMethods, show }) =>
				slug === "dashboards" &&
				!!allowedMethods &&
				allowedMethods.includes("r") &&
				show !== false,
			) ?? false,
);

const fetchDashboards = async () => {
	if (!hasDashboardsTable.value || !database.value?.slug) {
		dashboards.value = [];
		return;
	}
	try {
		const res = await $fetch<apiResponse<Dashboard[]>>(
			`${config.public.apiBase}${database.value.slug}/dashboards`,
			{
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		dashboards.value = res.result ?? [];
	} catch {
		dashboards.value = [];
	}
};

watch(
	() => [database.value?.slug, sessionID.value, Language.value],
	() => {
		fetchDashboards();
	},
	{ immediate: true },
);

function renderSingleItem(table: Table): MenuOption {
	const tableUrl = `${adminBase.value}/admin/tables/${table.slug}`;
	const itemChildren = [
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: tableUrl,
					},
					{ default: () => t("showAll") },
				),
			key: table.slug,
			show: table.slug !== "assets",
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:eye" })),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${tableUrl}/new`,
					},
					{ default: () => t("newItem") },
				),
			key: `${table.slug}-new`,
			show: table.slug !== "assets" && table.allowedMethods?.includes("c"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:plus" })),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${tableUrl}/settings`,
					},
					{ default: () => t("settings") },
				),
			key: `${table.slug}-settings`,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:settings" })),
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations", "assets"].includes(table.slug),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${tableUrl}/flows`,
					},
					{ default: () => t("flows") },
				),
			key: `${table.slug}-flows`,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:webhook" })),
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations"].includes(table.slug),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${tableUrl}/schedules`,
					},
					{ default: () => t("schedules") },
				),
			key: `${table.slug}-schedules`,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:clock-play" })),
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations", "assets"].includes(table.slug) &&
				table.allowedMethods?.includes("c"),
		},
	];
	return {
		label: () =>
			h(
				NuxtLink,
				{
					to: tableUrl,
				},
				{ default: () => t(table.slug) },
			),
		key: itemChildren.length ? `${table.slug}Group` : table.slug,
		icon: () => h(LazyTableIcon, { table }),
		children: [
			{
				type: "group",
				label: t(table.slug),
				key: table.slug,
				children: itemChildren.length ? itemChildren : undefined,
			},
		],
	};
}

function renderDashboardItem(): MenuOption {
	const dashboardsUrl = `${adminBase.value}/admin/dashboards`;
	return {
		label: () =>
			h(
				NuxtLink,
				{
					to: dashboardsUrl,
				},
				{ default: () => t("dashboards") },
			),
		key: "dashboardsGroup",
		icon: () =>
			h(NIcon, () => h(Icon, { name: "tabler:layout-dashboard" })),
		children: [
			{
				type: "group",
				label: t("dashboards"),
				key: "dashboards-menu",
				children: [
					{
						label: () =>
							h(
								NuxtLink,
								{
									to: dashboardsUrl,
								},
								{ default: () => t("showAll") },
							),
						key: "dashboards",
						icon: () =>
							h(NIcon, () => h(Icon, { name: "tabler:chart-bar" })),
					},
					...dashboards.value.map((dashboard) => ({
						label: () =>
							h(
								NuxtLink,
								{
									to: `${dashboardsUrl}/${dashboard.id}`,
								},
								{
									default: () => dashboard.name?.trim() || t("dashboard"),
								},
							),
						key: String(dashboard.id),
						icon: () =>
							h(NIcon, () =>
								h(Icon, {
									name: dashboard.icon
										? `tabler:${dashboard.icon}`
										: "tabler:chart-bar",
								}),
							),
					})),
				],
			},
		],
	};
}

const menuOptions = computed(() => {
	if (!database.value?.tables) return [] as MenuOption[];

	const primaryTableOptions =
		database.value.tables
			.filter(
				({ slug, allowedMethods, show }) =>
					![
						"users",
						"sessions",
						"assets",
						"translations",
						"pages",
						"blocks",
						"dashboards",
					].includes(slug) &&
					!!allowedMethods &&
					allowedMethods.trim() !== "" &&
					show !== false,
			)
			.map(renderSingleItem) ?? [];

	const secondaryTableOptions =
		database.value.tables
			.filter(
				({ slug, allowedMethods, show }) =>
					["users", "sessions", "assets", "pages", "blocks"].includes(slug) &&
					!!allowedMethods &&
					allowedMethods.trim() !== "" &&
					show !== false,
			)
			.map(renderSingleItem) ?? [];

	const options: MenuOption[] = [...primaryTableOptions];

	if (hasDashboardsTable.value) {
		options.push(renderDashboardItem());
	}

	if (secondaryTableOptions.length) {
		options.push({ key: "divider-1", type: "divider" });
	}

	options.push(...secondaryTableOptions);

	return options;
});
</script>