<template>
    <NIcon>
        <Icon :name="`tabler:${value}`" />
    </NIcon>
</template>

<script setup lang="ts">
const { value } = defineProps<{ value: `tabler:${string}` }>()
</script>