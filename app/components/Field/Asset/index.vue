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
			:action="`${appConfig.apiBase}${database.slug ?? 'inicontent'}/assets${field.params ? `?${field.params}` : ''}`"
			response-type="json" :fileList @update:file-list="setModelValue" :onBeforeUpload="handleBeforeUpload"
			:onFinish="onFinish" :list-type="!field.isTable ? 'image' : 'image-card'" :renderIcon
			:shouldUseThumbnailUrl="() => false" with-credentials>
			<NUploadDragger v-if="!field.isTable">
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
				<AssetCard targetID="assetsModal" :where="assetWhere">
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
import { isArrayOfObjects, isObject } from "inibase/utils"
import type { FormItemRule, UploadFileInfo } from "naive-ui"
import { Icon, NImage, NTooltip } from "#components"
import type { OnBeforeUpload } from "naive-ui/es/upload/src/interface";

const { field } = defineProps<{ field: Field }>()

const modelValue = defineModel<string | Asset | (string | Asset)[]>()

const Language = useCookie<LanguagesType>("language", { sameSite: true })

const appConfig = useAppConfig()
const rule: FormItemRule = {
	type: field.isArray ? "array" : "object",
	required: field.required,
	min: field.isArray ? field.min : undefined,
	max: field.isArray ? field.max : undefined,
	validator: async () => {
		await nextTick()
		return fieldValidator(field, modelValue.value)
	},
}

const database = useState<Database>("database")
const showAssetsModal = ref(false)

const acceptedFileType = computed(() => {
	if (!field.accept) return undefined
	const RETURN = []
	for (const type of field.accept) {
		switch (type) {
			case "image":
				RETURN.push("image/*")
				break
			case "video":
				RETURN.push("video/*")
				break
			case "audio":
				RETURN.push("audio/*")
				break
			case "document":
				RETURN.push(".doc, .docx, .pdf, .txt, .rtf, .odt")
				break
			case "archive":
				RETURN.push(".zip, .rar, .7z, .tar, .gz")
				break
		}
	}
	return RETURN.join(",")
})

const assetWhere = computed(() => {
	if (!field.accept) return undefined
	let whereType = "[]"
	for (const type of field.accept) {
		switch (type) {
			case "image":
				whereType += "image/png,image/jpeg,image/webp,image/avif,"
				break
			case "video":
				whereType +=
					"video/mp4, video/mpeg, video/quicktime, video/x-msvideo, video/x-flv, video/webm, video/ogg, video/3gpp, video/3gpp2, video/x-matroska, video/vnd.mpegurl, video/h264, video/x-ms-wmv, video/x-ms-asf,"
				break
			case "audio":
				whereType +=
					"audio/mpeg, audio/wav, audio/ogg, audio/aac, audio/flac, audio/mp4, audio/x-wav, audio/midi, audio/x-midi, audio/x-pn-wav, audio/x-aiff, audio/x-flac, audio/webm, audio/3gpp, audio/3gpp2, audio/amr, audio/x-ms-wma, audio/vnd.rn-realaudio, audio/vnd.wave,"
				break
			case "document":
				whereType +=
					"application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, text/plain, application/rtf, application/vnd.oasis.opendocument.text,"
				break
			case "archive":
				whereType +=
					"application/zip, application/x-rar-compressed, application/x-7z-compressed, application/x-tar, application/gzip,"
				break
		}
	}
	return { type: whereType.slice(0, -1) }
})

function importAssetCallback(assets: Asset | Asset[]) {
	const isModelValueTable = field.type !== "url" && field.children !== "url"
	const value = ([] as Asset[])
		.concat(assets)
		.map((asset) => (isModelValueTable ? asset : asset.publicURL))

	if (field.isArray)
		modelValue.value = [
			...(modelValue.value
				? Array.isArray(modelValue.value)
					? modelValue.value
					: [modelValue.value]
				: []),
			...value,
		]
	else modelValue.value = value[0]

	nextTick(() => {
		fileList.value = getFileList()
	})
}

function handleSelectAsset(asset?: Asset) {
	if (!asset) return

	const value =
		field.type === "url" || field.children === "url" ? asset.publicURL : asset

	if (!field.isArray) {
		if (
			modelValue.value &&
			!Array.isArray(modelValue.value) &&
			((typeof modelValue.value === "string" &&
				modelValue.value === asset.publicURL) ||
				(isObject(modelValue.value) && modelValue.value.id === asset.id))
		)
			modelValue.value = undefined
		else modelValue.value = value
	} else {
		if (modelValue.value && Array.isArray(modelValue.value)) {
			const index = isArrayOfObjects(modelValue.value)
				? (modelValue.value as Asset[]).findIndex(
					(value) => value.id === asset.id,
				)
				: (modelValue.value as string[]).indexOf(asset.publicURL)
			if (index > -1) modelValue.value.splice(index, 1)
			else modelValue.value.push(value)
		} else modelValue.value = [value]
	}

	nextTick(() => {
		fileList.value = getFileList()
	})
}

function getFileList() {
	if (!modelValue.value) return

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
	) as UploadFileInfo[]
}

const fileList = ref<undefined | UploadFileInfo[]>(getFileList())
async function setModelValue(value?: (UploadFileInfo & { _id?: string })[]) {
	fileList.value = value

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
					) as Asset[]
				if (finalFileList.length) {
					modelValue.value = field.isArray ? finalFileList : finalFileList[0]
					await nextTick()
					fileList.value = getFileList()
				} else modelValue.value = undefined
			}
		} else modelValue.value = undefined
	} else modelValue.value = undefined
}
const fileIdObject = ref<Record<string, string>>({})
function onFinish({
	file,
	event,
}: {
	file: UploadFileInfo & { _id?: string }
	event?: ProgressEvent
}) {
	const result = (
		(event?.target as XMLHttpRequest).response as apiResponse<Asset>
	).result
	file.url = result.publicURL
	file.type = result.type
	file.name = (result.name || result.id) as string
	fileIdObject.value[file.id] = result.id as string
	return file
}

const handleBeforeUpload: OnBeforeUpload = async ({ file: fileObject }) => {
	if (!appConfig.fileBase || !fileObject.file) return true
	const assetsUrl = `${appConfig.apiBase}${database.value.slug ?? 'inicontent'}/assets${field.params ? `?${field.params}` : ''}`
	try {
		const fd = new FormData()
		fd.append('file', fileObject.file)
		const fbResponse = await fetch(appConfig.fileBase, { method: 'POST', body: fd, credentials: 'include' })
		const fbJson = await fbResponse.json()
		if (fbJson?.error) return true

		const assetsResponse = await fetch(assetsUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(fbJson),
			credentials: 'include',
		})
		const assetsJson = await assetsResponse.json()
		const result = (assetsJson?.result) ? assetsJson.result : fbJson

		const id = `${String(Date.now())}-${fileObject.name || Math.random().toString(36).slice(2)}`
		const uploadFile: any = {
			id,
			name: result.name || fileObject.name,
			status: 'finished',
			url: result.publicURL || result.url,
			type: result.type || fileObject.type || (field.accept?.includes('image') ? 'image/jpeg' : undefined),
			file: fileObject.file,
		}

		fileIdObject.value[id] = (result && (result.id || result._id)) ? (result.id || result._id) : id
		fileList.value = [...(fileList.value || []), uploadFile]
		await nextTick()
		await setModelValue(fileList.value)
		// onFinish({ file: uploadFile, event: { target: { response: JSON.stringify({ result }) } } } as any)
		return false
	} catch (e) {
		return true
	}
}

function renderIcon(file: UploadFileInfo) {
	if (
		file.url &&
		file.type &&
		(file.type.startsWith("image/") || file.type === "application/pdf")
	)
		return h(NImage, {
			src: file.type === "application/pdf" ? `${file.url}?raw` : file.url,
			previewSrc:
				file.type === "application/pdf" ? `${file.url}?raw` : file.url,
			width: 100,
			height: 100,
			style: "height: 100%; width: 100%",
			objectFit: "cover",
			renderToolbar: ({
				nodes: {
					rotateCounterclockwise,
					rotateClockwise,
					resizeToOriginalSize,
					zoomOut,
					zoomIn,
					download,
					close,
				},
			}) => {
				if (download.props && file.url)
					download.props.onClick = (event: MouseEvent) => {
						event?.preventDefault()
						window.open(file.url as string, "_blank")
						close?.props?.onClick?.()
					}
				return [
					h(
						NTooltip,
						{},
						{
							default: () => file.name,
							trigger: () =>
								h(
									"i",
									{ class: "n-base-icon" },
									h(Icon, { name: "tabler:info-circle-filled" }),
								),
						},
					),
					rotateCounterclockwise,
					rotateClockwise,
					zoomIn,
					zoomOut,
					resizeToOriginalSize,
					download,
					close,
				]
			},
		})
	return h(Icon, {
		name: file.type?.startsWith("image/") ? "tabler:photo" : "tabler:file",
	})
}

const getChecked = (asset: Asset) =>
	!!modelValue.value &&
	([] as (Asset | string)[])
		.concat(modelValue.value)
		.findIndex((value) =>
			typeof value === "string"
				? value === asset.publicURL
				: value.id === asset.id,
		) > -1
</script>