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
                <NPopover v-if="user?.role === config.public.idOne" :delay="600" scrollable style="max-height: 240px;">
                    <template #trigger>
                        <NButton round size="small">{{ humanFileSize(
                            database?.size,
                        ) }}</NButton>
                    </template>
                    <NFlex vertical>
                        <NTag v-for="table in database.tables" round
                            style="width:fit-content;padding-inline-start: 0; margin: auto;" :bordered="false">
                            <NTag style="width:fit-content;margin-inline-end: 8px;" :bordered="false" type="primary"
                                round strong>
                                <template #avatar>
                                    <LazyTableIcon :table="table" />
                                </template>
                                {{ t(table.slug) }}
                            </NTag>
                            {{ humanFileSize(table?.size) }}
                        </NTag>
                    </NFlex>
                </NPopover>
                <NDropdown :options="userDropdownOptions" @select="onSelectUserDropdown">
                    <NButton round size="small">
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
                <NDropdown v-if="languagesDropdownOptions?.length" :value="Language" :options="languagesDropdownOptions"
                    @select="(v) => Language = v">
                    <NButton round size="small">
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:language" />
                            </NIcon>
                        </template>
                    </NButton>
                </NDropdown>
            </NButtonGroup>
        </template>
    </NPageHeader>
</template>

<script setup lang="ts">
import { isValidID } from "inibase/utils"
import { Icon, NIcon, NTag, NText } from "#components"

const config = useRuntimeConfig()
const route = useRoute()
const user = useState<User | undefined>("user")
const database = useState<Database>("database")

const Language = useCookie<LanguagesType>("language", { sameSite: true })
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const redirectTo = useCookie("redirectTo", { sameSite: true })

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
            String(route.matched[0]?.name),
        ),
)

function breadCrumbItemLink(index: number) {
    const segments = route.path.split("/").filter(Boolean)
    const segmentValue = breadcrumbArray.value[index]
    const actualIndex = segments.indexOf(segmentValue)
    if (actualIndex === -1) return route.path
    const pathSegments = ["", ...segments.slice(0, actualIndex + 1)].join("/")
    if (index === 0 && database.value?.slug !== "inicontent") {
        return pathSegments + "/tables"
    }
    return pathSegments
}
const breadcrumbArray = computed(() =>
    route.path
        .split("/")
        .filter(Boolean)
        .slice(
            !["database", "admin"].includes(route.matched[0]?.name as string) ? 1 : 0,
        )
        .filter((segment) => segment !== "admin"),
)
const table = useState<Table>("table")
const currentItem = useState<Item>("currentItem")
const currentDashboard = useState<Dashboard | null>("currentDashboard")
const itemLabel = computed(() => renderLabel(table.value, currentItem.value))

function breadCrumbItemLabel(index: number) {
    const childRoute = breadcrumbArray.value[index]
    if (isValidID(childRoute)) {
        if (currentDashboard.value?.name && route.path.includes('/dashboards/'))
            return currentDashboard.value.name
        if (currentItem.value)
            return itemLabel.value
    }
    return t(childRoute)
}
const userDropdownOptions = computed(() => [
    {
        label: t("settings"),
        key: "settings",
        icon: () => h(NIcon, () => h(Icon, { name: "tabler:settings" })),
        show: user.value?.role === config.public.idOne,
    },
    {
        label: t("billing"),
        key: "billing",
        icon: () => h(NIcon, () => h(Icon, { name: "tabler:credit-card" })),
        show:
            !!user.value?.id &&
            (
                user.value?.role === config.public.idOne ||
                database.value?.slug === "inicontent"
            ),
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
        label: `${t("clearCache")} (${humanFileSize(
            cacheStats.value.size,
        )})`,
        key: "clearCache",
        icon: () => h(NIcon, () => h(Icon, { name: "tabler:wash-machine" })),
        show: !!user.value?.id && cacheStats.value.size > 0,
    },
])

const sessionID = useCookie<string | null>("sessionID", {
    sameSite: true,
});

async function onSelectUserDropdown(v: string) {
    switch (v) {
        case "edit":
            navigateTo(
                `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/users/${(user.value as User).id
                }/edit`,
            )
            break
        case "billing":
            navigateTo(
                database.value?.slug === "inicontent"
                    ? "/admin/billing"
                    : `/${route.params.database ?? database.value?.slug}/admin/billing`,
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
                `${config.public.apiBase}${database.value.slug ?? "inicontent"
                }/auth/signout`,
                {
                    credentials: "include", params: {
                        locale: Language.value,
                        [`${database.value.slug}_sid`]: sessionID.value,
                    },
                },
            )
            redirectTo.value = undefined
            user.value = undefined
            await navigateTo(
                `${route.params.database ? `/${route.params.database}` : ""}/auth`,
            )
            break
        case "clearCache":
            await clearAllCache()
            cacheStats.value = await getCacheStats()
            break
    }
}
const cacheStats = ref<{ total?: number; expired?: number; size: number }>({ size: 0 })
onMounted(async () => {
    cacheStats.value = await getCacheStats()
})

const languagesDropdownOptions = database.value?.secondaryLanguages?.map(
    (language) => ({
        label: t(`languages.${language}`),
        key: language,
    }),
)

</script>