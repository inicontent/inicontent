<template>
    <NTag round :bordered="false">
        <NFlex>
            <NIcon v-if="value" style="cursor: pointer;" @click="copyID">
                <IconCopy />
            </NIcon>
            <NEllipsis tooltip style="max-width: 50px;">
                {{ value }}
            </NEllipsis>
        </NFlex>
    </NTag>
</template>

<script lang="ts" setup>
import { IconCopy } from '@tabler/icons-vue';
import { NTag, NIcon, NFlex, NEllipsis } from 'naive-ui';

const { value } = defineProps<{ value?: string }>()

async function copyID() {
    if (!value) return
    await copyToClipboard(value);
    window.$message.success(t("textCopied"));
}
</script>