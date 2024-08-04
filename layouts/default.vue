<template>
    <NMessageProvider keepAliveOnHover closable :containerStyle='{ top: "70px" }'>
        <NLayout position="absolute">
            <NScrollbar style="max-height: 65px" xScrollable trigger="none">
                <NLayoutHeader style="height: 64px; padding: 15px 24px" bordered>
                    <NPageHeader>
                        <template #avatar>
                            <NTag v-if="(route.name as string | undefined)?.startsWith(
                                'database',
                            )" @click="navigateTo(`/${database?.slug}`)" strong round :bordered="false" :style='{
                                cursor: "pointer",
                                fontWeight: 600,
                                ...(ThemeConfig.revert &&
                                    Theme === "dark"
                                    ? {
                                        color: "#000",
                                        backgroundColor: "#fff",
                                    }
                                    : {}),
                            }'>
                                <template #avatar>
                                    <NAvatar fallbackSrc="/favicon.ico" :style='{
                                        backgroundColor: "transparent"
                                    }' :src='database?.icon ?? "/favicon.ico"' />
                                </template>
                                {{ t(database?.slug) }}
                            </NTag>
                            <NTag v-else strong round :bordered="false">
                                <template #avatar>
                                    <NAvatar fallbackSrc="/favicon.ico" :src='database?.icon ?? "/favicon.ico"' />
                                </template>
                                {{ t(database?.slug) }}
                            </NTag>
                        </template>
                        <template #title v-if='![
                            "index",
                            "auth",
                            "dashboard",
                            "database",
                            "database-auth",
                        ].includes(route.name as string)'>
                            <NBreadcrumb>
                                <NBreadcrumbItem v-for='(childRoute, index) in route.path
                                    .split("/")
                                    .filter(Boolean)
                                    .filter(
                                        (_path, index) =>
                                            !(
                                                route.name as string | undefined
                                            )?.startsWith("database") || index !== 0,
                                    )' :href='route.path
                                        .split("/")
                                        .slice(
                                            0,
                                            index +
                                            ((
                                                route.name as string | undefined
                                            )?.startsWith("database")
                                                ? 3
                                                : 2),
                                        )
                                        .join("/")' @click.stop.prevent='navigateTo(
                                            route.path
                                                .split("/")
                                                .slice(
                                                    0,
                                                    index +
                                                    ((
                                                        route.name as
                                                        | string
                                                        | undefined
                                                    )?.startsWith("database")
                                                        ? 3
                                                        : 2),
                                                )
                                                .join("/"),
                                        )'>
                                    {{ isValidID(childRoute) &&
                                        useState("itemLabel").value ? useState("itemLabel").value : t(
                                            childRoute === "admin"
                                                ? "routeAdmin"
                                                : childRoute,
                                        ) }}
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
                                                <NButton round size="small" tag="a"
                                                    :href="`/${database?.slug}/admin/settings`" @click.stop.prevent="navigateTo(
                                                        `/${database?.slug}/admin/settings`,
                                                    )">
                                                    <template #icon>
                                                        <NIcon>
                                                            <IconSettings />
                                                        </NIcon>
                                                    </template>
                                                </NButton>
                                            </template>
                                            {{ t("databaseSettings") }}
                                        </NTooltip>
                                    </template>
                                    <NDropdown :options='userDropdownOptions' @select='onSelectUserDropdown'>
                                        <NButton round size="small"><template #icon>
                                                <NIcon>
                                                    <IconUser />
                                                </NIcon>
                                            </template></NButton>
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
                                    <NButton round size="small"><template #icon>
                                            <NIcon>
                                                <IconLanguage />
                                            </NIcon>
                                        </template></NButton>
                                </NDropdown>
                            </NButtonGroup>
                        </template>
                    </NPageHeader>
                </NLayoutHeader>
            </NScrollbar>
            <NLayoutContent id="container" position="absolute" :style="{
                top: '64px',
                height: 'calc(~\'100vh - 98px\')',
            }" :nativeScrollbar="false" :contentStyle='{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
                height: "max-content",
            }'>
                <slot />
            </NLayoutContent>
        </NLayout>
    </NMessageProvider>
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
    NIcon,
    NLayout,
    NLayoutContent,
    NLayoutHeader,
    NMessageProvider,
    NPageHeader,
    NScrollbar,
    NSpace,
    NTag,
    NText,
    NTooltip,
} from "naive-ui";

const Language = useGlobalCookie<string>("Language");
useLanguage({
    ar: {
        settings: "الإعدادات",
        toggleTheme: "تغيير الوضع",
        edit: "تعديل",
        routeAdmin: "لوحة التحكم",
        allRightsReserved: "جميع الحقوق محفوظة",
        logout: "تسجيل الخروج",
        profile: "تعديل الحساب",
        session: "سجل الدخول",
        user: "مستخدم",
        admin: "مدير",
        translation: "ترجمة",
        asset: "ملف",
        tables: "الجداول",
        totalDatabaseSize: "حجم قاعدة البيانات",
        databaseSettings: "إعدادات قاعدة البيانات",
        isRequired: "إجباري",
        isNotValid: "غير صالح",
    },
    en: { routeAdmin: "Admin Panel" },
});

const route = useRoute(),
    user = useState<User | null>("user"),
    Theme = useGlobalCookie<string>("Theme"),
    database = useState<Database>("database", () => ({
        slug: "inicontent",
        icon: "/favicon.ico",
    })),
    ThemeConfig = useState<ThemeConfig>("ThemeConfig");
const userDropdownOptions = [
    {
        key: "header",
        type: "render",
        render: () =>
            h(
                NSpace,
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
                        () => user.value?.username ?
                            user.value.username
                                .charAt(0)
                                .toUpperCase() +
                            user.value.username.slice(1) : "--",
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
        icon: () =>
            h(NIcon, () => h(IconPencil)),
        show: database.value?.tables
            ?.find(
                ({ slug }) => slug === "user",
            )
            ?.allowedMethods?.includes("u"),
    },
    {
        label: t("logout"),
        key: "logout",
        icon: () =>
            h(NIcon, () => h(IconLogout)),
    },
]
async function onSelectUserDropdown(v: string) {
    switch (v) {
        case "edit":
            navigateTo(
                `/${database.value.slug
                }/admin/tables/user/${(user.value as User).id
                }/edit`,
            );
            break;
        case "logout":
            await $fetch(
                `${useRuntimeConfig().public
                    .apiBase
                }${database.value.slug ??
                "inicontent"
                }/auth/signout`,
                {},
            );
            user.value = null;
            await navigateTo(
                database.value.slug
                    ? `/${database.value.slug}/auth`
                    : "/auth",
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
]
</script>