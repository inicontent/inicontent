<template>
	<NCard id="assetsContainer" style="height: fit-content;" :bordered="!targetID">
		<template #header>
			<span v-if="isAssetRoute">{{ t("assets") }}</span>
			<NBreadcrumb v-else>
				<NBreadcrumbItem @click="currentPath = ''">
					{{ t("assets") }}
				</NBreadcrumbItem>
				<NBreadcrumbItem v-for="(singlePath, index) in currentPath?.split('/').slice(1)"
					@click="currentPath = `${currentPath.split('/').slice(0, index + 2).join('/')}`">
					{{ singlePath }}
				</NBreadcrumbItem>
			</NBreadcrumb>
		</template>
		<template #header-extra>
			<NFlex>
				<LazyTableSearchButton v-model:string="searchString" v-model:array="searchArray" :schema size="small" />
				<NButtonGroup round>
					<NPopover>
						<template #trigger>
							<NButton round size="small">
								<template #icon>
									<NIcon>
										<Icon name="tabler:folder-plus" />
									</NIcon>
								</template>
							</NButton>
						</template>
						<NInputGroup>
							<NInput v-model:value="folder"
								@keydown="({ key }: KeyboardEvent) => { if (key === 'Enter') createFolder(); }"
								:placeholder="t('folderName')" size="small">
								<template #suffix>
									<NIcon>
										<Icon name="tabler:letter-case" />
									</NIcon>
								</template>
							</NInput>
							<NButton @click="createFolder" size="small" type="primary">
								<template #icon>
									<NIcon>
										<Icon name="tabler:arrow-right" />
									</NIcon>
								</template>
							</NButton>
						</NInputGroup>
					</NPopover>
					<NUpload v-if="table?.allowedMethods?.includes('c')" multiple abstract
						:action="`${appConfig.apiBase}${database.slug}/assets${currentPath}?${database.slug}_sid=${sessionID}`"
						@update:file-list="onUpdateFileList" :custom-request @remove="onRemoveUpload">
						<NPopover trigger="manual" placement="bottom-end"
							:show="UploadProgress > 0 && UploadProgress !== 1001">
							<template #trigger>
								<NUploadTrigger :abstract="false">
									<NButton round size="small"
										:style="isRTL ? 'border-radius: 28px 0 0 28px;' : 'border-radius: 0 28px 28px 0;'">
										<template #icon>
											<NProgress v-if="compressionIndicator" type="circle" status="warning"
												:percentage="compressionIndicator" :stroke-width="10">
												<NTooltip v-model:show="showSkipCompressionTooltip" placement="top">
													<template #trigger>
														<Icon @click.stop="skipCompression" :size="10"
															name="tabler:player-track-next-filled" />
													</template>
													{{ t("skipCompression") }}
												</NTooltip>
											</NProgress>
											<NIcon v-else-if="!UploadProgress">
												<Icon name="tabler:upload" />
											</NIcon>
											<NIcon v-else-if="UploadProgress === 10000">
												<Icon name="tabler:check" />
											</NIcon>
											<NSpin v-else-if="UploadProgress === 1000 || UploadProgress === 1001"
												:size="16" />
											<NProgress v-else type="circle" :show-indicator="false"
												:status="UploadProgress === 100 ? 'success' : 'warning'"
												:percentage="UploadProgress" :stroke-width="20" />
										</template>
									</NButton>
								</NUploadTrigger>
							</template>
							<NUploadFileList></NUploadFileList>
						</NPopover>
					</NUpload>
				</NButtonGroup>
			</NFlex>
		</template>
		<NFlex vertical align="center">
			<AssetGrid v-model="assets" :isAssetRoute :table :targetID="!targetID ? 'assetsContainer' : targetID"
				v-model:path="currentPath">
				<template v-slot="slotProps">
					<slot v-bind="slotProps"></slot>
				</template>
			</AssetGrid>
			<NPagination v-if="itemCount && pageCount > 1" :simple="!!$device.isMobile"
				:page-sizes="[15, 30, 60, 100, 500]" :show-size-picker="showSizePicker" style="margin-top: 25px;"
				@update:page-size="onUpdatePageSize" @update:page="onUpdatePage" :page="page" :page-size="pageSize"
				:item-count="itemCount" />
		</NFlex>
	</NCard>
</template>


<script lang="ts" setup>
import Inison from "inison";
import type { UploadCustomRequestOptions, UploadFileInfo } from "naive-ui";
import { getFileNameAndExtension } from "~/composables";
import { generateSearchArray } from "~/composables/search";
import { useOptimizeFile } from "~/composables/optimizeFile";
import { useAssetUploader } from "~/composables/useAssetUploader";
import { usePdfCompressor } from "~/composables/usePdfCompressor";
import { useVideoCompressor } from "~/composables/useVideoCompressor";

const { where, suffix } = defineProps<{
	targetID?: string;
	where?: any;
	suffix?: string;
}>();
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

const route = useRoute();
const router = useRouter();
const isAssetRoute = !!(route.params.path || route.params.path === "");

const table = useState<Table>("table");
const currentItem = useState<Item>("currentItem");
const assetsTable = ref<Table>(table.value);

const currentPath = ref<string>(
	`${suffix ? renderLabel({ ...assetsTable.value, label: suffix }, currentItem.value) : ""}${
		route.params.path
			? `/${([] as string[]).concat(route.params.path).join("/")}`
			: ""
	}`,
);

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
if (!assetsTable.value || assetsTable.value.slug !== "assets")
	assetsTable.value = (
		await $fetch<apiResponse<Table>>(
			`${appConfig.apiBase}inicontent/databases/${database.value.slug}/assets`,
			{
				credentials: "include",
				params: {
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		)
	).result;

const page = ref(route.query.page ? Number(route.query.page) : 1);
const pageSize = ref(route.query.perPage ? Number(route.query.perPage) : 22);
const pageCount = ref(0);
const itemCount = ref(0);
const showSizePicker = ref(false);
async function onUpdatePage(currentPage: number) {
	page.value = currentPage;
	let Query = route.query;
	if (currentPage !== 1) Query = { ...Query, page: currentPage as any };
	if (route.params.path || route.params.path === "")
		router.push({ query: (({ page, ...rest }) => rest)(Query) });
	return refresh();
}
async function onUpdatePageSize(currentPageSize: number) {
	const OLD_pageSize = toRaw(pageSize.value);
	pageSize.value = currentPageSize;
	let Query: { page?: number; perPage?: number } = route.query;
	if (pageSize.value !== 15) {
		const newPage = Math.round(
			OLD_pageSize < pageSize.value
				? (Query.page ?? 1) / (pageSize.value / OLD_pageSize)
				: (Query.page ?? 1) * (pageSize.value / OLD_pageSize),
		);
		page.value = Number.isNaN(newPage) ? 1 : newPage;
		Query = {
			...Query,
			perPage: pageSize.value,
			page: page.value,
		};
	}
	if (route.params.path || route.params.path === "")
		router.push({ query: (({ page, perPage, ...rest }) => rest)(Query) });
	return refresh();
}

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const isRTL = computed(() => Language.value === "ar");

const assets = ref<Asset[]>();

const searchString = ref<string | undefined>(
	(route.query.search as string | undefined) ?? "",
);

const searchArray = ref<searchType>(
	route.query.search
		? generateSearchArray(Inison.unstringify(route.query.search as string))
		: { and: [[null, "=", null]] },
);

watch(searchString, (v) => {
	const { search, page, ...Query }: any = route.query;

	router.push({
		query: {
			...Query,
			search: v,
		},
	});
});

const schema: Schema = [
	{
		key: "name",
		type: "string",
	},
	{
		key: "extension",
		type: "array",
		children: "string",
		subType: "select",
		options: [
			{
				label: t("image"),
				value: [
					"png",
					"jpg",
					"jpeg",
					"gif",
					"webp",
					"svg",
					"bmp",
					"tiff",
					"heic",
					"avif",
				],
				icon: "tabler:photo",
			},
			{
				label: t("video"),
				value: ["mp4", "mov", "wmv", "avi", "mkv", "flv", "webm", "rmvb"],
				icon: "tabler:video",
			},
			{
				label: t("audio"),
				value: ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
				icon: "tabler:audio",
			},
			{
				label: t("document"),
				value: ["docx", "pdf", "txt", "pptx", "xlsx"],
				icon: "tabler:file-text",
			},
			{
				label: t("archive"),
				value: ["zip", "rar", "tar", "gz"],
				icon: "tabler:archive",
			},
		],
	},
];

const { refresh } = await useLazyFetch<apiResponse<Asset[]>>(
	() => `${appConfig.apiBase}${database.value.slug}/assets${currentPath.value}`,
	{
		onRequest: () => {
			Loading.value.AssetData = true;
		},
		onResponse: ({ response: { _data } }) => {
			Loading.value.AssetData = false;

			_data = _data as apiResponse<Asset[]>;

			assets.value = _data.result;

			if (_data.options.total === 0) showSizePicker.value = false;
			if (_data.options.totalPages && _data.options.total) {
				pageCount.value = _data.options.totalPages;
				itemCount.value = _data.options.total;
			}
			return _data.result;
		},
		query: {
			options: Inison.stringify({
				page: page.value,
				perPage: pageSize.value,
			}),
			where: searchString,
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		credentials: "include",
	},
);

const UploadProgress = ref<number>(0);
async function onUpdateFileList(fileList: Required<UploadFileInfo>[]) {
	if (fileList.length) {
		if (UploadProgress.value < 100) {
			UploadProgress.value =
				fileList
					.filter((file) => file.status !== "finished")
					.reduce((sum, file) => sum + (file.percentage ?? 0), 0) /
				fileList.filter((file) => file.status !== "finished").length;
			if (UploadProgress.value === 0) UploadProgress.value = 1;
		} else {
			if (fileList.every((file) => file.status === "finished")) {
				await new Promise<void>((resolve) => setTimeout(resolve, 2000));
				UploadProgress.value = 10000;
				await new Promise<void>((resolve) => setTimeout(resolve, 5000));
				UploadProgress.value = 0;
			} else UploadProgress.value = 1000;
		}
	}
}

const { optimizeFile } = useOptimizeFile();
const { uploadAssetWithProgress } = useAssetUploader();
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
		const originalFile = file.file;
		if (!originalFile) throw new Error("Missing file payload");

		let fileToUpload: File = originalFile;
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
				fileToUpload = await compressVideo(originalFile);
			} catch (compressionError) {
				// If compression was aborted/terminated, use original file
				if (String(compressionError).includes("terminated")) {
					fileToUpload = originalFile;
					compressionIndicator.value = null;
				} else throw compressionError;
			}
		} else if (isPdf) {
			notifyPdfSize(originalFile.size);
			try {
				fileToUpload = await compressPdf(fileToUpload);
			} catch (pdfError) {
				// If compression was aborted, use original file
				if (String(pdfError).toLowerCase().includes("abort")) {
					fileToUpload = originalFile;
					compressionIndicator.value = null;
				} else throw pdfError;
			}
		} else if (originalFile.type?.startsWith("image/")) {
			const optimizationResult = await optimizeFile(originalFile);
			if (optimizationResult.optimized) fileToUpload = optimizationResult.file;
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
		const mimeType = fileToUpload.type || file.type;
		const { name, extension } = getFileNameAndExtension(
			fileToUpload.name || file.name,
		);

		onProgress?.({ percent: 10 });

		const { result } = await $fetch<apiResponse<Asset>>(action as string, {
			method: "POST",
			credentials: "include",
			headers: headers as Record<string, string>,
			body: { name, size: fileToUpload.size, type: mimeType, extension },
		});

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
			headers: { "Content-Type": mimeType as string },
			file: fileToUpload,
			onProgress,
		});
		compressionIndicator.value = null;

		file.url = result.publicURL;
		if (assets.value) assets.value.unshift(result);
		else assets.value = [result];
		if (!database.value.size) database.value.size = 0;
		database.value.size += result.size ?? 0;

		onFinish();
	} catch (error) {
		// Handle terminated/aborted compression
		if (
			String(error).includes("terminated") ||
			String(error).includes("abort")
		) {
			console.log("Compression skipped for:", file.name);
			// Current file was being compressed when skip was clicked
			// Mark as error status instead of removed to prevent re-upload triggers
			file.status = "error";
			compressionIndicator.value = null;
			onFinish(); // Call onFinish to let the upload component know we're done
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

async function onRemoveUpload({ file }: { file: Required<UploadFileInfo> }) {
	if (file.status !== "finished") {
		abortVideo();
		abortPdf();
		return false;
	}
	const data = await $fetch<apiResponse<Asset>>(
			`${appConfig.apiBase}${
				database.value.slug
			}/assets${currentPath.value}/${file.name}`,
			{
				method: "DELETE",
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		),
		singleAsset = assets.value?.find((asset) => asset.name === file.name);
	if (data.result) {
		if (assets.value)
			assets.value = assets.value.filter((asset) => asset.name !== file.name);
		window.$message.success(data?.message ?? t("success"));
		if (database.value.size) database.value.size -= singleAsset?.size ?? 0;
		return true;
	}
	window.$message.error(data?.message ?? t("error"));
	return false;
}

const folder = ref();
async function createFolder() {
	if (folder.value) {
		currentPath.value += `/${folder.value}`;
		window.$message.success(t("folderCreatedSuccessfully"));
		await nextTick();
		if (isAssetRoute)
			await navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/assets${currentPath.value}`,
			);
		folder.value = "";
	} else window.$message.error(t("folderNameRequired"));
}

watch(currentPath, () => {
	page.value = 1;
	itemCount.value = 0;
	refresh();
});
</script>