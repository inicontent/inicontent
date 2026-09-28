<template>
	<div v-if="modelValue" class="contents">
		<LazyBlock v-for="(_, index) in modelValue" v-model="modelValue[index]" />
	</div>
	<div v-else class="not-found-wrapper">
		<h1 class="not-found-title">404 | {{ t('pageNotFound') }}</h1>
	</div>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Content[]>();
</script>

<style>
.not-found-wrapper {
	display: grid;
	height: 100vh;
	place-content: center;
	background-color: #ffffff;
	padding-left: 1rem;
	padding-right: 1rem;
}

.dark .not-found-wrapper {
	background-color: #404040;
}

.not-found-title {
	text-transform: uppercase;
	color: #6B7280;
}

.ltr .not-found-title {
	letter-spacing: 0.1em;
}

.dark .not-found-title {
	color: #D1D5DB;
}
</style>