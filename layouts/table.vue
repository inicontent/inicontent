<template>
    <NuxtLayout name="default">
        <NLayout position="absolute" has-sider>
            <NLayoutSider v-if="database?.slug" :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
                isMenuOpen = !collapsed" style="z-index: 999" bordered show-trigger="bar" collapse-mode="width"
                :collapsed-width="isMobile ? 0 : 64" width="240" :native-scrollbar="false">
                <NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="isMobile ? 0 : 64"
                    @mouseover="() => isMenuOpen = true" @mouseleave="() => isMenuOpen = false" :options="menuOptions"
                    :defaultValue :watch-props="['defaultValue']" accordion />
            </NLayoutSider>
            <NLayoutContent id="pageContent" position="absolute" :content-style="{
                padding: isMobile
                    ? '24px 0'
                    : Language === 'ar'
                        ? '24px 88px 24px 24px'
                        : '24px 24px 24px 88px',
            }" :native-scrollbar="false">
                <div v-if="isMenuOpen"
                    style="width: 100%;height: 100%;right: 0;top: 0;position: absolute;background-color: #0000006e;z-index: 99;cursor: pointer;">
                </div>
                <slot></slot>
            </NLayoutContent>
        </NLayout>
    </NuxtLayout>
</template>

<script setup lang="ts">
import {
    NIcon,
    NLayout,
    NLayoutContent,
    NLayoutSider,
    NMenu,
    type MenuOption,
} from "naive-ui";
import { DataIcon, NuxtLink } from "#components";

const Language = useCookie<string>("Language");

useLanguage({
    ar: {
        clickToCopy: "نسخ",
        textCopied: "تم نسخ النص",
        viewTheItem: "مُعاينة العنصر",
        createdAt: "تاريخ الإنشاء",
        updatedAt: "تاريخ التعديل",
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
    },
    en: {},
});

const route = useRoute();
const { isMobile } = useDevice();
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

const getTableIcon = (slug: string) => {
    switch (slug) {
        case "assets":
            return h(DataIcon, { value: "folders" });
        case "translations":
            return h(DataIcon, { value: "language" });
        case "users":
            return h(DataIcon, { value: "users" });
        case "sessions":
            return h(DataIcon, { value: "fingerprint" });
        case "pages":
            return h(DataIcon, { value: "app-window" });
        case "components":
            return h(DataIcon, { value: "tournament" });
        default:
            return t(slug).charAt(0).toUpperCase();
    }
};

const renderSingleItem = ({ slug, allowedMethods }: Table): MenuOption => {
    const itemChildren = [
        {
            label: () =>
                h(
                    NuxtLink,
                    {
                        to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${slug}`,
                    },
                    { default: () => t("showAll") },
                ),
            key: slug,
            show: slug !== "assets",
            icon: () => h(NIcon, () => h(DataIcon, { value: "eye" })),
        },
        {
            label: () =>
                h(
                    NuxtLink,
                    {
                        to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${slug}/new`,
                    },
                    { default: () => t("newItem") },
                ),
            key: `${slug}-new`,
            show: slug !== "assets" && allowedMethods?.includes("c"),
            icon: () => h(NIcon, () => h(DataIcon, { value: "plus" })),
        },
        {
            label: () =>
                h(
                    NuxtLink,
                    {
                        to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${slug}/settings`,
                    },
                    { default: () => t("settings") },
                ),
            key: `${slug}-settings`,
            icon: () => h(NIcon, () => h(DataIcon, { value: "settings" })),
            show: user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55" && !["sessions", "translations", "assets"].includes(slug)
        },
        {
            label: () =>
                h(
                    NuxtLink,
                    {
                        to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${slug}/flows`,
                    },
                    { default: () => t("flows") },
                ),
            key: `${slug}-flows`,
            icon: () => h(NIcon, () => h(DataIcon, { value: "webhook" })),
            show: user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55" && !["sessions", "translations"].includes(slug)
        },
    ];
    return {
        label: () =>
            h(
                NuxtLink,
                {
                    to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${slug}`,
                },
                { default: () => t(slug) },
            ),
        key: itemChildren.length ? `${slug}Group` : slug,
        icon: () => h(NIcon, () => getTableIcon(slug)),
        children: itemChildren.length ? itemChildren : undefined,
    };
};
const menuOptions: MenuOption[] = database.value?.tables
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
    : [];
</script>