<template>
	<NFlex :wrap="false" class="localeCell">
		<NTag v-for="singleValue in ([] as string[]).concat(value)" :key="singleValue" round
			:bordered="false">
			{{ t(`languages.${singleValue}`) }}
		</NTag>
	</NFlex>
</template>

<script lang="ts" setup>
defineProps<{
	value: string | number | (string | number)[]
}>()
</script>

<style scoped>
.localeCell {
	max-width: 100%;
	overflow: hidden;
	min-width: 0;
}

.localeCell :deep(.n-tag) {
	max-width: 100%;
}

.localeCell :deep(.n-tag__content) {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
