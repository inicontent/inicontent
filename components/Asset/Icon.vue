<template>
    <DataIcon :value="iconName" />
</template>

<script lang="ts" setup>
const { type } = defineProps<{ type?: string }>()
function getIconName(type?: string) {
    if (!type) return 'text'
    if (type === 'dir') return 'folder';
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'file-music'
    if (type.startsWith('font/')) return 'file-typography'
    if (type === 'application/pdf') return 'file-type-pdf';
    if (type === 'application/zip') return 'file-type-zip';
    if (type === 'application/x-7z-compressed') return 'file-zip';
    if (type === 'application/msword') return 'file-type-doc';
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'file-type-docx';
    if (['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) return 'file-type-spreadsheet';
    if (type === 'text/html') return 'file-type-html';
    if (type === 'text/css') return 'file-type-css';
    if (type === 'text/js') return 'file-type-js';
    if (type === 'text/plain') return 'file-type-txt';
    return 'file-text'
}
const iconName = getIconName(type)
</script>
