<template>
	<NuxtLayout name="dashboard">
		<NLayout position="absolute" has-sider>
			<NLayoutSider v-if="database?.slug" :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
				isMenuOpen = !collapsed" style="z-index: 999" bordered show-trigger="bar" collapse-mode="width"
				:collapsed-width="$device.isMobile ? 0 : 64" width="240" :native-scrollbar="false">
				<NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="$device.isMobile ? 0 : 64"
					@mouseover="() => isMenuOpen = true" @mouseleave="() => isMenuOpen = false" :options="menuOptions"
					:defaultValue :watch-props="['defaultValue']" accordion />
			</NLayoutSider>
			<NLayoutContent id="pageContent" position="absolute" :content-style="{
				padding: $device.isMobile
					? '24px 0'
					: Language === 'ar'
						? '24px 88px 24px 24px'
						: '24px 24px 24px 88px',
			}" :native-scrollbar="false">
				<div v-if="isMenuOpen" @click="isMenuOpen = false"
					style="width: 100%;height: 100%;right: 0;top: 0;position: absolute;background-color: #0000006e;z-index: 99;cursor: pointer;">
				</div>
				<slot></slot>
			</NLayoutContent>
		</NLayout>
	</NuxtLayout>
</template>

<script setup lang="ts">
import {
	IconEye,
	IconPlus,
	IconSettings,
	IconWebhook,
} from "@tabler/icons-vue";
import {
	NIcon,
	NLayout,
	NLayoutContent,
	NLayoutSider,
	NMenu,
	type MenuOption,
} from "naive-ui";
import { NuxtLink } from "#components";

const Language = useCookie<LanguagesType>("language", { sameSite: true });

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
		showAll: "أظهر الكل",
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
});

onBeforeUpdate(() => {
	clearNuxtState("isMenuOpen");
});

const appConfig = useAppConfig();
const route = useRoute();
const user = useState<User>("users");
const table = useState<Table>("table");
const isMenuOpen = useState("isMenuOpen", () => false);
const database = useState<Database>("database");
const defaultValue = computed(() => {
	const lastPathInRoute = decodeURIComponent(
		route.path.split("/").filter(Boolean).at(-1) ?? "",
	);
	if (table.value?.slug) {
		if (lastPathInRoute && lastPathInRoute !== table.value.slug)
			return `${table.value.slug}-${lastPathInRoute}`;
		return table.value.slug;
	}
	return decodeURI(lastPathInRoute?.toString() ?? "");
});

function renderSingleItem(table: Table): MenuOption {
	const itemChildren = [
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.slug}`,
					},
					{ default: () => t("showAll") },
				),
			key: table.slug,
			show: table.slug !== "assets",
			icon: () => h(NIcon, () => h(IconEye)),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.slug}/new`,
					},
					{ default: () => t("newItem") },
				),
			key: `${table.slug}-new`,
			show: table.slug !== "assets" && table.allowedMethods?.includes("c"),
			icon: () => h(NIcon, () => h(IconPlus)),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.slug}/settings`,
					},
					{ default: () => t("settings") },
				),
			key: `${table.slug}-settings`,
			icon: () => h(NIcon, () => h(IconSettings)),
			show:
				user.value?.role === appConfig.idOne &&
				!["sessions", "translations", "assets"].includes(table.slug),
		},
		{
			label: () =>
				h(
					NuxtLink,
					{
						to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.slug}/flows`,
					},
					{ default: () => t("flows") },
				),
			key: `${table.slug}-flows`,
			icon: () => h(NIcon, () => h(IconWebhook)),
			show:
				user.value?.role === appConfig.idOne &&
				!["sessions", "translations"].includes(table.slug),
		},
	];
	return {
		label: () =>
			h(
				NuxtLink,
				{
					to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.slug}`,
				},
				{ default: () => t(table.slug) },
			),
		key: itemChildren.length ? `${table.slug}Group` : table.slug,
		icon: () => getTableIcon(table),
		children: itemChildren.length ? itemChildren : undefined,
	};
}

const menuOptions = computed(() =>
	database.value?.tables
		? ([
			...(database.value.tables
				.filter(
					({ slug, allowedMethods }) =>
						![
							"users",
							"sessions",
							"assets",
							"translations",
							"pages",
							"components",
						].includes(slug) && allowedMethods?.includes("r"),
				)
				.map(renderSingleItem) ?? []),
			database.value.tables.filter(
				({ slug, allowedMethods }) =>
					[
						"users",
						"sessions",
						"assets",
						"translations",
						"pages",
						"components",
					].includes(slug) && allowedMethods?.includes("r"),
			).length
				? {
					key: "divider-1",
					type: "divider",
				}
				: undefined,
			...(database.value.tables
				?.filter(
					({ slug, allowedMethods }) =>
						["users", "sessions", "assets", "pages", "components"].includes(
							slug,
						) && allowedMethods?.includes("r"),
				)
				.map(renderSingleItem) ?? []),
		].filter((item) => item) as MenuOption[])
		: [],
);
</script>