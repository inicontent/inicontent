<template>
    <NA :href="value" target="_blank">
        {{ value }}
    </NA>
</template>

<script lang="ts" setup>
import { NA } from 'naive-ui';

defineProps<{ value?: string }>()
</script>