/**
 * Document scanner composable powered by jscanify + OpenCV.js.
 *
 * The browser build of jscanify (jscanify/client) relies on a global `cv`
 * object, so OpenCV.js must be loaded first. We self-host it at
 * `/vendor/opencv.js` (its wasm is embedded as a base64 data-URI, so it
 * works offline and through the PWA service worker without extra parts).
 *
 * Everything is lazy: OpenCV.js (~9 MB) and jscanify are only downloaded
 * after `loadScanner()` is called (i.e. when the user clicks "Scan").
 *
 * Detection notes:
 *  - jscanify bluntly picks the largest Canny contour, which fails for
 *    small/low-contrast documents (e.g. an ID card on a busy desk).
 *    `analyzePaper()` adds validation (area share, frame margin, aspect
 *    ratio) and `startHighlightLoop()` color-codes the overlay so the
 *    user gets live guidance ("move closer", "detected", …).
 *  - `smartExtract()` preserves the document's true aspect ratio.
 *  - `warpCorners()` applies a perspective transform from manual corners,
 *    an escape hatch when auto-detection keeps failing.
 *
 * Designed so it can be extracted into any Vue 3 project (e.g. an
 * ID-card scanner side project).
 */
import { onBeforeUnmount, shallowRef } from "vue";

declare global {
	interface Window {
		cv?: any;
	}
}

export interface Point {
	x: number;
	y: number;
}

export interface Corners {
	topLeft: Point;
	topRight: Point;
	bottomLeft: Point;
	bottomRight: Point;
}

export interface PaperAnalysis {
	/** whether a plausible document quad was found */
	detected: boolean;
	corners: Corners | null;
	/** contour area / frame area (0..1) */
	areaRatio: number;
	/** width/height of the detected quad (0 when no quad) */
	aspectRatio: number;
	reason:
		| "ok"
		| "not-loaded"
		| "no-contour"
		| "too-small"
		| "hits-frame-edge"
		| "bad-aspect"
		| "error";
}

/** jscanify corner point names → normalized {topLeft,topRight,bottomLeft,bottomRight} */
function normalizeCorners(jCorners: any, imgW: number, imgH: number): Corners {
	const src = jCorners as {
		topLeftCorner: Point;
		topRightCorner: Point;
		bottomLeftCorner: Point;
		bottomRightCorner: Point;
	};
	const bounds = (p: Point | undefined): Point | null => {
		if (!p) return null;
		return {
			x: Math.max(0, Math.min(imgW, p.x)),
			y: Math.max(0, Math.min(imgH, p.y)),
		};
	};
	return {
		topLeft: bounds(src.topLeftCorner)!,
		topRight: bounds(src.topRightCorner)!,
		bottomLeft: bounds(src.bottomLeftCorner)!,
		bottomRight: bounds(src.bottomRightCorner)!,
	};
}

export function useScanner() {
	const scanner = shallowRef<{ [key: string]: any } | null>(null);
	const opencvLoaded = ref(false);
	const loading = ref(false);
	const error = ref<string | null>(null);

	/** Track in-flight load Promise so concurrent calls await the same load */
	let loadPromise: Promise<any> | null = null;

	/**
	 * Load OpenCV.js into the global `cv` via a <script> tag.
	 * Resolves once the runtime is initialized.
	 */
	function loadOpenCV(src = "/vendor/opencv.js"): Promise<void> {
		return new Promise((resolve, reject) => {
			// Already loaded?
			if (window.cv?.getBuildInformation) {
				resolve();
				return;
			}

			const script = document.createElement("script");
			script.src = src;
			script.async = true;
			script.onload = () => {
				const cvGlobal = window.cv;
				if (!cvGlobal) {
					reject(new Error("OpenCV.js loaded but `cv` global is missing"));
					return;
				}
				// Some builds call onRuntimeInitialized immediately, some need wait
				if (cvGlobal.getBuildInformation) {
					resolve();
				} else if (cvGlobal.onRuntimeInitialized) {
					cvGlobal.onRuntimeInitialized = () => resolve();
				} else {
					// Fallback: poll briefly
					const interval = setInterval(() => {
						if (cvGlobal.getBuildInformation) {
							clearInterval(interval);
							resolve();
						}
					}, 500);
				}
			};
			script.onerror = () =>
				reject(new Error(`Failed to load OpenCV.js from ${src}`));
			document.head.appendChild(script);
		});
	}

	/**
	 * Dynamically load OpenCV.js + jscanify (client build).
	 * Safe to call multiple times – subsequent calls await the same load.
	 */
	async function loadScanner(): Promise<void> {
		if (scanner.value || opencvLoaded.value) return;
		if (loadPromise) return loadPromise;

		loading.value = true;
		error.value = null;

		loadPromise = (async () => {
			try {
				await loadOpenCV();
				opencvLoaded.value = true;

				const module = await import("jscanify/client");
				const JScanify = module.default ?? module;

				if (!JScanify) throw new Error("jscanify failed to load");
				scanner.value = new JScanify();
			} catch (e: any) {
				error.value = e?.message ?? "Failed to load document scanner";
				loadPromise = null;
				throw e;
			} finally {
				loading.value = false;
			}
		})();

		return loadPromise;
	}

	// ── Camera helpers ────────────────────────────────────────────

	let currentStream: MediaStream | null = null;
	let highlightRAF: number | null = null;

	/**
	 * Start the device camera (rear-facing on mobile).
	 * Returns the MediaStream so the caller can attach it to a <video> element.
	 */
	async function startCamera(): Promise<MediaStream> {
		if (currentStream) stopCamera();

		const mediaDevices = navigator.mediaDevices;
		if (!mediaDevices?.getUserMedia) {
			// Safari/iPhone removes mediaDevices entirely on insecure (HTTP)
			// origins — show a helpful message instead of a JS crash.
			throw new Error(
				window.isSecureContext === false
					? "Camera requires a secure (HTTPS) connection. Open the app via https on this device, or use the Upload tab instead."
					: "Camera is not supported in this browser.",
			);
		}

		const stream = await mediaDevices.getUserMedia({
			video: {
				facingMode: "environment",
				width: { ideal: 1920 },
				height: { ideal: 1080 },
			},
			audio: false,
		});

		currentStream = stream;
		return stream;
	}

	/**
	 * Stop all tracks on the current camera stream.
	 */
	function stopCamera(): void {
		stopHighlightLoop();
		if (currentStream) {
			for (const track of currentStream.getTracks()) track.stop();
			currentStream = null;
		}
	}

	// ── Paper analysis ───────────────────────────────────────────

	/** Distance between two points */
	function dist(a: Point, b: Point): number {
		return Math.hypot(b.x - a.x, b.y - a.y);
	}

	/**
	 * Detect a document quad in the source and validate it.
	 *
	 * Unlike jscanify's bare `findPaperContour` (largest contour wins),
	 * this checks that the detected quad:
	 *  1. covers a meaningful share of the frame (≥ minAreaRatio)
	 *  2. doesn't run along the frame edges (corners have a margin)
	 *  3. has a plausible aspect ratio for a document/card
	 *
	 * @returns PaperAnalysis with normalized corners (image coordinates)
	 */
	function analyzePaper(
		source: CanvasImageSource,
		opts: { minAreaRatio?: number; maxAreaRatio?: number } = {},
	): PaperAnalysis {
		const { minAreaRatio = 0.06, maxAreaRatio = 0.98 } = opts;

		const empty: PaperAnalysis = {
			detected: false,
			corners: null,
			areaRatio: 0,
			aspectRatio: 0,
			reason: "not-loaded",
		};

		if (!scanner.value || !window.cv) return empty;

		try {
			const img = window.cv.imread(source);
			const imgW = img.cols;
			const imgH = img.rows;
			const contour = scanner.value.findPaperContour(img);
			img.delete();

			if (!contour) return { ...empty, reason: "no-contour" };

			const area = window.cv.contourArea(contour);
			const areaRatio = imgW * imgH > 0 ? area / (imgW * imgH) : 0;

			if (areaRatio < minAreaRatio) {
				contour.delete();
				return { ...empty, areaRatio, reason: "too-small" };
			}
			if (areaRatio > maxAreaRatio) {
				contour.delete();
				return { ...empty, areaRatio, reason: "hits-frame-edge" };
			}

			const jCorners = scanner.value.getCornerPoints(contour);
			contour.delete();
			const corners = normalizeCorners(jCorners ?? {}, imgW, imgH);

			// All four corners required
			if (
				!corners.topLeft ||
				!corners.topRight ||
				!corners.bottomLeft ||
				!corners.bottomRight
			) {
				return { ...empty, areaRatio, reason: "no-contour" };
			}

			// Frame margin: a corner glued to the image border means the
			// document was cut off — the transform would be garbage.
			const marginX = imgW * 0.01;
			const marginY = imgH * 0.01;
			const hitsEdge = Object.values(corners).some(
				(p) =>
					p.x <= marginX ||
					p.y <= marginY ||
					p.x >= imgW - marginX ||
					p.y >= imgH - marginY,
			);
			if (hitsEdge) {
				return { ...empty, areaRatio, reason: "hits-frame-edge" };
			}

			// Aspect ratio from average opposite edge lengths
			const top = dist(corners.topLeft, corners.topRight);
			const bottom = dist(corners.bottomLeft, corners.bottomRight);
			const left = dist(corners.topLeft, corners.bottomLeft);
			const right = dist(corners.topRight, corners.bottomRight);
			const quadW = (top + bottom) / 2;
			const quadH = (left + right) / 2;
			const aspectRatio = quadH > 0 ? quadW / quadH : 0;

			// Documents/cards are roughly 0.4x – 2.8x. Raw edge blobs that
			// slip through area checks rarely land in this band.
			if (aspectRatio < 0.4 || aspectRatio > 2.8) {
				return { ...empty, areaRatio, aspectRatio, reason: "bad-aspect" };
			}

			return {
				detected: true,
				corners,
				areaRatio,
				aspectRatio,
				reason: "ok",
			};
		} catch {
			return { ...empty, reason: "error" };
		}
	}

	/**
	 * User-friendly guidance for a failed analysis.
	 */
	function analysisHint(analysis: PaperAnalysis): string {
		switch (analysis.reason) {
			case "ok":
				return "Document detected";
			case "not-loaded":
				return "Scanner is loading…";
			case "no-contour":
				return "No document found — place it on a plain, contrasting surface";
			case "too-small":
				return "Move the document closer so it fills most of the frame";
			case "hits-frame-edge":
				return "The document touches the frame edge — center it with some margin";
			case "bad-aspect":
				return "Detection looks wrong — center the document with contrast";
			case "error":
				return "Detection error — try again";
			default:
				return "Position the document in view";
		}
	}

	// ── Live overlay ─────────────────────────────────────────────

	/**
	 * Pipe camera frames to an overlay canvas with a color-coded document
	 * highlight and a throttled detection-status callback.
	 *
	 * Color codes:
	 *  - green  #16a34a → confidently detected
	 *  - orange #f59e0b → detected but weak (small / near edge)
	 *  - red    #dc2626 → no document
	 *
	 * `onStatus` receives a `{ label, color, ok }` object roughly every
	 * `statusEvery` frames.
	 */
	function startHighlightLoop(
		videoEl: HTMLVideoElement,
		overlayCanvas: HTMLCanvasElement,
		onStatus?: (status: { label: string; color: string; ok: boolean }) => void,
		statusEvery = 6,
	): void {
		const ctx = overlayCanvas.getContext("2d")!;

		let frame = 0;
		let lastStatus: string | null = null;

		const tick = () => {
			if (!currentStream || !videoEl.videoWidth) {
				highlightRAF = requestAnimationFrame(tick);
				return;
			}

			// Keep canvas in sync with the video's intrinsic size
			if (
				overlayCanvas.width !== videoEl.videoWidth ||
				overlayCanvas.height !== videoEl.videoHeight
			) {
				overlayCanvas.width = videoEl.videoWidth;
				overlayCanvas.height = videoEl.videoHeight;
			}

			ctx.drawImage(videoEl, 0, 0);

			if (scanner.value) {
				const analysis = analyzePaper(overlayCanvas);
				if (frame % statusEvery === 0 && onStatus) {
					const label = analysisHint(analysis);
					if (label !== lastStatus) {
						lastStatus = label;
						let color = "#16a34a";
						let ok = true;
						if (!analysis.detected) {
							color = "#dc2626";
							ok = false;
						} else if (analysis.areaRatio < 0.15) {
							color = "#f59e0b";
						}
						onStatus({ label, color, ok });
					}
				}

				// Draw the detected quad (green/amber) instead of jscanify's
				// full-image highlight, so we stay on one canvas.
				if (analysis.corners) {
					const quad = [
						analysis.corners.topLeft,
						analysis.corners.topRight,
						analysis.corners.bottomRight,
						analysis.corners.bottomLeft,
					];
					ctx.strokeStyle =
						analysis.detected && analysis.areaRatio >= 0.15
							? "#16a34a"
							: "#f59e0b";
					ctx.lineWidth = Math.max(3, overlayCanvas.width * 0.005);
					ctx.beginPath();
					ctx.moveTo(quad[0].x, quad[0].y);
					for (let i = 1; i < 4; i++) ctx.lineTo(quad[i].x, quad[i].y);
					ctx.closePath();
					ctx.stroke();
				}
			}

			frame++;
			highlightRAF = requestAnimationFrame(tick);
		};

		highlightRAF = requestAnimationFrame(tick);
	}

	/**
	 * Stop the highlight loop without stopping the camera.
	 */
	function stopHighlightLoop(): void {
		if (highlightRAF !== null) {
			cancelAnimationFrame(highlightRAF);
			highlightRAF = null;
		}
	}

	/**
	 * Draw the current video frame to an offscreen canvas and return it.
	 */
	function captureFrame(videoEl: HTMLVideoElement): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = videoEl.videoWidth;
		canvas.height = videoEl.videoHeight;
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(videoEl, 0, 0);
		return canvas;
	}

	// ── Extraction ───────────────────────────────────────────────

	/**
	 * Detect the paper contour in a canvas/image element.
	 * Returns the contour (for getCornerPoints) or null.
	 */
	function detectPaper(source: CanvasImageSource): any | null {
		if (!scanner.value || !window.cv) return null;
		try {
			const img = window.cv.imread(source);
			const contour = scanner.value.findPaperContour(img);
			img.delete();
			if (contour) contour.delete();
			return contour;
		} catch {
			return null;
		}
	}

	/**
	 * Extract with perspective correction, preserving the document's
	 * true aspect ratio (derived from the detected quad edges).
	 * Falls back to a best-effort fixed-ratio extraction when the
	 * quad is unknown.
	 *
	 * @returns { canvas, analysis } — canvas is null when not detected
	 */
	function smartExtract(
		source: CanvasImageSource,
		maxWidth = 900,
	): { canvas: HTMLCanvasElement | null; analysis: PaperAnalysis } {
		const analysis = analyzePaper(source);

		if (!analysis.detected || !analysis.corners) {
			return { canvas: null, analysis };
		}

		const c = analysis.corners;
		const top = dist(c.topLeft, c.topRight);
		const bottom = dist(c.bottomLeft, c.bottomRight);
		const left = dist(c.topLeft, c.bottomLeft);
		const right = dist(c.topRight, c.bottomRight);
		const quadW = Math.max(1, (top + bottom) / 2);
		const quadH = Math.max(1, (left + right) / 2);

		const outW = Math.min(maxWidth, Math.round(quadW));
		const outH = Math.max(1, Math.round(outW * (quadH / quadW)));

		const canvas = warpCorners(source, analysis.corners, outW, outH);
		return { canvas, analysis };
	}

	/**
	 * Warp-perspective a source into an output canvas using explicit
	 * corner points (image coordinates). The core escape hatch for
	 * documents auto-detection keeps failing on (e.g. ID cards).
	 */
	function warpCorners(
		source: CanvasImageSource,
		corners: Corners,
		outWidth: number,
		outHeight: number,
	): HTMLCanvasElement | null {
		if (!window.cv) return null;
		try {
			const img = window.cv.imread(source);
			const srcTri = window.cv.matFromArray(4, 1, window.cv.CV_32FC2, [
				corners.topLeft.x,
				corners.topLeft.y,
				corners.topRight.x,
				corners.topRight.y,
				corners.bottomLeft.x,
				corners.bottomLeft.y,
				corners.bottomRight.x,
				corners.bottomRight.y,
			]);
			const dstTri = window.cv.matFromArray(4, 1, window.cv.CV_32FC2, [
				0,
				0,
				outWidth,
				0,
				0,
				outHeight,
				outWidth,
				outHeight,
			]);
			const M = window.cv.getPerspectiveTransform(srcTri, dstTri);
			const warpedDst = new window.cv.Mat();
			window.cv.warpPerspective(
				img,
				warpedDst,
				M,
				new window.cv.Size(outWidth, outHeight),
				window.cv.INTER_LINEAR,
				window.cv.BORDER_CONSTANT,
				new window.cv.Scalar(),
			);
			const canvas = document.createElement("canvas");
			window.cv.imshow(canvas, warpedDst);
			img.delete();
			srcTri.delete();
			dstTri.delete();
			M.delete();
			warpedDst.delete();
			return canvas;
		} catch {
			return null;
		}
	}

	/**
	 * Standard corner layout for the full source bounds (used to seed
	 * the manual corner editor when nothing was detected).
	 */
	function fullFrameCorners(imgW: number, imgH: number): Corners {
		return {
			topLeft: { x: 0, y: 0 },
			topRight: { x: imgW, y: 0 },
			bottomLeft: { x: 0, y: imgH },
			bottomRight: { x: imgW, y: imgH },
		};
	}

	/**
	 * Average length of the opposite edges of a corner quad.
	 * Used to preserve the document's aspect ratio when warping.
	 */
	function cornersSize(corners: Corners): { width: number; height: number } {
		const top = dist(corners.topLeft, corners.topRight);
		const bottom = dist(corners.bottomLeft, corners.bottomRight);
		const left = dist(corners.topLeft, corners.bottomLeft);
		const right = dist(corners.topRight, corners.bottomRight);
		return {
			width: (top + bottom) / 2,
			height: (left + right) / 2,
		};
	}

	/**
	 * Render the source canvas into an element (used to seed the
	 * manual corner editor).
	 */
	function canvasToDataURL(
		canvas: HTMLCanvasElement,
		type = "image/png",
	): string {
		return canvas.toDataURL(type);
	}

	/**
	 * Convert a canvas to a Blob (PNG by default).
	 */
	function canvasToBlob(
		canvas: HTMLCanvasElement,
		type = "image/png",
		quality?: number,
	): Promise<Blob> {
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(b) => {
					if (b) resolve(b);
					else reject(new Error("Failed to convert canvas to blob"));
				},
				type,
				quality,
			);
		});
	}

	// ── Cleanup ───────────────────────────────────────────────────

	onBeforeUnmount(() => {
		stopCamera();
	});

	return {
		/** jscanify instance (null until loadScanner resolves) */
		scanner,
		/** True while OpenCV.js is being downloaded */
		loading,
		/** True after OpenCV.js is ready */
		opencvLoaded,
		/** Error message if loading failed */
		error,

		loadScanner,
		startCamera,
		stopCamera,
		startHighlightLoop,
		stopHighlightLoop,
		captureFrame,
		detectPaper,
		analyzePaper,
		analysisHint,
		smartExtract,
		warpCorners,
		fullFrameCorners,
		cornersSize,
		canvasToBlob,
		canvasToDataURL,
	};
}
