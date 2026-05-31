<template>
	<NFlex :wrap="false" class="tagsCell">
		<NTag v-for="singleValue in ([] as string[]).concat(value)" round :bordered="false"
			:color="isArrayOfArrays(field.options) ? getColorObj(singleValue, field.options as [string | number, string][]) : undefined">
			{{ singleValue }}</NTag>
	</NFlex>
</template>

<script lang="ts" setup>
import { isArrayOfArrays } from "inibase/utils"

defineProps<{ field: Field; value: string | number | (string | number)[] }>()
</script>

<style scoped>
.tagsCell {
	max-width: 100%;
	overflow: hidden;
	min-width: 0;
}

.tagsCell :deep(.n-tag) {
	max-width: 100%;
}

.tagsCell :deep(.n-tag__content) {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>