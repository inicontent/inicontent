<template>
	<NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
		? typeof field.labelProps === 'function'
			? field.labelProps(modelValue) ?? {}
			: field.labelProps
		: {})">
		<template #label>
			<NFlex align="center">
				{{ t(field.key) }}
				<LazyRenderFieldUploadActions v-model:showAssetsModal="showAssetsModal"
					:callback="handleSelectAssets" />
			</NFlex>
		</template>

		<NUpload directory-dnd :onUpdateFileList :max="!field.isArray ? 1 : undefined" :multiple="!!field.isArray"
			:accept="generateAcceptedFileType(field.accept)"
			:action="`${appConfig.apiBase}${database.slug ?? 'inicontent'}/asset`" response-type="json" :fileList
			:onFinish :onPreview :list-type="!field.isTable ? 'image' : 'image-card'">
			<template v-if="!field.isTable">
				<NUploadDragger>
					<NIcon size="48" depth="3">
						<IconUpload />
					</NIcon>
				</NUploadDragger>
			</template>
			<template v-else>
				<NFlex align="center" size="small">
					<LazyRenderFieldUploadActions v-model:showAssetsModal="showAssetsModal"
						:callback="handleSelectAssets" />
				</Nflex>
			</template>
		</NUpload>

		<NDrawer v-model:show="showAssetsModal" defaultHeight="50%" placement="bottom" resizable>
			<NDrawerContent id="assetsModal" :nativeScrollbar="false" :bodyContentStyle="{ padding: 0 }">
				<AssetCard targetID="assetsModal">
					<template v-slot="{ asset }">
						<NRadio v-if="asset.type !== 'dir'" :checked="getChecked(asset)"
							@update:checked="handleSelectAssets(asset)" />
					</template>
				</AssetCard>
			</NDrawerContent>
		</NDrawer>
	</NFormItem>
</template>

<script lang="ts" setup>
import {
	NDrawer,
	NDrawerContent,
	NFormItem,
	NIcon,
	NRadio,
	NFlex,
	NUpload,
	NUploadDragger,
	type FormItemRule,
	type UploadFileInfo,
} from "naive-ui";
import { IconUpload } from "@tabler/icons-vue";
import { isArrayOfObjects, isObject } from "inibase/utils";

const { field } = defineProps({
	field: {
		type: Object as PropType<Field>,
		required: true,
	},
});

const modelValue = defineModel<string | Asset | (string | Asset)[]>();
const appConfig = useAppConfig()
const rule: FormItemRule = {
	type: field.isArray ? "array" : "object",
	required: field.required,
	trigger: "change",
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

const generateAcceptedFileType = (types: Field["accept"]) => {
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
};

function handleSelectAssets(asset?: Asset) {
	if (!asset) return;
	const value = field.type === 'url' || field.children === 'url' ? asset.publicURL : asset

	if (!field.isArray) {
		if (
			modelValue.value &&
			!Array.isArray(modelValue.value) &&
			((typeof modelValue.value === "string" && modelValue.value === asset.publicURL) || (isObject(modelValue.value) && modelValue.value.id === asset.id))
		)
			modelValue.value = undefined;
		else
			modelValue.value = value;
	} else {
		if (modelValue.value && Array.isArray(modelValue.value)) {
			const index = isArrayOfObjects(modelValue.value) ? (modelValue.value as Asset[]).findIndex(
				(value) => value.id === asset.id,
			) : (modelValue.value as string[]).indexOf(asset.publicURL);
			if (index > -1) modelValue.value.splice(index, 1);
			else modelValue.value.push(value);
		} else modelValue.value = [value];
	}
}

function onUpdateFileList(files: UploadFileInfo[]) {
	if (files.every((file) => !file)) modelValue.value = undefined;
	else
		modelValue.value = (!field.isArray
			? files.filter((file) => file)[0]
			: files.filter((file) => file)) as unknown as Asset | Asset[];
}

const fileList = computed(() =>
	(
		(Array.isArray(modelValue.value)
			? modelValue.value
			: [modelValue.value]) as (Asset | string)[]
	).filter(asset => asset).map((asset) => typeof asset === "string" ? ({
		id: asset,
		name: asset.split("/").pop(),
		status: "finished",
		url: asset,
		type: field.accept?.includes('image') ? 'image/jpeg' : undefined,
		thumbnailUrl: field.accept?.includes('image')
			? `${asset}?fit=94`
			: undefined,
	}) : ({
		id: asset.id as string,
		name: asset.id as string,
		status: "finished",
		url: asset.publicURL,
		type: asset.type,
		thumbnailUrl: asset.type?.startsWith("image/")
			? `${asset.publicURL}?fit=94`
			: undefined,
	})) as UploadFileInfo[],
);

function onFinish({
	file,
	event,
}: {
	file: UploadFileInfo;
	event?: ProgressEvent;
}) {
	if ((event?.target as XMLHttpRequest).response) {
		file.url = (event?.target as XMLHttpRequest).response.result.publicURL;
		file.name = (event?.target as XMLHttpRequest).response.result.id;
		return file;
	}
	return file;
}

function onPreview({ url }: UploadFileInfo) {
	if (url && !!field.isArray) return window.open(url, "blank")?.focus();
	return undefined;
}

const getChecked = (asset: Asset) =>
	([] as (Asset | string)[])
		.concat(modelValue.value ?? [])
		.findIndex((value) => typeof value === "string" ? value === asset.publicURL : value.id === asset.id) > -1;
</script>