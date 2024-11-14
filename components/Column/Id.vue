<template>
    <NTag round :bordered="false">
        <NFlex>
            <NIcon v-if="value" style="cursor: pointer;" @click="copyID">
                <DataIcon value="copy" />
            </NIcon>
            <NPerformantEllipsis tooltip style="max-width: 50px;">
                {{ value }}
            </NPerformantEllipsis>
        </NFlex>
    </NTag>
</template>

<script lang="ts" setup>
import { NTag, NIcon, NFlex, NPerformantEllipsis } from 'naive-ui';

const { value } = defineProps<{ value?: string }>()

async function copyID() {
    if (!value) return
    await copyToClipboard(value);
    window.$message.success(t("textCopied"));
}
</script>