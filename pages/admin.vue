<template>
    <NCard :title="t('databases')" style="background: none" :bordered="false">
        <template #header-extra>
            <NButton :circle="isMobile" :round="!isMobile" @click="(DatabaseModal = {}, showDatabaseModal = true)">
                <template #icon>
                    <NIcon>
                        <IconPlus />
                    </NIcon>
                </template>
                <template v-if="!isMobile">
                    {{ t('addNewDatabase') }}
                </template>
            </NButton>
        </template>
        <NModal v-model:show="showDatabaseModal" :style="{
            width: !isMobile ? '600px' : '100%'
        }" preset="card" :title="t('createDatabase')" :bordered="false" :segmented="{
            footer: 'soft',
        }">
            <template #footer>
                <NFlex justify="end">
                    <NButton :loading="Loading.Database" @click="DatabaseSave">
                        <template #icon>
                            <NIcon>
                                <IconDeviceFloppy />
                            </NIcon>
                        </template>
                        {{ t("create") }}
                    </NButton>
                </NFlex>
            </template>
            <NForm ref="DatabaseRef" :model="DatabaseModal">
                <LazyRenderField :model="DatabaseModal" :schema="[
                    {
                        id: 1,
                        key: 'slug',
                        type: 'string',
                        required: true,
                    },
                    {
                        id: 2,
                        key: 'icon',
                        type: 'url',
                        subType: 'upload',
                        required: true,
                    },
                    {
                        id: 3,
                        key: 'allowedDomains',
                        type: 'array',
                        children: 'url',
                        required: false,
                    },
                    {
                        id: 4,
                        key: 'languages',
                        type: 'array',
                        subType: 'select',
                        children: 'string',
                        values: Languages,
                        required: false,
                    },
                    {
                        id: 5,
                        key: 'roles',
                        type: 'array',
                        subType: 'tags',
                        children: 'string',
                        disabledItems: [0, 1, 2],
                        defaultValue: ['admin', 'user', 'guest'],
                        required: false,
                    },
                ]" />
            </NForm>
        </NModal>
        <NCollapse v-if="databases?.result?.length" :expanded-names="defaultOpenedDatabase"
            :triggerAreas="['main', 'arrow']" accordion>
            <NCollapseItem v-for="childDatabase in databases?.result" :title="t(childDatabase.slug)"
                :name="childDatabase.slug">
                <template #header-extra>
                    <NButtonGroup>
                        <NButton round tag="a" :href="`/${database?.slug}/admin/settings`" @click.stop.prevent="navigateTo(
                            `/${database?.slug}/admin/settings`,
                        )">
                            <template #icon>
                                <NIcon>
                                    <IconSettings />
                                </NIcon>
                            </template>
                        </NButton>
                        <NButton round tag="a" :href="`/${database?.slug}/admin`" @click.stop.prevent="navigateTo(
                            `/${database?.slug}/admin`,
                        )">
                            <template #icon>
                                <NIcon>
                                    <IconArrowRight />
                                </NIcon>
                            </template>
                        </NButton>

                    </NButtonGroup>
                </template>
                <LazyTableGrid :modelValue="childDatabase" />
            </NCollapseItem>
        </NCollapse>
        <NEmpty v-else />
    </NCard>
</template>

<script setup lang="ts">
import {
    IconArrowRight,
    IconDeviceFloppy,
    IconPlus,
    IconSettings,
} from "@tabler/icons-vue";
import {
    type FormInst,
    NButton,
    NButtonGroup,
    NCard,
    NCollapse,
    NCollapseItem,
    NEmpty,
    NForm,
    NIcon,
    NModal,
    NFlex,
    useMessage,
} from "naive-ui";

definePageMeta({
    middleware: "dashboard",
});

useLanguage({
    ar: {
        newItem: "عنصر جديد",
        tableSettings: "إعدادات الجدول",
        databases: "قواعد البيانات",
        createDatabase: "إنشاء قاعدة بيانات جديدة",
        slug: "الإسم",
        allowedMethods: "الأوامر المسموح بها",
        allowedDomains: "النِطاقات المسموح بها",
        languages: "اللغات",
        roles: "الأدوار",
        guest: "زائر",
        icon: "أيقونة",
    },
    en: {},
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
Loading.value.Database = false;

const database = useState<Database>("database"),
    message = useMessage(),
    { isMobile } = useDevice(),
    { data: databases } = await useFetch<apiResponse<Database[]>>(
        `${useRuntimeConfig().public.apiBase}inicontent/database`,
    ),
    defaultOpenedDatabase = ref(
        databases.value?.result?.length ? databases.value.result[0].slug : null,
    ),
    showDatabaseModal = ref(false),
    DatabaseRef = ref<FormInst | null>(null),
    DatabaseModal = ref<Database>(),
    DatabaseSave = async () => {
        DatabaseRef.value?.validate(async (errors: any) => {
            if (!errors) {
                const bodyContent = JSON.parse(JSON.stringify(DatabaseModal.value));
                Loading.value.Database = true;
                const data = await $fetch<apiResponse>(
                    `${useRuntimeConfig().public.apiBase}inicontent/database${bodyContent.id ? `/${bodyContent.slug}` : ""
                    }`,
                    {
                        method: bodyContent.id ? "PUT" : "POST",
                        body: bodyContent,
                    },
                );
                Loading.value.Database = false;

                if (!data.result) return message.error(data.message);

                if (databases.value) {
                    if (databases.value.result)
                        databases.value.result.push(data.result);
                    else databases.value.result = [data.result];
                    defaultOpenedDatabase.value = data.result.slug;
                }
                showDatabaseModal.value = false;
                message.success(data.message);
            } else message.error("The inputs are Invalid");
        });
    };

useHead({
    title: `${database.value.slug} | ${t('dashboard')}`,
    link: [{ rel: "icon", href: database.value?.icon ?? "" }],
});

</script>