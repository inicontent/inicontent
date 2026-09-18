<template>
	<NuxtLayout name="dashboard">
		<NLayout position="absolute" has-sider>
			<NLayoutSider v-if="database?.slug" :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
				isMenuOpen = !collapsed" :style="{ zIndex: 1000, borderLeft: Language === 'ar' ? '1px solid var(--n-border-color)' : 'none', borderRight: Language === 'ar' ? 'none' : '1px solid var(--n-border-color)' }" bordered show-trigger="bar" collapse-mode="width"
				:collapsed-width="$device.isMobile ? 0 : 64" width="240" :native-scrollbar="false">
				<NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="$device.isMobile ? 0 : 64"
					:options="menuOptions" :defaultValue :watch-props="['defaultValue']" :render-extra="renderMenuExtra" accordion />
			</NLayoutSider>
			<NLayoutContent id="pageContent" :content-style="{
				padding: $device.isMobile
					? '24px 12px'
					: Language === 'ar'
						? '0 24px 24px 24px'
						: '0 24px 24px 24px',
			}" :native-scrollbar="false">
				<slot></slot>
			</NLayoutContent>
		</NLayout>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { Icon, LazyTableIcon, NButton, NButtonGroup, NIcon, NPopover, NTooltip, NuxtLink } from "#components";

interface TableAction {
	key: string;
	to: string;
	icon: string;
	labelKey: string;
	show: boolean;
}

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const isMenuOpen = useScopedCookie<boolean>("isMenuOpen", database.value?.slug);

const config = useRuntimeConfig();
const route = useRoute();
const user = useState<User>("user");
const table = useState<Table>("table");
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
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
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

watch(table, () => fetchTranslation(true))

watch(
	() => [database.value?.slug, sessionID.value, Language.value],
	() => {
		fetchDashboards();
	},
	{ immediate: true },
);

function getTableUrl(slug: string) {
	return `${adminBase.value}/admin/tables/${slug}`;
}

function getTableActions(tbl: Table): TableAction[] {
	const tableUrl = `${adminBase.value}/admin/tables/${tbl.slug}`;
	return [
		{
			labelKey: "showAll",
			to: tableUrl,
			key: tbl.slug,
			show: tbl.slug !== "assets",
			icon: "tabler:eye",
		},
		{
			labelKey: "newItem",
			to: `${tableUrl}/new`,
			key: `${tbl.slug}-new`,
			show: tbl.slug !== "assets" && !!tbl.allowedMethods?.includes("c"),
			icon: "tabler:plus",
		},
		{
			labelKey: "settings",
			to: `${tableUrl}/settings`,
			key: `${tbl.slug}-settings`,
			icon: "tabler:settings",
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations", "assets"].includes(tbl.slug),
		},
		{
			labelKey: "flows",
			to: `${tableUrl}/flows`,
			key: `${tbl.slug}-flows`,
			icon: "tabler:webhook",
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations"].includes(tbl.slug),
		},
		{
			labelKey: "schedules",
			to: `${tableUrl}/schedules`,
			key: `${tbl.slug}-schedules`,
			icon: "tabler:clock-play",
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations", "assets"].includes(tbl.slug) &&
				!!tbl.allowedMethods?.includes("c"),
		},
	];
}

function renderActionsPopover(
	items: { key: string; to: string; icon: string; title: string; active: boolean }[],
	triggerActive: boolean,
) {
	if (!items.length) return undefined;
	return h(
		NPopover,
		{
			placement: Language.value === "ar" ? "left" : "right",
			raw: true,
		},
		{
			trigger: () =>
				h(
					NButton,
					{
						text: true,
					},
					{
						icon: () => h(NIcon, { size: 16 }, () => h(Icon, { name: "tabler:dots" })),
					}
				),
			default: () =>
				h(
					NButtonGroup,
					{ vertical: true },
					items.map((item) =>
						h(
							NTooltip,
							{ 
								placement: Language.value === "ar" ? "left" : "right",
							 	width: 60, 
							 	contentStyle: { textAlign: "center" }
							},
							{
								trigger: () =>
									h(NButton,
										{ 
											type: "primary",
											tag: "a",
											href: item.to,
											onClick: (e: Event) => {
												e.stopPropagation();
												e.preventDefault();
												navigateTo(item.to);
											},
										}, () => h(NIcon, { size: 18 }, () => h(Icon, { name: item.icon }))
									),
								default: () => item.title,
							},
						),
					),
				),
		},
	);
}

function renderTableExtra(tbl: Table) {
	const actions = getTableActions(tbl).filter((a) => a.show);
	return renderActionsPopover(
		actions.map((action) => ({
			key: action.key,
			to: action.to,
			icon: action.icon,
			title: t(action.labelKey),
			active: defaultValue.value === action.key,
		})),
		defaultValue.value === tbl.slug ||
			defaultValue.value.startsWith(`${tbl.slug}-`),
	);
}

function renderDashboardsExtra() {
	const dashboardsUrl = `${adminBase.value}/admin/dashboards`;
	const insideDashboards = route.path.includes("/admin/dashboards");
	return renderActionsPopover(
		[
			{
				key: "dashboards",
				to: dashboardsUrl,
				icon: "tabler:chart-bar",
				title: t("showAll"),
				active: defaultValue.value === "dashboards",
			},
			...dashboards.value.map((dashboard) => ({
				key: String(dashboard.id),
				to: `${dashboardsUrl}/${dashboard.id}`,
				icon: dashboard.icon ? `tabler:${dashboard.icon}` : "tabler:chart-bar",
				title: dashboard.name?.trim() || t("dashboard"),
				active: defaultValue.value === String(dashboard.id),
			})),
		],
		insideDashboards,
	);
}

function renderMenuExtra(option: { key?: string | number }) {
	if (!isMenuOpen.value) return undefined;
	const key = String(option.key ?? "");
	if (key === "backups") return undefined;
	if (key === "dashboards") return renderDashboardsExtra();
	const tbl = database.value?.tables?.find((candidate) => candidate.slug === key);
	if (tbl) return renderTableExtra(tbl);
	return undefined;
}

function renderSingleItem(tbl: Table): MenuOption {
	const actions = getTableActions(tbl);
	const itemChildren = actions.map((action) => ({
		label: () =>
			h(
				NuxtLink,
				{
					to: action.to,
				},
				{ default: () => t(action.labelKey) },
			),
		key: action.key,
		show: action.show,
		icon: () => h(NIcon, () => h(Icon, { name: action.icon })),
	}));
	return {
		label: () =>
			h(
				NuxtLink,
				{
					to: `${adminBase.value}/admin/tables/${tbl.slug}`,
				},
				{ default: () => t(tbl.slug) },
			),
		key: isMenuOpen.value ? tbl.slug : `${tbl.slug}Group`,
		icon: () => h(LazyTableIcon, { table: tbl }),
		children: isMenuOpen.value
			? undefined
			: [
					{
						type: "group",
						label: t(tbl.slug),
						key: tbl.slug,
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
		key: isMenuOpen.value ? "dashboards" : "dashboardsGroup",
		icon: () =>
			h(NIcon, () => h(Icon, { name: "tabler:layout-dashboard" })),
		children: isMenuOpen.value
			? undefined
			: [
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

function renderBackupsItem(): MenuOption {
	const backupsUrl = `${adminBase.value}/admin/tables/backups`;
	return {
		label: () =>
			h(
				NuxtLink,
				{
					to: backupsUrl,
				},
				{ default: () => t("backups") },
			),
		key: isMenuOpen.value ? "backups" : "backupsGroup",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:database-export" })),
		children: isMenuOpen.value
			? undefined
			: [
					{
						type: "group",
						label: t("backups"),
						key: "backups-menu",
						children: undefined,
					},
				],
	};
}

const SECONDARY_SLUGS = ["users", "sessions", "assets", "translations", "pages", "blocks", "templates"];
const EXCLUDED_SLUGS = [...SECONDARY_SLUGS, "dashboards", "backups"];

function isTableVisible(tbl: Table) {
	return !!tbl.allowedMethods && tbl.allowedMethods.trim() !== "" && tbl.show !== false;
}

const primaryTables = computed(() => {
	if (!database.value?.tables) return [] as Table[];
	return database.value.tables.filter(
		(tbl) => !EXCLUDED_SLUGS.includes(tbl.slug) && isTableVisible(tbl),
	);
});

const secondaryTables = computed(() => {
	if (!database.value?.tables) return [] as Table[];
	return database.value.tables.filter(
		(tbl) => SECONDARY_SLUGS.includes(tbl.slug) && isTableVisible(tbl),
	);
});

const menuOptions = computed(() => {
	const primaryTableOptions = primaryTables.value.map(renderSingleItem) ?? [];

	const secondaryTableOptions = secondaryTables.value.map(renderSingleItem) ?? [];

	const options: MenuOption[] = [...primaryTableOptions];

	if (hasDashboardsTable.value) {
		if (primaryTableOptions.length)
			options.push({ key: "divider-1", type: "divider" });
		options.push(renderDashboardItem());
	}

	if (secondaryTableOptions.length) {
		options.push({ key: "divider-2", type: "divider" });
	}

	options.push(...secondaryTableOptions);

	// Backups is a database-level admin surface, always available to the owner
	// even on legacy databases that lack the table in their meta row.
	if (user.value?.role === config.public.idOne) {
		options.push({ key: "divider-3", type: "divider" });
		options.push(renderBackupsItem());
	}

	return options;
});
</script>