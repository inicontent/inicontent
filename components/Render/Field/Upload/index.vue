<template>
	<NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
		? typeof field.labelProps === 'function'
			? field.labelProps(modelValue) ?? {}
			: field.labelProps
		: {})">
		<template #label>
			<NFlex align="center">
				{{ t(field.key) }}
				<LazyUploadActions v-model="showAssetsModal" :callback="handleSelectAssets" />
			</NFlex>
		</template>

		<NUpload directory-dnd :onUpdateFileList :max="!field.isArray ? 1 : undefined" :multiple="!!field.isArray"
			:accept="generateAcceptedFileType(field.accept)"
			:action="`${useRuntimeConfig().public.apiBase}${database.slug ?? 'inicontent'}/asset`" response-type="json"
			:file-list :onFinish :onPreview :list-type="!field.isTable ? 'image' : 'image-card'">
			<template v-if="!field.isTable">
				<NUploadDragger>
					<NIcon size="48" depth="3">
						<IconUpload />
					</NIcon>
				</NUploadDragger>
			</template>
			<template v-else>
				<NFlex align="center" size="small">
					<LazyRenderFieldUploadActions v-model="showAssetsModal" :callback="handleSelectAssets" />
				</Nflex>
			</template>
		</NUpload>

		<NDrawer v-model:show="showAssetsModal" defaultHeight="50%" placement="bottom" resizable>
			<NDrawerContent id="assetsModal" :nativeScrollbar="false" :bodyContentStyle="{ padding: 0 }">
				<LazyAssetCard targetID="assetsModal">
					<template v-slot="{ asset }">
						<NRadio v-if="asset.type !== 'folder'" :checked="getChecked(asset.publicURL)"
							@update:checked="handleSelectAssets(asset.publicURL)" />
					</template>
				</LazyAssetCard>
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
	type UploadFileInfo
} from "naive-ui";
import {
	IconUpload,
} from "@tabler/icons-vue";

const { field } = defineProps({
	field: {
		type: Object as PropType<Field>,
		required: true,
	},
});

const modelValue = defineModel({
	type: [Array, String] as PropType<string[] | string>,
});

const rule: FormItemRule = {
	type: field.isArray ? "array" : "url",
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
	if (!types) return undefined
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

function handleSelectAssets(url?: string) {
	if (!url) return;
	if (!field.isArray) {
		if (modelValue.value === url) modelValue.value = undefined;
		else modelValue.value = url;
	} else {
		if (modelValue.value && Array.isArray(modelValue.value)) {
			const index = modelValue.value.indexOf(url);
			if (index > -1) modelValue.value.splice(index, 1);
			else modelValue.value.push(url);
		} else modelValue.value = [url];
	}
};

function onUpdateFileList(files: UploadFileInfo[]) {
	if (files.every((file) => !file)) modelValue.value = undefined;
	else
		modelValue.value =
			(!field.isArray
				? files
					.filter((file) => file)
					.map((file) => (file.status === "finished" ? file.url : file))[0]
				: files
					.filter((file) => file)
					.map((file) => (file.status === "finished" ? file.url : file))) as string[]
};

const getFileNameFromUrl = (url: string) => url.split('/').pop()?.split('?')[0].split('#')[0] || '';
const fileList = ([] as string[])
	.concat(modelValue.value as string | string[])
	.filter((src) => src)
	.map((src) =>
		typeof src === "object"
			? src
			: {
				id: getFileNameFromUrl(src),
				name: getFileNameFromUrl(src),
				status: "finished",
				url: src,
				thumbnailUrl:
					src.includes("inicontent") &&
						isImage(getFileNameFromUrl(src))
						? `${src}?fit=94`
						: null,
			},
	) as UploadFileInfo[];

function onFinish({ file, event }: {
	file: UploadFileInfo
	event?: ProgressEvent
}) {
	if ((event?.target as XMLHttpRequest).response) {
		file.url = (event?.target as XMLHttpRequest).response.result.publicURL;
		file.name = (event?.target as XMLHttpRequest).response.result.name;
		return file;
	}
	return file;
};

function onPreview({ url }: UploadFileInfo) {
	if (url && !!field.isArray) return window.open(url, "blank")?.focus();
	return undefined
};

const getChecked = (url: string) => ([] as string[])
	.concat(modelValue.value as string | string[])
	.includes(url);
</script>