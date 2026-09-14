<template>
	<NModal :show="show" @update:show="onVisibilityChange" :mask-closable="false"
		preset="card" :title="t('documentScanner')" style="max-width: 720px; width: 95vw;"
		:segmented="{ content: true, footer: true }">
		<!-- Tabs: Camera / Upload -->
		<NTabs v-model:value="activeTab" type="segment" animated>
			<!-- ═══════════════ Camera Tab ═══════════════ -->
			<NTabPane name="camera" :tab="t('camera')">
				<NFlex vertical align="center" :size="16">
					<!-- Inline OpenCV status banners (do NOT block the camera preview) -->
					<NFlex v-if="scannerLoading" align="center" :size="8">
						<NSpin size="small" />
						<NText depth="3" style="font-size: 13px;">{{ t('loadingScanner') }}…</NText>
					</NFlex>
					<NAlert v-else-if="scannerError" type="error" :title="t('error')" closable
						@close="dismissScannerError">
						{{ scannerError }}
					</NAlert>

					<!-- Always rendered; hidden until a stream is attached
					     (cameraReady is only set after the refs exist) -->
					<div style="position: relative; width: 100%; border-radius: 8px; overflow: hidden; background: #000;">
						<video ref="videoEl" autoplay playsinline muted
							:style="cameraReady ? 'width: 100%; display: block;' : 'display: none;'"
							@loadedmetadata="onVideoReady" />
						<canvas ref="overlayCanvas"
							:style="cameraReady ? 'position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;' : 'display: none;'" />
						<NFlex v-if="cameraStarting" style="position: absolute; inset: 0;" align="center"
							justify="center">
							<NSpin size="large" />
						</NFlex>
					</div>

					<!-- Live detection guidance -->
					<NTag v-if="cameraReady && detectionStatus" :bordered="false"
						:color="{ color: detectionStatus.color, textColor: '#fff' }" size="small">
						<template #icon>
							<NIcon>
								<Icon :name="detectionStatus.ok ? 'tabler:check' : 'tabler:alert-triangle'" />
							</NIcon>
						</template>
						{{ detectionStatus.label }}
					</NTag>

					<NFlex v-if="cameraError" vertical align="center">
						<NAlert type="warning" :title="t('cameraUnavailable')">
							{{ cameraError }}
						</NAlert>
						<NButton size="small" @click="openCamera">{{ t('retry') }}</NButton>
					</NFlex>

					<NButton v-if="!cameraReady" block @click="openCamera" :loading="cameraStarting">
						<template #icon>
							<NIcon>
								<Icon name="tabler:camera" />
							</NIcon>
						</template>
						{{ t('openCamera') }}
					</NButton>
					<NButton v-else type="primary" block @click="capture">
						<template #icon>
							<NIcon>
								<Icon name="tabler:camera" />
							</NIcon>
						</template>
						{{ t('capture') }}
					</NButton>
				</NFlex>
			</NTabPane>

			<!-- ═══════════════ Upload Tab ═══════════════ -->
			<NTabPane name="upload" :tab="t('uploadImage')">
				<NFlex vertical align="center" :size="16">
					<input ref="fileInput" type="file" accept="image/*" style="display: none;"
						@change="onFileSelected" />

					<!-- Drop zone -->
					<div v-if="!previewCanvas"
						style="width: 100%; border: 2px dashed #ccc; border-radius: 8px; padding: 48px 16px; text-align: center; cursor: pointer;"
						@click="fileInput?.click()"
						@dragover.prevent
						@drop.prevent="onDrop">
						<NIcon size="48" depth="3" style="margin-bottom: 8px;">
							<Icon name="tabler:photo-up" />
						</NIcon>
						<NText depth="3" style="display: block; font-size: 14px;">
							{{ t('dropImageOrClick') }}
						</NText>
					</div>
				</NFlex>
			</NTabPane>
		</NTabs>

		<!-- ═══════════════ Preview (shown after capture or upload) ═══════════════ -->
		<NFlex v-if="previewCanvas" vertical :size="12" style="margin-top: 16px;">
			<NText strong>{{ t('preview') }}</NText>

			<!-- Manual corner adjustment mode -->
			<div v-if="manualAdjust" style="width: 100%;">
				<div ref="adjustBoxEl" class="adjust-box" style="position: relative; width: 100%; border-radius: 8px; overflow: hidden; touch-action: none;"
					@pointermove="onAdjustPointerMove" @pointerup="onAdjustPointerUp"
					@pointercancel="onAdjustPointerUp">
					<canvas ref="adjustCanvasEl" :width="rawCanvas?.width ?? 1"
						:height="rawCanvas?.height ?? 1"
						style="width: 100%; display: block; pointer-events: none;" />
					<svg :viewBox="`0 0 ${(rawCanvas?.width ?? 1)} ${(rawCanvas?.height ?? 1)}`"
						preserveAspectRatio="none"
						style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
						<polygon :points="quadPoints" fill="rgba(22, 163, 74, 0.18)" stroke="#16a34a"
							stroke-width="3" vector-effect="non-scaling-stroke" />
					</svg>
					<div v-for="key in cornerKeys" :key="key" class="corner-handle"
						:data-corner="key" :style="cornerStyle(key)"
						@pointerdown.stop.prevent="onAdjustPointerDown($event, key)" />
				</div>
				<NText depth="3" style="display: block; font-size: 12px; margin-top: 6px; text-align: center;">
					{{ t('dragHandlesToAdjust') }}
				</NText>
				<NFlex justify="space-between" style="margin-top: 10px;">
					<NButton size="small" quaternary @click="cancelManualAdjust">{{ t('cancel') }}</NButton>
					<NButton size="small" type="primary" @click="applyManualCrop" :disabled="adjusting">
						<template #icon>
							<NIcon>
								<Icon name="tabler:crop" />
							</NIcon>
						</template>
						{{ t('applyCrop') }}
					</NButton>
				</NFlex>
			</div>

			<template v-else>
				<!-- Auto-extraction failed warning -->
				<NAlert v-if="autoDetectionFailed" type="warning" :title="t('documentNotDetected')" closable
					@close="autoDetectionFailed = false">
					{{ detectionMessage }}
				</NAlert>

				<div style="width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid var(--n-border-color, #eee);">
					<canvas ref="previewEl" style="width: 100%; display: block;" />
				</div>
			</template>

			<!-- Extract progress -->
			<NFlex v-if="extracting" align="center" :size="8">
				<NSpin size="small" />
				<NText depth="3" style="font-size: 13px;">{{ t('extractingDocument') }}…</NText>
			</NFlex>

			<!-- OCR progress (only when allowOCR is true and OCR is running) -->
			<NFlex v-if="ocrRunning" align="center" :size="8">
				<NProgress type="line" :percentage="ocrProgress" :show-indicator="false"
					style="flex: 1;" status="success" />
				<NText depth="3" style="font-size: 12px;">{{ t('ocr') }} {{ ocrProgress }}%</NText>
			</NFlex>

			<!-- Adjust corners (escape hatch when auto-detection is weak) -->
			<NButton v-if="!manualAdjust" size="small" quaternary circle
				style="align-self: center;" @click="enterManualAdjust" :disabled="adjusting">
				<template #icon>
					<NIcon>
						<Icon name="tabler:adjustments-horizontal" />
					</NIcon>
				</template>
				{{ t('adjustCorners') }}
			</NButton>

			<!-- OCR language selector -->
			<NFlex v-if="allowOCR" align="center" :size="8">
				<NText depth="3" style="font-size: 13px;">{{ t('language') }}:</NText>
				<NSelect :options="ocrLanguageOptions" v-model:value="selectedOcrLanguage" size="small"
					style="width: 140px;" />
			</NFlex>
		</NFlex>

		<!-- ═══════════════ OCR Output (only when allowOCR) ═══════════════ -->
		<NFlex v-if="allowOCR && ocrResult" vertical :size="8" style="margin-top: 12px;">
			<NFlex align="center" justify="space-between">
				<NText strong>{{ t('extractedText') }}</NText>
				<NButton size="tiny" quaternary @click="copyOcrText">
					<template #icon>
						<NIcon>
							<Icon name="tabler:copy" />
						</NIcon>
					</template>
					{{ t('copy') }}
				</NButton>
			</NFlex>
			<NInput type="textarea" :value="ocrResult.text" :autosize="{ minRows: 3, maxRows: 8 }"
				readonly style="font-size: 13px;" />
		</NFlex>

		<template #footer>
			<NFlex justify="space-between">
				<NButton v-if="previewCanvas" @click="reset" quaternary :disabled="adjusting">
					<template #icon>
						<NIcon>
							<Icon name="tabler:refresh" />
						</NIcon>
					</template>
					{{ allowOCR && ocrResult ? t('retake') : t('reset') }}
				</NButton>
				<NFlex :size="8">
					<NButton v-if="allowOCR && ocrResult && !manualAdjust" type="primary" @click="emitInsertText">
						<template #icon>
							<NIcon>
								<Icon name="tabler:article" />
							</NIcon>
						</template>
						{{ t('insertAsText') }}
					</NButton>
					<NButton v-if="previewCanvas && !manualAdjust" type="primary" @click="emitInsertImage"
						:disabled="extracting || adjusting">
						<template #icon>
							<NIcon>
								<Icon name="tabler:photo" />
							</NIcon>
						</template>
						{{ allowOCR ? t('insertAsImage') : t('useThisScan') }}
					</NButton>
				</NFlex>
			</NFlex>
		</template>
	</NModal>
</template>

<script setup lang="ts">
import { copyToClipboard } from "~/composables";
import type { OcrResult } from "~/composables/useOcr";
import type { Corners, PaperAnalysis } from "~/composables/useScanner";

const props = withDefaults(
	defineProps<{
		show: boolean;
		/** Enable OCR text extraction + "Insert as Text" button */
		allowOCR?: boolean;
	}>(),
	{ allowOCR: false },
);

const emit = defineEmits<{
	"update:show": [value: boolean];
	/** Emitted when user clicks "Insert as Image" */
	scanned: [blob: Blob, dataUrl: string];
	/** Emitted when user clicks "Insert as Text" (only if allowOCR) */
	insertText: [text: string, blocks: any[]];
}>();

// `t` is auto-imported globally (see composables/index.ts + template-globals plugin).

// ── Scanner (jscanify) ───────────────────────────────────────
const {
	scanner,
	loading: scannerLoading,
	error: scannerError,
	loadScanner,
	startCamera,
	stopCamera,
	startHighlightLoop,
	stopHighlightLoop,
	captureFrame,
	smartExtract,
	warpCorners,
	fullFrameCorners,
	cornersSize,
	analysisHint,
	canvasToBlob,
} = useScanner();

// ── OCR ──────────────────────────────────────────────────────
// Always instantiate the composable (hooks must not be conditional);
// usage is gated on allowOCR.
const ocr = useOcr();

const ocrLanguageOptions = [
	{ label: "English", value: "eng" },
	{ label: "العربية", value: "ara" },
	{ label: "Français", value: "fra" },
	{ label: "Español", value: "spa" },
];

const selectedOcrLanguage = ref<string>("eng");
const ocrRunning = ref(false);
const ocrProgress = computed(() => ocr.progress.value);
const ocrResult = ref<OcrResult | null>(null);

watch(selectedOcrLanguage, async (lang) => {
	if (props.allowOCR) await ocr.setLanguage(lang);
});

// ── State ────────────────────────────────────────────────────
const activeTab = ref("camera");

const videoEl = ref<HTMLVideoElement>();
const overlayCanvas = ref<HTMLCanvasElement>();
const previewEl = ref<HTMLCanvasElement>();
const adjustBoxEl = ref<HTMLDivElement>();
const adjustCanvasEl = ref<HTMLCanvasElement>();
const fileInput = ref<HTMLInputElement>();

const cameraReady = ref(false);
const cameraStarting = ref(false);
const cameraError = ref<string | null>(null);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const extracting = ref(false);

/** The original (uncropped) capture/upload – the source for manual adjustment */
const rawCanvas = ref<HTMLCanvasElement | null>(null);
/** Result of the last auto-detection attempt */
const lastAnalysis = ref<PaperAnalysis | null>(null);
const autoDetectionFailed = ref(false);
const detectionMessage = ref<string | null>(null);
/** Live camera overlay guidance chip */
const detectionStatus = ref<{
	label: string;
	color: string;
	ok: boolean;
} | null>(null);

// Manual corner adjustment
const cornerKeys: (keyof Corners)[] = [
	"topLeft",
	"topRight",
	"bottomRight",
	"bottomLeft",
];
const manualAdjust = ref(false);
const adjusting = ref(false);
const draggingCorner = ref<keyof Corners | null>(null);
const manualCorners = ref<Corners | null>(null);

function clamp(v: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, v));
}

// ── Init scanner on mount ────────────────────────────────────
async function initScanner() {
	try {
		await loadScanner();
	} catch {
		// Error is exposed via scannerError
	}
}

onMounted(() => {
	initScanner();
});

// ── Camera ───────────────────────────────────────────────────
async function openCamera() {
	cameraStarting.value = true;
	cameraError.value = null;

	try {
		const stream = await startCamera();
		// Mount the video element first, then attach the stream
		cameraReady.value = true;
		await nextTick();
		if (videoEl.value) {
			videoEl.value.srcObject = stream;
			// muted+playsinline autoplays by default; play() is a safety net
			await videoEl.value.play().catch(() => {});
		} else {
			cameraReady.value = false;
			cameraError.value = "Video element unavailable";
		}
	} catch (e: any) {
		cameraReady.value = false;
		cameraError.value = e?.message ?? "Camera access denied";
	} finally {
		cameraStarting.value = false;
	}
}

function onVideoReady() {
	if (videoEl.value && overlayCanvas.value) {
		startHighlightLoop(videoEl.value, overlayCanvas.value, (status) => {
			detectionStatus.value = status;
		});
	}
}

function capture() {
	if (!videoEl.value) return;
	stopHighlightLoop();

	rawCanvas.value = captureFrame(videoEl.value);
	autoExtract();
}

// ── File upload ──────────────────────────────────────────────
function onFileSelected(e: Event) {
	const input = e.target as HTMLInputElement;
	const file = input.files?.[0];
	if (file) loadImageFile(file);
	input.value = "";
}

function onDrop(e: DragEvent) {
	const file = e.dataTransfer?.files?.[0];
	if (file && file.type.startsWith("image/")) loadImageFile(file);
}

async function loadImageFile(file: File) {
	const url = URL.createObjectURL(file);
	const img = new Image();
	img.onload = () => {
		const canvas = document.createElement("canvas");
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(img, 0, 0);
		URL.revokeObjectURL(url);

		rawCanvas.value = canvas;
		autoExtract();
	};
	img.src = url;
}

/**
 * Run detection + perspective extraction on the raw frame.
 * Falls back to the raw image (with a warning) when no good quad found.
 */
async function autoExtract() {
	if (!rawCanvas.value) return;

	// Ensure the scanner is loaded before attempting detection
	if (!scanner.value) {
		try {
			await loadScanner();
		} catch {
			// scannerError banner covers this
		}
	}

	let canvas: HTMLCanvasElement | null = null;
	let analysis: PaperAnalysis | null = null;
	if (scanner.value) {
		const result = smartExtract(rawCanvas.value);
		canvas = result.canvas;
		analysis = result.analysis;
	}
	lastAnalysis.value = analysis;

	if (canvas) {
		showPreview(canvas);
	} else {
		showPreview(rawCanvas.value);
		autoDetectionFailed.value = true;
		detectionMessage.value = analysis
			? analysisHint(analysis)
			: t("documentNotDetected");
	}
}

// ── Preview ──────────────────────────────────────────────────
async function showPreview(canvas: HTMLCanvasElement) {
	previewCanvas.value = canvas;

	await nextTick();
	if (previewEl.value) {
		previewEl.value.width = canvas.width;
		previewEl.value.height = canvas.height;
		const ctx = previewEl.value.getContext("2d")!;
		ctx.drawImage(canvas, 0, 0);
	}

	// Auto-run OCR if enabled
	if (props.allowOCR && ocr) {
		runOcr(canvas);
	}

	// Stop camera if it was active
	if (activeTab.value === "camera") {
		stopCamera();
		cameraReady.value = false;
	}
}

async function runOcr(canvas: HTMLCanvasElement) {
	if (!ocr) return;
	ocrRunning.value = true;
	ocrResult.value = null;

	try {
		ocrResult.value = await ocr.recognize(canvas);
	} catch (e) {
		console.error("OCR failed:", e);
	} finally {
		ocrRunning.value = false;
	}
}

// ── Manual corner adjustment ────────────────────────────────
async function enterManualAdjust() {
	if (!rawCanvas.value) return;

	// Seed from the last detection if available, otherwise the full frame
	manualCorners.value =
		lastAnalysis.value?.corners ??
		fullFrameCorners(rawCanvas.value.width, rawCanvas.value.height);
	manualAdjust.value = true;

	await nextTick();
	if (adjustCanvasEl.value && rawCanvas.value) {
		const ctx = adjustCanvasEl.value.getContext("2d")!;
		ctx.clearRect(
			0,
			0,
			adjustCanvasEl.value.width,
			adjustCanvasEl.value.height,
		);
		ctx.drawImage(rawCanvas.value, 0, 0);
	}
}

function cancelManualAdjust() {
	manualAdjust.value = false;
	draggingCorner.value = null;
}

async function applyManualCrop() {
	if (!rawCanvas.value || !manualCorners.value) return;
	adjusting.value = true;
	try {
		const size = cornersSize(manualCorners.value);
		const outW = Math.min(900, Math.round(size.width));
		const outH = Math.max(
			1,
			Math.round(outW * (size.height / Math.max(1, size.width))),
		);
		const canvas = warpCorners(
			rawCanvas.value,
			manualCorners.value,
			outW,
			outH,
		);
		if (canvas) {
			manualAdjust.value = false;
			autoDetectionFailed.value = false;
			detectionMessage.value = null;
			showPreview(canvas);
		} else {
			detectionMessage.value = "Perspective transform failed";
		}
	} finally {
		adjusting.value = false;
	}
}

function cornerStyle(key: keyof Corners) {
	const raw = rawCanvas.value;
	const c = manualCorners.value?.[key];
	if (!raw || !c) return {};
	return {
		left: `${(c.x / raw.width) * 100}%`,
		top: `${(c.y / raw.height) * 100}%`,
		transform: "translate(-50%, -50%)",
	};
}

const quadPoints = computed(() => {
	const raw = rawCanvas.value;
	const c = manualCorners.value;
	if (!raw || !c) return "";
	return cornerKeys.map((k) => `${c[k].x},${c[k].y}`).join(" ");
});

function onAdjustPointerDown(e: PointerEvent, key: keyof Corners) {
	draggingCorner.value = key;
	(e.target as HTMLElement).setPointerCapture?.(e.pointerId);
	updateCornerPosition(e);
}

function onAdjustPointerMove(e: PointerEvent) {
	if (!draggingCorner.value) return;
	updateCornerPosition(e);
}

function onAdjustPointerUp(e: PointerEvent) {
	(e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
	draggingCorner.value = null;
}

function updateCornerPosition(e: PointerEvent) {
	const box = adjustBoxEl.value;
	const raw = rawCanvas.value;
	const key = draggingCorner.value;
	if (!box || !raw || !key || !manualCorners.value) return;

	const rect = box.getBoundingClientRect();
	manualCorners.value = {
		...manualCorners.value,
		[key]: {
			x: clamp(
				((e.clientX - rect.left) / rect.width) * raw.width,
				0,
				raw.width,
			),
			y: clamp(
				((e.clientY - rect.top) / rect.height) * raw.height,
				0,
				raw.height,
			),
		},
	};
}

// ── Actions ──────────────────────────────────────────────────
async function emitInsertImage() {
	if (!previewCanvas.value || extracting.value) return;
	extracting.value = true;
	try {
		const blob = await canvasToBlob(previewCanvas.value);
		const dataUrl = previewCanvas.value.toDataURL("image/png");
		emit("scanned", blob, dataUrl);
		close();
	} finally {
		extracting.value = false;
	}
}

function emitInsertText() {
	if (!ocrResult.value || !ocr) return;
	const blocks = ocr.parseStructure(ocrResult.value.text);
	const tiptapJson = ocr.blocksToTiptapJson(blocks);
	emit("insertText", ocrResult.value.text, tiptapJson);
	close();
}

function copyOcrText() {
	if (ocrResult.value?.text) {
		copyToClipboard(ocrResult.value.text);
	}
}

function reset() {
	previewCanvas.value = null;
	rawCanvas.value = null;
	ocrResult.value = null;
	extracting.value = false;
	manualAdjust.value = false;
	autoDetectionFailed.value = false;
	detectionMessage.value = null;
	lastAnalysis.value = null;
	draggingCorner.value = null;

	// Re-open camera if on camera tab
	if (activeTab.value === "camera") {
		openCamera();
	}
}

function dismissScannerError() {
	scannerError.value = null;
}

function onVisibilityChange(visible: boolean) {
	if (!visible) {
		stopCamera();
		stopHighlightLoop();
		cameraReady.value = false;
		previewCanvas.value = null;
		rawCanvas.value = null;
		ocrResult.value = null;
		manualAdjust.value = false;
		autoDetectionFailed.value = false;
		detectionMessage.value = null;
		lastAnalysis.value = null;
		detectionStatus.value = null;
		draggingCorner.value = null;
	}
	emit("update:show", visible);
}

function close() {
	onVisibilityChange(false);
}
</script>

<style scoped>
.corner-handle {
	position: absolute;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #16a34a;
	border: 2px solid #fff;
	box-shadow: 0 1px 4px rgb(0 0 0 / 0.45);
	cursor: grab;
	z-index: 2;
	user-select: none;
	-webkit-user-select: none;
}

.corner-handle:active {
	cursor: grabbing;
}
</style>