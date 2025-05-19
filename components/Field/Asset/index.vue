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
			response-type="json" :fileList @update:file-list="setModelValue" :onFinish
			:list-type="!field.isTable ? 'image' : 'image-card'" with-credentials>
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
							<NCheckbox v-if="asset.type === 'dir'" :checked="getChecked(asset)"
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
import {
	type FormItemRule,
	type UploadFileInfo,
} from "naive-ui"

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
				thumbnailUrl:
					field.accept?.includes("image") && !field.params?.includes("fit")
						? `${asset}`
						: undefined,
			}
			: {
				id: asset.id,
				name: asset.name || asset.id,
				status: "finished",
				url: (asset as Asset).publicURL,
				type: asset.type,
				thumbnailUrl:
					asset.type?.startsWith("image/") && !field.params?.includes("fit")
						? `${(asset as Asset).publicURL}`
						: undefined,
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
					.map(({ id, name, url, type, file }) => ({
						id: fileIdObject.value[id],
						name,
						type,
						publicURL: url,
						size: file?.size ?? 0,
						createdAt: file?.lastModified ?? 0,
					})) as Asset[]
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