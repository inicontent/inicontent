<template>
	<NImageGroup>
		<NFlex :wrap="false" class="list">
			<template v-for="file in ([] as Asset[]).concat(value)">
				<NTooltip :disabled="!file.name">
					<template #trigger>
						<LazyAssetThumb :asset="file" :container-selector="$route.params.id ? undefined : '#DataTable'"
							:size="40" />
					</template>
					{{ file.name }}{{ file.extension ? `.${file.extension}` : '' }}
				</NTooltip>
			</template>
		</NFlex>
	</NImageGroup>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value: Asset | Asset[] }>();
</script>