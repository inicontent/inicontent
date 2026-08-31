<template>
	<NModal v-if="activeAsset" :show="showPreview" :auto-focus="false" :mask-closable="true"
		:close-on-esc="true" @mask-click="closePreview" @close="closePreview" @esc="closePreview"
		preset="card" 
		style="width: min(90vw, 1080px);max-width: 1080px;"
		:segmented="{ content: true, footer: true }"
		:show-mask="false"
		:title="`${activeAsset.name}${activeAsset.extension ? `.${activeAsset.extension}` : ''}`">
			<template #header-extra>
				<NText depth="3" style="margin:0 10px">{{ previewAssetIndex + 1 }} / {{ previewAssetList.length }}</NText>
			</template>
			<div class="assetLightboxBody">
				<video v-if="isVideoAsset(activeAsset)" :key="activeAsset.id" controls autoplay playsinline
					class="assetLightboxMedia" @loadeddata="Loading.previewModal = false"
					@canplay="Loading.previewModal = false" @error="Loading.previewModal = false">
					<source :src="activeAsset.publicURL" :type="activeAsset.type" />
				</video>
				<NImage v-else-if="isImageAsset(activeAsset)" :src="activeAsset.publicURL" preview-disabled
					class="assetLightboxMedia" object-fit="contain" :img-props="{ style: imageTransformStyle }" />
				<div v-else-if="isPdfAsset(activeAsset)" ref="pdfPanelRef" class="assetPdfPanel" @scroll.passive="updatePdfCurrentPage">
					<div ref="pdfPagesContainerRef" class="assetPdfPages" />
					<NText v-if="pdfError" depth="3">{{ pdfError }}</NText>
					<div v-if="pdfPageCount" class="assetPdfPageBadge">{{ pdfCurrentPage }} / {{ pdfPageCount }}</div>
				</div>
				<iframe v-else-if="isHtmlAsset(activeAsset)" :src="activeAsset.publicURL" class="assetLightboxFrame"
					title="HTML Preview" loading="lazy" referrerpolicy="no-referrer" />
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
			<template #footer>
				<NFlex v-if="isPdfAsset(activeAsset)" justify="center" aria-label="PDF controls">
					<NButton circle tertiary size="large" @click="openAssetInNewTab(activeAsset)">
						<NIcon :size="18">
							<Icon name="tabler:external-link" />
						</NIcon>
					</NButton>
				</NFlex>
				<NFlex v-if="isImageAsset(activeAsset)" justify="center" align="center" aria-label="Image rotation controls">
					<NButton circle tertiary @click="rotatePreviewImageLeft">
						<NIcon :size="18">
							<Icon name="tabler:rotate-2" />
						</NIcon>
					</NButton>
					<NButton circle tertiary size="large" @click="resetPreviewImageRotation">
						<NIcon :size="18">
							<Icon name="tabler:reload" />
						</NIcon>
					</NButton>
					<NButton circle tertiary @click="rotatePreviewImageRight">
						<NIcon :size="18">
							<Icon name="tabler:rotate-clockwise-2" />
						</NIcon>
					</NButton>
				</NFlex>
			</template>
			<NButton v-if="previewAssetList.length > 1"  circle tertiary size="large" class="assetLightboxNav assetLightboxPrev" @click="showPrevByLanguage">
				<NIcon :size="22">
					<Icon :name="Language === 'ar' ? 'tabler:chevron-right' : 'tabler:chevron-left'" />
				</NIcon>
			</NButton>
			<NButton v-if="previewAssetList.length > 1" circle tertiary size="large" class="assetLightboxNav assetLightboxNext" type="button" @click="showNextByLanguage">
				<NIcon :size="22">
					<Icon :name="Language === 'ar' ? 'tabler:chevron-left' : 'tabler:chevron-right'" />
				</NIcon>
			</NButton>
	</NModal>
</template>

<script setup lang="ts">
import { Icon, NIcon } from "#components";
import { imageExtensions, videoExtensions } from "~/composables";
import { useAssetPreview } from "~/composables/useAssetPreview";

const Language = useLanguageCookie();
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
const pdfPagesContainerRef = ref<HTMLDivElement>();
const pdfPanelRef = ref<HTMLDivElement>();
const pdfError = ref("");
const pdfPageCount = ref(0);
const pdfCurrentPage = ref(1);

type PdfViewport = {
	width: number;
	height: number;
};

type PdfRenderTask = {
	promise: Promise<void>;
	cancel: () => void;
};

type PdfPage = {
	getViewport: (params: { scale: number }) => PdfViewport;
	render: (params: {
		canvasContext: CanvasRenderingContext2D;
		viewport: PdfViewport;
		canvas: HTMLCanvasElement;
	}) => PdfRenderTask;
};

type PdfDocument = {
	numPages: number;
	getPage: (pageNumber: number) => Promise<PdfPage>;
	destroy: () => Promise<void>;
};

let pdfjsLib: Awaited<typeof import("pdfjs-dist")> | undefined;
let pdfDocument: PdfDocument | undefined;
let pdfLoadToken = 0;

const imageTransformStyle = computed(() => {
	const rotation = previewImageRotation.value % 360;
	return `transform: rotate(${rotation}deg); transform-origin: center center; transition: transform .2s ease;width:100%;`;
});

function isVideoAsset(asset: Asset) {
	return asset.type !== "dir" && videoExtensions.includes(asset.extension);
}

function isImageAsset(asset: Asset) {
	return asset.type !== "dir" && imageExtensions.includes(asset.extension);
}

function isPdfAsset(asset: Asset) {
	if (asset.type === "dir") return false;
	const ext = String(asset.extension || "").toLowerCase();
	return ext === "pdf" || asset.type === "application/pdf";
}

function isHtmlAsset(asset: Asset) {
	if (asset.type === "dir") return false;
	const ext = String(asset.extension || "").toLowerCase();
	return ext === "html" || ext === "htm" || asset.type === "text/html";
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

async function ensurePdfJsLoaded() {
	if (!pdfjsLib) {
		pdfjsLib = await import("pdfjs-dist");
		pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
	}
	return pdfjsLib;
}

async function cleanupPdfDocument() {
	if (!pdfDocument) return;
	try {
		await pdfDocument.destroy();
	} catch {
		// Ignore teardown errors.
	}
	pdfDocument = undefined;
}

function updatePdfCurrentPage() {
	const panel = pdfPanelRef.value;
	const container = pdfPagesContainerRef.value;
	if (!panel || !container || !pdfPageCount.value) return;
	const canvases = Array.from(
		container.querySelectorAll<HTMLCanvasElement>(".assetPdfCanvas"),
	);
	if (!canvases.length) return;
	const marker = panel.getBoundingClientRect().top + panel.clientHeight * 0.3;
	let current = 1;
	for (const [index, canvas] of canvases.entries()) {
		if (canvas.getBoundingClientRect().top <= marker) current = index + 1;
	}
	pdfCurrentPage.value = current;
}

async function renderAllPdfPages() {
	await nextTick();
	if (!pdfDocument || !pdfPagesContainerRef.value) return;
	const token = pdfLoadToken;
	const container = pdfPagesContainerRef.value;
	const panel = pdfPanelRef.value;
	container.innerHTML = "";

	const availableWidth = (panel?.clientWidth || container.clientWidth || 800) - 8;
	const availableHeight = panel?.clientHeight || 0;
	const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
	const qualityBoost = 1.5;

	for (let pageNum = 1; pageNum <= pdfPageCount.value; pageNum++) {
		if (token !== pdfLoadToken) return;
		const page = await pdfDocument.getPage(pageNum);
		if (token !== pdfLoadToken) return;
		const baseViewport = page.getViewport({ scale: 1 });
		// Fit each page inside the modal viewport instead of stretching it to full width.
		const widthScale = availableWidth / baseViewport.width;
		const heightScale = availableHeight
			? availableHeight / baseViewport.height
			: widthScale;
		const fitScale = Math.max(Math.min(widthScale, heightScale), 0.1);
		const oversample = pixelRatio * qualityBoost;
		const renderScale = Math.min(fitScale * oversample, fitScale * 4);
		const viewport = page.getViewport({ scale: renderScale });
		const canvas = document.createElement("canvas");
		canvas.className = "assetPdfCanvas";
		canvas.width = viewport.width;
		canvas.height = viewport.height;
		// Display at the fitted size; oversample only adds render resolution, not layout size.
		canvas.style.width = `${(baseViewport.width * fitScale)}px`;
		canvas.style.height = `${(baseViewport.height * fitScale)}px`;
		container.appendChild(canvas);
		const context = canvas.getContext("2d");
		if (!context) continue;
		const renderTask = page.render({ canvasContext: context, viewport, canvas });
		await renderTask.promise;
	}
	updatePdfCurrentPage();
}

async function initializePdfPreview(asset: Asset) {
	pdfLoadToken += 1;
	const currentLoadToken = pdfLoadToken;
	Loading.value.previewModal = true;
	pdfError.value = "";
	pdfPageCount.value = 0;
	pdfCurrentPage.value = 1;

	try {
		await cleanupPdfDocument();
		const library = await ensurePdfJsLoaded();
		const loadingTask = library.getDocument({
			url: asset.publicURL as string,
			// Needed so non-embedded/base-14 fonts get correct glyph widths instead of garbled spacing.
			cMapUrl: `https://unpkg.com/pdfjs-dist@${library.version}/cmaps/`,
			cMapPacked: true,
			standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${library.version}/standard_fonts/`,
			// Fall back to the system's Arabic/CJK fonts when they aren't embedded in the PDF.
			useSystemFonts: true,
			// Draw embedded glyph outlines directly instead of via @font-face+fillText, which breaks Arabic letter joining for some font subsets.
			disableFontFace: true,
		});
		const document = (await loadingTask.promise) as unknown as PdfDocument;

		if (currentLoadToken !== pdfLoadToken) {
			await document.destroy();
			return;
		}

		pdfDocument = document;
		pdfPageCount.value = document.numPages || 1;
		await renderAllPdfPages();
	} catch {
		pdfError.value = "Unable to preview this PDF file.";
	} finally {
		if (currentLoadToken === pdfLoadToken) {
			Loading.value.previewModal = false;
		}
	}
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
		pdfLoadToken += 1;
		void cleanupPdfDocument();
		pdfError.value = "";
		pdfPageCount.value = 0;
		pdfCurrentPage.value = 1;
		Loading.value.previewModal = false;
		return;
	}
	if (isPdfAsset(asset)) {
		void initializePdfPreview(asset);
		return;
	}
	pdfLoadToken += 1;
	void cleanupPdfDocument();
	pdfError.value = "";
	pdfPageCount.value = 0;
	pdfCurrentPage.value = 1;
	Loading.value.previewModal = isVideoAsset(asset);
});

onMounted(() => {
	window.addEventListener("keydown", onPreviewKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", onPreviewKeydown);
	void cleanupPdfDocument();
});
</script>

<style scoped>
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

.assetLightboxFrame {
	width: 100%;
	height: min(72vh, 760px);
	border: 0;
	border-radius: 10px;
	background: #fff;
}

.assetPdfPanel {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	height: min(72vh, 760px);
	max-height: min(72vh, 760px);
	overflow-x: hidden;
	overflow-y: auto;
	padding: 4px;
}

.assetPdfPageBadge {
	position: sticky;
	bottom: 8px;
	align-self: center;
	padding: 4px 12px;
	border-radius: 999px;
	font-size: 12px;
	color: #fff;
	background: color-mix(in srgb, #000 62%, transparent);
	pointer-events: none;
}

.assetPdfPages {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	width: 100%;
}

.assetPdfCanvas {
	max-width: 100%;
	background: #fff;
	border-radius: 10px;
	box-shadow: 0 6px 20px color-mix(in srgb, #000 14%, transparent);
}

.assetPdfControls {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding-top: 12px;
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
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
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
</style>
