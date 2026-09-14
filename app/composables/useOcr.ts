import type { Worker } from "tesseract.js";

/** OCR result for a single word with its bounding box */
export interface OcrWord {
	text: string;
	confidence: number;
	bbox: { x0: number; y0: number; x1: number; y1: number };
}

/** Full OCR recognition result */
export interface OcrResult {
	text: string;
	confidence: number;
	words: OcrWord[];
}

/** A block of structured content parsed from OCR text */
export interface OcrBlock {
	type: "heading" | "paragraph" | "bulletList" | "numberedList";
	level?: 1 | 2;
	items?: string[];
	text?: string;
}

/** Languages supported by the platform */
export type OcrLanguage = "eng" | "ara" | "fra" | "spa";

/** Maps UI locale codes to tesseract language codes */
const LOCALE_MAP: Record<string, OcrLanguage> = {
	en: "eng",
	ar: "ara",
	fr: "fra",
	es: "spa",
};

/**
 * OCR composable powered by tesseract.js.
 *
 * Lazily creates a worker on first recognition and reuses it.
 * Returns structured text + a parseStructure() helper that converts
 * raw OCR output into heading / paragraph / list blocks suitable
 * for Tiptap's insertContent().
 *
 * Designed to be extracted into any Vue 3 project.
 */
export function useOcr() {
	let workerPromise: Promise<Worker> | null = null;

	const loading = ref(false);
	const progress = ref(0);
	const language = ref<OcrLanguage>("eng");

	/** Set OCR language using a locale code (en, ar, fr, es) and re-init the worker */
	async function setLanguage(locale: string) {
		const next = LOCALE_MAP[locale] ?? "eng";
		if (next === language.value) return;
		language.value = next;
		if (workerPromise) await reinitWorker();
	}

	/** Ensure the tesseract worker is initialised (lazy-loads tesseract.js) */
	async function ensureWorker(): Promise<Worker> {
		if (workerPromise) return workerPromise;

		workerPromise = (async () => {
			const { createWorker } = await import("tesseract.js");
			const w = await createWorker(language.value, undefined, {
				logger: (m) => {
					if (
						m.status === "recognizing text" &&
						typeof m.progress === "number"
					) {
						progress.value = Math.round(m.progress * 100);
					}
				},
			});
			return w;
		})();

		return workerPromise;
	}

	/**
	 * Re-initialise the worker when the language changes.
	 */
	async function reinitWorker(): Promise<void> {
		if (workerPromise) {
			const old = await workerPromise;
			await old.terminate();
			workerPromise = null;
		}
		await ensureWorker();
	}

	/**
	 * Run OCR on an image / canvas / data-URL.
	 *
	 * @param source  - HTMLCanvasElement, HTMLImageElement, HTMLVideoElement, or string URL
	 * @returns       - Parsed text, confidence, and per-word bounding boxes
	 */
	async function recognize(
		source: CanvasImageSource | string,
	): Promise<OcrResult> {
		loading.value = true;
		progress.value = 0;

		try {
			const worker = await ensureWorker();

			const { data } = await worker.recognize(source as any);

			const words: OcrWord[] = (data.words ?? []).map((w: any) => ({
				text: w.text,
				confidence: w.confidence,
				bbox: w.bbox,
			}));

			return {
				text: data.text.trim(),
				confidence: data.confidence,
				words,
			};
		} finally {
			loading.value = false;
			progress.value = 100;
		}
	}

	/**
	 * Parse raw OCR text into structured blocks for Tiptap.
	 *
	 * Detection rules:
	 *  - ALL-CAPS line (≥3 chars, no digits) → heading (h1 if ≤40 chars, h2 otherwise)
	 *  - Line starting with `- `, `• `, `* ` → bullet list item
	 *  - Line starting with `1. `, `2. `, etc. → numbered list item
	 *  - Consecutive non-empty, non-list, non-heading lines → paragraph
	 */
	function parseStructure(rawText: string): OcrBlock[] {
		const lines = rawText.split("\n");
		const blocks: OcrBlock[] = [];

		let i = 0;

		while (i < lines.length) {
			const line = lines[i]!;
			const trimmed = line.trim();

			// Empty line → skip (paragraph breaks handled implicitly)
			if (!trimmed) {
				i++;
				continue;
			}

			// Heading: ALL CAPS, ≥3 chars, no digits, no punctuation-heavy
			if (
				trimmed.length >= 3 &&
				trimmed === trimmed.toUpperCase() &&
				/[A-Z\u0600-\u06FF]/.test(trimmed) &&
				!/^\d/.test(trimmed) &&
				trimmed.length <= 80
			) {
				blocks.push({
					type: "heading",
					level: trimmed.length <= 40 ? 1 : 2,
					text: trimmed,
				});
				i++;
				continue;
			}

			// Bullet list
			const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
			if (bulletMatch) {
				const items: string[] = [];
				while (i < lines.length) {
					const lm = lines[i]!.trim().match(/^[-•*]\s+(.+)/);
					if (!lm) break;
					items.push(lm[1]!);
					i++;
				}
				blocks.push({ type: "bulletList", items });
				continue;
			}

			// Numbered list
			const numMatch = trimmed.match(/^\d+[.)]\s+(.+)/);
			if (numMatch) {
				const items: string[] = [];
				while (i < lines.length) {
					const lm = lines[i]!.trim().match(/^\d+[.)]\s+(.+)/);
					if (!lm) break;
					items.push(lm[1]!);
					i++;
				}
				blocks.push({ type: "numberedList", items });
				continue;
			}

			// Paragraph: collect consecutive non-special lines
			const paraLines: string[] = [];
			while (i < lines.length) {
				const pl = lines[i]!.trim();
				if (!pl) break;
				// Stop if next line is a heading or list start
				if (
					(pl.length >= 3 &&
						pl === pl.toUpperCase() &&
						/[A-Z\u0600-\u06FF]/.test(pl) &&
						!/^\d/.test(pl) &&
						pl.length <= 80) ||
					/^[-•*]\s+/.test(pl) ||
					/^\d+[.)]\s+/.test(pl)
				)
					break;
				paraLines.push(pl);
				i++;
			}
			if (paraLines.length) {
				blocks.push({ type: "paragraph", text: paraLines.join(" ") });
			}
		}

		return blocks;
	}

	/**
	 * Convert parsed OcrBlocks to Tiptap-compatible JSON for insertContent().
	 */
	function blocksToTiptapJson(blocks: OcrBlock[]): any[] {
		return blocks.map((b) => {
			switch (b.type) {
				case "heading":
					return {
						type: "heading",
						attrs: { level: b.level ?? 1 },
						content: [{ type: "text", text: b.text ?? "" }],
					};
				case "paragraph":
					return {
						type: "paragraph",
						content: [{ type: "text", text: b.text ?? "" }],
					};
				case "bulletList":
					return {
						type: "bulletList",
						content: (b.items ?? []).map((item) => ({
							type: "listItem",
							content: [
								{
									type: "paragraph",
									content: [{ type: "text", text: item }],
								},
							],
						})),
					};
				case "numberedList":
					return {
						type: "orderedList",
						content: (b.items ?? []).map((item) => ({
							type: "listItem",
							content: [
								{
									type: "paragraph",
									content: [{ type: "text", text: item }],
								},
							],
						})),
					};
				default:
					return {
						type: "paragraph",
						content: [{ type: "text", text: "" }],
					};
			}
		});
	}

	/**
	 * Terminate the worker and free resources.
	 */
	async function terminate(): Promise<void> {
		if (workerPromise) {
			const w = await workerPromise;
			await w.terminate();
			workerPromise = null;
		}
	}

	return {
		loading,
		progress,
		language,
		setLanguage,
		recognize,
		parseStructure,
		blocksToTiptapJson,
		reinitWorker,
		terminate,
	};
}
