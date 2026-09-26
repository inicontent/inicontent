import { useOptimizeFile } from "~/composables/optimizeFile";
import type {
	AttachmentRejection,
	ChatAttachment,
} from "~/utils/chatAttachments";

/**
 * Where chat attachments live in the tenant's own asset storage.
 *
 * A dedicated folder keeps generated `.txt` files and pasted screenshots out
 * of the user's real asset library, where they would show up as site content.
 */
export const CHAT_ATTACHMENT_FOLDER = "ai";

/** Uploaded when the chat is used outside a database workspace. */
export const CHAT_ATTACHMENT_FALLBACK_SLUG = "inicontent";

let attachmentIdCounter = 0;

const nextAttachmentId = () => {
	attachmentIdCounter += 1;
	return `chat-attachment-${Date.now()}-${attachmentIdCounter}`;
};

export function useChatAttachments() {
	const attachments = ref<ChatAttachment[]>([]);
	const { optimizeFile } = useOptimizeFile();
	const uploading = computed(() =>
		attachments.value.some(
			(attachment) => !attachment.error && !attachment.url,
		),
	);

	/**
	 * Create the `ai` folder chain. A body-less POST creates missing folders
	 * and 404s on ones that already exist, so failures are ignored and the
	 * first upload succeeds either way.
	 */
	async function ensureFolder(slug: string, params: Record<string, string>) {
		try {
			await $fetch(
				`${config.public.apiBase}${slug}/assets/${CHAT_ATTACHMENT_FOLDER}`,
				{ method: "POST", credentials: "include", params },
			);
		} catch {
			// Already there, or created by the first upload in this gesture.
		}
	}

	/**
	 * Add files to the composer, uploading each in the background.
	 *
	 * Everything is rejected up front: size, type, count and combined total are
	 * all checked before a byte is sent, so an oversized file is free to refuse.
	 * The chip then tracks its own upload, which is why a failure marks just
	 * that one instead of the whole message.
	 */
	async function addFiles(
		files: File[],
		options: {
			slug: string;
			params: Record<string, string>;
			reject: (reason: AttachmentRejection, file: File) => void;
		},
	) {
		const { slug, params, reject } = options;
		const accepted: File[] = [];

		for (const file of files) {
			// Re-check against the live list so several files in one gesture see
			// the earlier ones and cannot slip past the caps together.
			const reason = attachmentRejection(file, attachments.value);
			if (reason) {
				reject(reason, file);
				continue;
			}
			if (hasAttachment(attachments.value, file)) continue;
			accepted.push(await optimizeForUpload(file));
		}

		if (accepted.length === 0) return;

		await ensureFolder(slug, params);

		// Reserve every slot up front, so a second gesture cannot race the
		// count cap while these are still uploading.
		const entries: Array<{ id: string; file: File }> = accepted.map((file) => ({
			id: nextAttachmentId(),
			file,
		}));
		attachments.value.push(
			...entries.map(({ id, file }) => ({
				id,
				name: file.name,
				type: file.type || "application/octet-stream",
				size: file.size,
				progress: 0,
			})),
		);

		await Promise.all(
			entries.map(({ id, file }) =>
				uploadOne(id, file, slug, params).catch(() => {
					// uploadOne already recorded the error on the chip.
				}),
			),
		);
	}

	async function uploadOne(
		id: string,
		file: File,
		slug: string,
		params: Record<string, string>,
	) {
		const patch = (changes: Partial<ChatAttachment>) => {
			const entry = attachments.value.find((item) => item.id === id);
			if (entry) Object.assign(entry, changes);
		};

		try {
			const { name, extension } = getFileNameAndExtension(file.name);
			const type = file.type || "application/octet-stream";

			// The path addresses the folder only. The asset endpoint reads every
			// path segment as a folder and 404s a file body aimed at a missing
			// one, so the name travels in the body — which is also where the
			// endpoint gets the unique id that keeps two same-named screenshots
			// from colliding in storage.
			const { result } = await $fetch<{
				result: { uploadURL?: string; publicURL?: string };
			}>(`${config.public.apiBase}${slug}/assets/${CHAT_ATTACHMENT_FOLDER}`, {
				method: "POST",
				credentials: "include",
				params,
				body: { name, size: file.size, type, extension },
			});

			if (!result?.uploadURL) throw new Error("No upload URL");

			await uploadAssetWithProgress({
				url: result.uploadURL,
				method: result.uploadURL.includes("s3") ? "PUT" : "POST",
				headers: { "Content-Type": type },
				file,
				onProgress: ({ percent }) => patch({ progress: percent }),
			});

			if (!result.publicURL) throw new Error("No public URL");
			patch({ url: result.publicURL, progress: 100 });
		} catch {
			patch({ error: "uploadFailed" });
		}
	}

	/**
	 * Shrink images before upload. The API bills by token, and a 4 MB phone
	 * screenshot costs far more vision tokens than the same image at 300 KB.
	 *
	 * The optimizer prefers AVIF when it is smaller, and the API cannot read
	 * AVIF, so a result in an unreadable format is dropped for the original.
	 */
	async function optimizeForUpload(file: File): Promise<File> {
		if (!file.type.startsWith("image/")) return file;
		try {
			const { optimized, file: shrunk } = await optimizeFile(file);
			return optimized && isReadableImage(shrunk) ? shrunk : file;
		} catch {
			return file;
		}
	}

	function removeAttachment(id: string) {
		attachments.value = attachments.value.filter(
			(attachment) => attachment.id !== id,
		);
	}

	/** Detach everything. The uploaded assets stay in storage either way. */
	function clearAttachments() {
		attachments.value = [];
	}

	return {
		attachments,
		uploading,
		addFiles,
		removeAttachment,
		clearAttachments,
	};
}
