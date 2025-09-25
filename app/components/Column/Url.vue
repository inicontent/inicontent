<template>
    <NA :href="value" target="_blank">
        {{ value }}
    </NA>
</template>

<script lang="ts" setup>
defineProps<{ value?: string }>()
</script>