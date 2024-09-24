<template>
    <NPopover trigger="hover">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop>
                <NIcon>
                    <IconLink />
                </NIcon>
            </NButton>
        </template>
        <NInputGroup>
            <NInput :input-props="{ type: 'url' }" v-model="assetURL" :placeholder="t('assetLink')" clearable
                @keydown.enter="() => (callback(assetURL),
                    assetURL = undefined)">
                <template #suffix>
                    <NIcon>
                        <IconLink />
                    </NIcon>
                </template>
            </NInput>
            <NTooltip :delay="500">
                <template #trigger>
                    <NButton disabled>
                        <NIcon>
                            <IconUpload />
                        </NIcon>
                    </NButton>
                </template>
                {{ t('importAsset') }}
            </NTooltip>
            <NTooltip :delay="500">
                <template #trigger>
                    <NButton :disabled="!assetURL" @click="() => (callback(assetURL),
                        assetURL = undefined)">
                        <NIcon>
                            <IconArrowRight />
                        </NIcon>
                    </NButton>
                </template>
                {{ t('insertAsset') }}
            </NTooltip>
        </NInputGroup>
    </NPopover>

    <NTooltip :delay="500">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="() => modelValue = true">
                <NIcon>
                    <IconBooks />
                </NIcon>
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
    IconUpload,
} from "@tabler/icons-vue";
import {
    NButton,
    NIcon,
    NInput,
    NInputGroup,
    NPopover,
    NTooltip
} from "naive-ui";

defineProps({
    callback: {
        type: Function,
        required: true
    }
})

const modelValue = defineModel({
    type: Boolean
})

const assetURL = ref()
</script>
