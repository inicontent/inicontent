<template>
	<NImageGroup>
		<NFlex :wrap="false" class="list">
			<template v-for="file in ([] as Asset[]).concat(value)">
				<LazyAssetThumb :asset="file" :container-selector="$route.params.id ? undefined : '#DataTable'"
					:size="40" />
			</template>
		</NFlex>
	</NImageGroup>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value: Asset | Asset[] }>();
const Language = useCookie<LanguagesType>("language", { sameSite: true })

const formatDate = (date: string | Date | number) => {
	const d = new Date(date);
	return d.toLocaleString(Language.value, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};
</script>