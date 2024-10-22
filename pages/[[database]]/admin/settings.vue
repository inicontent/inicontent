<template>
    <n-grid cols="12" :x-gap="12" item-responsive responsive="screen">
        <n-grid-item span="12 l:11">
            <n-card :title="`${database.slug} ${t('settings')}`" hoverable>
                <template #header-extra>
                    <n-flex>
                        <n-tooltip :delay="500">
                            <template #trigger>
                                <n-popconfirm :show-icon="false" @positive-click="deleteDatabase">
                                    <template #trigger>
                                        <n-button type="error" tertiary round :loading="Loading.deleteDatabase">
                                            <template #icon>
                                                <n-icon>
                                                    <IconTrash />
                                                </n-icon>
                                            </template>
                                        </n-button>
                                    </template>
                                    {{ t("theFollowingActionIsIrreversible") }}
                                </n-popconfirm>
                            </template>
                            {{ t("deleteDatabase") }}
                        </n-tooltip>
                        <n-button @click="updateDatabase" round :loading="Loading.updateDatabase">
                            <template #icon>
                                <n-icon>
                                    <IconDeviceFloppy />
                                </n-icon>
                            </template>
                            {{ t("save") }}
                        </n-button>
                    </n-flex>
                </template>
                <n-flex vertical>
                    <n-card id="general" :title="t('general')" hoverable>
                        <n-form ref="databaseRef" :model="databaseCopy">
                            <RenderFieldS v-model="databaseCopy" :schema="databaseSchema" />
                        </n-form>
                    </n-card>
                    <n-card id="translation" :title="t('translation')" hoverable>
                        <n-empty :description="t('soon')" />
                    </n-card>
                    <n-card id="email" :title="t('email')" hoverable>
                        <n-empty :description="t('soon')" />
                    </n-card>
                </n-flex>
            </n-card>
        </n-grid-item>
        <n-grid-item v-if="!isMobile" span="0 l:1">
            <n-anchor affix listen-to="#container" :top="88" :bound="90" style="z-index: 1;">
                <n-anchor-link :title="t('general')" href="#general" />
                <n-anchor-link :title="t('translation')" href="#translation" />
                <n-anchor-link :title="t('email')" href="#email" />
            </n-anchor>
        </n-grid-item>
    </n-grid>
</template>

<script lang="ts" setup>
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-vue";
import {
    type FormInst,
    NAnchor,
    NAnchorLink,
    NButton,
    NCard,
    NEmpty,
    NForm,
    NGridItem,
    NGrid,
    NIcon,
    NPopconfirm,
    NFlex,
    NTooltip,
} from "naive-ui";

definePageMeta({
    middleware: "dashboard",
    layout: "table",
});

onMounted(() => {
    document.onkeydown = (e) => {
        if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
        e.preventDefault();
        updateDatabase();
    };
});

useLanguage({
    ar: {
        save: "حِفظ",
        slug: "الإسم",
        allowedMethods: "الأوامر المسموح بها",
        languages: "اللغات",
        roles: "الأدوار",
        guest: "زائر",
        icon: "أيقونة",
        general: "إعدادات عامة",
        translation: "إعدادات الترجمة",
        email: "إعدادات البريد",
        theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
    },
    en: {},
});
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute(),
    { isMobile } = useDevice(),
    router = useRouter(),
    database = useState<Database>("database"),
    databaseRef = ref<FormInst | null>(null),
    databaseCopy = ref(toRaw(database.value)),
    updateDatabase = async () => {
        databaseRef.value?.validate(async (errors) => {
            if (!errors) {
                const bodyContent = JSON.parse(JSON.stringify(databaseCopy.value));
                Loading.value.updateDatabase = true;
                const data = await $fetch<apiResponse>(
                    `${useRuntimeConfig().public.apiBase}inicontent/database/${database.value.slug
                    }`,
                    {
                        method: "PUT",
                        body: bodyContent,
                    },
                );
                if (data.result) {
                    database.value = { ...database.value, ...data.result };
                    if (route.params.database !== database.value.slug)
                        router.replace({
                            params: { database: database.value.slug },
                        });
                    setThemeConfig()
                    Loading.value.updateDatabase = false;
                    window.$message.success(data.message);
                } else window.$message.error(data.message);
                Loading.value.updateDatabase = false;
            } else window.$message.error(t('inputsAreInvalid'));
        });
    },
    deleteDatabase = async () => {
        Loading.value.deleteDatabase = true;
        const data = await $fetch<apiResponse>(
            `${useRuntimeConfig().public.apiBase}inicontent/database/${database.value.slug
            }`,
            {
                method: "DELETE",
            },
        );
        if (data.result) {
            Loading.value.deleteDatabase = false;
            window.$message.success(data.message);
            setTimeout(async () => {
                clearNuxtState("database");
                await navigateTo("/admin");
            }, 800);
        } else window.$message.error(data.message);
        Loading.value.deleteDatabase = false;
    };

useHead({
    title: `${database.value.slug} | ${t("settings")}`,
    link: [{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" }],
});
</script>
