<template>
    <div v-html="value"></div>
</template>

<script lang="ts" setup>
defineProps({
    value: {
        type: String,
        required: true
    }
})
</script>