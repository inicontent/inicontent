<template>
	<NFlex :wrap="false">
		<NTag v-for="singleValue in ([] as string[]).concat(value)" round :bordered="false"
			:color="getColorObj(singleValue)" :style="getDynamicStyle(singleValue)">{{ singleValue }}</NTag>
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
		if (option) {
			return {
				color: option[1],
				borderColor: option[1],
				textColor: getContrastColor(option[1]),
			};
		}
	}
	return {};
}

function getComputedBgColor(element: HTMLElement) {
	return window.getComputedStyle(element).backgroundColor;
}

function getContrastColor(rgb: string) {
	const result = rgb.match(/\d+/g)?.map(Number);
	if (!result) return "black";
	const [r, g, b] = result;
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 128 ? "black" : "white";
}

function getDynamicStyle(value: string) {
	return (node: HTMLElement) => {
		const bgColor = getComputedBgColor(node);
		const textColor = getContrastColor(bgColor);
		return { color: textColor, backgroundColor: value };
	};
}
</script>