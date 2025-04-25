<template>
	<NFlex :wrap="false">
		<NTag v-for="singleValue in ([] as string[]).concat(value)" round :bordered="false"
			:color="getColorObj(singleValue, $props.field.options)" :style="getDynamicStyle">{{
				singleValue }}</NTag>
	</NFlex>
</template>

<script lang="ts" setup>
import { NFlex, NTag } from "naive-ui";

defineProps<{ field: Field; value: string | string[] }>();
</script>