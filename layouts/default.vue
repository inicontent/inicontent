<template>
    <NLayout position="absolute">
        <NScrollbar style="max-height: 65px" xScrollable trigger="none">
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
                            <template v-if="user?.id">
                                <template v-if="user?.role ===
                                    'd7b3d61a582e53ee29b5a1d02a436d55'">
                                    <NTooltip :delay="500">
                                        <template #trigger>
                                            <NButton round size="small">{{ humanFileSize(
                                                database?.size,
                                            ) }}</NButton>
                                        </template>
                                        {{ t("totalDatabaseSize") }}
                                    </NTooltip>
                                    <NTooltip :delay="500">
                                        <template #trigger>
                                            <NButton round size="small">
                                                <template #icon>
                                                    <NuxtLink
                                                        :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/settings`">
                                                        <NIcon>
                                                            <IconSettings />
                                                        </NIcon>
                                                    </NuxtLink>
                                                </template>
                                            </NButton>
                                        </template>
                                        {{ t("databaseSettings") }}
                                    </NTooltip>
                                </template>
                                <NDropdown :options="userDropdownOptions" @select="onSelectUserDropdown">
                                    <NButton round size="small">
                                        <template #icon>
                                            <NIcon>
                                                <IconUser />
                                            </NIcon>
                                        </template>
                                    </NButton>
                                </NDropdown>
                            </template>
                            <NTooltip :delay="500">
                                <template #trigger>
                                    <NButton round size="small" @click="Theme =
                                        Theme === 'dark'
                                            ? 'light'
                                            : 'dark'">
                                        <template #icon>
                                            <NIcon>
                                                <IconMoon v-if="Theme === 'light'" />
                                                <IconSun v-else />
                                            </NIcon>
                                        </template>
                                    </NButton>
                                </template>
                                {{ t("toggleTheme") }}
                            </NTooltip>
                            <NDropdown :value="Language" :options="languagesDropdownOptions"
                                @select="(v) => Language = v">
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
        <NLayoutContent id="container" position="absolute" style="top: 64px;height: calc(100vh - 64px);overflow: auto;"
            content-style="display: flex;justify-content: center;align-items: center;padding: 24px 0;height: max-content">
            <slot></slot>
        </NLayoutContent>
    </NLayout>
</template>

<script setup lang="ts">
import {
    IconLanguage,
    IconLogout,
    IconMoon,
    IconPencil,
    IconSettings,
    IconSun,
    IconUser,
} from "@tabler/icons-vue";
import { isValidID } from "inibase/utils";
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
    useMessage,
} from "naive-ui";

const Language = useCookie<string>("Language", { sameSite: true });
useLanguage({
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
        databaseSettings: "إعدادات قاعدة البيانات",
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
        units: {
            kB: "ك.ب",
            MB: "م.ب",
            GB: "ج.ب",
            TB: "ت.ب",
        },
    },
    en: {},
});

onBeforeUpdate(() => {
    clearNuxtState("LanguageMessages");
})

onMounted(() => {
    window.$message = useMessage();
});

const appConfig = useAppConfig();
const route = useRoute();
const user = useState<User | null>("users");
const Theme = useCookie<string>("Theme", { sameSite: true })
const database = useState<Database>("database")
const ThemeConfig = useState<ThemeConfig>("ThemeConfig");

const showBreadcrumb =
    database.value?.slug &&
    !["index", "auth", "dashboard", "database", "database-auth"].includes(
        String(route.matched[0].name),
    );

const breadcrumbArray = computed(() =>
    route.path
        .split("/")
        .filter(Boolean)
        .filter(
            (_path, index) =>
                !String(route.matched[0].name)?.startsWith("database") || index !== 0,
        ),
);
function breadCrumbItemLink(index: number) {
    if (index === 0) {
        return (
            route.path
                .split("/")
                .slice(
                    0,
                    index +
                    (String(route.matched[0].name)?.startsWith("database") ? 3 : 2),
                )
                .join("/") + (database.value.slug === "inicontent" ? "" : "/tables")
        );
    }
    return route.path
        .split("/")
        .slice(
            0,
            index + (String(route.matched[0].name)?.startsWith("database") ? 3 : 2),
        )
        .join("/");
}
const itemLabel = useState("itemLabel");
function breadCrumbItemLabel(index: number) {
    const childRoute = breadcrumbArray.value[index];
    return isValidID(childRoute) && itemLabel.value
        ? itemLabel.value
        : t(childRoute === "admin" ? "adminPanel" : childRoute);
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
    },
    {
        key: "header-divider",
        type: "divider",
    },
    {
        label: t("profile"),
        key: "edit",
        icon: () => h(NIcon, () => h(IconPencil)),
        show: database.value?.tables
            ?.find(({ slug }) => slug === "users")
            ?.allowedMethods?.includes("u"),
    },
    {
        label: t("logout"),
        key: "logout",
        icon: () => h(NIcon, () => h(IconLogout)),
    },
];
async function onSelectUserDropdown(v: string) {
    switch (v) {
        case "edit":
            navigateTo(
                `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/users/${(user.value as User).id
                }/edit`,
            );
            break;
        case "logout":
            await $fetch(
                `${appConfig.apiBase}${database.value.slug ?? "inicontent"
                }/auth/signout`,
                {},
            );
            user.value = null;
            await navigateTo(
                `${route.params.database ? `/${route.params.database}` : ""}/auth`,
            );
            break;
    }
}
const languagesDropdownOptions = [
    {
        label: "عربي",
        key: "ar",
    },
    {
        label: "English",
        key: "en",
    },
];
</script>