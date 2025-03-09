<template>
    <NFlex :wrap="false" align="center">
        <NIcon v-if="value" style="cursor: pointer;" size="medium" @click="copyID">
            <IconCopy />
        </NIcon>
        <NPerformantEllipsis>
            {{ value }}
        </NPerformantEllipsis>
    </NFlex>
</template>

<script lang="ts" setup>
import { IconCopy } from "@tabler/icons-vue";
import { NFlex, NIcon, NPerformantEllipsis } from "naive-ui";

const { value } = defineProps<{ value?: string | number }>();

async function copyID() {
	if (!value) return;
	await copyToClipboard(value);
	window.$message.success(t("copiedSuccessfully"));
}
</script>