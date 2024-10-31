<template>
    {{ value }}
</template>

<script lang="ts" setup>
defineProps<{ value?: string | number }>()
</script>