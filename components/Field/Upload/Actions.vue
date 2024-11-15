<template>
    <NPopover trigger="manual" v-model:show="showPopover">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="showPopover = !showPopover">
                <NIcon>
                    <IconLink />
                </NIcon>
            </NButton>
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
                {{ t('importAsset') }}
            </NTooltip>
        </NInputGroup>
    </NPopover>

    <NTooltip :delay="500">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="showAssetsModal = true">
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


const { field, callback } = defineProps<{ field: Field, callback: CallableFunction }>()

const showAssetsModal = defineModel<boolean>('showAssetsModal')

const showPopover = ref(false)
const appConfig = useAppConfig()
const assetURLs = ref()
const database = useState<Database>("database");
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

async function importAsset() {
    Loading.value.import = true
    const data = await $fetch<apiResponse<Asset | Asset[]>>(`${appConfig.apiBase}${database.value.slug ?? 'inicontent'}/assets/import${field.params ? `?${field.params}` : ''}`, {
        method: "POST",
        headers: {
            'Content-Type': 'text/plain; charset=utf-8'
        },
        body: assetURLs.value
    })
    if (data.result) {
        assetURLs.value = undefined
        callback(data.result)
    } else window.$message.error(data.message);
    Loading.value.import = false
};
</script>
