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
			:action="`${appConfig.apiBase}${database.slug ?? 'inicontent'}/assets${field.suffix ? renderLabel({ ...table, label: field.suffix }, currentItem) : ''}${field.suffix?.includes('?') ? '&' : '?'}${database.slug}_sid=${sessionID}`"
			:fileList @update:file-list="setModelValue" :custom-request
			:list-type="!field.isTable ? 'image' : 'image-card'" :renderIcon :shouldUseThumbnailUrl="() => false">
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
import { isArrayOfObjects, isObject } from "inibase/utils"
import type { FormItemRule, UploadCustomRequestOptions, UploadFileInfo } from "naive-ui"
import { Icon, NImage, NTooltip } from "#components"
import { imageExtensions } from "~/composables";

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

function customRequest({
	file,
	headers,
	action,
	onFinish,
	onError,
	onProgress
}: UploadCustomRequestOptions) {
	$fetch<apiResponse<Asset>>(action as string, {
		method: 'POST',
		credentials: 'include',
		headers: headers as Record<string, string>,
		body: { name: file.name, size: file.file?.size, type: file.type, extension: file?.name.split('.').pop() },
	})
		.then(({ result }) => {
			onProgress({ percent: 50 })

			// const formData = new FormData();
			// formData.append("file", file.file);
			$fetch(result.uploadURL as string, {
				method: result.uploadURL.includes('s3') ? 'PUT' : 'POST',
				headers: { "Content-Type": file.type as string },
				body: file.file,
			}).then(() => {
				onProgress({ percent: 100 })

				file.url = result.publicURL
				file.status = "finished"
				fileIdObject.value[file.id] = result.id as string
				fileList.value = [...(fileList.value || []), file]
				if (!database.value.size) database.value.size = 0
				database.value.size += result.size ?? 0

				setModelValue(fileList.value)


				onFinish()
			})
		})
		.catch((error) => {
			console.error(error)
			onError()
		})
}

const table = useState<Table>("table")
const currentItem = useState<Item>("currentItem")

function renderIcon(file: UploadFileInfo & { extension?: string }) {
	file.extension = file.name?.split(".").pop() || ""
	if (
		file.url &&
		file.type &&
		(imageExtensions.includes(file.extension) || (file.extension === "pdf" && file.url.startsWith('https://cdn.inicontent.com/')))
	)
		return h(NImage, {
			src: file.extension === "pdf" ? `${file.url}?raw` : file.url,
			previewSrc:
				file.extension === "pdf" ? `${file.url}?raw` : file.url,
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
		name: file.extension && imageExtensions.includes(file.extension) ? "tabler:photo" : "tabler:file",
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

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})
</script>