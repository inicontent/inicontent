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

const props = defineProps({
    value: {
        type: String,
        required: true
    }
})

async function copyID() {
    await copyToClipboard(props.value as string);
    window.$message.success(t("textCopied"));
}
</script>