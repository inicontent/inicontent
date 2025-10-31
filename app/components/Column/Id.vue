<template>
    <div class="flex" :wrap="false" align="center" :size="5">
        <span v-if="value" style="cursor: pointer;" size="medium" @click="copyID">
            <Icon name="tabler:copy" />
        </div>
        <div class="truncate">
            {{ value }}
        </div>
    </div>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string | number }>()

async function copyID() {
	if (!value) return
	await copyToClipboard(value)
	window.$message.success(t("copiedSuccessfully"))
}
</script>