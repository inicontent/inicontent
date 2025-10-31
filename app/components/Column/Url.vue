<template>
    <a :href="value" target="_blank">
        {{ value }}
    </a>
</template>

<script lang="ts" setup>
defineProps<{ value?: string }>()
</script>