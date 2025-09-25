<template>
    <NA :href="`mailto:${value}`" target="_blank">
        {{ value }}
    </NA>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>()
</script>