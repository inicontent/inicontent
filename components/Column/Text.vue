<template>
    <NPerformantEllipsis>
        {{ value }}
    </NPerformantEllipsis>
</template>

<script lang="ts" setup>
defineProps<{ value?: string | number }>();
</script>