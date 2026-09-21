<template>
	<NuxtLayout name="dashboard">
		<NLayout position="absolute" has-sider>
			<NLayoutSider v-if="database?.slug" :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
				isMenuOpen = !collapsed" :style="{ zIndex: 1000, borderLeft: Language === 'ar' ? '1px solid var(--n-border-color)' : 'none', borderRight: Language === 'ar' ? 'none' : '1px solid var(--n-border-color)' }" bordered show-trigger="bar" collapse-mode="width"
				:collapsed-width="$device.isMobile ? 0 : 64" width="240" :native-scrollbar="false">
				<NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="$device.isMobile ? 0 : 64"
					v-model:value="selectedValue" :options="menuOptions" :render-extra="renderMenuExtra" accordion />
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
import { Icon, LazyTableIcon, NButton, NButtonGroup, NIcon, NPopover, NEllipsis, NuxtLink } from "#components";

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
const { tableUrl } = useTableUrl();
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

function getTableActions(tbl: Table): TableAction[] {
	const url = tableUrl(tbl.slug);
	return [
		{
			labelKey: "showAll",
			to: url,
			key: tbl.slug,
			show: tbl.slug !== "assets",
			icon: "tabler:eye",
		},
		{
			labelKey: "newItem",
			to: `${url}/new`,
			key: `${tbl.slug}-new`,
			show: tbl.slug !== "assets" && !!tbl.allowedMethods?.includes("c"),
			icon: "tabler:plus",
		},
		{
			labelKey: "settings",
			to: `${url}/settings`,
			key: `${tbl.slug}-settings`,
			icon: "tabler:settings",
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations", "assets"].includes(tbl.slug),
		},
		{
			labelKey: "flows",
			to: `${url}/flows`,
			key: `${tbl.slug}-flows`,
			icon: "tabler:webhook",
			show:
				user.value?.role === config.public.idOne &&
				!["sessions", "translations"].includes(tbl.slug),
		},
		{
			labelKey: "schedules",
			to: `${url}/schedules`,
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
	items: { key: string; to: string; icon: string; title: string; active: boolean }[]
) {
	if (!items.length) return undefined;
	return h(
		NPopover,
		{
			placement: Language.value === "ar" ? "left" : "right",
			style: { padding: 0 },
		},
		{
			trigger: () =>
				h(
					NButton,
					{
						quaternary: true,
						size: "small",
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
						h(NButton,
							{ 
								style: { justifyContent: "start" },
								secondary: true,
								type: item.active ? "primary" : "default",
								tag: "a",
								href: item.to,
								onClick: (e: Event) => {
									e.stopPropagation();
									e.preventDefault();
									navigateTo(item.to);
								},
							}, {
								default: () => item.title,
								icon: () => h(NIcon, { size: 18 }, () => h(Icon, { name: item.icon }))
							}
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
		}))
	);
}

function renderDashboardsExtra() {
	const dashboardsUrl = `${adminBase.value}/admin/dashboards`;
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
		]
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
					to: tableUrl(tbl.slug),
				},
				{ default: () => h(NEllipsis, { tooltip: false, style: { maxWidth: '130px' } }, () => t(tbl.slug)) },
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
	const backupsUrl = tableUrl("backups");
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

// The menu selection is derived from the current route. It is a computed that
// re-normalizes against the live menu structure, so it stays correct when the
// sidebar is toggled between expanded and collapsed mode (the menu keys differ
// between modes: leaves like `products` vs. groups like `productsGroup`).
// Child pages (e.g. /admin/tables/:slug/new) have no item of their own when
// the sidebar is expanded, so they highlight the parent table item instead.
function optionContainsKey(options: MenuOption[], key: string): boolean {
	return options.some((option) => {
		if (String(option.key ?? "") === key) return true;
		const children = option.children;
		return (
			Array.isArray(children) &&
			children.some((child) => {
				if (String(child.key ?? "") === key) return true;
				const grandchildren = child.children;
				return (
					Array.isArray(grandchildren) &&
					grandchildren.some((grand) => String(grand.key ?? "") === key)
				);
			})
		);
	});
}

function normalizeMenuValue(value: string): string {
	if (optionContainsKey(menuOptions.value, value)) return value;
	// Prefer the longest matching slug so e.g. "user-roles-*" isn't mistaken
	// for a child page of "users".
	const tbl = database.value?.tables
		?.filter((candidate) => value.startsWith(`${candidate.slug}-`))
		.sort((a, b) => b.slug.length - a.slug.length)[0];
	if (tbl) return tbl.slug;
	// Specific dashboard pages have no item of their own when expanded.
	if (route.path.includes("/admin/dashboards")) return "dashboards";
	return value;
}

// Read-only from the component's perspective: NMenu's transient value changes
// (e.g. opening a collapsed submenu sets the parent's key) are discarded, and
// the highlight always reflects the real current page + menu mode.
const selectedValue = computed({
	get: () => normalizeMenuValue(defaultValue.value),
	set: () => {},
});
</script>