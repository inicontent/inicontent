<template>
    <div>
        <LazyFormDrawer></LazyFormDrawer>
        <NSpin :show="!!Loading.CREATE || !!Loading.DELETE || !!Loading.UPDATE">
            <NCard style="height: fit-content">
                <template #header>
                    <NPerformantEllipsis>{{ t(table.slug) }}: {{ isEdit ? itemLabel : t('newItem') }}
                    </NPerformantEllipsis>
                </template>
                <template v-if="formRef?.schema && formRef?.schema.length > 4" #header-extra>
                    <NButtonGroup v-if="isEdit">
                        <NTooltip :delay="1500">
                            <template #trigger>
                                <NButton type="info" secondary round>
                                    <template #icon>
                                        <NuxtLink
                                            :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}`">
                                            <NIcon>
                                                <Icon name="tabler:eye" />
                                            </NIcon>
                                        </NuxtLink>
                                    </template>
                                </NButton>
                            </template>
                            {{ t('view') }}
                        </NTooltip>
                        <NPopconfirm @positive-click="formRef?.delete">
                            <template #trigger>
                                <NTooltip :delay="1500">
                                    <template #trigger>
                                        <NButton secondary round type="error" :loading="Loading.DELETE">
                                            <template #icon>
                                                <NIcon>
                                                    <Icon name="tabler:trash" />
                                                </NIcon>
                                            </template>
                                        </NButton>
                                    </template>
                                    {{ t('delete') }}
                                </NTooltip>
                            </template>
                            {{ t("theFollowingActionIsIrreversible") }}
                        </NPopconfirm>

                        <NTooltip :delay="1500">
                            <template #trigger>
                                <NButton secondary round type="primary" @click="formRef?.update"
                                    :loading="Loading.UPDATE || Loading.SCHEMA">
                                    <template #icon>
                                        <NIcon>
                                            <Icon name="tabler:device-floppy" />
                                        </NIcon>
                                    </template>
                                </NButton>
                            </template>
                            {{ t('update') }}
                        </NTooltip>
                    </NButtonGroup>
                    <NTooltip v-else :delay="1500">
                        <template #trigger>
                            <NButton secondary round type="primary" @click="formRef?.create"
                                :loading="Loading.CREATE || Loading.SCHEMA">
                                <template #icon>
                                    <NIcon>
                                        <Icon name="tabler:send" />
                                    </NIcon>
                                </template>
                            </NButton>
                        </template>
                        {{ t('publish') }}
                    </NTooltip>
                </template>
                <template #action>
                    <NFlex justify="end">
                        <NButtonGroup v-if="isEdit">
                            <NButton type="info" secondary round>
                                <template #icon>
                                    <NuxtLink
                                        :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}`">
                                        <NIcon>
                                            <Icon name="tabler:eye" />
                                        </NIcon>
                                    </NuxtLink>
                                </template>
                                {{ t('view') }}
                            </NButton>
                            <NPopconfirm @positive-click="formRef?.delete">
                                <template #trigger>
                                    <NButton secondary round type="error" :loading="Loading.DELETE">
                                        <template #icon>
                                            <NIcon>
                                                <Icon name="tabler:trash" />
                                            </NIcon>
                                        </template>
                                        {{ t('delete') }}
                                    </NButton>
                                </template>
                                {{ t("theFollowingActionIsIrreversible") }}
                            </NPopconfirm>

                            <NButton secondary round type="primary" @click="formRef?.update"
                                :loading="Loading.UPDATE || Loading.SCHEMA">
                                <template #icon>
                                    <NIcon>
                                        <Icon name="tabler:device-floppy" />
                                    </NIcon>
                                </template>
                                {{ t('update') }}
                            </NButton>
                        </NButtonGroup>
                        <NButton v-else secondary round type="primary" @click="formRef?.create"
                            :loading="Loading.CREATE || Loading.SCHEMA">
                            <template #icon>
                                <NIcon>
                                    <Icon name="tabler:send" />
                                </NIcon>
                            </template>
                            {{ t('publish') }}
                        </NButton>
                        <slot name="extraActions"></slot>
                    </NFlex>
                </template>
                <slot>
                    <Form ref="formRef" v-model="modelValue"></Form>
                </slot>
            </NCard>
        </NSpin>
    </div>
</template>

<script lang="ts" setup>
onBeforeRouteUpdate((route, currentRoute) => {
    if (route.fullPath !== currentRoute.fullPath.slice(0, -5))
        clearNuxtState("itemLabel")
})

const modelValue = defineModel<Item>()
const isEdit = !!modelValue.value?.id

const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const table = useState<Table>("table")
const database = useState<Database>("database")
const formRef = ref<FormRef>()

const itemLabel = useState("itemLabel")
watchEffect(() => {
    itemLabel.value = renderLabel(table.value, modelValue.value)
})

useHead({
    title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${isEdit ? itemLabel.value : t("new")}`,
    link: [
        { rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
    ],
})
</script>