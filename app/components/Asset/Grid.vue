<template>
	<template v-if="(modelValue && modelValue.length) || Loading.AssetData">
		<NDrawer v-model:show="showDrawer" :placement="Language === 'ar' ? 'left' : 'right'" class="assetDrawer">
			<NDrawerContent :native-scrollbar="false" v-if="CurrentAsset">
				<NFlex vertical>
					<NImage
						v-if="imageExtensions.includes(CurrentAsset.extension) || (CurrentAsset.extension === 'pdf' && CurrentAsset.publicURL.startsWith('https://cdn.inicontent.com/'))"
						class="asset"
						:src="`${CurrentAsset.publicURL}${CurrentAsset.extension === 'pdf' ? '?raw' : ''}`"
						:preview-src="`${CurrentAsset.publicURL}${CurrentAsset.extension === 'pdf' ? '?raw' : ''}`"
						:img-props="{ class: 'image' }"
						:renderToolbar="(props) => renderToolbar(props, CurrentAsset)" />
					<NIcon v-else class="asset">
						<NA :href="CurrentAsset.publicURL" target="_blank">
							<LazyAssetIcon :type="CurrentAsset.type" class="icon" />
						</NA>
					</NIcon>
					<div v-if="CurrentAsset.name">
						<NText strong>{{ t("name") }}: </NText>
						<NText>{{ CurrentAsset.name }}{{ CurrentAsset.extension ? `.${CurrentAsset.extension}` : '' }}
						</NText>
					</div>
					<div>
						<NText strong>{{ t("size") }}: </NText>
						<NText>{{ humanFileSize(CurrentAsset.size) }}</NText>
					</div>
					<div>
						<NText strong>{{ t("type") }}: </NText>
						<NText>{{ CurrentAsset.type }}</NText>
					</div>
					<div>
						<NText strong>{{ t("link") }}: </NText>
						<NA :href="CurrentAsset.publicURL" target="_blank">{{ decodeURIComponent(CurrentAsset.publicURL)
						}}
						</NA>
					</div>
					<div>
						<NText strong>{{ t("createdAt") }}: </NText>
						<NTime :time="CurrentAsset.createdAt" />
					</div>
				</NFlex>
			</NDrawerContent>
		</NDrawer>
		<NModal :show="currentPreviewAsset !== undefined" @mask-click="onClosePreview" @close="onClosePreview"
			@esc="onClosePreview" :width="800">
			<NSpin :show="previewLoading" size="large" style="width: 80%;">
				<video v-if="currentPreviewAsset && videoExtensions.includes(currentPreviewAsset.extension)" controls
					autoplay style="width:100%;height:auto"
					:style="{ visibility: previewLoading ? 'hidden' : 'visible' }" @loadeddata="previewLoading = false"
					@canplay="previewLoading = false" @error="previewLoading = false">
					<source :src="currentPreviewAsset?.publicURL" :type="currentPreviewAsset?.type" />
				</video>
				<object v-else-if="currentPreviewAsset?.extension === 'pdf' && pdfObjectUrl" :data="pdfObjectUrl"
					type="application/pdf" style="width:100%;height:80vh;"
					:style="{ visibility: previewLoading ? 'hidden' : 'visible' }"
					@load="previewLoading = false"></object>
			</NSpin>
		</NModal>
		<NImageGroup>
			<NGrid :x-gap="12" :y-gap="12" cols="100:2 200:3 300:4 400:5 500:6 700:8 900:11">
				<template v-if="modelValue === undefined || Loading.AssetData" #default>
					<NGridItem v-for="(_) in [...Array(22).keys()]">
						<NSkeleton class="asset"></NSkeleton>
					</NGridItem>
				</template>
				<template v-else #default>
					<NGridItem v-for="(asset) in (modelValue as Asset[]).sort((a, b) => {
						if (a.type === 'dir' && b.type !== 'dir') return -1;
						if (a.type !== 'dir' && b.type === 'dir') return 1;
						return 0;
					})">
						<div @contextmenu="handleContextMenu($event, asset)">
							<NFlex vertical class="assetContainer">
								<NFlex class="assetActions">
									<slot :asset></slot>
								</NFlex>
								<div class="previewOverlay">
									<div v-if="['pdf', ...imageExtensions, ...videoExtensions].includes(asset.extension)"
										class="fileType">
										<LazyAssetIcon :type="asset.type" />
									</div>
									<NImage v-if="imageExtensions.includes(asset.extension)" class="asset"
										:src="asset.publicURL" :intersection-observer-options="{
											root: `#${targetID ?? 'container'}`
										}" lazy />
									<NImage
										v-else-if="(asset.extension === 'pdf' && asset.publicURL.startsWith('https://cdn.inicontent.com/'))"
										class="asset" :src="`${asset.publicURL}?raw`" :intersection-observer-options="{
											root: `#${targetID ?? 'container'}`
										}" lazy preview-disabled @click="handleOnClickAsset($event, asset)" />
									<NImage
										v-else-if="videoExtensions.includes(asset.extension) && videoThumbs[assetKey(asset)]"
										class="asset" :src="videoThumbs[assetKey(asset)]"
										:intersection-observer-options="{
											root: `#${targetID ?? 'container'}`
										}" lazy preview-disabled @click="handleOnClickAsset($event, asset)" />
									<NSpin v-else-if="videoExtensions.includes(asset.extension)"
										:show="videoExtensions.includes(asset.extension) && generatingVideo[assetKey(asset)]"
										size="small">
										<NIcon class="asset" @click="handleOnClickAsset($event, asset)"
											v-intersect="() => videoExtensions.includes(asset.extension) && !videoThumbs[assetKey(asset)] && generateVideoThumb(asset)">
											<LazyAssetIcon :type="asset.type" class="icon" />
										</NIcon>
									</NSpin>
									<NIcon v-else class="asset" @click="handleOnClickAsset($event, asset)">
										<LazyAssetIcon :type="asset.type" class="icon" />
									</NIcon>
								</div>
								<NPerformantEllipsis expand-trigger="click" line-clamp="1">
									{{ asset.name }}{{ asset.extension ? `.${asset.extension}` : '' }}
								</NPerformantEllipsis>
							</NFlex>
						</div>
					</NGridItem>
				</template>
			</NGrid>
		</NImageGroup>
		<NDropdown v-if="table?.allowedMethods?.includes('u') || table?.allowedMethods?.includes('d')"
			placement="bottom-start" trigger="manual" :x="x" :y="y" :show="showDropdown" :options="dropdownOptions"
			@clickoutside="dropdownOnClickOutside" @select="(key: string) => dropdownOnSelect(key)" />
	</template>
	<NEmpty v-else />
</template>

<script lang="ts" setup>
import type { ImageRenderToolbarProps } from "naive-ui"
import type { VNodeChild, Directive } from "vue"
import { Icon, NIcon } from "#components"
import { imageExtensions, videoExtensions } from "~/composables";

const path = defineModel<string>("path", {
	default: "",
})
const { isAssetRoute, table } = defineProps<{
	targetID?: string
	isAssetRoute?: boolean
	table: Table
}>()

const Language = useCookie<LanguagesType>("language", { sameSite: true })

defineTranslation({
	ar: {
		info: "معلومات",
		name: "الإسم",
		size: "الحجم",
		type: "النوع",
		link: "الرابط",
		rename: "تغيير الإسم",
		replace: "إستبدال",
	},
})

const modelValue = defineModel<Asset[]>()
watch(modelValue, (value) => {
	console.log(value);

})
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
const CurrentAsset = ref<Asset>()

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function deleteAsset(asset: Asset) {
	Loading.value[`deleteAsset${asset.id}`] = true
	const data = await $fetch<apiResponse>(
		`${appConfig.apiBase}${database.value.slug}/assets${path.value}/${asset.id}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	),
		singleAsset = modelValue.value?.find((value) => value.id === asset.id)
	if (data?.result) {
		modelValue.value = modelValue.value?.filter(
			(value) => value.id !== asset.id,
		)

		if (database.value.size) database.value.size -= singleAsset?.size ?? 0
		window.$message.success(data?.message ?? t("success"))
	} else window.$message.error(data?.message ?? t("error"))
	Loading.value[`deleteAsset${asset.id}`] = false
}
const dropdownOptions = computed(() => [
	{
		label: t("info"),
		key: "info",
		show: !!CurrentAsset.value?.type && (imageExtensions.includes(CurrentAsset.value.extension) || videoExtensions.includes(CurrentAsset.value.extension) || CurrentAsset.value.extension === "pdf"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:info-square-rounded" })),
	}, {
		label: t("delete"),
		key: "delete",
		show: table?.allowedMethods?.includes("d"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
	},
	{
		label: t("rename"),
		key: "rename",
		disabled: true,
		show:
			table?.allowedMethods?.includes("u") &&
			CurrentAsset.value?.type === "dir",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:pencil" })),
	},
	{
		label: t("replace"),
		key: "replace",
		disabled: true,
		show: table?.allowedMethods?.includes("u"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:upload" })),
	},
])

function dropdownOnSelect(key: string) {
	switch (key) {
		case "delete":
			deleteAsset(CurrentAsset.value as Asset)
			showDropdown.value = false
			break
		case "info":
			showDrawer.value = true
			showDropdown.value = false
			break
		default:
			break
	}
}

const showDrawer = ref(false)
const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
async function handleContextMenu(e: MouseEvent, asset: Asset) {
	e.preventDefault()
	showDropdown.value = false
	await nextTick()
	CurrentAsset.value = asset
	showDropdown.value = true
	x.value = e.clientX + 8
	y.value = e.clientY + 8
}
function dropdownOnClickOutside(e: MouseEvent) {
	const isRightClick = e.button === 2
	if (!isRightClick) showDropdown.value = false
}
const route = useRoute()

const currentPreviewAsset = ref<Asset>()
const previewLoading = ref(false)
const pdfObjectUrl = ref<string | null>(null)
async function handleOnClickAsset(e: MouseEvent, asset: Asset) {
	if (e.ctrlKey || e.metaKey) {
		e.preventDefault()
		window.open(asset.publicURL)
		return
	}
	if (asset.type === "dir") {
		if (isAssetRoute)
			return navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/assets${path.value}/${asset.name}`,
			)
		path.value += `/${asset.name}`
		return
	}
	if (videoExtensions.includes(asset.extension) || asset.extension === "pdf") {
		e.preventDefault()
		currentPreviewAsset.value = asset
		previewLoading.value = true
		if (asset.extension === 'pdf')
			await loadPdfObjectUrl(asset.publicURL)
		return;
	}
	CurrentAsset.value = asset
	showDrawer.value = true
}

// Video thumbnail generation state and helper
const videoThumbs = reactive<Record<string, string | undefined>>({})
const generatingVideo = reactive<Record<string, boolean>>({})

function assetKey(asset: Asset): string {
	// Prefer a stable unique key
	return String(asset.id ?? asset.publicURL ?? asset.name)
}

async function generateVideoThumb(asset: Asset, timeSec = 0.5) {
	if (!videoExtensions.includes(asset.extension)) return
	const key = assetKey(asset)
	if (videoThumbs[key] !== undefined) return videoThumbs[key]
	try {
		generatingVideo[key] = true
		const dataUrl = await new Promise<string | undefined>((resolve) => {
			const video = document.createElement('video')
			// Requires proper CORS headers on the asset URL
			video.crossOrigin = 'anonymous'
			video.preload = 'metadata'
			video.muted = true
			video.src = asset.publicURL

			const cleanup = () => {
				video.removeEventListener('loadeddata', onLoaded)
				video.removeEventListener('seeked', onSeeked)
				video.removeEventListener('error', onError)
			}
			const onError = () => { cleanup(); resolve(undefined) }
			const onLoaded = () => {
				try {
					const target = Number.isFinite(video.duration) ? Math.min(timeSec, Math.max(0, video.duration - 0.1)) : 0
					if (target > 0) {
						video.currentTime = target
					} else {
						onSeeked()
					}
				} catch {
					onError()
				}
			}
			const onSeeked = () => {
				try {
					const canvas = document.createElement('canvas')
					canvas.width = video.videoWidth || 320
					canvas.height = video.videoHeight || 180
					const ctx = canvas.getContext('2d')
					if (!ctx) { cleanup(); resolve(undefined); return }
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
					const url = canvas.toDataURL('image/jpeg', 0.8)
					cleanup()
					resolve(url)
				} catch {
					cleanup(); resolve(undefined)
				}
			}

			video.addEventListener('loadeddata', onLoaded, { once: true })
			video.addEventListener('seeked', onSeeked, { once: true })
			video.addEventListener('error', onError, { once: true })
		})
		videoThumbs[key] = dataUrl
	} catch {
		videoThumbs[key] = undefined
	}
	generatingVideo[key] = false
	return videoThumbs[key]
}

function onClosePreview() {
	currentPreviewAsset.value = undefined
	previewLoading.value = false
	if (pdfObjectUrl.value) {
		URL.revokeObjectURL(pdfObjectUrl.value)
		pdfObjectUrl.value = null
	}
}

async function loadPdfObjectUrl(url: string) {
	try {
		const response = await fetch(url, { credentials: 'include' })
		const blob = await response.blob()
		if (blob.type !== 'application/pdf') throw new Error('Not a PDF')
		if (pdfObjectUrl.value) URL.revokeObjectURL(pdfObjectUrl.value)
		pdfObjectUrl.value = URL.createObjectURL(blob)
	} catch (e) {
		// Fallback: keep spinner off and avoid blocking UI
		pdfObjectUrl.value = null
		previewLoading.value = false
	}
}

// Intersection observer directive for lazy actions
const vIntersect: Directive<HTMLElement, () => void> = {
	mounted(el, binding) {
		const callback = binding.value
		if (typeof callback !== 'function') return
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					callback()
					observer.disconnect()
					break
				}
			}
		})
		observer.observe(el)
			// store on element for potential cleanup
			; (el as any).__io__ = observer
	},
	unmounted(el) {
		const observer: IntersectionObserver | undefined = (el as any).__io__
		if (observer) observer.disconnect()
		delete (el as any).__io__
	}
}

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