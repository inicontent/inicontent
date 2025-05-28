<template>
    <NFlex :wrap="false" align="center" :size="5">
        <NIcon v-if="value" style="cursor: pointer;" size="medium" @click="copyID">
            <Icon name="tabler:copy" />
        </NIcon>
        <NPerformantEllipsis>
            {{ value }}
        </NPerformantEllipsis>
    </NFlex>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string | number }>()

async function copyID() {
	if (!value) return
	await copyToClipboard(value)
	window.$message.success(t("copiedSuccessfully"))
}
</script>