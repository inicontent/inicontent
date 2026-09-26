import { strict as assert } from "node:assert";
import { test } from "node:test";

// @ts-expect-error Node's test runner imports TS files directly in this suite.
import {
	attachmentExtension,
	attachmentRejection,
	buildAttachmentMessage,
	createPastedTextFile,
	formatAttachmentSize,
	hasAttachment,
	isImageAttachment,
	isReadableImage,
	isSupportedAttachment,
	MAX_CHAT_ATTACHMENT_BYTES,
	MAX_CHAT_ATTACHMENTS,
	MAX_CHAT_ATTACHMENTS_TOTAL_BYTES,
	PASTE_TEXT_FILE_THRESHOLD,
	pastedTextFileName,
	shouldConvertPasteToFile,
	toAttachmentPayload,
} from "../app/utils/chatAttachments.ts";

const file = (overrides: Record<string, unknown> = {}) => ({
	name: "notes.txt",
	type: "text/plain",
	size: 1024,
	...overrides,
});

const uploaded = (overrides: Record<string, unknown> = {}) => ({
	id: "a1",
	name: "notes.txt",
	type: "text/plain",
	size: 1024,
	url: "https://s3.inicontent.com/demo/ai/notes.txt",
	...overrides,
});

test("formatAttachmentSize scales to a readable unit", () => {
	assert.equal(formatAttachmentSize(0), "0 B");
	assert.equal(formatAttachmentSize(512), "512 B");
	assert.equal(formatAttachmentSize(2048), "2.0 KB");
	assert.equal(formatAttachmentSize(5 * 1024 * 1024), "5.0 MB");
	assert.equal(formatAttachmentSize(12 * 1024 * 1024), "12 MB");
});

test("attachmentExtension reads the last extension, ignoring directories", () => {
	assert.equal(attachmentExtension("notes.txt"), "txt");
	assert.equal(attachmentExtension("reports/q3 FINAL.PDF"), "pdf");
	assert.equal(attachmentExtension("archive.tar.gz"), "gz");
	assert.equal(attachmentExtension(".gitignore"), "");
	assert.equal(attachmentExtension("noextension"), "");
});

test("isImageAttachment goes by MIME type", () => {
	assert.equal(isImageAttachment({ type: "image/png" }), true);
	assert.equal(isImageAttachment({ type: "text/plain" }), false);
});

test("isSupportedAttachment accepts the types the API can read", () => {
	for (const type of [
		"text/plain",
		"text/markdown",
		"text/csv",
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif",
		"application/pdf",
		"application/json",
		"application/xml",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.ms-excel",
		"application/msword",
		"application/vnd.oasis.opendocument.text",
	])
		assert.equal(
			isSupportedAttachment({ name: "f", type }),
			true,
			`expected ${type} to be supported`,
		);
});

test("isSupportedAttachment rejects AVIF, which the API cannot read", () => {
	// `optimizeFile` prefers AVIF when smaller, so an optimized image must be
	// checked before it is uploaded rather than 400'd by the API.
	assert.equal(
		isSupportedAttachment({ name: "a.avif", type: "image/avif" }),
		false,
	);
	assert.equal(isReadableImage({ type: "image/avif" }), false);
	assert.equal(isReadableImage({ type: "image/webp" }), true);
	assert.equal(
		isSupportedAttachment({ name: "a.heic", type: "image/heic" }),
		false,
	);
	// Judged by extension when the browser gives no usable type, so a directly
	// picked .avif is refused before the upload rather than 400'd on send.
	assert.equal(
		isSupportedAttachment({ name: "a.avif", type: "application/octet-stream" }),
		false,
	);
	assert.equal(isSupportedAttachment({ name: "a.avif", type: "" }), false);
	assert.equal(isSupportedAttachment({ name: "a.webp", type: "" }), true);
});

test("isSupportedAttachment falls back to the extension when the MIME is generic", () => {
	// Drag-and-drop and some clipboard pastes report a generic or empty type.
	assert.equal(
		isSupportedAttachment({
			name: "data.csv",
			type: "application/octet-stream",
		}),
		true,
	);
	assert.equal(isSupportedAttachment({ name: "data.csv", type: "" }), true);
	assert.equal(isSupportedAttachment({ name: "photo.png", type: "" }), true);
});

test("isSupportedAttachment rejects binary types the API cannot read", () => {
	assert.equal(
		isSupportedAttachment({
			name: "app.exe",
			type: "application/x-msdownload",
		}),
		false,
	);
	assert.equal(
		isSupportedAttachment({ name: "song.mp3", type: "audio/mpeg" }),
		false,
	);
	assert.equal(
		isSupportedAttachment({ name: "movie.mov", type: "video/quicktime" }),
		false,
	);
});

test("attachmentRejection refuses an oversized file before any upload", () => {
	assert.equal(
		attachmentRejection(file({ size: MAX_CHAT_ATTACHMENT_BYTES + 1 })),
		"tooLarge",
	);
	// Exactly at the cap is still allowed.
	assert.equal(
		attachmentRejection(file({ size: MAX_CHAT_ATTACHMENT_BYTES })),
		null,
	);
});

test("attachmentRejection refuses an empty file", () => {
	assert.equal(attachmentRejection(file({ size: 0 })), "empty");
});

test("attachmentRejection refuses an unreadable type", () => {
	assert.equal(
		attachmentRejection(
			file({ name: "app.exe", type: "application/x-msdownload" }),
		),
		"unsupportedType",
	);
});

test("attachmentRejection enforces the per-message count cap", () => {
	const existing = Array.from({ length: MAX_CHAT_ATTACHMENTS }, () => ({
		size: 10,
	}));
	assert.equal(attachmentRejection(file(), existing), "tooMany");
	assert.equal(
		attachmentRejection(file(), existing.slice(0, MAX_CHAT_ATTACHMENTS - 1)),
		null,
	);
});

test("attachmentRejection enforces the combined byte cap", () => {
	const chunk = MAX_CHAT_ATTACHMENTS_TOTAL_BYTES / MAX_CHAT_ATTACHMENTS;
	// One slot still free, so this is about the byte total, not the count.
	const existing = Array.from({ length: MAX_CHAT_ATTACHMENTS - 1 }, () => ({
		size: chunk,
	}));
	assert.equal(
		attachmentRejection(file({ size: chunk + 1024 }), existing),
		"totalTooLarge",
	);
	assert.equal(attachmentRejection(file({ size: 1024 }), existing), null);
});

test("shouldConvertPasteToFile only converts a long paste", () => {
	assert.equal(shouldConvertPasteToFile("short question"), false);
	assert.equal(
		shouldConvertPasteToFile("x".repeat(PASTE_TEXT_FILE_THRESHOLD)),
		false,
	);
	assert.equal(
		shouldConvertPasteToFile("x".repeat(PASTE_TEXT_FILE_THRESHOLD + 1)),
		true,
	);
	// Surrounding whitespace should not count towards the threshold.
	assert.equal(shouldConvertPasteToFile(`   ${"x".repeat(100)}   `), false);
});

test("pastedTextFileName is dated and ends in .txt", () => {
	const name = pastedTextFileName(new Date("2026-03-04T05:06:07Z"));
	assert.equal(name, "pasted-text-2026-03-04-05-06-07.txt");
	assert.match(name, /^pasted-text-[\d-]+\.txt$/);
});

test("createPastedTextFile keeps the text and is a plain .txt", async () => {
	const created = createPastedTextFile("a,b\n1,2", "pasted.csv.txt");
	assert.equal(created.name, "pasted.csv.txt");
	assert.equal(created.type, "text/plain");
	assert.equal(created.size, "a,b\n1,2".length);
	assert.equal(await created.text(), "a,b\n1,2");
});

test("hasAttachment blocks picking the same file twice", () => {
	const existing = [uploaded()];
	assert.equal(
		hasAttachment(existing, { name: "notes.txt", size: 1024 }),
		true,
	);
	assert.equal(
		hasAttachment(existing, { name: "other.txt", size: 1024 }),
		false,
	);
	// Same name, different content.
	assert.equal(
		hasAttachment(existing, { name: "notes.txt", size: 2048 }),
		false,
	);
});

test("toAttachmentPayload sends only finished uploads", () => {
	assert.deepEqual(
		toAttachmentPayload([
			uploaded(),
			{ id: "a2", name: "pending.png", type: "image/png", size: 10 },
			{
				id: "a3",
				name: "failed.txt",
				type: "text/plain",
				size: 10,
				error: "uploadFailed",
			},
		]),
		[
			{
				url: "https://s3.inicontent.com/demo/ai/notes.txt",
				name: "notes.txt",
				type: "text/plain",
				size: 1024,
			},
		],
	);
});

test("toAttachmentPayload is empty for a text-only turn", () => {
	// Keeps `attachments` out of the request entirely when nothing is attached.
	assert.deepEqual(toAttachmentPayload([]), []);
});

test("buildAttachmentMessage names the files so the agent can refer to them", () => {
	assert.equal(
		buildAttachmentMessage("summarize these", [
			uploaded(),
			uploaded({ id: "a2", name: "shot.png", type: "image/png" }),
		]),
		"summarize these\n\nAttached: notes.txt, shot.png",
	);
});

test("buildAttachmentMessage leaves the text alone when nothing uploaded", () => {
	assert.equal(buildAttachmentMessage("add a table", []), "add a table");
	assert.equal(
		buildAttachmentMessage("add a table", [
			{ id: "a1", name: "pending.txt", type: "text/plain", size: 10 },
		]),
		"add a table",
	);
});
