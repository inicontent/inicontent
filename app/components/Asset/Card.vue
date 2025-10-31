<template>
	<NCard id="assetsContainer" style="height: fit-content;" :bordered="!targetID">
		<template #header>
			<span v-if="isAssetRoute">{{ t("assets") }}</span>
			<NBreadcrumb v-else>
				<NBreadcrumbItem @click="currentPath = ''">
					{{ t("assets") }}
				</NBreadcrumbItem>
				<NBreadcrumbItem v-for="(singlePath, index) in currentPath.split('/').slice(1)"
					@click="currentPath = `${currentPath.split('/').slice(0, index + 2).join('/')}`">
					{{ singlePath }}
				</NBreadcrumbItem>
			</NBreadcrumb>
		</template>
		<template #header-extra>
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
					@update:file-list="onUpdateFileList" @finish="onFinishUpload" :onBeforeUpload="handleBeforeUpload"
					@remove="onRemoveUpload" with-credentials>
					<NPopover trigger="manual" placement="bottom-end"
						:show="UploadProgress > 0 && UploadProgress !== 1001">
						<template #trigger>
							<NUploadTrigger :abstract="false">
								<NButton round size="small"
									:style="isRTL ? 'border-radius: 28px 0 0 28px;' : 'border-radius: 0 28px 28px 0;'">
									<template #icon>
										<NIcon v-if="!UploadProgress">
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
import Inison from "inison"

defineTranslation({
	ar: {
		folderCreatedSuccessfully: "تم إنشاء المجلد بنجاح",
		folderNameRequired: "إسم المجلد مطلوب",
		folderName: "إسم المجلد",
	},
})

const { where, suffix } = defineProps<{
	targetID?: string
	where?: any
	suffix?: string
}>()
const appConfig = useAppConfig()

const route = useRoute()
const isAssetRoute = !!(route.params.path || route.params.path === "")

const table = useState<Table>("table")
const currentItem = useState<Item>("currentItem")
const assetsTable = ref<Table>(table.value)

const currentPath = ref<string>(
	`${suffix ? renderLabel({ ...assetsTable.value, label: suffix }, currentItem.value) : ""}${route.params.path
		? `/${([] as string[]).concat(route.params.path).join("/")}`
		: ""
	}`,
)

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
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
	).result

const router = useRouter()
const page = ref(route.query.page ? Number(route.query.page) : 1)
const pageSize = ref(route.query.perPage ? Number(route.query.perPage) : 22)
const pageCount = ref(0)
const itemCount = ref(0)
const showSizePicker = ref(false)
async function onUpdatePage(currentPage: number) {
	page.value = currentPage
	let Query = route.query
	if (currentPage !== 1) Query = { ...Query, page: currentPage as any }
	if (route.params.path || route.params.path === "")
		router.push({ query: (({ page, ...rest }) => rest)(Query) })
	return refresh()
}
async function onUpdatePageSize(currentPageSize: number) {
	const OLD_pageSize = toRaw(pageSize.value)
	pageSize.value = currentPageSize
	let Query: { page?: number; perPage?: number } = route.query
	if (pageSize.value !== 15) {
		const newPage = Math.round(
			OLD_pageSize < pageSize.value
				? (Query.page ?? 1) / (pageSize.value / OLD_pageSize)
				: (Query.page ?? 1) * (pageSize.value / OLD_pageSize),
		)
		page.value = Number.isNaN(newPage) ? 1 : newPage
		Query = {
			...Query,
			perPage: pageSize.value,
			page: page.value,
		}
	}
	if (route.params.path || route.params.path === "")
		router.push({ query: (({ page, perPage, ...rest }) => rest)(Query) })
	return refresh()
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })
const isRTL = computed(() => Language.value === "ar")

const assets = ref<Asset[]>()
const { refresh } = await useLazyAsyncData(
	`assets${currentPath.value}`,
	() =>
		$fetch<apiResponse<Asset[]>>(
			`${appConfig.apiBase}${database.value.slug}/assets${currentPath.value}`,
			{
				onRequest: () => {
					Loading.value.AssetData = true
				},
				query: {
					options: Inison.stringify({
						page: page.value,
						perPage: pageSize.value,
					}),
					where: where ? Inison.stringify(where) : undefined,
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		),
	{
		transform: ({ result, options: { totalPages, total } }) => {
			assets.value = result

			Loading.value.AssetData = false

			if (total === 0) showSizePicker.value = false
			if (totalPages && total) {
				pageCount.value = totalPages
				itemCount.value = total
			}
			return result
		},
	},
)

const UploadProgress = ref<number>(0)
async function onUpdateFileList(fileList: Required<UploadFileInfo>[]) {
	if (fileList.length) {
		if (UploadProgress.value < 100) {
			UploadProgress.value =
				fileList
					.filter((file) => file.status !== "finished")
					.reduce((sum, file) => sum + (file.percentage ?? 0), 0) /
				fileList.filter((file) => file.status !== "finished").length
			if (UploadProgress.value === 0) UploadProgress.value = 1
		} else {
			if (fileList.every((file) => file.status === "finished")) {
				await new Promise<void>((resolve) => setTimeout(resolve, 2000))
				UploadProgress.value = 10000
				await new Promise<void>((resolve) => setTimeout(resolve, 5000))
				UploadProgress.value = 0
			} else UploadProgress.value = 1000
		}
	}
}
function onFinishUpload({
	file,
	event,
}: {
	file: UploadSettledFileInfo
	event?: ProgressEvent
}): UploadFileInfo | undefined | void {
	if ((event?.target as any)?.response) {
		const response: apiResponse<Asset> = JSON.parse(
			(event?.target as any).response,
		)
		file.url = response.result.publicURL
		file.name = response.result.id as string
		if (assets.value) assets.value?.unshift(response.result)
		else assets.value = [response.result]
		if (!database.value.size) database.value.size = 0
		database.value.size += response.result.size ?? 0
		return file
	}
	return file
}
const handleBeforeUpload: OnBeforeUpload = async ({ file: fileObject }) => {
	if (!appConfig.fileBase || !fileObject.file) return true
	const assetsUrl = `${appConfig.apiBase}${database.value.slug}/assets${currentPath.value}?${database.value.slug}_sid=${sessionID.value}`
	try {
		if (UploadProgress.value === 0) UploadProgress.value = 1001
		const fd = new FormData()
		fd.append("file", fileObject.file)
		const fbResponse = await fetch(appConfig.fileBase, {
			method: "POST",
			body: fd,
			credentials: "include",
		})
		const fbJson = await fbResponse.json()
		if (fbJson?.error) return true

		const assetsResponse = await fetch(assetsUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(fbJson),
			credentials: "include",
		})
		const assetsJson = await assetsResponse.json()
		const result = assetsJson?.result ? assetsJson.result : fbJson

		if (assets.value) assets.value?.unshift(result)
		else assets.value = [result]

		if (!database.value.size) database.value.size = 0
		database.value.size += result.size ?? 0

		return false
	} catch (e) {
		return true
	}
}
async function onRemoveUpload({ file }: { file: Required<UploadFileInfo> }) {
	const data = await $fetch<apiResponse<Asset>>(
		`${appConfig.apiBase}${database.value.slug
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
		singleAsset = assets.value?.find((asset) => asset.name === file.name)
	if (data.result) {
		if (assets.value)
			assets.value = assets.value.filter((asset) => asset.name !== file.name)
		window.$message.success(data?.message ?? t("success"))
		if (database.value.size) database.value.size -= singleAsset?.size ?? 0
		return true
	}
	window.$message.error(data?.message ?? t("error"))
	return false
}

const folder = ref()
async function createFolder() {
	if (folder.value) {
		currentPath.value += `/${folder.value}`
		window.$message.success(t("folderCreatedSuccessfully"))
		await nextTick()
		if (isAssetRoute)
			await navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/assets${currentPath.value}`,
			)
		folder.value = ""
	} else
		window.$message.error(t("folderNameRequired"))
}

watch(currentPath, () => {
	page.value = 1
	itemCount.value = 0
	refresh()
})
</script>
