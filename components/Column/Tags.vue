<template>
    <NFlex :wrap="false">
        <NTag v-for="singleValue in ([] as string[]).concat(value)" round :bordered="false"
            :color="getColorObj(singleValue)">{{ singleValue }}</NTag>
    </NFlex>
</template>

<script lang="ts" setup>
import { isArrayOfArrays } from "inibase/utils";
import { NFlex, NTag } from "naive-ui";

const { field } = defineProps<{ field: Field; value: string | string[] }>();

function getColorObj(value: string) {
	if (field.options && isArrayOfArrays(field.options)) {
		const option = (
			field.options as undefined | [string | number, string][]
		)?.find(([label]) => label === value);
		if (option) return { color: option[1] };
	}
	return undefined;
}
</script>