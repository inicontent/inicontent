<template>
    <div class="truncate">
        {{ value }}
    </div>
</template>

<script lang="ts" setup>
defineProps<{ value?: string | number }>()
</script>