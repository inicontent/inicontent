<template>
    <div v-html="value?.replaceAll('<img ', '<img style=\'width:100%\'') || ''"></div>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>()
</script>