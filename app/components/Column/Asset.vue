<template>
	<NImageGroup>
		<NFlex :wrap="false">
			<template v-for="file in ([] as Asset[]).concat(value)">
				<NTooltip v-if="imageExtensions.includes(file.extension) || file.extension === 'pdf'"
					:disabled="!file.name">
					<template #trigger>
						<div style="position: relative;">
							<AssetThumb :asset="file" container-selector="#DataTable"
								style="width: 40px;height: 40px;overflow: hidden;" />
						</div>
					</template>
					{{ file.name }}{{ file.extension ? `.${file.extension}` : '' }}
				</NTooltip>
				<NButton v-else tag="a" :href="file.publicURL" target="_blank" secondary type="primary" round>
					<template #icon>
						<NIcon>
							<LazyAssetIcon :type="file.type" />
						</NIcon>
					</template>
					{{ file.name }}{{ file.extension ? `.${file.extension}` : '' }}
				</NButton>
			</template>
		</NFlex>
	</NImageGroup>
</template>

<script lang="ts" setup>
import type { ImageRenderToolbarProps } from "naive-ui"
import type { VNodeChild } from "vue"
import { Icon, NButton, NIcon, NTooltip } from "#components"
import { imageExtensions } from "~/composables";

const { value } = defineProps<{ value: Asset | Asset[] }>()


</script>