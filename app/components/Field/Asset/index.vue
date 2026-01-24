<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<template #label>
			<NFlex inline align="center" size="small" :style="`margin-${(Language === 'ar' ? 'right' : 'left')}: 5px`">
				<LazyFieldAssetActions v-model:showAssetsModal="showAssetsModal" :field
					:callback="importAssetCallback" />
			</NFlex>
		</template>
		<NUpload directory-dnd :max="!field.isArray ? 1 : undefined" :multiple="!!field.isArray"
			:accept="acceptedFileType"
			:action="`${appConfig.apiBase}${database.slug ?? 'inicontent'}/assets${field.suffix ? renderLabel({ ...table, label: field.suffix }, currentItem) : ''}`"
			:fileList @update:file-list="setModelValue" :custom-request @remove="handleRemoveUpload"
			:list-type="!field.isTable ? 'image' : 'image-card'" :renderIcon :shouldUseThumbnailUrl="() => false">
			<NUploadDragger v-if="compressionIndicator">
				<NProgress type="circle" status="warning" :percentage="compressionIndicator" :stroke-width="10"
					style="width:54px" indicator-placement="inside">
					<NTooltip v-model:show="showSkipCompressionTooltip" placement="top">
						<template #trigger>
							<Icon @click.stop="skipCompression" name="tabler:player-track-next-filled" />
						</template>
						{{ t("skipCompression") }}
					</NTooltip>
				</NProgress>
			</NUploadDragger>
			<NUploadDragger v-else-if="!field.isTable">
				<NIcon size="48" depth="3">
					<Icon name="tabler:upload" />
				</NIcon>
			</NUploadDragger>
			<NFlex v-else align="center" size="small">
				<LazyFieldAssetActions v-model:showAssetsModal="showAssetsModal" :field
					:callback="importAssetCallback" />
			</NFlex>
		</NUpload>
		<NDrawer v-model:show="showAssetsModal" defaultHeight="50%" placement="bottom" resizable>
			<NDrawerContent id="assetsModal" :nativeScrollbar="false" :bodyContentStyle="{ padding: 0 }">
				<AssetCard targetID="assetsModal" :where="assetWhere" :suffix="field.suffix">
					<template v-slot="{ asset }">
						<template v-if="asset.type !== 'dir'">
							<NCheckbox v-if="field.isArray" :checked="getChecked(asset)"
								@update:checked="handleSelectAsset(asset)" />
							<NRadio v-else :checked="getChecked(asset)" @update:checked="handleSelectAsset(asset)" />
						</template>
					</template>
				</AssetCard>
			</NDrawerContent>
		</NDrawer>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import { isArrayOfObjects, isObject } from "inibase/utils";
import type {
	FormItemRule,
	UploadCustomRequestOptions,
	UploadFileInfo,
} from "naive-ui";
import { Icon, LazyAssetThumb } from "#components";
import { getFileNameAndExtension } from "~/composables";
import renderLabel from "~/composables/renderLabel";
import { useOptimizeFile } from "~/composables/optimizeFile";
import { useAssetUploader } from "~/composables/useAssetUploader";
import { usePdfCompressor } from "~/composables/usePdfCompressor";
import { useVideoCompressor } from "~/composables/useVideoCompressor";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string | Asset | (string | Asset)[]>();

const Language = useCookie<LanguagesType>("language", { sameSite: true });

const appConfig = useAppConfig();
const LARGE_VIDEO_BYTES = 512 * 1024 * 1024;
const HUGE_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;
const LARGE_PDF_BYTES = 50 * 1024 * 1024;
const HUGE_PDF_BYTES = 200 * 1024 * 1024;

const {
	compressVideo,
	loading: videoLoading,
	progress: videoProgress,
	abort: abortVideo,
	resetSkip: resetVideoSkip,
} = useVideoCompressor();
const {
	compressPdf,
	loading: pdfLoading,
	progress: pdfProgress,
	abort: abortPdf,
	resetSkip: resetPdfSkip,
} = usePdfCompressor();

const compressionIndicator = ref<number | null>(null);
const skipCompressionRequested = ref(false);
const processingFileId = ref<string | null>(null); // Track which file is being processed

const skipCompression = () => {
	if (compressionIndicator.value === null) return;
	skipCompressionRequested.value = true;
	abortVideo();
	abortPdf();
};

async function handleRemoveUpload({
	file,
}: {
	file: Required<UploadFileInfo>;
}) {
	if (file.status !== "finished") {
		// If this is the file currently being processed, abort and reset
		if (processingFileId.value === file.id) {
			skipCompressionRequested.value = true;
			abortVideo();
			abortPdf();
			processingFileId.value = null;
		}

		fileList.value = (fileList.value || []).filter(
			(item) => item.id !== file.id,
		);
		await nextTick();
		setModelValue(fileList.value);
		return false;
	}

	const assetId = fileIdObject.value[file.id] || file.id;
	if (assetId) {
		try {
			const path = field.suffix
				? renderLabel(
					{ ...table.value, label: field.suffix },
					currentItem.value,
				)
				: "";
			await $fetch(
				`${appConfig.apiBase}${database.value.slug}/assets${path}/${assetId}`,
				{
					method: "DELETE",
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			);

			const asset = Array.isArray(modelValue.value)
				? (modelValue.value as Asset[]).find((a) => a.id === assetId)
				: (modelValue.value as Asset | undefined);

			if (asset && asset.id === assetId && database.value.size) {
				database.value.size -= asset.size ?? 0;
			}
		} catch (e) {
			console.error("Failed to delete asset", e);
		}
	}

	return true;
}

const getIndicatorPercent = (progress: number) => {
	const raw = Math.round(progress * 100);
	if (!Number.isFinite(raw)) return 1;
	return Math.min(99, Math.max(1, raw));
};

watchEffect(() => {
	if (videoLoading.value) {
		compressionIndicator.value = getIndicatorPercent(videoProgress.value);
	} else if (pdfLoading.value) {
		compressionIndicator.value = getIndicatorPercent(pdfProgress.value);
	} else {
		compressionIndicator.value = null;
	}
});

const notifyVideoSize = (size: number) => {
	if (!import.meta.client) return;
	const messageApi = window?.$message;
	if (!messageApi) return;
	const formattedSize = humanFileSize(size);
	if (size >= HUGE_VIDEO_BYTES)
		messageApi.warning(t("compression.videoHuge", { size: formattedSize }));
	else if (size >= LARGE_VIDEO_BYTES)
		messageApi.info(t("compression.videoLarge", { size: formattedSize }));
};

const notifyPdfSize = (size: number) => {
	if (!import.meta.client) return;
	const messageApi = window?.$message;
	if (!messageApi) return;
	const formattedSize = humanFileSize(size);
	if (size >= HUGE_PDF_BYTES)
		messageApi.warning(t("compression.pdfHuge", { size: formattedSize }));
	else if (size >= LARGE_PDF_BYTES)
		messageApi.info(t("compression.pdfLarge", { size: formattedSize }));
};

const rule: FormItemRule = {
	type: field.isArray ? "array" : "object",
	required: field.required,
	min: field.isArray ? field.min : undefined,
	max: field.isArray ? field.max : undefined,
	validator: async () => {
		await nextTick();
		return fieldValidator(field, modelValue.value);
	},
};

const database = useState<Database>("database");
const showAssetsModal = ref(false);

const acceptedFileType = computed(() => {
	if (!field.accept) return undefined;
	const RETURN = [];
	for (const type of field.accept) {
		switch (type) {
			case "image":
				RETURN.push("image/*");
				break;
			case "video":
				RETURN.push("video/*");
				break;
			case "audio":
				RETURN.push("audio/*");
				break;
			case "document":
				RETURN.push(".doc, .docx, .pdf, .txt, .rtf, .odt");
				break;
			case "archive":
				RETURN.push(".zip, .rar, .7z, .tar, .gz");
				break;
		}
	}
	return RETURN.join(",");
});

const assetWhere = computed(() => {
	if (!field.accept) return undefined;
	let whereType = "[]";
	for (const type of field.accept) {
		switch (type) {
			case "image":
				whereType += "image/png,image/jpeg,image/webp,image/avif,";
				break;
			case "video":
				whereType +=
					"video/mp4, video/mpeg, video/quicktime, video/x-msvideo, video/x-flv, video/webm, video/ogg, video/3gpp, video/3gpp2, video/x-matroska, video/vnd.mpegurl, video/h264, video/x-ms-wmv, video/x-ms-asf,";
				break;
			case "audio":
				whereType +=
					"audio/mpeg, audio/wav, audio/ogg, audio/aac, audio/flac, audio/mp4, audio/x-wav, audio/midi, audio/x-midi, audio/x-pn-wav, audio/x-aiff, audio/x-flac, audio/webm, audio/3gpp, audio/3gpp2, audio/amr, audio/x-ms-wma, audio/vnd.rn-realaudio, audio/vnd.wave,";
				break;
			case "document":
				whereType +=
					"application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, text/plain, application/rtf, application/vnd.oasis.opendocument.text,";
				break;
			case "archive":
				whereType +=
					"application/zip, application/x-rar-compressed, application/x-7z-compressed, application/x-tar, application/gzip,";
				break;
		}
	}
	return { type: whereType.slice(0, -1) };
});

function importAssetCallback(assets: Asset | Asset[]) {
	const isModelValueTable = field.type !== "url" && field.children !== "url";
	const value = ([] as Asset[])
		.concat(assets)
		.map((asset) => (isModelValueTable ? asset : asset.publicURL));

	if (field.isArray)
		modelValue.value = [
			...(modelValue.value
				? Array.isArray(modelValue.value)
					? modelValue.value
					: [modelValue.value]
				: []),
			...value,
		];
	else modelValue.value = value[0];

	nextTick(() => {
		fileList.value = getFileList();
	});
}

function handleSelectAsset(asset?: Asset) {
	if (!asset) return;

	const value =
		field.type === "url" || field.children === "url" ? asset.publicURL : asset;

	if (!field.isArray) {
		if (
			modelValue.value &&
			!Array.isArray(modelValue.value) &&
			((typeof modelValue.value === "string" &&
				modelValue.value === asset.publicURL) ||
				(isObject(modelValue.value) && modelValue.value.id === asset.id))
		)
			modelValue.value = undefined;
		else modelValue.value = value;
	} else {
		if (modelValue.value && Array.isArray(modelValue.value)) {
			const index = isArrayOfObjects(modelValue.value)
				? (modelValue.value as Asset[]).findIndex(
					(value) => value.id === asset.id,
				)
				: (modelValue.value as string[]).indexOf(asset.publicURL);
			if (index > -1) modelValue.value.splice(index, 1);
			else modelValue.value.push(value);
		} else modelValue.value = [value];
	}

	nextTick(() => {
		fileList.value = getFileList();
	});
}

function getFileList() {
	if (!modelValue.value) return;

	return ([] as (Asset | string)[]).concat(modelValue.value).map((asset) =>
		typeof asset === "string"
			? {
				id: asset,
				name: asset.split("/").pop(),
				status: "finished",
				url: asset,
				type: field.accept?.includes("image") ? "image/jpeg" : undefined,
			}
			: {
				id: asset.id,
				name: asset.name || asset.id,
				status: "finished",
				url: (asset as Asset).publicURL,
				type: asset.type,
			},
	) as UploadFileInfo[];
}

const fileList = ref<undefined | UploadFileInfo[]>(getFileList());
async function setModelValue(value?: UploadFileInfo[]) {
	fileList.value = value;

	if (value) {
		if (value.length) {
			if (
				value.length ===
				value.filter(({ status }) => status === "finished").length
			) {
				const finalFileList = value
					.filter(({ status }) => status === "finished")
					.map((asset) =>
						!asset.file
							? field.isArray
								? (modelValue.value as Asset[]).find(
									(item) => item.id === asset.id,
								)
								: modelValue.value
							: {
								id: fileIdObject.value[asset.id],
								name: asset.name,
								type: asset.type,
								publicURL: asset.url,
								size: asset.file?.size ?? 0,
								createdAt: asset.file?.lastModified ?? 0,
							},
					) as Asset[];
				if (finalFileList.length) {
					modelValue.value = field.isArray ? finalFileList : finalFileList[0];
					await nextTick();
					fileList.value = getFileList();
				} else modelValue.value = undefined;
			}
		} else modelValue.value = undefined;
	} else modelValue.value = undefined;
}

const fileIdObject = ref<Record<string, string>>({});

const { optimizeFile } = useOptimizeFile();
const { uploadAssetWithProgress } = useAssetUploader();

// Determine if optimization is enabled (undefined or true = enabled)
const shouldOptimize = computed(() => field.optimize !== false);
const showSkipCompressionTooltip = ref(false);

async function customRequest({
	file,
	headers,
	action,
	onFinish,
	onError,
	onProgress,
}: UploadCustomRequestOptions) {
	// Track this file as being processed
	processingFileId.value = file.id;

	try {
		if (shouldOptimize.value) {
			const originalFile = file.file;
			if (!originalFile) throw new Error("Missing file payload");

			let fileToUpload: File = originalFile;
			let compressionSkipped = false;
			const isVideo = originalFile.type?.startsWith("video/") ?? false;
			const isPdf =
				originalFile.type === "application/pdf" ||
				originalFile.name.toLowerCase().endsWith(".pdf");

			if (isVideo || isPdf) {
				showSkipCompressionTooltip.value = true;
				setTimeout(() => {
					showSkipCompressionTooltip.value = false;
				}, 800);
			}

			if (isVideo) {
				notifyVideoSize(originalFile.size);
				try {
					fileToUpload = await compressVideo(
						new File([originalFile], originalFile.name, {
							type: originalFile.type,
						}),
					);
				} catch (videoError) {
					// If compression was aborted/terminated, use original file
					if (String(videoError).includes("terminated")) {
						fileToUpload = originalFile;
						compressionSkipped = true;
						compressionIndicator.value = null;
					} else throw videoError;
				}
			} else if (isPdf && false) {
				notifyPdfSize(originalFile.size);
				try {
					fileToUpload = await compressPdf(fileToUpload);
				} catch (pdfError) {
					// If compression was aborted, use original file
					if (String(pdfError).toLowerCase().includes("abort")) {
						fileToUpload = originalFile;
						compressionSkipped = true;
						compressionIndicator.value = null;
					} else throw pdfError;
				}
			} else if (originalFile.type?.startsWith("image/")) {
				const optimizationResult = await optimizeFile(
					new File([originalFile], originalFile.name, {
						type: originalFile.type,
					}),
				);
				if (optimizationResult.optimized)
					fileToUpload = optimizationResult.file;
			}

			// IMPORTANT: Completely replace the file object to prevent uploading both files
			// Create a new File instance to ensure no reference to original
			if (fileToUpload !== originalFile) {
				fileToUpload = new File([fileToUpload], fileToUpload.name, {
					type: fileToUpload.type,
					lastModified: fileToUpload.lastModified,
				});
			}
			// Update the file reference in the upload info
			file.file = fileToUpload;
			file.name = fileToUpload.name;
			file.type = fileToUpload.type;
		}

		const { name, extension } = getFileNameAndExtension(file.name);

		onProgress?.({ percent: 10 });

		const { result } = await $fetch<apiResponse<Asset>>(
			`${action}?${database.value.slug}_sid=${sessionID.value}`,
			{
				method: "POST",
				credentials: "include",
				headers: headers as Record<string, string>,
				body: { name, size: file.file?.size, type: file.type, extension },
			},
		);

		if (!result.uploadURL) {
			if (result.id)
				await $fetch<apiResponse<Asset>>(
					`${action}/${result.id}?${database.value.slug}_sid=${sessionID.value}`,
					{
						method: "DELETE",
						credentials: "include",
						headers: headers as Record<string, string>,
					},
				);
			throw new Error("Failed to get upload URL");
		}

		await uploadAssetWithProgress({
			url: result.uploadURL as string,
			method: result.uploadURL.includes("s3") ? "PUT" : "POST",
			headers: { "Content-Type": file.type as string },
			file: file.file,
			onProgress,
		});
		compressionIndicator.value = null;

		file.url = result.publicURL;
		file.status = "finished";
		fileIdObject.value[file.id] = result.id as string;
		// fileList.value = [...(fileList.value || []), file] // Do not manually append to fileList, NUpload handles it
		if (!database.value.size) database.value.size = 0;
		database.value.size += result.size ?? 0;

		setModelValue(fileList.value);

		onFinish();
	} catch (error) {
		// Handle terminated/aborted compression
		if (
			String(error).includes("terminated") ||
			String(error).includes("abort")
		) {
			// Current file was being compressed when skip was clicked
			// DON'T modify fileList as this might trigger re-uploads of finished files
			// Just mark as error and finish silently
			file.status = "error";
			compressionIndicator.value = null;
			console.log("Compression skipped for:", file.name);
			onFinish(); // Finish without calling onError to prevent error message
			return;
		}
		compressionIndicator.value = null;
		console.error("Error in customRequest:", error);
		onError();
	} finally {
		// Clean up
		if (processingFileId.value === file.id) {
			processingFileId.value = null;
		}
		// Reset skip flag only after current file is done
		if (skipCompressionRequested.value) {
			skipCompressionRequested.value = false;
		}
	}
}

const table = useState<Table>("table");
const currentItem = useState<Item>("currentItem");

function renderIcon(
	file: UploadFileInfo & { extension?: string; publicURL?: string },
) {
	const { extension } = getFileNameAndExtension(file.name);
	file.extension = extension;
	file.publicURL = file.url as string;
	return h(LazyAssetThumb, {
		asset: file as unknown as Asset,
		style: {
			height: "25px",
			width: "25px",
		},
	});
}

const getChecked = (asset: Asset) =>
	!!modelValue.value &&
	([] as (Asset | string)[])
		.concat(modelValue.value)
		.findIndex((value) =>
			typeof value === "string"
				? value === asset.publicURL
				: value.id === asset.id,
		) > -1;

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
});
</script>