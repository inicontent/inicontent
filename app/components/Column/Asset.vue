<template>
	<NuxtImgGroup>
		<div class="flex" :wrap="false">
			<template v-for="file in ([] as Asset[]).concat(value)">
				<UTooltip v-if="file.type.startsWith('image/') || file.type === 'application/pdf'"
					:disabled="!file.name">
					<template #trigger>
						<div style="position: relative;">
							<Icon v-if="file.type === 'application/pdf'" name="tabler:file-filled"
								style="position: absolute;color: rgb(var(--primaryColor));top: 2px;" />
							<NuxtImg lazy
								:src="file.type === 'application/pdf' ? `${file.publicURL}?fit=100` : file.publicURL"
								:preview-src="file.type === 'application/pdf' ? `${file.publicURL}?raw` : file.publicURL"
								:width="32" :height="32" object-fit="cover" style="height: 100%;"
								:renderToolbar="(props) => renderToolbar(props, file)" />
						</div>
					</template>
					{{ file.name }}
				</UTooltip>
				<UButton v-else tag="a" :href="file.publicURL" target="_blank" secondary type="primary" round>
					<template #icon>
						<div class="inline-block">
							<LazyAssetIcon :type="file.type" />
						</div>
					</template>
					{{ file.name }}
				</UButton>
			</template>
		</div>
	</NImageGroup>
</template>

<script lang="ts" setup>
import type { VNodeChild } from "vue"
import { Icon, NButton, NIcon, NTooltip } from "#components"

const { value } = defineProps<{ value: Asset | Asset[] }>()

const renderToolbar: (
	props: ImageRenderToolbarProps,
	file?: Asset,
) => VNodeChild = (
	{
		nodes: {
			rotateCounterclockwise,
			rotateClockwise,
			resizeToOriginalSize,
			zoomOut,
			zoomIn,
			download,
			close,
		},
	},
	file?: Asset,
) => {
	if (download.props && file?.publicURL)
		download.props.onClick = (event: MouseEvent) => {
			event?.preventDefault()
			window.open(file.publicURL as string, "_blank")
			close?.props?.onClick?.()
		}
	return [
		file?.name
			? h(
					NTooltip,
					{},
					{
						default: () => file.name,
						trigger: () =>
							h(
								"i",
								{ class: "n-base-icon" },
								h(Icon, { name: "tabler:info-circle-filled" }),
							),
					},
				)
			: null,
		rotateCounterclockwise,
		rotateClockwise,
		zoomIn,
		zoomOut,
		resizeToOriginalSize,
		download,
		close,
	]
}
</script>