<template>
    <NTag round :bordered="false">
        <template #icon v-if="value">
            <NIcon style="cursor: pointer;" size="medium" @click="copyID">
                <IconCopy />
            </NIcon>
        </template>
        {{ value }}
    </NTag>
</template>

<script lang="ts" setup>
import { IconCopy } from "@tabler/icons-vue";
import { NTag, NIcon } from "naive-ui";

const { value } = defineProps<{ value?: string | number }>();

async function copyID() {
    if (!value) return;
    await copyToClipboard(value);
    window.$message.success(t("copiedSuccessfully"));
}
</script>