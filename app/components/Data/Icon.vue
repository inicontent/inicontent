<template>
    <div class="inline-block">
        <Icon :name="`tabler:${value}`" />
    </div>
</template>

<script setup lang="ts">
const { value } = defineProps<{ value: `tabler:${string}` }>()
</script>