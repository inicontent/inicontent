<template>
	<NuxtLayout name="default">
		<NLayout position="absolute">
			<NScrollbar id="iniHeader" style="max-height: 65px" xScrollable trigger="none">
				<NLayoutHeader style="height: 64px; padding: 15px 24px" bordered>
					<NPageHeader>
						<template #avatar>
							<NuxtLink v-if="String($route.matched[0].name).startsWith('database')"
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
									<NAvatar fallbackSrc="/favicon.ico"
										:src='database?.icon?.publicURL ?? "/favicon.ico"' />
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
								<NTooltip v-if="user?.role ===
									appConfig.idOne" :delay="500">
									<template #trigger>
										<NButton round size="small">{{ humanFileSize(
											database?.size,
										) }}</NButton>
									</template>
									{{ t("totalDatabaseSize") }}
								</NTooltip>
								<NDropdown :options="userDropdownOptions" @select="onSelectUserDropdown">
									<NButton round size="small">
										<template #icon>
											<NIcon>
												<IconSettings />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NDropdown v-if="languagesDropdownOptions?.length" :value="Language"
									:options="languagesDropdownOptions" @select="(v) => Language = v">
									<NButton round size="small">
										<template #icon>
											<NIcon>
												<IconLanguage />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
							</NButtonGroup>
						</template>
					</NPageHeader>
				</NLayoutHeader>
			</NScrollbar>
			<NLayoutContent id="container" position="absolute"
				style="top: 64px;height: calc(100vh - 64px);overflow: auto;"
				content-style="display: flex;justify-content: center;align-items: center;padding: 24px 0;height: max-content">
				<slot></slot>
			</NLayoutContent>
		</NLayout>
	</NuxtLayout>
</template>

<script setup lang="ts">
import {
	IconLanguage,
	IconLogin,
	IconLogout,
	IconMoon,
	IconPencil,
	IconSettings,
	IconSun,
} from "@tabler/icons-vue"
import { isValidID } from "inibase/utils"
import {
	NAvatar,
	NBreadcrumb,
	NBreadcrumbItem,
	NButton,
	NButtonGroup,
	NDropdown,
	NFlex,
	NIcon,
	NLayout,
	NLayoutContent,
	NLayoutHeader,
	NPageHeader,
	NScrollbar,
	NTag,
	NText,
	NTooltip,
} from "naive-ui"

const Language = useCookie<LanguagesType>("language", { sameSite: true })
defineTranslation({
	ar: {
		settings: "الإعدادات",
		toggleTheme: "تغيير الوضع",
		edit: "تعديل",
		adminPanel: "لوحة التحكم",
		allRightsReserved: "جميع الحقوق محفوظة",
		logout: "تسجيل الخروج",
		profile: "تعديل الحساب",
		sessions: "سِجل الدخول",
		components: "أجزاء الصفحات",
		pages: "الصفحات",
		users: "المستخدمين",
		admin: "مدير",
		user: "مستخدم",
		guest: "زائر",
		translations: "الترجمة",
		assets: "الملفات",
		tables: "الجداول",
		totalDatabaseSize: "حجم قاعدة البيانات",
		isRequired: "إجباري",
		isNotValid: "غير صالح",
		username: "إسم المستخدم",
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		role: "الصلاحية",
		createdBy: "أُنشأ من قبل",
		theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
		inputsAreInvalid: "المُدخلات غير صحيحة",
		slug: "الإسم",
		roles: "الأدوار",
		icon: "الأيقونة",
		primaryLanguage: "اللغة الأساسية",
		secondaryLanguages: "اللغات الثانوية",
		tableSettings: "إعدادات الجدول",
		primaryColor: "اللون الأساسي",
		primaryDarkColor: "اللون الأساسي في الوضع الليلي",
		deletedSuccessfully: "تم الحذف بنجاح",
		auth: "تسجيل الدخول",
		units: {
			kB: "ك.ب",
			MB: "م.ب",
			GB: "ج.ب",
			TB: "ت.ب",
		},
	},
})

// onBeforeUpdate(() => {
//     clearNuxtState("translations");
// })

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const appConfig = useAppConfig()
const route = useRoute()
const user = useState<User | undefined>("user")
const database = useState<Database>("database")
const fromPath = useCookie("from")

const ThemeConfig = useState<ThemeConfig>("ThemeConfig", () => ({
	primaryColor: "#FF9800",
	primaryColorHover: "#F7A42A",
	primaryColorPressed: "#E19421",
	primaryColorSuppl: "#CB7900",
}))

const showBreadcrumb = computed(
	() =>
		database.value?.slug &&
		!["index", "auth", "dashboard", "database", "database-auth"].includes(
			String(route.matched[0].name),
		),
)

const breadcrumbArray = computed(() =>
	route.path
		.split("/")
		.filter(Boolean)
		.slice(
			!["database", "admin"].includes(route.matched[0].name as string) ? 1 : 0,
		),
)
function breadCrumbItemLink(index: number) {
	if (index === 0) {
		return (
			route.path
				.split("/")
				.slice(
					0,
					index +
						(["database", "admin"].includes(breadcrumbArray.value[0]) ? 3 : 2),
				)
				.join("/") + (database.value?.slug === "inicontent" ? "" : "/tables")
		)
	}
	return route.path
		.split("/")
		.slice(
			0,
			index + (String(route.matched[0].name)?.startsWith("database") ? 3 : 2),
		)
		.join("/")
}
const itemLabel = useState("itemLabel")
function breadCrumbItemLabel(index: number) {
	const childRoute = breadcrumbArray.value[index]
	return isValidID(childRoute) && itemLabel.value
		? itemLabel.value
		: t(childRoute === "admin" ? "adminPanel" : childRoute)
}
const userDropdownOptions = [
	{
		key: "header",
		type: "render",
		render: () =>
			h(
				NFlex,
				{
					justify: "center",
					style: {
						padding: "5px 0",
					},
				},
				() =>
					h(
						NText,
						{
							strong: true,
						},
						() =>
							user.value?.username
								? user.value.username.charAt(0).toUpperCase() +
									user.value.username.slice(1)
								: "--",
					),
			),
		show: !!user.value?.id,
	},
	{
		key: "header-divider",
		type: "divider",
		show: !!user.value?.id,
	},
	{
		label: t("settings"),
		key: "settings",
		icon: () => h(NIcon, () => h(IconSettings)),
		show: user.value?.role === appConfig.idOne,
	},
	{
		label: t("toggleTheme"),
		key: "theme",
		icon: () => h(NIcon, () => h(Theme.value === "light" ? IconMoon : IconSun)),
	},
	{
		label: t("profile"),
		key: "edit",
		icon: () => h(NIcon, () => h(IconPencil)),
		show:
			!!user.value?.id &&
			database.value?.tables
				?.find(({ slug }) => slug === "users")
				?.allowedMethods?.includes("u"),
	},
	{
		label: t("logout"),
		key: "logout",
		icon: () => h(NIcon, () => h(IconLogout)),
		show: !!user.value?.id,
	},
	{
		label: t("auth"),
		key: "auth",
		icon: () => h(NIcon, () => h(IconLogin)),
		show: !user.value?.id,
		disabled: (route.name as string | undefined)?.endsWith("-auth"),
	},
]

async function onSelectUserDropdown(v: string) {
	switch (v) {
		case "edit":
			navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/users/${
					(user.value as User).id
				}/edit`,
			)
			break
		case "settings":
			navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/settings`,
			)
			break
		case "theme":
			Theme.value = Theme.value === "dark" ? "light" : "dark"
			break
		case "logout":
			await $fetch(
				`${appConfig.apiBase}${
					database.value.slug ?? "inicontent"
				}/auth/signout`,
				{},
			)
			fromPath.value = undefined
			user.value = undefined
			await navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/auth`,
			)
			break
	}
}
const languagesDropdownOptions = database.value.secondaryLanguages?.map(
	(language) => ({
		label: t(`languages.${language}`),
		key: language,
	}),
)
</script>