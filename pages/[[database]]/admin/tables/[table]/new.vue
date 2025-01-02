<template>
	<FormCard v-model="data"></FormCard>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: ["database", "user", "dashboard", "table"],
	layout: "table",
});

const data = ref<Item>({});
</script>