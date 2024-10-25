<template>
    <Auth />
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["database", "user", "dashboard"],
});
</script>
