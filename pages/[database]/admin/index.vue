<template>
    <div></div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "dashboard",
});
const database = useState<Database>("database");
await navigateTo("admin/tables");
</script>
