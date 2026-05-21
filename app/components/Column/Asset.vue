<template>
	<NFlex :wrap="false" class="list">
		<template v-for="file in assets" :key="file.id">
			<LazyAssetThumb :asset="file" :preview-assets="assets"
				:container-selector="$route.params.id ? undefined : '#DataTable'" :size="40" />
		</template>
	</NFlex>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value: Asset | Asset[] }>();
const assets = computed(() => ([] as Asset[]).concat(value));
</script>