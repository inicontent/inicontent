<template>
	<NIcon v-html="iconHtml" v-bind="$attrs"></NIcon>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";

const { value } = defineProps<{ value: string }>();
const { data: iconHtml } = await useLazyAsyncData(
	`icon-${value}`,
	() =>
		$fetch<Blob>(
			`https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/${value}.svg`,
			{
				responseType: "blob",
			},
		),
	{
		transform: async (res) => res.text(),
	},
);
</script>