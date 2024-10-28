<template>
    <NPopover trigger="manual" :show="showPopover">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="showPopover = !showPopover">
                <NIcon>
                    <IconLink />
                </NIcon>
            </NButton>
        </template>
        <NInputGroup>
            <NInput :input-props="{ type: 'url' }" v-model:value="assetURLs" :placeholder="t('assetLink')" clearable
                @keydown.enter="importAsset">
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
                {{ t('importAsset') }}
            </NTooltip>
        </NInputGroup>
    </NPopover>

    <NTooltip :delay="500">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="$emit('update:showAssetsModal', true)">
                <template #icon>
                    <NIcon>
                        <IconBooks />
                    </NIcon>
                </template>
            </NButton>
        </template>
        {{ t('gallery') }}
    </NTooltip>
</template>

<script lang="ts" setup>
import {
    IconArrowRight,
    IconBooks,
    IconLink,
} from "@tabler/icons-vue";
import {
    NButton,
    NIcon,
    NInput,
    NInputGroup,
    NPopover,
    NTooltip,
} from "naive-ui";

const { callback, field } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    },
    callback: {
        type: Function,
        required: true
    },
    showAssetsModal: {
        type: Boolean
    }
})
defineEmits(["update:showAssetsModal"])

const showPopover = ref(false)
const appConfig = useAppConfig()
const assetURLs = ref()
const database = useState<Database>("database");
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

async function importAsset() {
    Loading.value.import = true
    const data = await $fetch<apiResponse<Asset | Asset[]>>(`${appConfig.apiBase}${database.value.slug ?? 'inicontent'}/asset${field.params ? `?${field.params}` : ''}`, {
        method: "POST",
        body: assetURLs
    })
    if (data.result) {
        callback(data.result)
    } else window.$message.error(data.message);
    Loading.value.import = false
};
</script>
