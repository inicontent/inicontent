<template>
    {{ value }}
</template>

<script lang="ts" setup>
defineProps({
    value: {
        type: String,
        required: true
    }
})</script>