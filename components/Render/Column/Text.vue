<template>
    {{ value }}
</template>

<script lang="ts" setup>
defineProps({
    value: {
        type: [String, Number],
        required: true
    }
})</script>