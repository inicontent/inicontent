<template>
    <NuxtLayout name="default">
        <NLayout position="absolute" has-sider>
            <NLayoutSider :collapsed="!isMenuOpen" @update-collapsed="(collapsed) =>
                isMenuOpen = !collapsed" style="z-index: 999" bordered show-trigger="bar" collapse-mode="width"
                :collapsed-width="isMobile ? 0 : 64" width="240" :native-scrollbar="false">
                <NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="isMobile ? 0 : 64"
                    @mouseover="() => isMenuOpen = true" @mouseleave="() => isMenuOpen = false" :options="menuOptions"
                    :value="defaultValue ?? undefined" accordion />
            </NLayoutSider>
            <NLayoutContent id="pageContent" position="absolute" :content-style="{
                padding: isMobile
                    ? '24px 0'
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
                <slot></slot>
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
    IconPencil,
    IconPlus,
    IconTrash,
    IconUsers,
} from "@tabler/icons-vue";
import { NIcon, NLayout, NLayoutContent, NLayoutSider, NMenu } from "naive-ui";
import { NuxtLink } from "#components";

const Language = useCookie<string>("Language");

useLanguage({
    ar: {
        showAll: "أظهر الكل",
        newItem: "عنصر جديد",
    },
    en: {},
});

const route = useRoute(),
    { isMobile } = useDevice(),
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
        allowedMethods?.includes("r")
            ? {
                label: () =>
                    h(
                        NuxtLink,
                        {
                            onClick: () => {
                                defaultValue.value = `${slug}-get`;
                            },
                            to: `/${database.value.slug}/api/tables/${slug}/get`,
                        },
                        { default: () => t("GET") },
                    ),
                key: `${slug}-get`,
                icon: () => h(NIcon, () => h(IconEye)),
            } : null,
        allowedMethods?.includes("c")
            ? {
                label: () =>
                    h(
                        NuxtLink,
                        {
                            onClick: () => {
                                defaultValue.value = `${slug}-post`;
                            },
                            to: `/${database.value.slug}/api/tables/${slug}/post`,
                        },
                        { default: () => t("POST") },
                    ),
                key: `${slug}-post`,
                icon: () => h(NIcon, () => h(IconPlus)),
            }
            : null,
        allowedMethods?.includes("u")
            ? {
                label: () =>
                    h(
                        NuxtLink,
                        {
                            onClick: () => {
                                defaultValue.value = `${slug}-put`;
                            },
                            to: `/${database.value.slug}/api/tables/${slug}/put`,
                        },
                        { default: () => t("PUT") },
                    ),
                key: `${slug}-put`,
                icon: () => h(NIcon, () => h(IconPencil)),
            }
            : null,
        allowedMethods?.includes("d")
            ? {
                label: () =>
                    h(
                        NuxtLink,
                        {
                            onClick: () => {
                                defaultValue.value = `${slug}-delete`;
                            },
                            to: `/${database.value.slug}/api/tables/${slug}/delete`,
                        },
                        { default: () => t("DELETE") },
                    ),
                key: `${slug}-delete`,
                icon: () => h(NIcon, () => h(IconTrash)),
            }
            : null,
    ].filter((item) => item);
    return itemChildren.length ? {
        label: () =>
            h(
                NuxtLink,
                {
                    onClick: () => {
                        defaultValue.value = slug;
                    },
                    to: `/${database.value.slug}/api/tables/${slug}`,
                },
                { default: () => t(slug) },
            ),
        key: slug,
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
        children: itemChildren
    } : undefined;
};
const menuOptions: any = database.value.tables
    ? [
        ...(database.value.tables
            ?.filter(
                ({ slug }) =>
                    !["user", "session", "asset", "translation"].includes(slug)
            )
            .map(renderSingleItem) ?? []),
        database.value.tables?.filter(
            ({ slug }) =>
                ["user", "session", "asset", "translation"].includes(slug)
        ).length
            ? {
                key: "divider-1",
                type: "divider",
            }
            : null,
        ...(database.value.tables
            ?.filter(
                ({ slug }) =>
                    ["user", "session", "asset", "translation"].includes(slug)
            )
            .map(renderSingleItem) ?? []),
    ]
    : [];
</script>