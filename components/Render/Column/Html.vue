<template>
    <div v-html="value"></div>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>()
</script>