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
import { Icon, LazyTableIcon, NuxtLink, NIcon } from "#components"

const Language = useCookie<LanguagesType>("language", { sameSite: true })

defineTranslation({
	ar: {
		clickToCopy: "نسخ",
		copiedSuccessfully: "تم النسخ بنجاح",
		viewTheItem: "مُعاينة العنصر",
		createdAt: "تاريخ الإنشاء",
		updatedAt: "تاريخ التعديل",
		view: "عرض",
		update: "تحديث",
		create: "إنشاء",
		delete: "حذف",
		actions: "الأوامر",
		flows: "تدفقات",
		newItem: "عنصر جديد",
		new: "جديد",
		id: "معرف",
		publish: "نشر",
		pasteItem: "لصق العنصر",
		copyItem: "نسخ العنصر",
		createFromClipboard: "إنشاء من الحافظة",
		clipboardItemIsNotCorrect: "العنصر في الحافظة غير صحيح",
		clipboardEmpty: "الحافظة فارغة",
	},
})

onBeforeUpdate(() => {
	clearNuxtState("isMenuOpen")
})

const appConfig = useAppConfig()
const route = useRoute()
const user = useState<User>("user")
const table = useState<Table>("table")
const isMenuOpen = useState("isMenuOpen", () => false)
const database = useState<Database>("database")
const defaultValue = computed(() => {
	const lastPathInRoute = decodeURIComponent(
		route.path.split("/").filter(Boolean).at(-1) ?? "",
	)
	if (table.value?.slug) {
		if (lastPathInRoute && lastPathInRoute !== table.value.slug)
			return `${table.value.slug}-${lastPathInRoute}`
		return table.value.slug
	}
	return decodeURI(lastPathInRoute?.toString() ?? "")
})

function renderSingleItem(table: Table): MenuOption {
	const tableUrl = `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.slug}`
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
				user.value?.role === appConfig.idOne &&
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
				user.value?.role === appConfig.idOne &&
				!["sessions", "translations"].includes(table.slug),
		},
	]
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
	}
}

const menuOptions = computed(() =>
	database.value?.tables
		? ([
			...(database.value.tables
				.filter(
					({ slug, allowedMethods, show }) =>
						![
							"users",
							"sessions",
							"assets",
							"translations",
							"pages",
							"blocks",
						].includes(slug) &&
						allowedMethods?.includes("r") &&
						show !== false,
				)
				.map(renderSingleItem) ?? []),
			database.value.tables.filter(
				({ slug, allowedMethods, show }) =>
					[
						"users",
						"sessions",
						"assets",
						"translations",
						"pages",
						"blocks",
					].includes(slug) &&
					allowedMethods?.includes("r") &&
					show !== false,
			).length
				? {
					key: "divider-1",
					type: "divider",
				}
				: undefined,
			...(database.value.tables
				?.filter(
					({ slug, allowedMethods, show }) =>
						["users", "sessions", "assets", "pages", "blocks"].includes(
							slug,
						) &&
						allowedMethods?.includes("r") &&
						show !== false,
				)
				.map(renderSingleItem) ?? []),
		].filter((item) => item) as MenuOption[])
		: [],
)
</script>