<template>
    <NA :href="`mailto:${value}`" target="_blank">
        {{ value }}
    </NA>
</template>

<script lang="ts" setup>
import { NA } from 'naive-ui';

const { value } = defineProps<{ value?: string }>()
</script>