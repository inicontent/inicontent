<template>
    <NuxtLayout name="dashboard">
        <NLayout position="absolute" has-sider>
            <NLayoutSider v-if="database?.slug" :collapsed="!isMenuOpen"
                @update-collapsed="(collapsed) => (isMenuOpen = !collapsed)" style="z-index: 1000" bordered
                show-trigger="bar" collapse-mode="width" :collapsed-width="$device.isMobile ? 0 : 64" width="240"
                :native-scrollbar="false">
                <NMenu :collapsed="!isMenuOpen" :collapsed-icon-size="22" :collapsed-width="$device.isMobile ? 0 : 64"
                    :options="menuOptions" :default-value="defaultValue" :watch-props="['defaultValue']" accordion />
            </NLayoutSider>
            <NLayoutContent id="pageContent" position="absolute" :content-style="{
                padding: $device.isMobile
                    ? '24px 12px'
                    : Language === 'ar'
                        ? '24px 88px 24px 24px'
                        : '24px 24px 24px 88px',
            }" :native-scrollbar="false">
                <div v-if="isMenuOpen" @mouseover="() => (isMenuOpen = false)"
                    style="width: 100%; height: 100%; right: 0; top: 0; position: absolute; background-color: #0000006e; z-index: 99; cursor: pointer;">
                </div>
                <slot></slot>
            </NLayoutContent>
        </NLayout>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui"
import { Icon, LazyTableIcon, NuxtLink, NIcon } from "#components"

const Language = useCookie<LanguagesType>("language", { sameSite: true })

onBeforeUpdate(() => {
    clearNuxtState("isMenuOpen")
})

const route = useRoute()
const isMenuOpen = useState("isMenuOpen", () => false)
const database = useState<Database>("database")
const table = useState<Table>("table")

const defaultValue = computed(() => {
    const rawMethodKey = route.query.method as string | undefined
    const normalizedMethod = rawMethodKey
        ? methodAliases[rawMethodKey.toLowerCase()] ?? rawMethodKey
        : undefined
    const methodKey = normalizedMethod ?? "overview"
    if (table.value?.slug) return `${table.value.slug}-${methodKey}`
    const lastPathInRoute = decodeURIComponent(
        route.path.split("/").filter(Boolean).at(-1) ?? "",
    )
    return lastPathInRoute
})

const methodAliases: Record<string, string> = {
    create: "post",
    read: "get",
    update: "put",
    post: "post",
    get: "get",
    put: "put",
    delete: "delete",
}

const methodEntries = [
    {
        key: "overview",
        icon: "tabler:book",
        label: () => t("overview"),
        show: () => true,
        to: (baseUrl: string) => baseUrl,
    },
    {
        key: "post",
        icon: "tabler:plus",
        label: () => t("methods.post"),
        show: (allowed?: string) => allowed?.includes("c"),
        to: (baseUrl: string) => ({ path: baseUrl, query: { method: "post" } }),
    },
    {
        key: "get",
        icon: "tabler:eye",
        label: () => t("methods.get"),
        show: (allowed?: string) => allowed?.includes("r"),
        to: (baseUrl: string) => ({ path: baseUrl, query: { method: "get" } }),
    },
    {
        key: "put",
        icon: "tabler:pencil",
        label: () => t("methods.put"),
        show: (allowed?: string) => allowed?.includes("u"),
        to: (baseUrl: string) => ({ path: baseUrl, query: { method: "put" } }),
    },
    {
        key: "delete",
        icon: "tabler:trash",
        label: () => t("methods.delete"),
        show: (allowed?: string) => allowed?.includes("d"),
        to: (baseUrl: string) => ({ path: baseUrl, query: { method: "delete" } }),
    },
]

function buildMethodChildren(currentTable: Table) {
    const baseUrl = `${route.params.database ? `/${route.params.database}` : ""}/admin/api/tables/${currentTable.slug}`
    return methodEntries
        .filter((entry) => entry.show(currentTable.allowedMethods))
        .map((entry) => ({
            label: () =>
                h(
                    NuxtLink,
                    {
                        to: entry.to(baseUrl),
                    },
                    { default: () => entry.label() },
                ),
            key: `${currentTable.slug}-${entry.key}`,
            icon: () => h(NIcon, () => h(Icon, { name: entry.icon })),
        }))
}

function buildMenuOption(currentTable: Table): MenuOption {
    const children = buildMethodChildren(currentTable)
    return {
        label: () =>
            h(
                NuxtLink,
                {
                    to: `${route.params.database ? `/${route.params.database}` : ""}/admin/api/tables/${currentTable.slug}`,
                },
                { default: () => t(currentTable.slug) },
            ),
        key: `${currentTable.slug}Group`,
        icon: () => h(LazyTableIcon, { table: currentTable }),
        children: [
            {
                type: "group",
                label: t(currentTable.slug),
                key: currentTable.slug,
                children,
            },
        ],
    }
}

const primaryTables = computed(() =>
    (database.value?.tables ?? []).filter(
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
    ),
)

const secondaryTables = computed(() =>
    (database.value?.tables ?? []).filter(
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
    ),
)

const menuOptions = computed(() => {
    if (!database.value?.tables) return [] as MenuOption[]
    const options: MenuOption[] = []
    options.push(...primaryTables.value.map(buildMenuOption))
    if (secondaryTables.value.length)
        options.push({ key: "divider-1", type: "divider" })
    options.push(...secondaryTables.value.map(buildMenuOption))
    return options
})
</script>
