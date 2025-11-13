<template>
    <!-- Image -->
    <NImage v-if="imageExtensions.includes(asset.extension)" class="asset" :src="asset.publicURL"
        :intersectionObserverOptions lazy :renderToolbar="(props) => renderToolbar(props, asset)" />

    <!-- PDF with thumbnail -->
    <NImage v-else-if="asset.extension === 'pdf' && pdfThumbs[assetKey]" class="asset" :src="pdfThumbs[assetKey]"
        :intersectionObserverOptions lazy preview-disabled @click="showPreview" />

    <!-- PDF generating thumbnail -->
    <NSpin v-else-if="asset.extension === 'pdf'" :show="generatingPdf[assetKey]" size="small">
        <NIcon class="asset" v-intersect="() => !pdfThumbs[assetKey] && generatePdfThumb()">
            <LazyAssetIcon :type="asset.type" class="icon" />
        </NIcon>
    </NSpin>

    <!-- Video with thumbnail -->
    <NImage v-else-if="videoExtensions.includes(asset.extension) && videoThumbs[assetKey]" class="asset"
        :src="videoThumbs[assetKey]" :intersectionObserverOptions lazy preview-disabled @click="showPreview" />

    <!-- Video generating thumbnail -->
    <NSpin v-else-if="videoExtensions.includes(asset.extension)"
        :show="videoExtensions.includes(asset.extension) && generatingVideo[assetKey]" size="small">
        <NIcon class="asset"
            v-intersect="() => videoExtensions.includes(asset.extension) && !videoThumbs[assetKey] && generateVideoThumb()">
            <LazyAssetIcon :type="asset.type" class="icon" />
        </NIcon>
    </NSpin>

    <!-- Other file types as icon -->
    <NIcon v-else class="asset">
        <LazyAssetIcon :type="asset.type" class="icon" />
    </NIcon>
</template>

<script lang="ts" setup>
import type { ImageRenderToolbarProps } from "naive-ui"
import type { Directive, VNodeChild } from "vue"
import { Icon, NIcon, NTooltip } from "#components"
import { imageExtensions, videoExtensions } from "~/composables"
import {
    getCachedThumbnail,
    cacheThumbnail,
} from "~/composables/useThumbnailCache"

interface Props {
    asset: Asset
    containerSelector?: string | null
}

const { asset, containerSelector } = defineProps<Props>()

const intersectionObserverOptions = containerSelector ? {
    root: containerSelector
} : undefined
// Video and PDF thumbnail generation state
const videoThumbs = reactive<Record<string, string | undefined>>({})
const generatingVideo = reactive<Record<string, boolean>>({})
const pdfThumbs = reactive<Record<string, string | undefined>>({})
const generatingPdf = reactive<Record<string, boolean>>({})

const assetKey = computed(() => String(asset.id ?? asset.publicURL ?? asset.name))

function assetKeyValue(asset: Asset): string {
    return String(asset.id ?? asset.publicURL ?? asset.name)
}

async function generateVideoThumb(timeSec = 0.5) {
    if (!videoExtensions.includes(asset.extension)) return
    const key = assetKeyValue(asset)
    if (videoThumbs[key] !== undefined) return videoThumbs[key]

    try {
        generatingVideo[key] = true

        // Try to get from cache first
        const cached = await getCachedThumbnail(`video-${key}`)
        if (cached) {
            videoThumbs[key] = cached
            return cached
        }

        const dataUrl = await new Promise<string | undefined>((resolve) => {
            const video = document.createElement("video")
            // Requires proper CORS headers on the asset URL
            video.crossOrigin = "anonymous"
            video.preload = "metadata"
            video.muted = true
            video.src = asset.publicURL

            const cleanup = () => {
                video.removeEventListener("loadeddata", onLoaded)
                video.removeEventListener("seeked", onSeeked)
                video.removeEventListener("error", onError)
            }
            const onError = () => {
                cleanup()
                resolve(undefined)
            }
            const onLoaded = () => {
                try {
                    const target = Number.isFinite(video.duration)
                        ? Math.min(timeSec, Math.max(0, video.duration - 0.1))
                        : 0
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
                    const canvas = document.createElement("canvas")
                    canvas.width = video.videoWidth || 320
                    canvas.height = video.videoHeight || 180
                    const ctx = canvas.getContext("2d")
                    if (!ctx) {
                        cleanup()
                        resolve(undefined)
                        return
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                    const url = canvas.toDataURL("image/jpeg", 0.8)
                    cleanup()
                    resolve(url)
                } catch {
                    cleanup()
                    resolve(undefined)
                }
            }

            video.addEventListener("loadeddata", onLoaded, { once: true })
            video.addEventListener("seeked", onSeeked, { once: true })
            video.addEventListener("error", onError, { once: true })
        })

        videoThumbs[key] = dataUrl

        // Cache the generated thumbnail
        if (dataUrl) {
            await cacheThumbnail(`video-${key}`, dataUrl)
        }
    } catch {
        videoThumbs[key] = undefined
    }
    generatingVideo[key] = false
    return videoThumbs[key]
}

async function generatePdfThumb() {
    if (asset.extension !== "pdf") return
    const key = assetKeyValue(asset)
    if (pdfThumbs[key] !== undefined) return pdfThumbs[key]


    try {
        generatingPdf[key] = true

        // Try to get from cache first
        const cached = await getCachedThumbnail(`pdf-${key}`)
        if (cached) {
            pdfThumbs[key] = cached
            return cached
        }

        // Dynamically import pdfjs-dist to avoid bundling issues
        const pdfjsLib = await import("pdfjs-dist")
        // Set worker source from CDN to avoid loading local worker file
        // pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

        const pdf = await pdfjsLib.getDocument(asset.publicURL).promise
        if (!pdf || pdf.numPages === 0) {
            pdfThumbs[key] = undefined
            return
        }

        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1.5 })

        const canvas = document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
            pdfThumbs[key] = undefined
            return
        }

        await page.render({
            canvasContext: ctx,
            viewport: viewport,
            canvas: canvas,
        }).promise

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        pdfThumbs[key] = dataUrl

        // Cache the generated thumbnail
        if (dataUrl) {
            await cacheThumbnail(`pdf-${key}`, dataUrl)
        }
    } catch (error) {
        console.warn(
            `Failed to generate PDF thumbnail for ${asset.publicURL}:`,
            error,
        )
        pdfThumbs[key] = undefined
    } finally {
        generatingPdf[key] = false
    }
    return pdfThumbs[key]
}

// Intersection observer directive for lazy actions
const vIntersect: Directive<HTMLElement, () => void> = {
    mounted(el, binding) {
        const callback = binding.value
        if (typeof callback !== "function") return
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
    },
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

const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const currentPreviewAsset = useState<Asset | undefined>("currentPreviewAsset")
const pdfObjectUrl = useState<string | undefined>("pdfObjectUrl")

async function loadPdfObjectUrl(url: string) {
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Network response was not ok')
        const blob = await res.blob()
        if (blob.type !== 'application/pdf') throw new Error('Not a PDF')
        if (pdfObjectUrl.value) URL.revokeObjectURL(pdfObjectUrl.value)
        pdfObjectUrl.value = URL.createObjectURL(blob)
    } catch (e) {
        // Fallback: keep spinner off and avoid blocking UI
        Loading.value.previewModal = false
    }
}

async function showPreview() {
    if (imageExtensions.includes(asset.extension) || videoExtensions.includes(asset.extension) || asset.extension === "pdf") {
        currentPreviewAsset.value = asset
        Loading.value.previewModal = true
        if (asset.extension === 'pdf')
            await loadPdfObjectUrl(asset.publicURL)
    }
}
</script>