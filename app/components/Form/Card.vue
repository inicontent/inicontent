<template>
    <div>
        <LazyFormDrawer></LazyFormDrawer>
        <div class="animate-spin" :show="!!Loading.CREATE || !!Loading.DELETE || !!Loading.UPDATE">
            <UCard style="height: fit-content">
                <template #header>
                    <div class="truncate">{{ t(table.slug) }}: {{ isEdit ? itemLabel : t('newItem') }}
                    </div>
                </template>
                <template v-if="formRef?.schema && formRef?.schema.length > 4" #header-extra>
                    <UButtonGroup v-if="isEdit">
                        <UTooltip :delay="1500">
                            <template #trigger>
                                <UButton type="info" secondary round>
                                    <template #icon>
                                        <NuxtLink
                                            :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}`">
                                            <div class="inline-block">
                                                <Icon name="tabler:eye" />
                                            </div>
                                        </NuxtLink>
                                    </template>
                                </UButton>
                            </template>
                            {{ t('view') }}
                        </UTooltip>
                        <UPopover @positive-click="formRef?.delete">
                            <template #trigger>
                                <UTooltip :delay="1500">
                                    <template #trigger>
                                        <UButton secondary round type="error" :loading="Loading.DELETE">
                                            <template #icon>
                                                <div class="inline-block">
                                                    <Icon name="tabler:trash" />
                                                </div>
                                            </template>
                                        </UButton>
                                    </template>
                                    {{ t('delete') }}
                                </UTooltip>
                            </template>
                            {{ t("theFollowingActionIsIrreversible") }}
                        </UPopover>

                        <UTooltip :delay="1500">
                            <template #trigger>
                                <UButton secondary round type="primary" @click="formRef?.update"
                                    :loading="Loading.UPDATE || Loading.SCHEMA">
                                    <template #icon>
                                        <div class="inline-block">
                                            <Icon name="tabler:device-floppy" />
                                        </div>
                                    </template>
                                </UButton>
                            </template>
                            {{ t('update') }}
                        </UTooltip>
                    </div>
                    <UTooltip v-else :delay="1500">
                        <template #trigger>
                            <UButton secondary round type="primary" @click="formRef?.create"
                                :loading="Loading.CREATE || Loading.SCHEMA">
                                <template #icon>
                                    <div class="inline-block">
                                        <Icon name="tabler:send" />
                                    </div>
                                </template>
                            </UButton>
                        </template>
                        {{ t('publish') }}
                    </UTooltip>
                </template>
                <template #action>
                    <div class="flex" justify="end">
                        <UButtonGroup v-if="isEdit">
                            <UButton type="info" secondary round>
                                <template #icon>
                                    <NuxtLink
                                        :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/${$route.params.id}`">
                                        <div class="inline-block">
                                            <Icon name="tabler:eye" />
                                        </div>
                                    </NuxtLink>
                                </template>
                                {{ t('view') }}
                            </UButton>
                            <UPopover @positive-click="formRef?.delete">
                                <template #trigger>
                                    <UButton secondary round type="error" :loading="Loading.DELETE">
                                        <template #icon>
                                            <div class="inline-block">
                                                <Icon name="tabler:trash" />
                                            </div>
                                        </template>
                                        {{ t('delete') }}
                                    </UButton>
                                </template>
                                {{ t("theFollowingActionIsIrreversible") }}
                            </UPopover>

                            <UButton secondary round type="primary" @click="formRef?.update"
                                :loading="Loading.UPDATE || Loading.SCHEMA">
                                <template #icon>
                                    <div class="inline-block">
                                        <Icon name="tabler:device-floppy" />
                                    </div>
                                </template>
                                {{ t('update') }}
                            </UButton>
                        </div>
                        <UButton v-else secondary round type="primary" @click="formRef?.create"
                            :loading="Loading.CREATE || Loading.SCHEMA">
                            <template #icon>
                                <div class="inline-block">
                                    <Icon name="tabler:send" />
                                </div>
                            </template>
                            {{ t('publish') }}
                        </UButton>
                        <slot name="extraActions"></slot>
                    </div>
                </template>
                <slot>
                    <Form ref="formRef" v-model="modelValue"></Form>
                </slot>
            </UCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Item>()
const isEdit = !!modelValue.value?.id

const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const table = useState<Table>("table")
const database = useState<Database>("database")
const formRef = ref<FormRef>()

const itemLabel = computed(() => renderLabel(table.value, modelValue.value))

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${isEdit ? itemLabel.value : t("new")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>