<template>
    <NPageHeader>
        <template #avatar>
            <NuxtLink v-if="String($route.matched[0]?.name).startsWith('database')"
                :to="`/${$route.params.database ?? ''}`">
                <NTag strong round :bordered="false" style="cursor:pointer;font-weight:600"
                    :style="ThemeConfig.revert && Theme === 'dark' ? 'color:#000;background-color:#fff' : ''">
                    <template #avatar>
                        <NAvatar fallbackSrc="/favicon.ico" :style='{
                            backgroundColor: "transparent"
                        }' :src='database?.icon?.publicURL ?? "/favicon.ico"' />
                    </template>
                    {{ t(database?.slug ?? 'inicontent') }}
                </NTag>
            </NuxtLink>
            <NTag v-else strong round :bordered="false">
                <template #avatar>
                    <NAvatar fallbackSrc="/favicon.ico" :src='database?.icon?.publicURL ?? "/favicon.ico"' />
                </template>
                {{ t(database?.slug ?? 'inicontent') }}
            </NTag>
        </template>
        <template #title v-if='showBreadcrumb'>
            <NBreadcrumb>
                <NBreadcrumbItem v-for="(_, index) of breadcrumbArray">
                    <NuxtLink :to="breadCrumbItemLink(index)">
                        {{ breadCrumbItemLabel(index) }}
                    </NuxtLink>
                </NBreadcrumbItem>
            </NBreadcrumb>
        </template>
        <template #extra>
			<NButtonGroup>
				<LazyOfflineSyncStatus show-pwa />
				<NPopover v-if="user?.role === config.public.idOne" :delay="600" scrollable style="max-height: 240px;">
						<template #trigger>
							<NButton secondary round size="small">{{ humanFileSize(totalSize) }}</NButton>
						</template>
						<div v-if="barSegments.length > 0"
							style="height: 6px; border-radius: 3px; overflow: hidden; display: flex; gap: 2px; background: rgba(128,128,128,.2); margin-block-end: 10px;">
							<div v-for="table in barSegments" :key="table.slug"
								:style="{ width: `${((table.size ?? 0) / totalSize) * 100}%`, backgroundColor: tableColor(table) }" />
						</div>
						<NFlex v-for="(table, index) in sortedTables" :key="table.slug" justify="space-between" align="center">
							<NFlex align="center" :size="6">
								<span :style="{
									width: '8px',
									height: '8px',
									borderRadius: '50%',
									// Tables under the 5% bar threshold have no segment, so
									// their dot renders grey — signaling 'too small to draw'.
									backgroundColor: barSegments.some((t) => t.slug === table.slug)
										? tableColor(table)
										: 'rgba(128,128,128,.5)',
									flexShrink: 0,
								}" />
								<LazyTableIcon :table="table" />
								<NText>{{ t(table.slug) }}</NText>
							</NFlex>
							<NText depth="3">{{ humanFileSize(table?.size) }}</NText>
						</NFlex>
				</NPopover>
				<NDropdown v-if="languagesDropdownOptions?.length > 1" :value="Language" :options="languagesDropdownOptions"
					@select="(v) => Language = v">
					<NButton secondary round size="small">
						<template #icon>
							<NIcon>
								<Icon name="tabler:language" />
							</NIcon>
						</template>
					</NButton>
				</NDropdown>
				<NDropdown :options="userDropdownOptions" @select="onSelectUserDropdown">
					<NButton secondary type="primary" round size="small">
						<template #icon>
							<NIcon>
								<Icon name="tabler:user" />
							</NIcon>
						</template>
						<template v-if="user">
							<NText strong>{{ user.username.charAt(0).toUpperCase() +
								user.username.slice(1) }}</NText>
						</template>
					</NButton>
				</NDropdown>
			</NButtonGroup>
		</template>
    </NPageHeader>
</template>

<script setup lang="ts">
import { isValidID } from "inibase/utils";
import { Icon, NIcon, NTag, NText, NFlex } from "#components";

const config = useRuntimeConfig();
const route = useRoute();
const { tableUrl } = useTableUrl();
const user = useState<User | undefined>("user");
const database = useState<Database>("database");

const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const Theme = useCookie<"light" | "dark">("theme", { sameSite: true });
const redirectTo = useScopedCookie<string | null>("redirectTo", database.value?.slug);

const ThemeConfig = useState<ThemeConfig>("ThemeConfig", () => ({
	primaryColor: "#FF9800",
	primaryColorHover: "#F7A42A",
	primaryColorPressed: "#E19421",
	primaryColorSuppl: "#CB7900",
}));

const showBreadcrumb = computed(
	() =>
		database.value?.slug &&
		!["index", "auth", "database-auth"].includes(
			String(route.matched[0]?.name),
		),
);

const sortedTables = computed(() =>
	[...(database.value?.tables ?? [])].sort(
		(a, b) => (b.size ?? 0) - (a.size ?? 0),
	),
);
const totalSize = computed(() =>
	sortedTables.value.reduce((total, table) => total + (table.size ?? 0), 0),
);
// Only draw bar segments that represent a meaningful share of storage, so
// tiny tables don't render as sub-pixel slivers of clutter. The gap left at
// the end of the bar reads as "the remaining small tables".
const barSegments = computed(() =>
	totalSize.value === 0
		? []
		: sortedTables.value.filter(
				(table) => ((table.size ?? 0) / totalSize.value) * 100 >= 5,
			),
);
// Spread hues evenly across however many tables exist, so colors never repeat
// (unlike a fixed palette that cycles once there are more tables than colors).
// Key color off the table's position in the FULL sorted list, so a row's dot
// and its bar segment always share the same hue — even after `barSegments`
// drops sub-5% tables (whose segment index would otherwise disagree with the
// row index). Hues spread evenly so they never repeat, regardless of count.
const tableColor = (table: Table) => {
	const count = Math.max(sortedTables.value.length, 1);
	const index = Math.max(
		sortedTables.value.findIndex((t) => t.slug === table.slug),
		0,
	);
	return `hsl(${(360 / count) * index} 70% 52%)`;
};

function breadCrumbItemLink(index: number) {
	const breadcrumbSegments = breadcrumbArray.value.slice(0, index + 1);
	if (hideDatabaseInBreadcrumb.value && databaseParam.value)
		return `/${databaseParam.value}/${breadcrumbSegments.join("/")}`;
	return `/${breadcrumbSegments.join("/")}`;
}
const routeSegments = computed(() => route.path.split("/").filter(Boolean));
const databaseParam = computed(() => {
	const param = route.params.database;
	return typeof param === "string" ? param : undefined;
});
const hideDatabaseInBreadcrumb = computed(
	() =>
		!!databaseParam.value &&
		routeSegments.value[0] === databaseParam.value &&
		routeSegments.value[1] === "admin",
);
const breadcrumbArray = computed(() =>
	hideDatabaseInBreadcrumb.value
		? routeSegments.value.slice(1)
		: routeSegments.value,
);
const table = useState<Table>("table");
const currentItem = useState<Item>("currentItem");
const currentDashboard = useState<Dashboard | null>("currentDashboard");
const itemLabel = computed(() => renderLabel(table.value, currentItem.value));

function breadCrumbItemLabel(index: number) {
	const childRoute = breadcrumbArray.value[index];
	if (isValidID(childRoute)) {
		if (currentDashboard.value?.name && route.path.includes("/dashboards/"))
			return currentDashboard.value.name;
		if (currentItem.value) return itemLabel.value;
	}
	if (childRoute === "admin") return t("adminPanel");
	return t(childRoute);
}
const userDropdownOptions = computed(() => [
	{
		label: t("apiDocumentation"),
		key: "api",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:book" })),
		show: !!user.value?.id,
	},
	{
		label: t("settings"),
		key: "settings",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:settings" })),
		show: user.value?.role === config.public.idOne,
	},
	{
		label: () => h(NFlex,{ justify: Language.value === "ar" ? "end" : "start", align: "center",  reverse: Language.value === "ar"  }, () => [
			t("billing"),
			h(NIcon, { color: ThemeConfig.value.primaryColor}, () => h(Icon, { name: "tabler:external-link" }))
		]),
		key: "billing",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:credit-card" })),
		show:
			!!user.value?.id &&
			(database.value?.slug === "inicontent" ||
				user.value?.role === config.public.idOne),
		disabled: route.path.includes("/admin/billing"),
	},
	{
		label: t("toggleTheme"),
		key: "theme",
		icon: () =>
			h(NIcon, () =>
				h(Icon, {
					name: Theme.value === "light" ? "tabler:moon" : "tabler:sun",
				}),
			),
	},
	{
		label: t("profile"),
		key: "edit",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:pencil" })),
		show:
			!!user.value?.id &&
			database.value?.tables
				?.find(({ slug }) => slug === "users")
				?.allowedMethods?.includes("u"),
	},
	{
		label: t("logout"),
		key: "logout",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:logout" })),
		show: !!user.value?.id,
	},
	{
		label: t("auth"),
		key: "auth",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:login" })),
		show: !user.value?.id,
		disabled: (route.name as string | undefined)?.endsWith("-auth"),
	},
	{
		label: `${t("clearCache")} (${humanFileSize(cacheStats.value.size)})`,
		key: "clearCache",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:wash-machine" })),
		show: !!user.value?.id && cacheStats.value.size > 0,
	},
]);

const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const { platformUrl } = usePlatformRedirect();

async function onSelectUserDropdown(v: string) {
	switch (v) {
		case "api":
			navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/api`,
			);
			break;
		case "edit":
			navigateTo(tableUrl("users", `/${(user.value as User).id}/edit`));
			break;
		case "billing":
			navigateTo(platformUrl("billing"), { external: true });
			break;
		case "settings":
			navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/settings`,
			);
			break;
		case "theme":
			Theme.value = Theme.value === "dark" ? "light" : "dark";
			break;
		case "logout":
			await $fetch(
				`${config.public.apiBase}${
					database.value?.slug ?? "inicontent"
				}/auth/signout`,
				{
					credentials: "include",
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
				},
			);
			redirectTo.value = undefined;
			user.value = undefined;
			await navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/auth`,
			);
			break;
		case "clearCache":
			await clearAllCache();
			cacheStats.value = await getCacheStats();
			break;
	}
}
const cacheStats = ref<{ total?: number; expired?: number; size: number }>({
	size: 0,
});
onMounted(async () => {
	cacheStats.value = await getCacheStats();
});

const languagesDropdownOptions = computed(() => {
	const primary = database.value?.primaryLanguage;
	const secondary = database.value?.secondaryLanguages ?? [];
	const languages = [primary, ...secondary].filter(
		(language): language is LanguagesType => !!language,
	);

	return [...new Set(languages)].map((language) => ({
		label: t(`languages.${language}`),
		key: language,
	}));
});
</script>