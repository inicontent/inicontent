<template>
	<NFlex :wrap="false">
		<NTag v-for="singleValue in ([] as string[]).concat(value)" round :bordered="false"
			:color="isArrayOfArrays(field.options) ? getColorObj(singleValue, field.options as [string | number, string][]) : undefined">
			{{ singleValue }}</NTag>
	</NFlex>
</template>

<script lang="ts" setup>
import { isArrayOfArrays } from "inibase/utils"

defineProps<{ field: Field; value: string | string[] }>()
</script>