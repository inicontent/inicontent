<template>
    <UBadge round :style="{ backgroundColor: value }">
        <span style="mix-blend-mode: difference;">{{ value }}</span>
    </UBadge>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>()
</script>