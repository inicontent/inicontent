import {
	getCachedThumbnail,
	cacheThumbnail,
} from "~/composables/useThumbnailCache";
import {
	wordExtensions,
	spreadsheetExtensions,
	officeExtensions,
} from "~/composables";

const MAX_FILE_SIZE_RENDER = 10 * 1024 * 1024; // 10MB limit for Tier 2 rendering
const THUMBNAIL_SIZE = 200;
const TIMEOUT_MS = 30000;

/**
 * Tier 1: Extract embedded thumbnail from OOXML ZIP archive.
 * Office files (docx, xlsx, pptx) are ZIP archives that often contain
 * a pre-generated thumbnail at `docProps/thumbnail.jpeg` (or .png).
 */
async function extractEmbeddedThumbnail(
	data: ArrayBuffer,
): Promise<string | undefined> {
	try {
		const JSZip = (await import("jszip")).default;
		const zip = await JSZip.loadAsync(data);

		// Look for thumbnail in docProps/
		const candidates = [
			"docProps/thumbnail.jpeg",
			"docProps/thumbnail.jpg",
			"docProps/thumbnail.png",
			"docProps/thumbnail.gif",
		];

		for (const path of candidates) {
			const file = zip.file(path);
			if (file) {
				const blob = await file.async("blob");
				const mimeType = path.endsWith(".png") ? "image/png" : "image/jpeg";

				// Convert to data URL via canvas for consistent sizing
				return await blobToThumbnailDataUrl(blob, mimeType);
			}
		}

		// Also check case-insensitive and alternative paths
		const allFiles = Object.keys(zip.files);
		for (const filePath of allFiles) {
			const lower = filePath.toLowerCase();
			if (
				lower.startsWith("docprops/thumbnail") &&
				(lower.endsWith(".jpeg") ||
					lower.endsWith(".jpg") ||
					lower.endsWith(".png"))
			) {
				const file = zip.file(filePath);
				if (file) {
					const blob = await file.async("blob");
					const mimeType = lower.endsWith(".png")
						? "image/png"
						: "image/jpeg";
					return await blobToThumbnailDataUrl(blob, mimeType);
				}
			}
		}
	} catch (error) {
		console.warn("Failed to extract embedded thumbnail:", error);
	}
	return undefined;
}

/**
 * Convert a Blob to a square thumbnail data URL.
 */
async function blobToThumbnailDataUrl(
	blob: Blob,
	mimeType: string,
): Promise<string | undefined> {
	return new Promise((resolve) => {
		const img = new Image();
		const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));

		img.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				canvas.width = THUMBNAIL_SIZE;
				canvas.height = THUMBNAIL_SIZE;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(undefined);
					return;
				}

				// Cover-crop: scale to fill the square, center the content
				const scale = Math.max(
					THUMBNAIL_SIZE / img.width,
					THUMBNAIL_SIZE / img.height,
				);
				const scaledW = img.width * scale;
				const scaledH = img.height * scale;
				const offsetX = (THUMBNAIL_SIZE - scaledW) / 2;
				const offsetY = (THUMBNAIL_SIZE - scaledH) / 2;

				ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
				resolve(canvas.toDataURL("image/jpeg", 0.7));
			} catch {
				resolve(undefined);
			} finally {
				URL.revokeObjectURL(url);
			}
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			resolve(undefined);
		};

		img.src = url;
	});
}

/**
 * Tier 2a: Render first page of DOCX and capture as thumbnail.
 */
async function renderDocxFirstPage(
	data: ArrayBuffer,
): Promise<string | undefined> {
	const container = document.createElement("div");
	try {
		// Offscreen container sized to A4 aspect ratio — clips to first page
		Object.assign(container.style, {
			position: "fixed",
			left: "-9999px",
			top: "0",
			width: "800px",
			height: "1100px",
			overflow: "hidden",
			background: "white",
			zIndex: "-1",
		});
		document.body.appendChild(container);

		const { renderAsync } = await import("docx-preview");
		await renderAsync(data, container, undefined, {
			breakPages: true,
			ignoreLastRenderedPageBreak: false,
			ignoreWidth: false,
			ignoreHeight: false,
			ignoreFonts: false,
			inWrapper: true,
			renderHeaders: false,
			renderFooters: false,
			renderFootnotes: false,
			renderEndnotes: false,
		});

		const html2canvas = (await import("html2canvas")).default;
		const canvas = await html2canvas(container, {
			width: 800,
			height: 1100,
			scale: 0.5, // render at half-res for speed
			useCORS: true,
			logging: false,
			backgroundColor: "#ffffff",
		});

		// Crop to square thumbnail
		const thumbCanvas = document.createElement("canvas");
		thumbCanvas.width = THUMBNAIL_SIZE;
		thumbCanvas.height = THUMBNAIL_SIZE;
		const ctx = thumbCanvas.getContext("2d");
		if (!ctx) return undefined;

		const scale = Math.max(
			THUMBNAIL_SIZE / canvas.width,
			THUMBNAIL_SIZE / canvas.height,
		);
		const scaledW = canvas.width * scale;
		const scaledH = canvas.height * scale;
		const offsetX = (THUMBNAIL_SIZE - scaledW) / 2;
		const offsetY = (THUMBNAIL_SIZE - scaledH) / 2;

		ctx.drawImage(canvas, offsetX, offsetY, scaledW, scaledH);
		return thumbCanvas.toDataURL("image/jpeg", 0.7);
	} catch (error) {
		console.warn("Failed to render DOCX first page:", error);
		return undefined;
	} finally {
		container.remove();
	}
}

/**
 * Tier 2b: Parse first rows of XLSX and capture as thumbnail.
 */
async function renderXlsxFirstPage(
	data: ArrayBuffer,
): Promise<string | undefined> {
	const container = document.createElement("div");
	try {
		const XLSX = await import("xlsx");
		const workbook = XLSX.read(data, {
			type: "array",
			sheetRows: 15, // only first 15 rows
		});

		const firstSheetName = workbook.SheetNames[0];
		if (!firstSheetName) return undefined;

		const sheet = workbook.Sheets[firstSheetName];
		if (!sheet) return undefined;

		const html = XLSX.utils.sheet_to_html(sheet);

		// Offscreen container with spreadsheet styling
		Object.assign(container.style, {
			position: "fixed",
			left: "-9999px",
			top: "0",
			width: "800px",
			height: "600px",
			overflow: "hidden",
			background: "white",
			zIndex: "-1",
			fontFamily: "monospace, sans-serif",
			fontSize: "12px",
		});
		document.body.appendChild(container);

		container.innerHTML = `<style>
			table { border-collapse: collapse; width: 100%; }
			td, th {
				border: 1px solid #d0d0d0;
				padding: 4px 8px;
				text-align: left;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 150px;
				font-size: 11px;
			}
			th { background: #f5f5f5; font-weight: 600; }
			tr:nth-child(even) { background: #fafafa; }
		</style>${html}`;

		const html2canvas = (await import("html2canvas")).default;
		const canvas = await html2canvas(container, {
			width: 800,
			height: 600,
			scale: 0.5,
			useCORS: true,
			logging: false,
			backgroundColor: "#ffffff",
		});

		// Crop to square thumbnail
		const thumbCanvas = document.createElement("canvas");
		thumbCanvas.width = THUMBNAIL_SIZE;
		thumbCanvas.height = THUMBNAIL_SIZE;
		const ctx = thumbCanvas.getContext("2d");
		if (!ctx) return undefined;

		const scale = Math.max(
			THUMBNAIL_SIZE / canvas.width,
			THUMBNAIL_SIZE / canvas.height,
		);
		const scaledW = canvas.width * scale;
		const scaledH = canvas.height * scale;
		const offsetX = (THUMBNAIL_SIZE - scaledW) / 2;
		const offsetY = (THUMBNAIL_SIZE - scaledH) / 2;

		ctx.drawImage(canvas, offsetX, offsetY, scaledW, scaledH);
		return thumbCanvas.toDataURL("image/jpeg", 0.7);
	} catch (error) {
		console.warn("Failed to render XLSX first page:", error);
		return undefined;
	} finally {
		container.remove();
	}
}

/**
 * Main entry point: generate a thumbnail for an Office document.
 * Uses a tiered strategy:
 *   Tier 1: Extract embedded thumbnail from OOXML ZIP (fast, any size)
 *   Tier 2: Render first page client-side (DOCX/XLSX only, ≤10MB)
 *   Tier 3: Return undefined → caller falls back to file-type icon
 */
export async function generateDocumentThumbnail(
	asset: Asset,
): Promise<string | undefined> {
	if (!officeExtensions.includes(asset.extension)) return undefined;

	const key = String(asset.id ?? asset.publicURL ?? asset.name);
	const cacheKey = `doc-${key}`;

	// Check cache first
	const cached = await getCachedThumbnail(cacheKey);
	if (cached) return cached;

	// Fetch file as ArrayBuffer with timeout
	let data: ArrayBuffer;
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
		const response = await fetch(asset.publicURL, {
			signal: controller.signal,
		});
		clearTimeout(timeoutId);

		if (!response.ok) return undefined;
		data = await response.arrayBuffer();
	} catch (error) {
		console.warn("Failed to fetch document for thumbnail:", error);
		return undefined;
	}

	// Tier 1: Try embedded thumbnail extraction (works for all OOXML, any size)
	const embedded = await extractEmbeddedThumbnail(data);
	if (embedded) {
		await cacheThumbnail(cacheKey, embedded);
		return embedded;
	}

	// Tier 2: Render first page (only for small files)
	if (asset.size && asset.size > MAX_FILE_SIZE_RENDER) {
		console.warn(
			`Document too large (${Math.round(asset.size / 1024 / 1024)}MB) for first-page rendering. Skipping.`,
		);
		return undefined;
	}

	let rendered: string | undefined;

	if (wordExtensions.includes(asset.extension) && asset.extension !== "doc") {
		rendered = await renderDocxFirstPage(data);
	} else if (
		spreadsheetExtensions.includes(asset.extension) &&
		asset.extension !== "xls"
	) {
		rendered = await renderXlsxFirstPage(data);
	}
	// Legacy formats (doc, xls) and presentations (ppt, pptx without embedded thumb)
	// → return undefined, caller shows icon

	if (rendered) {
		await cacheThumbnail(cacheKey, rendered);
	}

	return rendered;
}
