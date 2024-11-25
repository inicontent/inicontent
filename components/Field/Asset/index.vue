<template>
	<NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
		? typeof field.labelProps === 'function'
			? field.labelProps(modelValue) ?? {}
			: field.labelProps
		: {})">
		<template #label>
			<NFlex align="center" size="small">
				<NFlex v-if="field.description" align="center" :size="0">
					{{ t(field.key) }}
					<NTooltip>
						<template #trigger>
							<NButton circle text size="tiny">
								<template #icon>
									<NIcon>
										<IconQuestionMark />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t(field.description) }}
					</NTooltip>
				</NFlex>
				<template v-else>{{ t(field.key) }}</template>
				<LazyFieldAssetActions v-model:showAssetsModal="showAssetsModal" :field
					:callback="importAssetCallback" />
			</NFlex>
		</template>

		<NUpload directory-dnd :max="!field.isArray ? 1 : undefined" :multiple="!!field.isArray"
			:accept="generateAcceptedFileType(field.accept)"
			:action="`${appConfig.apiBase}${database.slug ?? 'inicontent'}/assets${field.params ? `?${field.params}` : ''}`"
			response-type="json" :fileList @update:file-list="setModelValue" :onFinish :onPreview
			:list-type="!field.isTable ? 'image' : 'image-card'">
			<template v-if="!field.isTable">
				<NUploadDragger>
					<NIcon size="48" depth="3">
						<IconUpload />
					</NIcon>
				</NUploadDragger>
			</template>
			<template v-else>
				<NFlex align="center" size="small">
					<LazyFieldAssetActions v-model:showAssetsModal="showAssetsModal" :field
						:callback="importAssetCallback" />
				</Nflex>
			</template>
		</NUpload>

		<NDrawer v-model:show="showAssetsModal" defaultHeight="50%" placement="bottom" resizable>
			<NDrawerContent id="assetsModal" :nativeScrollbar="false" :bodyContentStyle="{ padding: 0 }">
				<AssetCard targetID="assetsModal">
					<template v-slot="{ asset }">
						<NRadio v-if="asset.type !== 'dir'" :checked="getChecked(asset)"
							@update:checked="handleSelectAsset(asset)" />
					</template>
				</AssetCard>
			</NDrawerContent>
		</NDrawer>
	</NFormItem>
</template>

<script lang="ts" setup>
import { IconQuestionMark, IconUpload } from "@tabler/icons-vue";
import {
	NButton,
	NFlex,
	NIcon,
	NTooltip,
	NDrawer,
	NDrawerContent,
	NFormItem,
	NRadio,
	NUpload,
	NUploadDragger,
	type FormItemRule,
	type UploadFileInfo,
} from "naive-ui";
import { isArrayOfObjects, isObject } from "inibase/utils";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<string | Asset | (string | Asset)[]>();
watch(modelValue, () => {
	fileList.value = getFileList();
});

const appConfig = useAppConfig();
const rule: FormItemRule = {
	type: field.isArray ? "array" : "object",
	required: field.required,
	trigger: ["input", "change"],
	min: field.isArray ? field.min : undefined,
	max: field.isArray ? field.max : undefined,
	validator() {
		if (
			!modelValue.value ||
			(Array.isArray(modelValue.value) && modelValue.value.length === 0)
		)
			return field.required
				? new Error(`${t(field.key)} ${t("isRequired")}`)
				: true;
		if (
			Array.isArray(modelValue.value) &&
			field.min &&
			modelValue.value.length < field.min
		)
			return new Error(`${t(field.key)} ${t("isNotValid")}`);
		if (
			Array.isArray(modelValue.value) &&
			field.max &&
			modelValue.value.length > field.max
		)
			return new Error(`${t(field.key)} ${t("isNotValid")}`);
	},
};

const database = useState<Database>("database");
const showAssetsModal = ref(false);

function generateAcceptedFileType(types: Field["accept"]) {
	if (!types) return undefined;
	const RETURN = [];
	for (const type of types) {
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
}

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
}

function getFileList() {
	return ([] as (Asset | string)[])
		.concat(modelValue.value ?? [])
		.map((asset) =>
			typeof asset === "string"
				? {
						id: asset,
						name: asset.split("/").pop(),
						status: "finished",
						url: asset,
						type: field.accept?.includes("image") ? "image/jpeg" : undefined,
						thumbnailUrl:
							field.accept?.includes("image") && !field.params?.includes("fit")
								? `${asset}?fit=94`
								: undefined,
					}
				: {
						id: asset.id,
						name: asset.id,
						status: "finished",
						url: (asset as Asset).publicURL,
						type: asset.type,
						thumbnailUrl:
							asset.type?.startsWith("image/") && !field.params?.includes("fit")
								? `${(asset as Asset).publicURL}?fit=94`
								: undefined,
					},
		) as UploadFileInfo[];
}

const fileList = ref<undefined | UploadFileInfo[]>(getFileList());
function setModelValue(value?: UploadFileInfo[]) {
	fileList.value = value;

	if (value) {
		if (
			value.length &&
			value.length ===
				value.filter(({ status }) => status === "finished").length
		) {
			const finalFileList = value
				.filter(({ status }) => status === "finished")
				.map(({ name, url, type, file }) => ({
					id: name,
					type,
					publicURL: url,
					size: file?.size ?? 0,
					createdAt: file?.lastModified ?? 0,
				})) as Asset[];
			if (finalFileList.length)
				modelValue.value = field.isArray ? finalFileList : finalFileList[0];
			else modelValue.value = undefined;
		}
	} else modelValue.value = undefined;
}

function onFinish({
	file,
	event,
}: {
	file: UploadFileInfo;
	event?: ProgressEvent;
}) {
	const result = (
		(event?.target as XMLHttpRequest).response as apiResponse<Asset>
	).result;
	file.url = result.publicURL;
	file.type = result.type;
	file.name = result.id as string;
	// file.id = result.id as string;
	return file;
}

function onPreview({ url }: UploadFileInfo) {
	if (url && !!field.isArray) return window.open(url, "blank")?.focus();
	return undefined;
}

const getChecked = (asset: Asset) =>
	([] as (Asset | string)[])
		.concat(modelValue.value ?? [])
		.findIndex((value) =>
			typeof value === "string"
				? value === asset.publicURL
				: value.id === asset.id,
		) > -1;
</script>