<template>
    <a :href="`mailto:${value}`" target="_blank">
        {{ value }}
    </a>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>()
</script>