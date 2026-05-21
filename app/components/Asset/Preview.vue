<template>
	<NModal :show="showPreview" class="assetLightbox" :auto-focus="false" :mask-closable="true"
		:close-on-esc="true" @mask-click="closePreview" @close="closePreview" @esc="closePreview">
		<NCard v-if="activeAsset" embedded :bordered="false" class="assetLightboxCard" role="dialog"
			:title="`${activeAsset.name}${activeAsset.extension ? `.${activeAsset.extension}` : ''}`">
			<template #header-extra>
				<div class="assetLightboxHeaderExtra">
					<NText depth="3">{{ previewAssetIndex + 1 }} / {{ previewAssetList.length }}</NText>
					<button class="assetLightboxClose" type="button" aria-label="Close preview" @click="closePreview">
						<NIcon :size="18">
							<Icon name="tabler:x" />
						</NIcon>
					</button>
				</div>
			</template>
			<div class="assetLightboxBody">
				<video v-if="isVideoAsset(activeAsset)" :key="activeAsset.id" controls autoplay playsinline
					class="assetLightboxMedia" @loadeddata="Loading.previewModal = false"
					@canplay="Loading.previewModal = false" @error="Loading.previewModal = false">
					<source :src="activeAsset.publicURL" :type="activeAsset.type" />
				</video>
				<NImage v-else-if="isImageAsset(activeAsset)" :src="activeAsset.publicURL" preview-disabled
					class="assetLightboxMedia" object-fit="contain" :img-props="{ style: imageTransformStyle }" />
				<div v-else class="assetDocPanel">
					<LazyAssetThumb :asset="activeAsset" :hide-tooltip="true" :size="340" :preview-disabled="true"
						:disable-default-click-action="true" @click="openAssetInNewTab(activeAsset)" />
					<button class="assetDocOpenButton" type="button" @click="openAssetInNewTab(activeAsset)">
						<NIcon :size="30">
							<Icon name="tabler:external-link" />
						</NIcon>
					</button>
				</div>
			</div>
			<div v-if="isImageAsset(activeAsset)" class="assetLightboxControls" aria-label="Image rotation controls">
				<button class="assetLightboxControl" type="button" @click="rotatePreviewImageLeft">
					<NIcon :size="18">
						<Icon name="tabler:rotate-2" />
					</NIcon>
				</button>
				<button class="assetLightboxControl" type="button" @click="resetPreviewImageRotation">
					<NIcon :size="18">
						<Icon name="tabler:reload" />
					</NIcon>
				</button>
				<button class="assetLightboxControl" type="button" @click="rotatePreviewImageRight">
					<NIcon :size="18">
						<Icon name="tabler:rotate-clockwise-2" />
					</NIcon>
				</button>
			</div>
			<button class="assetLightboxNav assetLightboxPrev" type="button" @click="showPrevByLanguage"
				:disabled="previewAssetList.length <= 1">
				<NIcon :size="22">
					<Icon :name="Language === 'ar' ? 'tabler:chevron-right' : 'tabler:chevron-left'" />
				</NIcon>
			</button>
			<button class="assetLightboxNav assetLightboxNext" type="button" @click="showNextByLanguage"
				:disabled="previewAssetList.length <= 1">
				<NIcon :size="22">
					<Icon :name="Language === 'ar' ? 'tabler:chevron-left' : 'tabler:chevron-right'" />
				</NIcon>
			</button>
		</NCard>
	</NModal>
</template>

<script setup lang="ts">
import { Icon, NIcon } from "#components";
import { imageExtensions, videoExtensions } from "~/composables";
import { useAssetPreview } from "~/composables/useAssetPreview";

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const {
	currentPreviewAsset,
	previewAssetList,
	previewAssetIndex,
	previewImageRotation,
	closePreview,
	showPrevPreviewAsset,
	showNextPreviewAsset,
	rotatePreviewImageLeft,
	rotatePreviewImageRight,
	resetPreviewImageRotation,
} = useAssetPreview();

const showPreview = computed(() => !!currentPreviewAsset.value);
const activeAsset = computed(() => currentPreviewAsset.value);
const imageTransformStyle = computed(() => {
	const rotation = previewImageRotation.value % 360;
	return `transform: rotate(${rotation}deg); transform-origin: center center; transition: transform .2s ease;`;
});

function isVideoAsset(asset: Asset) {
	return asset.type !== "dir" && videoExtensions.includes(asset.extension);
}

function isImageAsset(asset: Asset) {
	return asset.type !== "dir" && imageExtensions.includes(asset.extension);
}

function openAssetInNewTab(asset?: Asset) {
	if (!asset?.publicURL) return;
	window.open(asset.publicURL, "_blank", "noopener");
}

function showPrevByLanguage() {
	Language.value === "ar" ? showNextPreviewAsset() : showPrevPreviewAsset();
}

function showNextByLanguage() {
	Language.value === "ar" ? showPrevPreviewAsset() : showNextPreviewAsset();
}

function onPreviewKeydown(event: KeyboardEvent) {
	if (!showPreview.value) return;
	if (event.key === "Escape") {
		event.preventDefault();
		closePreview();
	}
	if (event.key === "ArrowLeft") {
		event.preventDefault();
		showPrevByLanguage();
	}
	if (event.key === "ArrowRight") {
		event.preventDefault();
		showNextByLanguage();
	}
}

watch(currentPreviewAsset, (asset) => {
	if (!asset) {
		Loading.value.previewModal = false;
		return;
	}
	Loading.value.previewModal = isVideoAsset(asset);
});

onMounted(() => {
	window.addEventListener("keydown", onPreviewKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", onPreviewKeydown);
});
</script>

<style scoped>
.assetLightboxCard {
	position: relative;
	width: min(90vw, 1080px);
	max-width: 1080px;
	margin: 0 auto;
}

.assetLightboxHeaderExtra {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.assetLightboxClose {
	border: 0;
	width: 34px;
	height: 34px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--n-text-color);
	background: color-mix(in srgb, var(--n-color) 76%, #000 24%);
}

.assetLightboxBody {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: min(72vh, 760px);
	text-align: center;
}

.assetLightboxMedia {
	width: 100%;
	max-height: min(72vh, 760px);
	object-fit: contain;
	margin: 0 auto;
}

.assetDocPanel {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	width: 100%;
}

.assetDocOpenButton {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border: 0;
	width: 68px;
	height: 68px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--n-text-color);
	background: color-mix(in srgb, var(--n-color) 70%, #000 30%);
	box-shadow: 0 6px 24px color-mix(in srgb, #000 30%, transparent);
	backdrop-filter: blur(4px);
}

.assetLightboxControls {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	padding-top: 12px;
}

.assetLightboxControl {
	border: 0;
	width: 38px;
	height: 38px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--n-text-color);
	background: color-mix(in srgb, var(--n-color) 76%, #000 24%);
}

.assetLightboxNav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 3;
	border: 0;
	width: 44px;
	height: 44px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--n-text-color);
	background: color-mix(in srgb, var(--n-color) 68%, #000 32%);
}

.assetLightboxNav:disabled {
	opacity: 0.35;
	cursor: default;
}

.assetLightboxPrev {
	left: 14px;
}

.assetLightboxNext {
	right: 14px;
}

.assetLightbox :deep(.n-modal) {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
}
</style>
