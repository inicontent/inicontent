<template>
    <NTag round :bordered="false">
        <NFlex>
            <NIcon v-if="value" style="cursor: pointer;" @click="copyID">
                <IconCopy />
            </NIcon>
            <NPerformantEllipsis tooltip style="max-width: 50px;">
                {{ value }}
            </NPerformantEllipsis>
        </NFlex>
    </NTag>
</template>

<script lang="ts" setup>
import { IconCopy } from "@tabler/icons-vue";
import { NTag, NIcon, NFlex, NPerformantEllipsis } from "naive-ui";

const { value } = defineProps<{ value?: string }>();

async function copyID() {
	if (!value) return;
	await copyToClipboard(value);
	window.$message.success(t("copiedSuccessfully"));
}
</script>