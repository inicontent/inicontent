<template>
    <NTooltip :delay="500">
        <template #trigger>
            <NButton circle secondary size="tiny" @click.prevent.stop="showAssetsModal = true">
                <template #icon>
                    <NIcon>
                        <IconBooks />
                    </NIcon>
                </template>
            </NButton>
        </template>
        {{ t('gallery') }}
    </NTooltip>
    <NPopover trigger="manual" v-model:show="showPopover">
        <template #trigger>
            <NTooltip :delay="500" placement="bottom">
                <template #trigger>
                    <NButton circle secondary size="tiny" @click.prevent.stop="showPopover = !showPopover">
                        <NIcon>
                            <IconLink />
                        </NIcon>
                    </NButton>
                </template>
                {{ t('import') }}
            </NTooltip>
        </template>
        <NInputGroup>
            <NInput :input-props="{ type: 'url' }" v-model:value="assetURLs" :placeholder="t('assetLink')" clearable
                @keydown.enter.prevent="importAsset">
                <template #suffix>
                    <NIcon>
                        <IconLink />
                    </NIcon>
                </template>
            </NInput>
            <NTooltip :delay="500">
                <template #trigger>
                    <NButton :loading="Loading.import" :disabled="!assetURLs" tag="a" @click.prevent.stop="importAsset">
                        <template #icon>
                            <NIcon>
                                <IconArrowRight />
                            </NIcon>
                        </template>
                    </NButton>
                </template>
                {{ t('import') }}
            </NTooltip>
        </NInputGroup>
    </NPopover>
</template>

<script lang="ts" setup>
import { IconArrowRight, IconBooks, IconLink } from "@tabler/icons-vue";
import {
    NButton,
    NIcon,
    NInput,
    NInputGroup,
    NPopover,
    NTooltip,
} from "naive-ui";

defineTranslation({
    ar: {
        import: "إستيراد",
        gallery: "قائمة الملفات",
    },
});

const { field, callback } = defineProps<{
    field: Field;
    callback: CallableFunction;
}>();

const showAssetsModal = defineModel<boolean>("showAssetsModal");

const showPopover = ref(false);
const appConfig = useAppConfig();
const assetURLs = ref();
const database = useState<Database>("database");
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

async function importAsset() {
    Loading.value.import = true;
    const data = await $fetch<apiResponse<Asset | Asset[]>>(
        `${appConfig.apiBase}${database.value.slug ?? "inicontent"}/assets/import${field.params ? `?${field.params}` : ""}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
            body: assetURLs.value,
        },
    );
    if (data.result) {
        assetURLs.value = undefined;
        callback(data.result);
        showPopover.value = false;
    } else window.$message.error(data.message);
    Loading.value.import = false;
}
</script>
