/**
 * Attachment helpers for the chat composer.
 *
 * Files are uploaded to the tenant's own asset storage first, then their public
 * URLs are sent with the message so the agent can actually read them. The API
 * re-validates everything here; these are the guards that keep a bad file from
 * being uploaded at all.
 *
 * Kept free of composables and `t()` so it can be imported by `node --test`.
 */

/** Files per message. Mirrored by the API in `utils/ai-attachments.ts`. */
export const MAX_CHAT_ATTACHMENTS = 5;

/** Rejected before upload: OpenAI bills these, so a huge file is never free. */
export const MAX_CHAT_ATTACHMENT_BYTES = 10 * 1024 * 1024;

/**
 * OpenAI caps all files in one request at 50 MB combined, and PDFs bill page
 * images on top of their text, so the per-message total stays well below that.
 */
export const MAX_CHAT_ATTACHMENTS_TOTAL_BYTES = 25 * 1024 * 1024;

/**
 * Pasted text this long becomes a `.txt` attachment instead of the message
 * body. A pasted CSV or log is the request; the short reply is the instruction.
 */
export const PASTE_TEXT_FILE_THRESHOLD = 2_000;

/**
 * Extensions the Responses API can read as a file input. Anything else is
 * rejected with a clear reason rather than uploaded and then 400'd.
 */
export const ATTACHMENT_EXTENSIONS = new Set([
	"7z",
	"bmp",
	"css",
	"csv",
	"doc",
	"docx",
	"eml",
	"epub",
	"gif",
	"gz",
	"htm",
	"html",
	"jpeg",
	"jpg",
	"js",
	"json",
	"md",
	"mbox",
	"odp",
	"ods",
	"odt",
	"pdf",
	"php",
	"png",
	"ppt",
	"pptx",
	"py",
	"rb",
	"rtf",
	"svg",
	"tar",
	"ts",
	"tsv",
	"txt",
	"webp",
	"xls",
	"xlsx",
	"xml",
	"zip",
]);

/**
 * Image formats the Responses API accepts. Deliberately narrower than
 * `image/*`: the upload optimizer can emit AVIF, which the API rejects, so an
 * AVIF must fall back to the original rather than be uploaded and then 400.
 */
export const SUPPORTED_IMAGE_TYPES = new Set([
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
]);

/** Reverse lookup, so an image is judged the same by MIME type or extension. */
const IMAGE_TYPES_BY_EXTENSION: Record<string, string> = {
	gif: "image/gif",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
};

/** An attachment as it travels through the composer and onto the wire. */
export type ChatAttachment = {
	/** Stable key for list rendering; never sent to the API. */
	id: string;
	name: string;
	type: string;
	size: number;
	/** Empty until the upload finishes. */
	url?: string;
	/** 0-100 while uploading. */
	progress?: number;
	/** Set when the upload failed, so the chip can explain itself. */
	error?: string;
};

/** The `attachments` field on the AI request body. */
export type ChatAttachmentPayload = {
	url: string;
	name: string;
	type: string;
	size: number;
};

/** Why a file was refused. i18n keys, translated by the caller. */
export type AttachmentRejection =
	| "tooLarge"
	| "tooMany"
	| "totalTooLarge"
	| "unsupportedType"
	| "empty"
	| "uploadFailed";

/** Human-readable byte size, without pulling in the composable. */
export function formatAttachmentSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	const units = ["KB", "MB", "GB"];
	let value = bytes / 1024;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit++;
	}
	return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

/** Lowercased extension of a file name, without the dot. */
export function attachmentExtension(name: string): string {
	const base = name.split(/[\\/]/).pop() ?? "";
	const dot = base.lastIndexOf(".");
	if (dot <= 0) return "";
	return base.slice(dot + 1).toLowerCase();
}

export function isImageAttachment(attachment: { type: string }): boolean {
	return attachment.type.startsWith("image/");
}

/**
 * Whether the API can read this type. Falls back to the extension when a
 * browser gives an empty or generic `type` (`application/octet-stream`), which
 * is common for drag-and-drop and some clipboard pastes.
 */
export function isSupportedAttachment(attachment: {
	name: string;
	type: string;
}): boolean {
	const type = attachment.type.trim().toLowerCase();
	if (type && type !== "application/octet-stream") {
		if (type.startsWith("image/")) return SUPPORTED_IMAGE_TYPES.has(type);
		if (type.startsWith("text/")) return true;
		if (type === "application/pdf") return true;
		if (type === "application/json") return true;
		if (type === "application/xml" || type.endsWith("+xml")) return true;
		// Office formats are reported with many vendor-specific types.
		if (
			/^application\/(vnd\.(ms-|oasis\.opendocument|openxmlformats|msword|ms-excel|ms-powerpoint)|msword|ms-excel|ms-powerpoint|rtf|epub)/.test(
				type,
			)
		)
			return true;
		return ATTACHMENT_EXTENSIONS.has(type.split("/").pop() ?? "");
	}
	// Judged by extension. An image still has to land in a format the API can
	// read, so a `.avif` picked directly is refused here rather than 400'd later.
	const extension = attachmentExtension(attachment.name);
	const imageType = IMAGE_TYPES_BY_EXTENSION[extension];
	if (imageType) return SUPPORTED_IMAGE_TYPES.has(imageType);
	return ATTACHMENT_EXTENSIONS.has(extension);
}

/**
 * Whether an image can stay optimized. `optimizeFile` prefers AVIF when it is
 * smaller, which is exactly the format the API cannot read.
 */
export function isReadableImage(file: { type: string }): boolean {
	return SUPPORTED_IMAGE_TYPES.has(file.type.trim().toLowerCase());
}

/**
 * Why this file cannot be attached, or `null` when it is fine.
 *
 * The size and count checks run before any upload, so an oversized file costs
 * the user nothing.
 */
export function attachmentRejection(
	file: { name: string; type: string; size: number },
	existing: Array<{ size: number }> = [],
): AttachmentRejection | null {
	if (file.size === 0) return "empty";
	if (file.size > MAX_CHAT_ATTACHMENT_BYTES) return "tooLarge";
	if (!isSupportedAttachment(file)) return "unsupportedType";
	if (existing.length >= MAX_CHAT_ATTACHMENTS) return "tooMany";
	const total = existing.reduce((sum, item) => sum + item.size, 0);
	if (total + file.size > MAX_CHAT_ATTACHMENTS_TOTAL_BYTES)
		return "totalTooLarge";
	return null;
}

/** Pasted text long enough to be worth sending as a readable file. */
export function shouldConvertPasteToFile(text: string): boolean {
	return text.trim().length > PASTE_TEXT_FILE_THRESHOLD;
}

/** A dated, collision-resistant name for a pasted text attachment. */
export function pastedTextFileName(date: Date = new Date()): string {
	const stamp = date.toISOString().slice(0, 19).replace(/[:T]/g, "-");
	return `pasted-text-${stamp}.txt`;
}

/**
 * The `.txt` a long paste becomes. Returning a `File` (not a `Blob`) keeps the
 * same name and type handling as a picked file, so the upload path is shared.
 */
export function createPastedTextFile(text: string, name?: string): File {
	return new File([text], name ?? pastedTextFileName(), {
		type: "text/plain",
	});
}

/** Pick only images out of a clipboard payload, ignoring pasted text. */
export function imagesFromClipboard(data: DataTransfer | null): File[] {
	const files = Array.from(data?.files ?? []);
	const items = Array.from(data?.items ?? []);
	const fromItems = items
		.filter((item) => item.kind === "file" && item.type.startsWith("image/"))
		.map((item) => item.getAsFile())
		.filter((file): file is File => file !== null);
	// `files` is empty in some browsers for clipboard pastes; prefer whichever
	// source actually produced images.
	return fromItems.length > 0
		? fromItems
		: files.filter((file) => file.type.startsWith("image/"));
}

/** Whether two files are the same pick, so a double-add cannot double-upload. */
export function isSameAttachment(
	a: { name: string; size: number },
	b: { name: string; size: number },
): boolean {
	return a.name === b.name && a.size === b.size;
}

/** The chips already queued, for the duplicate check. */
export function hasAttachment(
	existing: Array<{ name: string; size: number }>,
	file: { name: string; size: number },
): boolean {
	return existing.some((item) => isSameAttachment(item, file));
}

/** Only finished uploads, in composer order. */
export function uploadedAttachments<T extends { url?: string; error?: string }>(
	attachments: T[],
): T[] {
	return attachments.filter(
		(attachment) => !attachment.error && Boolean(attachment.url),
	);
}

/**
 * The `attachments` array for the request body. Returns nothing when no upload
 * has landed, so the field is omitted entirely for a text-only turn.
 */
export function toAttachmentPayload(
	attachments: ChatAttachment[],
): ChatAttachmentPayload[] {
	return uploadedAttachments(attachments).map((attachment) => ({
		url: attachment.url as string,
		name: attachment.name,
		type: attachment.type,
		size: attachment.size,
	}));
}

/**
 * Append a compact list of the attached names to the message, so the agent
 * knows a file is coming and what it is called. The names are enough to refer
 * to; the file itself travels as an input part.
 */
export function buildAttachmentMessage(
	text: string,
	attachments: Array<{ name: string; url?: string; error?: string }>,
): string {
	const names = uploadedAttachments(attachments).map(
		(attachment) => attachment.name,
	);
	if (names.length === 0) return text;
	return `${text}\n\nAttached: ${names.join(", ")}`;
}
