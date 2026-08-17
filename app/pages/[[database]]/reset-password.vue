<template>
	<PasswordReset />
</template>

<script lang="ts" setup>
definePageMeta({
	layout: "default",
	middleware: ["database", "global"],
});
</script>