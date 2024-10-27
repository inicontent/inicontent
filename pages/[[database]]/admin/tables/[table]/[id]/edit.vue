<template>
    <NCard style="height: fit-content">
        <template #header>
            <NEllipsis>{{ t(table.slug) }}: {{ itemLabel }}</NEllipsis>
        </template>
        <template v-if="schema && schema.length > 4" #header-extra>
            <NButtonGroup>
                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton type="info" secondary round tag="a"
                            :href="`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/${table.slug}/${$route.params.id}`"
                            @click.prevent.stop="() => navigateTo(`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/${table.slug}/${$route.params.id}`)">
                            <template #icon>
                                <NIcon>
                                    <IconEye />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('view') }}
                </NTooltip>
                <NPopconfirm @positive-click="DELETE">
                    <template #trigger>
                        <NTooltip :delay="500">
                            <template #trigger>
                                <NButton secondary round type="error" :loading="Loading.DELETE">
                                    <template #icon>
                                        <NIcon>
                                            <IconTrash />
                                        </NIcon>
                                    </template>
                                </NButton>
                            </template>
                            {{ t('delete') }}
                        </NTooltip>
                    </template>
                    {{ t("theFollowingActionIsIrreversible") }}
                </NPopconfirm>

                <NTooltip :delay="500">
                    <template #trigger>
                        <NButton secondary round type="primary" @click="UPDATE" :loading="Loading.UPDATE">
                            <template #icon>
                                <NIcon>
                                    <IconDeviceFloppy />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ t('update') }}
                </NTooltip>
            </NButtonGroup>
        </template>
        <template #actions>
            <NButtonGroup>
                <NButton type="info" secondary round tag="a"
                    :href="`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/${table.slug}/${$route.params.id}`"
                    @click.prevent.stop="() => navigateTo(`${$route.params.database ? `/${database.slug}` : ''}/admin/tables/${table.slug}/${$route.params.id}`)">
                    <template #icon>
                        <NIcon>
                            <IconEye />
                        </NIcon>
                    </template>
                    {{ t('view') }}
                </NButton>
                <NPopconfirm @positive-click="DELETE">
                    <template #trigger>
                        <NButton secondary round type="error" :loading="Loading.DELETE">
                            <template #icon>
                                <NIcon>
                                    <IconTrash />
                                </NIcon>
                            </template>
                            {{ t('delete') }}
                        </NButton>
                    </template>
                    {{ t("theFollowingActionIsIrreversible") }}
                </NPopconfirm>

                <NButton secondary round type="primary" @click="UPDATE" :loading="Loading.UPDATE">
                    <template #icon>
                        <NIcon>
                            <IconDeviceFloppy />
                        </NIcon>
                    </template>
                    {{ t('update') }}
                </NButton>
            </NButtonGroup>
        </template>
        <NForm v-if="itemObject" :model="itemObject" ref="formRef">
            <RenderFieldS v-model="itemObject" :schema />
        </NForm>
    </NCard>
</template>

<script lang="ts" setup>
import {
    NButton,
    NCard,
    NEllipsis,
    NForm,
    NIcon,
    NTooltip,
    NPopconfirm,
    type FormInst,
    NButtonGroup,
} from "naive-ui";
import { IconDeviceFloppy, IconEye, IconTrash } from "@tabler/icons-vue";

clearNuxtState("itemLabel");

definePageMeta({
    middleware: ["database", "user", "dashboard", "table"],
    layout: "table",
});

onMounted(() => {
    document.onkeydown = (e) => {
        if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
        e.preventDefault();
        UPDATE();
    };
});

useLanguage({
    ar: {
        view: "مُعاينة",
        update: "حِفظ",
        publish: "نشر",
        delete: "حذف",
        theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
    },
    en: {},
});
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute()
const database = useState<Database>("database")
const table = useState<Table>("table")
const schema = table.value.schema?.filter(
    (field) =>
        !["id", "createdAt", "createdBy", "updatedAt", "updatedBy"].includes(field.key),
)
const { data: itemObject } = await useFetch<Item>(
    `${appConfig.apiBase}${database.value.slug}/${table.value.slug
    }/${route.params.id}`,
    {

        transform: (input) => input.result
    }
)

if (!itemObject.value?.id)
    throw createError({
        statusCode: 404,
        statusMessage: "item",
        fatal: true
    });

const formRef = ref<FormInst>()

async function UPDATE() {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            const bodyContent = toRaw(itemObject.value);
            Loading.value.UPDATE = true;
            const data = await $fetch<apiResponse<Item>>(
                `${appConfig.apiBase}${database.value.slug}/${table.value.slug
                }/${itemObject.value?.id}`,
                {
                    method: "PUT",
                    body: bodyContent,
                },
            );
            if (data.result?.id) {
                itemObject.value = data.result;
                window.$message.success(data.message);
            } else window.$message.error(data.message);
            Loading.value.UPDATE = false;
        } else window.$message.error(t("inputsAreInvalid"));
    });
};

async function DELETE() {
    Loading.value.DELETE = true;
    const data = await $fetch<apiResponse<Item>>(
        `${appConfig.apiBase}${database.value.slug}/${table.value.slug
        }/${itemObject.value?.id}`,
        {
            method: "DELETE",
        },
    );
    if (data.result) {
        window.$message.success(data.message);
        Loading.value.DELETE = false;
        return navigateTo(
            `/${database.value.slug}/admin/tables/${table.value.slug}`,
        );
    }
    window.$message.error(data.message);
    Loading.value.DELETE = false;
};

const itemLabel = useState("itemLabel", () =>
    renderLabel(table.value.label, table.value.schema, itemObject.value),
)

useHead({
    title: `${t(database.value.slug)} | ${t(table.value.slug)} > ${itemLabel.value}`,
    link: [{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" }],
});
</script>
