<template>
    <IconFileText v-if="!type" />
    <IconFolder v-else-if="type === 'dir'" />
    <IconVideo v-else-if="type.startsWith('video/')" />
    <IconFileMusic v-else-if="type.startsWith('audio/')" />
    <IconFileTypography v-else-if="type.startsWith('font/')" />
    <IconFileTypePdf v-else-if="type === 'application/pdf'" />
    <IconFileTypeZip v-else-if="type === 'application/zip'" />
    <IconFileZip v-else-if="type === 'application/x-7z-compressed'" />
    <IconFileTypeDoc v-else-if="type === 'application/msword'" />
    <IconFileTypeDocx v-else-if="type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" />
    <IconFileSpreadsheet
        v-else-if="['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)" />
    <IconFileTypeHtml v-else-if="type === 'text/html'" />
    <IconFileTypeCss v-else-if="type === 'text/css'" />
    <IconFileTypeJs v-else-if="type === 'text/js'" />
    <IconFileTypeTxt v-else-if="type === 'text/plain'" />
    <IconFileText v-else />
</template>

<script lang="ts" setup>
import {
	IconFileMusic,
	IconFileSpreadsheet,
	IconFileTypeDoc,
	IconFileTypeDocx,
	IconFileTypography,
	IconFileTypeJs,
	IconFileZip,
	IconFileTypeTxt,
	IconFileText,
	IconFileTypeCss,
	IconFileTypeHtml,
	IconFileTypePdf,
	IconFileTypeZip,
	IconFolder,
	IconVideo,
} from "@tabler/icons-vue";

defineProps<{ type?: string }>();
</script>
