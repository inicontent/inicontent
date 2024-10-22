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
        <NDrawer v-model:show="showDatabaseModal" :placement="Language === 'ar' ? 'left' : 'right'"
            :width="isMobile ? '100%' : 350">
            <NDrawerContent :title="t('createDatabase')" closable>
                <template #footer>
                    <NFlex justify="end">
                        <NButton round :loading="Loading.Database" @click="DatabaseSave">
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
                    <RenderFieldS v-model="DatabaseModal" :schema="databaseSchema" />
                </NForm>
            </NDrawerContent>
        </NDrawer>
        <NCollapse v-if="databases?.result?.length" v-model:expanded-names="expandedNames"
            :triggerAreas="['main', 'arrow']" accordion>
            <NCollapseItem v-for="(database, index) in databases?.result" :title="t(database.slug)"
                :name="database.slug">
                <template #header-extra>
                    <NButtonGroup>
                        <NButton round tag="a" :href="`/${database.slug}/admin/settings`" @click.stop.prevent="navigateTo(
                            `/${database.slug}/admin/settings`,
                        )">
                            <template #icon>
                                <NIcon>
                                    <IconSettings />
                                </NIcon>
                            </template>
                        </NButton>
                        <NButton round tag="a" :href="`/${database.slug}/admin`" @click.stop.prevent="navigateTo(
                            `/${database.slug}/admin`,
                        )">
                            <template #icon>
                                <NIcon>
                                    <IconArrowRight />
                                </NIcon>
                            </template>
                        </NButton>
                    </NButtonGroup>
                </template>
                <LazyTableGrid v-model="databases.result[index]" />
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
    NDrawer,
    NDrawerContent,
    NFlex,
} from "naive-ui";

definePageMeta({
    middleware: "dashboard",
});

const route = useRoute();
const database = useState<Database>("database")

const Language = useCookie("Language")

useLanguage({
    ar: {
        newItem: "عنصر جديد",
        tableSettings: "إعدادات الجدول",
        databases: "قواعد البيانات",
        createDatabase: "إنشاء قاعدة بيانات جديدة",
        slug: "الإسم",
        allowedMethods: "الأوامر المسموح بها",
        languages: "اللغات",
        roles: "الأدوار",
        guest: "زائر",
        icon: "أيقونة",
    },
    en: {},
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
Loading.value.Database = false;

const { isMobile } = useDevice(),
    { data: databases, execute } = await useFetch<apiResponse<Database[]>>(
        `${useRuntimeConfig().public.apiBase}inicontent/database`, {
        immediate: false
    }
    ),
    expandedNames = ref(
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

                if (!data.result) return window.$message.error(data.message);

                if (databases.value) {
                    if (databases.value.result)
                        databases.value.result.push(data.result);
                    else databases.value.result = [data.result];
                    expandedNames.value = data.result.slug;
                }
                showDatabaseModal.value = false;
                window.$message.success(data.message);
            } else window.$message.error(t('inputsAreInvalid'));
        });
    };

if (database.value.slug !== "inicontent")
    await navigateTo(`/${route.params.database ? (`${database.value.slug}/`) : ''}admin/tables`)
else
    await execute()

useHead({
    title: `${database.value.slug} | ${t('dashboard')}`,
    link: [{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" }],
});

</script>