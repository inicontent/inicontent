<template>
	<NModal
		:show="show"
		@update:show="emit('update:show', $event)"
		preset="card"
		:title="title"
		size="large"
	>
		<NFlex v-if="page" vertical align="start" :size="8">
			<NButton size="small" round secondary disabled>
				<template #icon>
					<NIcon><Icon name="tabler:file-text" /></NIcon>
				</template>
				/{{ page.slug }}
			</NButton>
			<NText depth="3">{{ t('pagePreviewUnavailable') }}</NText>
		</NFlex>
	</NModal>
</template>

<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	page?: { slug?: string; seo?: { title?: string }; content?: unknown } | null;
	primaryColor?: string;
}>();

const emit = defineEmits<{ "update:show": [boolean] }>();

const title = computed(() => {
	const pageTitle = props.page?.seo?.title;
	return pageTitle === "" ? t("homePage") : pageTitle || "";
});
</script>