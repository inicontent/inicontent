<template>
    <NuxtLayout name="default">
        <NLayout position="absolute" has-sider>
            <NLayoutSider :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
                isMenuOpen = !collapsed" style="z-index: 999" bordered show-trigger="bar" collapse-mode="width"
                :collapsed-width="isMobile ? 0 : 64" width="240" :native-scrollbar="false">
                <NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="isMobile ? 0 : 64"
                    @mouseover="() =>
                        isMenuOpen = true" @mouseleave="() =>
                            isMenuOpen = false" :options="menuOptions" :expanded-keys="table?.slug
                                ? [`${table?.slug}Group`]
                                : []" :value="defaultValue ?? undefined" accordion />
            </NLayoutSider>
            <NLayoutContent id="page_content" position="absolute" :content-style="{
                padding: isMobile
                    ? '24px'
                    : Language === 'ar'
                        ? '24px 88px 24px 24px'
                        : '24px 24px 24px 88px',
            }" :native-scrollbar="false">
                <div v-if="isMenuOpen" :style='{
                    width: "100%",
                    height: "100%",
                    right: "0px",
                    top: "0px",
                    backgroundColor: "#0000006e",
                    position: "absolute",
                    zIndex: 99,
                    cursor: "pointer",
                }'>
                </div>
                <slot />
            </NLayoutContent>
        </NLayout>
    </NuxtLayout>
</template>

<script setup lang="ts">
import {
    IconEye,
    IconFingerprint,
    IconFolders,
    IconLanguage,
    IconPlus,
    IconSettings,
    IconUsers,
    IconWebhook,
} from "@tabler/icons-vue";
import { NIcon, NLayout, NLayoutContent, NLayoutSider, NMenu } from "naive-ui";
import { NuxtLink } from "#components";

const Language = useGlobalCookie<string>("Language");

useLanguage({
    ar: {
        showAll: "أظهر الكل",
        newItem: "عنصر جديد",
    },
    en: {},
});

const route = useRoute(),
    { isMobile } = useDevice(),
    user = useState<User>("user"),
    table = useState<Table>("table"),
    isMenuOpen = useState("isMenuOpen", () => false),
    database = useState<Database>("database"),
    defaultValue = ref();

const lastPathInRoute = decodeURIComponent(
    route.path.split("/").filter(Boolean).at(-1) ?? "",
);
if (table.value?.slug) {
    if (lastPathInRoute && lastPathInRoute !== table.value.slug)
        defaultValue.value = `${table.value.slug}-${lastPathInRoute}`;
    else defaultValue.value = table.value.slug;
} else defaultValue.value = decodeURI(lastPathInRoute?.toString() ?? "");

const renderSingleItem = ({ slug, allowedMethods }: Table) => {
    const itemChildren = [
        ...(slug !== "asset" && allowedMethods?.includes("c")
            ? [
                {
                    label: () =>
                        h(
                            NuxtLink,
                            {
                                onClick: () => {
                                    defaultValue.value = slug;
                                },
                                to: `/${database.value.slug}/admin/tables/${slug}`,
                            },
                            { default: () => t("showAll") },
                        ),
                    key: slug,
                    icon: () => h(NIcon, () => h(IconEye)),
                },
                {
                    label: () =>
                        h(
                            NuxtLink,
                            {
                                onClick: () => {
                                    defaultValue.value = `${slug}-new`;
                                },
                                to: `/${database.value.slug}/admin/tables/${slug}/new`,
                            },
                            { default: () => t("newItem") },
                        ),
                    key: `${slug}-new`,
                    icon: () => h(NIcon, () => h(IconPlus)),
                },
            ]
            : []),
        ...(user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55"
            ? [
                ...(slug !== "asset"
                    ? [
                        {
                            label: () =>
                                h(
                                    NuxtLink,
                                    {
                                        onClick: () => {
                                            defaultValue.value = `${slug}-settings`;
                                        },
                                        to: `/${database.value.slug}/admin/tables/${slug}/settings`,
                                    },
                                    { default: () => t("settings") },
                                ),
                            key: `${slug}-settings`,
                            icon: () => h(NIcon, () => h(IconSettings)),
                        },
                    ]
                    : []),
                {
                    label: () =>
                        h(
                            NuxtLink,
                            {
                                onClick: () => {
                                    defaultValue.value = `${slug}-flows`;
                                },
                                to: `/${database.value.slug}/admin/tables/${slug}/flows`,
                            },
                            { default: () => t("flows") },
                        ),
                    key: `${slug}-flows`,
                    icon: () => h(NIcon, () => h(IconWebhook)),
                },
            ]
            : []),
    ];
    return {
        label: () =>
            h(
                NuxtLink,
                {
                    onClick: () => {
                        defaultValue.value = slug;
                    },
                    to: `/${database.value.slug}/admin/tables/${slug}`,
                },
                { default: () => t(slug) },
            ),
        key: itemChildren.length ? `${slug}Group` : slug,
        icon: () =>
            h(NIcon, () => {
                switch (slug) {
                    case "asset":
                        return h(IconFolders);
                    case "translation":
                        return h(IconLanguage);
                    case "user":
                        return h(IconUsers);
                    case "session":
                        return h(IconFingerprint);
                    default:
                        return t(slug).charAt(0).toUpperCase();
                }
            }),
        children: itemChildren.length ? itemChildren : undefined,
    };
};
const menuOptions: any = database.value.tables
    ? [
        ...(database.value.tables
            ?.filter(
                ({ slug, allowedMethods }) =>
                    !["user", "session", "asset", "translation"].includes(slug) &&
                    allowedMethods?.includes("r"),
            )
            .map(renderSingleItem) ?? []),
        database.value.tables?.filter(
            ({ slug, allowedMethods }) =>
                ["user", "session", "asset", "translation"].includes(slug) &&
                allowedMethods?.includes("r"),
        ).length
            ? {
                key: "divider-1",
                type: "divider",
            }
            : null,
        ...(database.value.tables
            ?.filter(
                ({ slug, allowedMethods }) =>
                    ["user", "session", "asset"].includes(slug) &&
                    allowedMethods?.includes("r"),
            )
            .map(renderSingleItem) ?? []),
    ]
    : [];
</script>