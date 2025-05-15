<template>
	<NCard id="assetsContainer" style="height: fit-content;" :bordered="targetID === 'assetsContainer'">
		<template #header>
			<span v-if="isAssetRoute">{{ t("assets") }}</span>
			<NBreadcrumb v-else>
				<NBreadcrumbItem @click="modelValue = ''">
					{{ t("assets") }}
				</NBreadcrumbItem>
				<NBreadcrumbItem v-for="(singlePath, index) in (modelValue ?? '').split('/').slice(1)"
					@click="modelValue = `/${(modelValue ?? '').split('/').slice(1, index + 1).join('/')}`">
					{{ singlePath }}
				</NBreadcrumbItem>
			</NBreadcrumb>
		</template>
		<template #header-extra>
			<NUpload v-if="table?.allowedMethods?.includes('c')" multiple abstract
				:action="`${appConfig.apiBase}${database.slug}/assets${modelValue ?? ($route.params.folder ? `/${([] as string[]).concat($route.params.folder).join('/')}` : '')}`"
				@update:file-list="onUpdateFileList" @finish="onFinishUpload" @remove="onRemoveUpload">
				<NPopover trigger="manual" placement="bottom-end" :show="UploadProgress > 0">
					<template #trigger>
						<NUploadTrigger :abstract="false">
							<NPopover>
								<template #trigger>
									<NButton round>
										<template #icon>
											<NIcon v-if="!UploadProgress">
												<IconPlus />
											</NIcon>
											<NIcon v-else-if="UploadProgress === 10000">
												<IconCheck />
											</NIcon>
											<NSpin v-else-if="UploadProgress === 1000" :size="16" />
											<NProgress v-else type="circle" :show-indicator="false"
												:status="UploadProgress === 100 ? 'success' : 'warning'"
												:percentage="UploadProgress" :stroke-width="20" />
										</template>
									</NButton>
								</template>
								<NInputGroup>
									<NInput v-model:value="folder"
										@keydown="({ key }: KeyboardEvent) => { if (key === 'Enter') createFolder(); }"
										:placeholder="t('folderName')">
										<template #suffix>
											<NIcon>
												<IconLetterCase />
											</NIcon>
										</template>
									</NInput>
									<NButton @click="createFolder">
										<template #icon>
											<NIcon>
												<IconFolderPlus />
											</NIcon>
										</template>
									</NButton>
								</NInputGroup>
							</NPopover>
						</NUploadTrigger>
					</template>
					<NUploadFileList />
				</NPopover>
			</NUpload>
		</template>
		<NFlex vertical align="center">
			<AssetGrid v-model="assets" :isAssetRoute :table :targetID>
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
import {
	NBreadcrumb,
	NBreadcrumbItem,
	NButton,
	NCard,
	NFlex,
	NIcon,
	NInput,
	NInputGroup,
	NPagination,
	NPopover,
	NProgress,
	NSpin,
	NUpload,
	NUploadFileList,
	NUploadTrigger,
	type UploadFileInfo,
	type UploadSettledFileInfo,
} from "naive-ui";
import {
	IconCheck,
	IconFolderPlus,
	IconLetterCase,
	IconPlus,
} from "@tabler/icons-vue";
import Inison from "inison";

defineTranslation({
	ar: {
		folderName: "إسم المجلد",
	},
});

const { where } = defineProps({
	targetID: {
		type: String,
		default: "assetsContainer",
	},
	where: {
		type: Object,
	},
});
const modelValue = defineModel<string>();
const appConfig = useAppConfig();
const route = useRoute();
const isAssetRoute = !!(route.params.folder || route.params.folder === "");
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const parentTable = useState<Table>("table");
const table = ref<Table>(parentTable.value);
if (!parentTable.value || parentTable.value.slug !== "assets")
	table.value = (
		await $fetch<apiResponse<Table>>(
			`${appConfig.apiBase}inicontent/databases/${database.value.slug}/assets`, { credentials: "include" }
		)
	).result;

const router = useRouter();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const pageSize = ref(route.query.perPage ? Number(route.query.perPage) : 22);
const pageCount = ref(0);
const itemCount = ref(0);
const showSizePicker = ref(false);
async function onUpdatePage(currentPage: number) {
	page.value = currentPage;
	let Query = route.query;
	if (currentPage !== 1) Query = { ...Query, page: currentPage as any };
	if (route.params.folder || route.params.folder === "")
		router.push({ query: (({ page, ...rest }) => rest)(Query) });
	return refreshAssets();
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
	if (route.params.folder || route.params.folder === "")
		router.push({ query: (({ page, perPage, ...rest }) => rest)(Query) });
	return refreshAssets();
}

const Language = useCookie<LanguagesType>("language", { sameSite: true });

const { data: assets, refresh: refreshAssets } = await useLazyAsyncData(
	`assets${modelValue.value ?? (route.params.folder ? `/${([] as string[]).concat(route.params.folder).join("/")}` : "")}`,
	() =>
		$fetch<apiResponse<Asset[]>>(
			`${appConfig.apiBase}${database.value.slug}/assets${modelValue.value ?? (route.params.folder ? `/${([] as string[]).concat(route.params.folder).join("/")}` : "")}`,
			{
				onRequest: () => {
					Loading.value.AssetData = true;
				},
				query: {
					options: Inison.stringify({
						page: page.value,
						perPage: pageSize.value,
					}),
					where: where ? Inison.stringify(where) : undefined,
					locale: Language.value
				}, credentials: "include"
			},
		),
	{
		transform: ({ result, options: { totalPages, total } }) => {
			Loading.value.AssetData = false;

			if (total === 0) showSizePicker.value = false;
			if (totalPages && total) {
				pageCount.value = totalPages;
				itemCount.value = total;
			}
			return result;
		},
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
function onFinishUpload({
	file,
	event,
}: {
	file: UploadSettledFileInfo;
	event?: ProgressEvent;
}): UploadFileInfo | undefined | void {
	if ((event?.target as any)?.response) {
		const response: apiResponse<Asset> = JSON.parse(
			(event?.target as any).response,
		);
		file.url = response.result.publicURL;
		file.name = response.result.id as string;
		if (assets.value) assets.value?.push(response.result);
		else assets.value = [response.result];
		if (!database.value.size) database.value.size = 0;
		database.value.size += response.result.size ?? 0;
		return file;
	}
	return file;
}
async function onRemoveUpload({ file }: { file: Required<UploadFileInfo> }) {
	const data = await $fetch<apiResponse<Asset>>(
		`${appConfig.apiBase}${database.value.slug
		}/assets${modelValue.value ?? (route.params.folder ? `/${([] as string[]).concat(route.params.folder).join("/")}` : "")}/${file.name}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value
			}, credentials: "include"
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
		modelValue.value = `${modelValue.value ?? (route.params.folder ? `/${([] as string[]).concat(route.params.folder).join("/")}` : "")}/${folder.value}`;
		window.$message.success(t("folderCreatedSuccessfully"));
		if (isAssetRoute)
			await navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/assets${modelValue.value}`,
			);
	}
}

watch(modelValue, () => {
	page.value = 1;
	itemCount.value = 0;
	refreshAssets();
});
</script>
