<template>
    <!-- Image -->
    <NImage v-if="asset.publicURL && imageExtensions.includes(asset.extension)" class="asset" :src="asset.publicURL"
        :intersectionObserverOptions lazy :renderToolbar="(props) => renderToolbar(props, asset)"
        @click="handleAssetClick" :width="size" :height="size" />

    <!-- PDF with thumbnail -->
    <NImage v-else-if="asset.extension === 'pdf' && pdfThumbs[assetKey]" class="asset" :src="pdfThumbs[assetKey]"
        :intersectionObserverOptions lazy preview-disabled @click="handleAssetClick" :width="size" :height="size" />

    <!-- PDF generating thumbnail -->
    <NSpin v-else-if="asset.extension === 'pdf'" :show="generatingPdf[assetKey]" size="small">
        <NIcon class="asset" v-intersect="() => !pdfThumbs[assetKey] && generatePdfThumb()"
            @click="handleAssetClick" :width="size" :height="size">
            <LazyAssetIcon :type="asset.type" class="icon" />
        </NIcon>
    </NSpin>

    <!-- Video with thumbnail -->
    <NImage v-else-if="videoExtensions.includes(asset.extension) && videoThumbs[assetKey]" class="asset"
        :src="videoThumbs[assetKey]" :intersectionObserverOptions lazy preview-disabled @click="handleAssetClick" :width="size" :height="size" />

    <!-- Video generating thumbnail -->
    <NSpin v-else-if="videoExtensions.includes(asset.extension)"
        :show="videoExtensions.includes(asset.extension) && generatingVideo[assetKey]" size="small">
        <NIcon class="asset"
            v-intersect="() => videoExtensions.includes(asset.extension) && !videoThumbs[assetKey] && generateVideoThumb()"
                @click="handleAssetClick" :size>
            <LazyAssetIcon :type="asset.type" class="icon" />
        </NIcon>
    </NSpin>

    <!-- Other file types as icon -->
    <NIcon v-else class="asset" @click="handleAssetClick" :size="size">
        <LazyAssetIcon :type="asset.type" class="icon" />
    </NIcon>
</template>

<script lang="ts" setup>
import type { ImageRenderToolbarProps } from "naive-ui";
import type { Directive, VNodeChild } from "vue";
import { Icon, NIcon, NTooltip } from "#components";
import { imageExtensions, videoExtensions } from "~/composables";
import {
	getCachedThumbnail,
	cacheThumbnail,
} from "~/composables/useThumbnailCache";

interface Props {
	asset: Asset;
	containerSelector?: string | null;
	size?: number;
}

const { asset, containerSelector, size } = defineProps<Props>();

const intersectionObserverOptions = containerSelector
	? {
			root: containerSelector,
		}
	: undefined;
// Video and PDF thumbnail generation state
const videoThumbs = reactive<Record<string, string | undefined>>({});
const generatingVideo = reactive<Record<string, boolean>>({});
const pdfThumbs = reactive<Record<string, string | undefined>>({});
const generatingPdf = reactive<Record<string, boolean>>({});

const assetKey = computed(() =>
	String(asset.id ?? asset.publicURL ?? asset.name),
);

function assetKeyValue(asset: Asset): string {
	return String(asset.id ?? asset.publicURL ?? asset.name);
}

async function generateVideoThumb(timeSec = 0.5) {
	if (!videoExtensions.includes(asset.extension)) return;
	const key = assetKeyValue(asset);
	if (videoThumbs[key] !== undefined) return videoThumbs[key];

	try {
		generatingVideo[key] = true;

		// Try to get from cache first
		const cached = await getCachedThumbnail(`video-${key}`);
		if (cached) {
			videoThumbs[key] = cached;
			return cached;
		}

		const dataUrl = await new Promise<string | undefined>((resolve) => {
			const video = document.createElement("video");
			// Requires proper CORS headers on the asset URL
			video.crossOrigin = "anonymous";
			video.preload = "metadata";
			video.muted = true;
			video.src = asset.publicURL;

			const cleanup = () => {
				video.removeEventListener("loadeddata", onLoaded);
				video.removeEventListener("seeked", onSeeked);
				video.removeEventListener("error", onError);
			};
			const onError = () => {
				cleanup();
				resolve(undefined);
			};
			const onLoaded = () => {
				try {
					const target = Number.isFinite(video.duration)
						? Math.min(timeSec, Math.max(0, video.duration - 0.1))
						: 0;
					if (target > 0) {
						video.currentTime = target;
					} else {
						onSeeked();
					}
				} catch {
					onError();
				}
			};
			const onSeeked = () => {
				try {
					const canvas = document.createElement("canvas");
					canvas.width = video.videoWidth || 320;
					canvas.height = video.videoHeight || 180;
					const ctx = canvas.getContext("2d");
					if (!ctx) {
						cleanup();
						resolve(undefined);
						return;
					}
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					const url = canvas.toDataURL("image/jpeg", 0.7);
					cleanup();
					resolve(url);
				} catch {
					cleanup();
					resolve(undefined);
				}
			};

			video.addEventListener("loadeddata", onLoaded, { once: true });
			video.addEventListener("seeked", onSeeked, { once: true });
			video.addEventListener("error", onError, { once: true });
		});

		videoThumbs[key] = dataUrl;

		// Cache the generated thumbnail
		if (dataUrl) await cacheThumbnail(`video-${key}`, dataUrl);
	} catch {
		videoThumbs[key] = undefined;
	}
	generatingVideo[key] = false;
	return videoThumbs[key];
}

async function generatePdfThumb() {
	if (asset.extension !== "pdf") return;
	const key = assetKeyValue(asset);
	if (pdfThumbs[key] !== undefined) return pdfThumbs[key];

	try {
		generatingPdf[key] = true;

		// Try to get from cache first
		const cached = await getCachedThumbnail(`pdf-${key}`);
		if (cached) {
			pdfThumbs[key] = cached;
			return cached;
		}

		// Check file size before attempting to load
		// Limit to 50MB to prevent memory issues with large PDFs
		const maxFileSizeBytes = 50 * 1024 * 1024;
		if (asset.size && asset.size > maxFileSizeBytes) {
			console.warn(
				`PDF file too large (${Math.round(asset.size / 1024 / 1024)}MB). Skipping thumbnail generation.`,
			);
			pdfThumbs[key] = undefined;
			return;
		}

		// Dynamically import pdfjs-dist to avoid bundling issues
		const pdfjsLib = await import("pdfjs-dist");
		// Set worker source from CDN to avoid loading local worker file
		pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

		// Create a timeout promise to abort if loading takes too long
		const timeoutPromise: Promise<never> = new Promise((_resolve, reject) => {
			setTimeout(() => reject(new Error("PDF loading timeout")), 30000); // 30 second timeout
		});

		const pdf = await Promise.race([
			pdfjsLib.getDocument(asset.publicURL as string)
				.promise as Promise<unknown>,
			timeoutPromise,
		]);

		if (!pdf || !(pdf as any).numPages || (pdf as any).numPages === 0) {
			pdfThumbs[key] = undefined;
			return;
		}

		const page = await Promise.race([
			(pdf as any).getPage(1) as Promise<unknown>,
			timeoutPromise,
		]);

		// Create a smaller square thumbnail (200x200px)
		const thumbnailSize = 200;
		const viewport = (page as any).getViewport({ scale: 1 });

		// Calculate scale to cover the square (like CSS cover) - use MAX instead of MIN
		const scale = Math.max(
			thumbnailSize / viewport.width,
			thumbnailSize / viewport.height,
		);
		const scaledViewport = (page as any).getViewport({ scale });

		const canvas = document.createElement("canvas");
		// Make the canvas square
		canvas.width = thumbnailSize;
		canvas.height = thumbnailSize;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			pdfThumbs[key] = undefined;
			return;
		}

		// Center the scaled PDF content in the square canvas (crop excess)
		const offsetX = (thumbnailSize - scaledViewport.width) / 2;
		const offsetY = (thumbnailSize - scaledViewport.height) / 2;
		ctx.translate(offsetX, offsetY);

		await Promise.race([
			(page as any).render({
				canvasContext: ctx,
				viewport: scaledViewport,
				canvas: canvas,
			}).promise as Promise<unknown>,
			timeoutPromise,
		]);

		const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
		pdfThumbs[key] = dataUrl;

		// Cache the generated thumbnail
		if (dataUrl) await cacheThumbnail(`pdf-${key}`, dataUrl);
	} catch (error) {
		console.warn(
			`Failed to generate PDF thumbnail for ${asset.publicURL}:`,
			error,
		);
		pdfThumbs[key] = undefined;
	} finally {
		generatingPdf[key] = false;
	}
	return pdfThumbs[key];
}

// Intersection observer directive for lazy actions
const vIntersect: Directive<HTMLElement, () => void> = {
	mounted(el, binding) {
		const callback = binding.value;
		if (typeof callback !== "function") return;
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					callback();
					observer.disconnect();
					break;
				}
			}
		});
		observer.observe(el);
		// store on element for potential cleanup
		(el as any).__io__ = observer;
	},
	unmounted(el) {
		const observer: IntersectionObserver | undefined = (el as any).__io__;
		if (observer) observer.disconnect();
		delete (el as any).__io__;
	},
};

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
			event?.preventDefault();
			window.open(file.publicURL as string, "_blank");
			close?.props?.onClick?.();
		};
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
	];
};

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const currentPreviewAsset = useState<Asset | undefined>("currentPreviewAsset");
const requiresPreviewDownloadShortcut = computed(
	() => asset.extension === "pdf" || videoExtensions.includes(asset.extension),
);
const isPreviewingCurrentAsset = computed(() => {
	const previewAsset = currentPreviewAsset.value;
	if (!previewAsset) return false;
	return assetKeyValue(previewAsset) === assetKey.value;
});
const shouldListenForDownloadShortcut = computed(
	() => requiresPreviewDownloadShortcut.value && isPreviewingCurrentAsset.value,
);
let removePreviewShortcut: (() => void) | undefined;

function handleAssetClick(event: MouseEvent) {
	if (
		asset.extension === "pdf" ||
		(!videoExtensions.includes(asset.extension) &&
			!imageExtensions.includes(asset.extension))
	)
		return window.open(asset.publicURL as string, "_blank");

	if (event.ctrlKey || event.metaKey) {
		event.preventDefault();
		event.stopPropagation();
		return window.open(asset.publicURL as string, "_blank");
	}
	return false;
}

async function triggerAssetDownload(file: Asset = asset) {
	if (!file.publicURL || typeof window === "undefined") return;
	const link = document.createElement("a");
	const defaultName = (() => {
		if (file.name) return file.name;
		try {
			const url = new URL(file.publicURL);
			const last = url.pathname.split("/").pop();
			return last || "asset";
		} catch {
			return "asset";
		}
	})();
	link.download = defaultName;
	document.body.appendChild(link);

	const downloadByOpening = () => {
		const newTab = window.open(file.publicURL as string, "_blank", "noopener");
		if (newTab) {
			// Give the browser a moment to trigger the download before closing the tab
			window.setTimeout(() => {
				try {
					newTab.close();
				} catch {
					/* Ignore cross-origin close errors */
				}
			}, 2000);
		}
	};

	try {
		link.href = file.publicURL as string;
		link.rel = "noopener";
		link.click();
	} catch (error) {
		console.warn("Falling back to opening asset in new tab", error);
		downloadByOpening();
	} finally {
		document.body.removeChild(link);
	}
}

function registerPreviewShortcut() {
	if (!import.meta.client || removePreviewShortcut) return;
	const handler = (event: KeyboardEvent) => {
		if (!(event.metaKey || event.ctrlKey)) return;
		if (event.key?.toLowerCase() !== "s") return;
		event.preventDefault();
		void triggerAssetDownload(currentPreviewAsset.value ?? asset);
	};
	window.addEventListener("keydown", handler);
	removePreviewShortcut = () => window.removeEventListener("keydown", handler);
}

function cleanupPreviewShortcut() {
	if (!removePreviewShortcut) return;
	removePreviewShortcut();
	removePreviewShortcut = undefined;
}

watch(
	shouldListenForDownloadShortcut,
	(shouldListen) => {
		if (!import.meta.client) return;
		if (shouldListen) {
			registerPreviewShortcut();
		} else {
			cleanupPreviewShortcut();
		}
	},
	{ immediate: true },
);

onBeforeUnmount(() => {
	cleanupPreviewShortcut();
});

async function showPreview() {
	if (
		imageExtensions.includes(asset.extension) ||
		videoExtensions.includes(asset.extension)
	) {
		currentPreviewAsset.value = asset;
		Loading.value.previewModal = true;
	}
}
</script>