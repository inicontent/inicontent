<template>
    <div v-if="typeof value === 'string'"
        v-html="value?.replaceAll('<img ', '<img style=\'width:100%\'').replaceAll('\n', '<br />') || ''"></div>
    <div v-else>{{ value }}</div>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string | number }>()
</script>