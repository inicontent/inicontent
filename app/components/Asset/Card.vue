<template>
	<div
		style="position: relative;"
		@dragenter.prevent="onDragEnter"
		@dragover.prevent="onDragOver"
		@drop.prevent="onDrop"
		@dragleave="onDragLeave"
	>
		<input
			ref="folderInputRef"
			type="file"
			multiple
			webkitdirectory
			style="display: none;"
			@change="onFolderInputChange"
		/>
		<Transition name="drop-fade">
			<div
				v-if="isDragOver"
				style="position: absolute; inset: 0; z-index: 100; background: rgba(24, 160, 88, 0.1); border: 2px dashed #18a058; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; pointer-events: none;"
			>
				<NIcon size="56" color="#18a058">
					<Icon name="tabler:cloud-upload" />
				</NIcon>
				<span style="color: #18a058; font-size: 16px; font-weight: 500;">{{ t("dropFilesHere") }}</span>
			</div>
		</Transition>
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
			<NFlex wrap>
				<NButtonGroup v-if="selectedAssetIds.length" round>
					<NTooltip>
						<template #trigger>
							<NButton size="small" round secondary type="info" :title="allSelectableSelected ? t('clearAll') : t('selectAll')"
								@click="toggleSelectAllFromGroup">
								<template #icon>
									<NIcon>
										<Icon :name="allSelectableSelected ? 'tabler:square-minus' : 'tabler:square-check'" />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ allSelectableSelected ? t("clearAll") : t("selectAll") }}
					</NTooltip>
					<NTooltip>
						<template #trigger>
							<NButton size="small" round secondary type="warning" :loading="bulkDownloadLoading"
								:title="`${t('download')} ZIP${bulkDownloadLoading ? ` ${bulkZipProgress}%` : ''}`"
								@click="downloadSelectedAsZip">
								<template #icon>
									<NIcon>
										<Icon name="tabler:file-zip" />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ bulkDownloadLoading ? `${t("download")} ZIP ${bulkZipProgress}%` : `${t("download")} ZIP` }}
					</NTooltip>
					<NTooltip>
						<template #trigger>
							<NButton size="small" round secondary type="error" :loading="bulkDeleteLoading" :title="t('delete')"
								@click="deleteSelectedAssets">
								<template #icon>
									<NIcon>
										<Icon name="tabler:trash" />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t("delete") }}
					</NTooltip>
				</NButtonGroup>
				<LazyTableSearchButton v-model:string="searchString" v-model:array="searchArray" :schema size="small" />
				<NButtonGroup round>
					<NPopover placement="top-start">
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
						:action="`${config.public.apiBase}${database.slug}/assets${currentPath}?${database.slug}_sid=${sessionID}`"
						@update:file-list="onUpdateFileList" :custom-request @remove="onRemoveUpload">
						<NPopover trigger="manual" placement="top-end"
							:show="UploadProgress > 0" scrollable style="max-height: 160px">
							<template #trigger>
								<NUploadTrigger :abstract="false">
									<NButton round size="small"
										:style="isRTL ? 'border-radius: 28px 0 0 28px;' : 'border-radius: 0 28px 28px 0;'"
										:title="`${t('uploadFiles')} · ⌥/Ctrl+click: ${t('uploadFolder')}`"
										@click="handleUploadButtonClick">
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
							<NFlex v-if="UploadProgress === 1001" vertical style="gap: 6px; padding: 2px 0; min-width: 160px;">
								<NText style="font-size: 12px;">
									{{ folderUploadProgress.total > 0
										? `${folderUploadProgress.current} / ${folderUploadProgress.total}`
										: folderUploadProgress.current }}
								</NText>
								<NProgress v-if="folderUploadProgress.total > 0" type="line"
									:percentage="Math.round((folderUploadProgress.current / folderUploadProgress.total) * 100)"
									:show-indicator="false" />
							</NFlex>
							<NUploadFileList v-else />
						</NPopover>
					</NUpload>
				</NButtonGroup>
			</NFlex>
		</template>
		<NFlex vertical align="center">
			<AssetGrid v-model="assets" :isAssetRoute :table :targetID="!targetID ? 'assetsContainer' : targetID"
				:selected-asset-ids="selectedAssetIds" v-model:path="currentPath">
				<template v-slot="slotProps">
					<NCheckbox
						:checked="selectedAssetIdsSet.has(slotProps.asset.id)"
						@update:checked="() => toggleAssetSelection(slotProps.asset.id)"
						/>
					<slot v-bind="slotProps"></slot>
				</template>
			</AssetGrid>
			<NPagination v-if="pagination.itemCount && pagination.pageCount > 1" :simple="!!$device.isMobile"
				:page-sizes="[15, 30, 60, 100, 500]" :show-size-picker="showSizePicker" style="margin-top: 25px;"
				@update:page-size="onUpdatePageSize" @update:page="onUpdatePage" :page="pagination.page"
				:page-size="pagination.pageSize" :item-count="pagination.itemCount" />
		</NFlex>
		</NCard>
	</div>
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
const config = useRuntimeConfig();

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
	`${suffix ? renderLabel({ ...assetsTable.value, label: suffix }, currentItem.value) : ""}${route.params.path
		? `/${([] as string[]).concat(route.params.path).join("/")}`
		: ""
	}`,
);

const sessionID = useSessionCookie();

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
if (!assetsTable.value || assetsTable.value.slug !== "assets")
	assetsTable.value = (
		await $fetch<apiResponse<Table>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/assets`,
			{
				credentials: "include",
				params: {
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		)
	).result;

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const isRTL = computed(() => Language.value === "ar");

const assets = ref<Asset[]>();
const selectedAssetIds = ref<Asset["id"][]>([]);
const bulkDeleteLoading = ref(false);
const bulkDownloadLoading = ref(false);
const bulkZipProgress = ref(0);
const folderUploadProgress = reactive({ current: 0, total: 0 });

const selectedAssetIdsSet = computed(() => new Set(selectedAssetIds.value));
const selectedAssets = computed(() =>
	(assets.value ?? []).filter((asset) => selectedAssetIdsSet.value.has(asset.id)),
);
const allSelectableSelected = computed(
	() => !!(assets.value ?? []).length && selectedAssetIds.value.length === (assets.value ?? []).length,
);

function toggleAssetSelection(id: Asset["id"]) {
	if (!selectedAssetIdsSet.value.has(id)) selectedAssetIds.value = [...selectedAssetIds.value, id];
	else selectedAssetIds.value = selectedAssetIds.value.filter((selectedId) => selectedId !== id);
}

function toggleSelectAllAssets(checked: boolean) {
	if (!checked) {
		selectedAssetIds.value = [];
		return;
	}
	selectedAssetIds.value = (assets.value ?? []).map((asset) => asset.id);
}

function toggleSelectAllFromGroup() {
	if (allSelectableSelected.value) {
		selectedAssetIds.value = [];
		return;
	}
	toggleSelectAllAssets(true);
}

watch(assets, (value) => {
	const currentIds = new Set((value ?? []).map((asset) => asset.id));
	selectedAssetIds.value = selectedAssetIds.value.filter((id) => currentIds.has(id));
});

async function runWithConcurrency<T>(
	items: T[],
	concurrency: number,
	handler: (item: T, index: number) => Promise<void>,
) {
	const queue = items.map((item, index) => ({ item, index }));
	const workerCount = Math.max(1, Math.min(concurrency, queue.length));

	await Promise.all(
		Array.from({ length: workerCount }, async () => {
			while (queue.length) {
				const entry = queue.shift();
				if (!entry) break;
				await handler(entry.item, entry.index);
				await new Promise<void>((resolve) => setTimeout(resolve, 0));
			}
		}),
	);
}

async function deleteSelectedAssets() {
	if (!selectedAssets.value.length || bulkDeleteLoading.value) return;
	if (
		import.meta.client &&
		!window.confirm(`${t("delete")} (${selectedAssets.value.length})?`)
	)
		return;

	bulkDeleteLoading.value = true;
	const deletedIds: Asset["id"][] = [];
	let deletedSize = 0;
	let failedCount = 0;

	try {
		await runWithConcurrency(selectedAssets.value, 4, async (asset) => {
			try {
				await $fetch<apiResponse>(
					`${config.public.apiBase}${database.value.slug}/assets${currentPath.value}/${asset.type === "dir" ? asset.name : asset.id}`,
					{
						method: "DELETE",
						params: {
							locale: Language.value,
							[`${database.value.slug}_sid`]: sessionID.value,
						},
						credentials: "include",
					},
				);

				deletedIds.push(asset.id);
				deletedSize += asset.size ?? 0;
			} catch {
				failedCount += 1;
			}
		});

		if (deletedIds.length) {
			const deletedSet = new Set(deletedIds);
			assets.value = (assets.value ?? []).filter((asset) => !deletedSet.has(asset.id));
			selectedAssetIds.value = selectedAssetIds.value.filter((id) => !deletedSet.has(id));
			if (database.value.size) database.value.size = Math.max(0, database.value.size - deletedSize);
		}

		if (deletedIds.length) window.$message.success(`${deletedIds.length} ${t("success")}`);
		if (failedCount) window.$message.error(`${failedCount} ${t("error")}`);
	} catch (error) {
		console.error("Failed to delete selected assets", error);
		window.$message.error(t("error"));
	} finally {
		bulkDeleteLoading.value = false;
	}
}

function getZipSafeName(asset: Asset, usedNames: Map<string, number>) {
	const extension = asset.extension ? `.${asset.extension}` : "";
	const rawName = `${asset.name}${extension}`;
	const sanitized = rawName.replace(/[\\/:*?"<>|]+/g, "_").trim() || `asset-${asset.id}${extension}`;
	const currentCount = usedNames.get(sanitized) ?? 0;
	usedNames.set(sanitized, currentCount + 1);
	if (!currentCount) return sanitized;
	const nameWithoutExt = sanitized.slice(0, sanitized.length - extension.length);
	return `${nameWithoutExt}-${currentCount + 1}${extension}`;
}

async function fetchAllAssetsInPath(apiPath: string): Promise<Asset[]> {
	const all: Asset[] = [];
	let page = 1;
	while (true) {
		const data = await $fetch<apiResponse<Asset[]>>(
			`${config.public.apiBase}${database.value.slug}/assets${apiPath}`,
			{
				credentials: "include",
				params: {
					options: Inison.stringify({ page, perPage: 500 }),
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		);
		all.push(...(data.result ?? []));
		const totalPages = (data.options?.totalPages as number) ?? 0;
		if (page >= totalPages) break;
		page++;
	}
	return all;
}

async function collectZipFiles(
	assetsToProcess: Asset[],
	apiBasePath: string,
	zipBasePath: string,
): Promise<{ asset: Asset; zipPath: string }[]> {
	const result: { asset: Asset; zipPath: string }[] = [];
	const usedNames = new Map<string, number>();
	for (const asset of assetsToProcess) {
		if (asset.type === "dir") {
			const subApiPath = `${apiBasePath}/${asset.name}`;
			const subZipPath = zipBasePath ? `${zipBasePath}/${asset.name}` : asset.name;
			const subAssets = await fetchAllAssetsInPath(subApiPath);
			result.push(...(await collectZipFiles(subAssets, subApiPath, subZipPath)));
		} else if (asset.publicURL) {
			const fileName = getZipSafeName(asset, usedNames);
			result.push({ asset, zipPath: zipBasePath ? `${zipBasePath}/${fileName}` : fileName });
		}
	}
	return result;
}

async function downloadSelectedAsZip() {
	if (!import.meta.client || !selectedAssets.value.length || bulkDownloadLoading.value) return;

	bulkDownloadLoading.value = true;
	bulkZipProgress.value = 0;

	try {
		const JSZip = (await import("jszip")).default;
		const zip = new JSZip();
		const selected = [...selectedAssets.value];

		const allFiles = await collectZipFiles(selected, currentPath.value, "");

		if (!allFiles.length) throw new Error("No files could be added to zip");

		let addedFiles = 0;

		await runWithConcurrency(allFiles, 3, async ({ asset, zipPath }) => {
			try {
				const response = await fetch(asset.publicURL);
				if (!response.ok) return;
				const blob = await response.blob();
				zip.file(zipPath, blob, { binary: true });
				addedFiles += 1;
				bulkZipProgress.value = Math.round((addedFiles / allFiles.length) * 80);
			} catch {
				// Ignore individual asset failures and continue with the rest.
			}
		});

		if (!addedFiles) throw new Error("No files could be added to zip");

		const zipBlob = await zip.generateAsync(
			{
				type: "blob",
				compression: "STORE",
			},
			(metadata) => {
				bulkZipProgress.value = Math.max(80, Math.round(80 + metadata.percent * 0.2));
			},
		);

		const downloadURL = URL.createObjectURL(zipBlob);
		const anchor = document.createElement("a");
		const zipName = `assets-${new Date().toISOString().replace(/[:.]/g, "-")}.zip`;
		anchor.href = downloadURL;
		anchor.download = zipName;
		anchor.click();
		setTimeout(() => URL.revokeObjectURL(downloadURL), 1000);
		bulkZipProgress.value = 100;
	} catch (error) {
		console.error("Failed to download selected assets as zip", error);
		window.$message.error(t("error"));
	} finally {
		bulkDownloadLoading.value = false;
		bulkZipProgress.value = 0;
	}
}

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

const pagination = reactive({
	page: route.query.page ? Number(route.query.page) : 1,
	pageCount: 1,
	pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
	itemCount: 0,
	async onUpdatePage(currentPage: number) {
		pagination.page = currentPage;
		let { page, ...Query }: any = route.query;
		Query = {
			...Query,
			page: currentPage !== 1 ? currentPage : undefined,
		};
		router.push({ query: Query });
	},
	async onUpdatePageSize(pageSize: number) {
		const OLD_pageSize = toRaw(pagination.pageSize);
		pagination.pageSize = pageSize;
		let { perPage, page, ...Query }: any = route.query;
		if (pageSize !== 15) {
			pagination.page = Math.round(
				OLD_pageSize < pageSize
					? page / (pageSize / OLD_pageSize)
					: page * (pageSize / OLD_pageSize),
			);
			if (Number.isNaN(pagination.page)) pagination.page = 1;
			Query = {
				...Query,
				perPage: pageSize,
				page: pagination.page === 1 ? undefined : pagination.page,
			};
			router.push({
				query: Query,
			});
		}
	},
});

const showSizePicker = ref(false);
async function onUpdatePage(currentPage: number) {
	pagination.page = currentPage;
	let Query = route.query;
	if (currentPage !== 1) Query = { ...Query, page: currentPage as any };
	if (route.params.path || route.params.path === "")
		router.push({ query: (({ page, ...rest }) => rest)(Query) });
	return refresh();
}
async function onUpdatePageSize(currentPageSize: number) {
	const OLD_pageSize = toRaw(pagination.pageSize);
	pagination.pageSize = currentPageSize;
	let Query: { page?: number; perPage?: number } = route.query;
	if (pagination.pageSize !== 15) {
		const newPage = Math.round(
			OLD_pageSize < pagination.pageSize
				? (Query.page ?? 1) / (pagination.pageSize / OLD_pageSize)
				: (Query.page ?? 1) * (pagination.pageSize / OLD_pageSize),
		);
		pagination.page = Number.isNaN(newPage) ? 1 : newPage;
		Query = {
			...Query,
			perPage: pagination.pageSize,
			page: pagination.page,
		};
	}
	if (route.params.path || route.params.path === "")
		router.push({ query: (({ page, perPage, ...rest }) => rest)(Query) });
	return refresh();
}

const queryOptions = computed(() =>
	Inison.stringify({
		page: pagination.page,
		perPage: pagination.pageSize,
	}),
);

const { refresh } = await useLazyFetch<apiResponse<Asset[]>>(
	() => `${config.public.apiBase}${database.value.slug}/assets${currentPath.value}`,
	{
		onRequest: () => {
			Loading.value.AssetData = true;
		},
		onResponse: ({ response: { _data } }) => {
			Loading.value.AssetData = false;

			_data = _data as apiResponse<Asset[]>;

			assets.value = _data.result;

			showSizePicker.value =
				_data.options &&
				(!_data.options.perPage ||
					(_data.options.total as number) > _data.options.perPage);

			pagination.pageCount = _data.options.totalPages ?? 0;
			pagination.itemCount = _data.options.total ?? 0;

			return _data.result;
		},
		query: {
			options: queryOptions,
			where: searchString,
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		credentials: "include",
	},
);

const UploadProgress = ref<number>(0);
let uploadCompleteTimer: ReturnType<typeof setTimeout> | undefined;
function onUpdateFileList(fileList: Required<UploadFileInfo>[]) {
	if (!fileList.length) return;

	const allFinished = fileList.every((f) => f.status === "finished");

	if (allFinished) {
		// Guard against multiple concurrent completion sequences
		if (uploadCompleteTimer !== undefined) return;
		uploadCompleteTimer = setTimeout(() => {
			UploadProgress.value = 10000;
			uploadCompleteTimer = setTimeout(() => {
				UploadProgress.value = 0;
				uploadCompleteTimer = undefined;
			}, 5000);
		}, 2000);
		return;
	}

	// New uploads arrived – cancel any pending completion animation
	if (uploadCompleteTimer !== undefined) {
		clearTimeout(uploadCompleteTimer);
		uploadCompleteTimer = undefined;
	}

	const nonFinished = fileList.filter((f) => f.status !== "finished");
	if (!nonFinished.length) {
		UploadProgress.value = 1000;
		return;
	}

	// Cap at 99 so the circle never shows "100% success" before the check animation
	const avg = nonFinished.reduce((sum, f) => sum + (f.percentage ?? 0), 0) / nonFinished.length;
	UploadProgress.value = Math.max(1, Math.min(99, Math.round(avg)));
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
		`${config.public.apiBase}${database.value.slug
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
		await $fetch<apiResponse>(
			`${config.public.apiBase}${database.value.slug}/assets${currentPath.value}`,
			{
				method: "POST",
				credentials: "include",
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		);
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
	pagination.onUpdatePage(1);
	pagination.itemCount = 0;
});

// --- Drag & Drop ---
const isDragOver = ref(false);
const folderInputRef = ref<HTMLInputElement>();
const dragCounter = ref(0);

function handleUploadButtonClick(e: MouseEvent) {
	// Alt+Click (⌥) or Ctrl+Click → folder picker
	if (e.altKey || e.ctrlKey) {
		e.stopPropagation();
		e.preventDefault();
		folderInputRef.value?.click();
	}
	// Plain click falls through to NUploadTrigger → regular file picker
}

function onDragEnter(e: DragEvent) {
	if (!table.value?.allowedMethods?.includes("c")) return;
	const hasFiles = Array.from(e.dataTransfer?.items ?? []).some(
		(item) => item.kind === "file",
	);
	if (!hasFiles) return;
	dragCounter.value++;
	isDragOver.value = true;
}

function onDragLeave() {
	dragCounter.value--;
	if (dragCounter.value <= 0) {
		isDragOver.value = false;
		dragCounter.value = 0;
	}
}

function onDragOver(e: DragEvent) {
	if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
}

async function readAllDirectoryEntries(
	reader: FileSystemDirectoryReader,
): Promise<FileSystemEntry[]> {
	const all: FileSystemEntry[] = [];
	let batch: FileSystemEntry[];
	do {
		batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
			reader.readEntries(resolve, reject);
		});
		all.push(...batch);
	} while (batch.length > 0);
	return all;
}

async function uploadFileToPath(file: File, targetPath: string) {
	const isVideo = file.type?.startsWith("video/") ?? false;
	const isPdf =
		file.type === "application/pdf" ||
		file.name.toLowerCase().endsWith(".pdf");

	let fileToUpload: File = file;

	if (isVideo) {
		notifyVideoSize(file.size);
		try {
			fileToUpload = await compressVideo(file);
		} catch {
			fileToUpload = file;
			compressionIndicator.value = null;
		}
	} else if (isPdf) {
		notifyPdfSize(file.size);
		try {
			fileToUpload = await compressPdf(file);
		} catch {
			fileToUpload = file;
			compressionIndicator.value = null;
		}
	} else if (file.type?.startsWith("image/")) {
		const optimizationResult = await optimizeFile(file);
		if (optimizationResult.optimized) fileToUpload = optimizationResult.file;
	}

	const { name, extension } = getFileNameAndExtension(fileToUpload.name);
	const mimeType = fileToUpload.type || file.type;
	const action = `${config.public.apiBase}${database.value.slug}/assets${targetPath}?${database.value.slug}_sid=${sessionID.value}`;

	const { result } = await $fetch<apiResponse<Asset>>(action, {
		method: "POST",
		credentials: "include",
		body: { name, size: fileToUpload.size, type: mimeType, extension },
	});

	if (!result.uploadURL) throw new Error("Failed to get upload URL");

	await uploadAssetWithProgress({
		url: result.uploadURL as string,
		method: result.uploadURL.includes("s3") ? "PUT" : "POST",
		headers: { "Content-Type": mimeType as string },
		file: fileToUpload,
	});

	compressionIndicator.value = null;

	if (targetPath === currentPath.value) {
		if (assets.value) assets.value.unshift(result);
		else assets.value = [result];
	}
	if (!database.value.size) database.value.size = 0;
	database.value.size += result.size ?? 0;
}

async function ensureFolderExists(folderPath: string) {
	try {
		await $fetch<apiResponse>(
			`${config.public.apiBase}${database.value.slug}/assets${folderPath}`,
			{
				method: "POST",
				credentials: "include",
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		);
	} catch {
		// Folder may already exist — ignore
	}
}

async function processDroppedEntries(
	entries: FileSystemEntry[],
	basePath: string,
) {
	for (const entry of entries) {
		if (entry.isFile) {
			const file = await new Promise<File>((resolve, reject) => {
				(entry as FileSystemFileEntry).file(resolve, reject);
			});
			try {
				await uploadFileToPath(file, basePath);
			} catch (err) {
				console.error("Drop upload failed for:", entry.name, err);
			} finally {
				folderUploadProgress.current++;
			}
		} else if (entry.isDirectory) {
			const dirPath = `${basePath}/${entry.name}`;
			await ensureFolderExists(dirPath);
			const reader = (entry as FileSystemDirectoryEntry).createReader();
			const subEntries = await readAllDirectoryEntries(reader);
			await processDroppedEntries(subEntries, dirPath);
		}
	}
}

async function onDrop(e: DragEvent) {
	isDragOver.value = false;
	dragCounter.value = 0;

	if (!table.value?.allowedMethods?.includes("c")) return;

	const items = e.dataTransfer?.items;
	if (!items?.length) return;

	const entries: FileSystemEntry[] = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (!item) continue;
		const entry = item.webkitGetAsEntry?.();
		if (entry) entries.push(entry);
	}
	if (!entries.length) return;

	if (uploadCompleteTimer !== undefined) {
		clearTimeout(uploadCompleteTimer);
		uploadCompleteTimer = undefined;
	}
	folderUploadProgress.current = 0;
	folderUploadProgress.total = 0;
	UploadProgress.value = 1001;
	try {
		await processDroppedEntries(entries, currentPath.value);
		UploadProgress.value = 10000;
		await new Promise<void>((resolve) => setTimeout(resolve, 3000));
		UploadProgress.value = 0;
	} catch (err) {
		console.error("Drop upload error:", err);
		UploadProgress.value = 0;
	} finally {
		await refresh();
	}
}

async function onFolderInputChange(e: Event) {
	const input = e.target as HTMLInputElement;
	const files = Array.from(input.files ?? []);
	input.value = "";
	if (!files.length) return;

	if (uploadCompleteTimer !== undefined) {
		clearTimeout(uploadCompleteTimer);
		uploadCompleteTimer = undefined;
	}
	UploadProgress.value = 1001;
	try {
		const dirsNeeded = new Set<string>();
		const uploads: { file: File; targetPath: string }[] = files.map((file) => {
			const relativePath = file.webkitRelativePath || file.name;
			const parts = relativePath.split("/");
			// parts[0] is the root folder name — create it and upload content inside it
			const rootPath = `${currentPath.value}/${parts[0]}`;
			dirsNeeded.add(rootPath);
			const folderParts = parts.slice(1, -1);

			let pathAcc = rootPath;
			for (const part of folderParts) {
				pathAcc = `${pathAcc}/${part}`;
				dirsNeeded.add(pathAcc);
			}

			const targetPath =
				folderParts.length > 0
					? `${rootPath}/${folderParts.join("/")}`
					: rootPath;

			return { file, targetPath };
		});

		// Create directories shallowest-first
		const sortedDirs = Array.from(dirsNeeded).sort(
			(a, b) => a.split("/").length - b.split("/").length,
		);
		folderUploadProgress.current = 0;
		folderUploadProgress.total = uploads.length;
		for (const dir of sortedDirs) {
			await ensureFolderExists(dir);
		}

		for (const { file, targetPath } of uploads) {
			try {
				await uploadFileToPath(file, targetPath);
			} catch (err) {
				console.error("Folder upload failed for:", file.name, err);
			} finally {
				folderUploadProgress.current++;
			}
		}

		UploadProgress.value = 10000;
		await new Promise<void>((resolve) => setTimeout(resolve, 3000));
		UploadProgress.value = 0;
	} catch (err) {
		console.error("Folder upload error:", err);
		UploadProgress.value = 0;
	} finally {
		await refresh();
	}
}

</script>

<style scoped>
.drop-fade-enter-active,
.drop-fade-leave-active {
	transition: opacity 0.15s ease;
}
.drop-fade-enter-from,
.drop-fade-leave-to {
	opacity: 0;
}
</style>