import {
	IconArrowRight,
	IconBooks,
	IconLink,
	IconUpload,
} from "@tabler/icons-vue";
import { deleteProperty, getProperty, hasProperty, setProperty } from "inidot";
import {
	NButton,
	NDrawer,
	NDrawerContent,
	NFormItem,
	NIcon,
	NInput,
	NInputGroup,
	NPopover,
	NRadio,
	NSpace,
	NText,
	NTooltip,
	NUpload,
	NUploadDragger,
} from "naive-ui";
import { LazyAssetCard } from "#components";

export default defineNuxtComponent({
	props: {
		modelValue: {
			type: Object,
			required: true,
		},
		field: {
			type: Object as PropType<Field>,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Drawer = false;

		const modelValue = toRef(props, "modelValue"),
			field = props.field,
			path = props.path,
			database = useState<Database>("database"),
			assetURL = ref<string>(),
			CurrentField: any = ref(null),
			showAssetsModal = ref(false),
			generateAcceptedFileType = (types: string[]): string => {
				const RETURN: string[] = [];
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
			},
			uploadButtons = [
				h(
					NPopover,
					{
						trigger: "hover",
					},
					{
						trigger: () =>
							h(
								NButton,
								{
									circle: true,
									strong: true,
									secondary: true,
									size: "tiny",
									onClick(e) {
										e.preventDefault();
										e.stopPropagation();
									},
								},
								{
									icon: () => h(NIcon, () => h(IconLink)),
								},
							),
						default: () =>
							h(NInputGroup, () => [
								h(
									NInput,
									{
										inputProps: { type: "url" },
										value: assetURL.value,
										onUpdateValue(url) {
											assetURL.value = url;
										},
										onKeydown: ({ key }) => {
											if (key === "Enter") {
												CurrentField.value = {
													path: path,
													...field,
												};
												handleSelectAssets(assetURL.value);
												assetURL.value = undefined;
											}
										},

										placeholder: "Link",
										clearable: true,
									},
									{
										suffix: () => h(NIcon, () => h(IconLink)),
									},
								),
								// TODO: add import asset from url
								h(
									NTooltip,
									{},
									{
										trigger: () =>
											h(NButton, { disabled: true }, () =>
												h(NIcon, () => h(IconUpload)),
											),
										default: () => t("importAsset"),
									},
								),
								h(
									NTooltip,
									{},
									{
										trigger: () =>
											h(
												NButton,
												{
													disabled: !assetURL.value,
													onClick() {
														CurrentField.value = {
															path: path,
															...field,
														};
														handleSelectAssets(assetURL.value);
														assetURL.value = undefined;
													},
												},
												() => h(NIcon, () => h(IconArrowRight)),
											),
										default: () => t("insertAsset"),
									},
								),
							]),
					},
				),
				h(
					NTooltip,
					{},
					{
						trigger: () =>
							h(
								NButton,
								{
									circle: true,
									strong: true,
									secondary: true,
									size: "tiny",
									onClick(e) {
										e.preventDefault();
										e.stopPropagation();

										CurrentField.value = {
											path,
											...field,
										};
										showAssetsModal.value = true;
									},
								},
								{ icon: () => h(NIcon, () => h(IconBooks)) },
							),
						default: () => t("gallery"),
					},
				),
			],
			handleSelectAssets = (url?: string) => {
				if (!url) return;
				const currentFieldValue = getProperty(
					modelValue.value,
					CurrentField.value.path,
				);

				if (!CurrentField.value.isArray) {
					if (currentFieldValue === url)
						deleteProperty(modelValue.value, CurrentField.value.path);
					else setProperty(modelValue.value, CurrentField.value.path, url);
				} else {
					if (currentFieldValue) {
						if (Array.isArray(currentFieldValue)) {
							if (currentFieldValue.includes(url))
								deleteProperty(
									modelValue.value,
									`${CurrentField.value.path}.${currentFieldValue.indexOf(
										url,
									)}`,
								);
							else
								setProperty(
									modelValue.value,
									`${CurrentField.value.path}.${currentFieldValue.length}`,
									url,
								);
						} else {
							if (currentFieldValue === url)
								deleteProperty(modelValue.value, `${CurrentField.value.path}`);
							else
								setProperty(modelValue.value, `${CurrentField.value.path}`, [
									url,
								]);
						}
					} else
						setProperty(modelValue.value, `${CurrentField.value.path}`, [url]);
				}
			};
		return () => [
			h(
				NFormItem,
				{
					path,
					rule: {
						type: field.isArray ? "array" : undefined,
						required: field.required,
						trigger: "change",
						message: `${t(field.key)} ${t("isRequired")}`,
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				{
					label: () =>
						h(
							NSpace,
							{
								inline: true,
								align: "center",
							},
							() => [t(field.key), ...uploadButtons],
						),
					default: () =>
						h(
							NUpload,
							{
								directoryDnd: true,
								onUpdateFileList: (files) => {
									files.every((file) => !file)
										? deleteProperty(modelValue.value, path)
										: setProperty(
												modelValue.value,
												path,
												!field.isArray
													? files
															.filter((file) => file)
															.map((file) =>
																file.status === "finished" ? file.url : file,
															)[0]
													: files
															.filter((file) => file)
															.map((file) =>
																file.status === "finished" ? file.url : file,
															),
											);
								},
								max: !field.isArray ? 1 : undefined,
								multiple: !!field.isArray,
								accept: field.accept
									? generateAcceptedFileType(field.accept)
									: undefined,
								action: `${useRuntimeConfig().public.apiBase}${
									database.value.slug ?? "inicontent"
								}/asset`,
								responseType: "json",
								fileList: []
									.concat(getProperty(modelValue.value, path, []))
									.filter((src) => src)
									.map((src: string | object) =>
										typeof src === "object"
											? src
											: {
													id: src
														.split("/")
														.pop()
														?.split("#")[0]
														?.split("?")[0],
													name: src
														.split("/")
														.pop()
														?.split("#")[0]
														?.split("?")[0],
													status: "finished",
													url: src,
													thumbnailUrl:
														src.includes("inicontent") &&
														[
															"png",
															"jpg",
															"jpeg",
															"ico",
															"webp",
															"svg",
															"gif",
														].includes(src?.split(".")?.pop() ?? "")
															? `${src}?fit=94`
															: null,
												},
									) as any,
								onFinish: ({ file, event }: any) => {
									if (event?.target?.response) {
										file.url = event.target.response.result.publicURL;
										file.name = event.target.response.result.name;
										return file;
									}
									return file;
								},
								onPreview: ({ url }) =>
									url && !!field.isArray
										? window.open(url, "blank")?.focus() ?? undefined
										: undefined,
								listType: !field.isTable ? "image" : "image-card",
							},
							() =>
								!field.isTable
									? h(NUploadDragger, () =>
											h(NIcon, { size: 48, depth: 3 }, () => h(IconUpload)),
										)
									: h(
											NSpace,
											{
												inline: true,
												align: "center",
												size: "small",
											},
											() => uploadButtons,
										),
						),
				},
			),
			h(
				NDrawer,
				{
					show: showAssetsModal.value,
					"on-update:show": (v: boolean) => {
						showAssetsModal.value = v;
					},
					defaultHeight: "50%",
					placement: "bottom",
					resizable: true,
				},
				() =>
					h(
						NDrawerContent,
						{
							id: "assets_modal",
							nativeScrollbar: false,
							bodyContentStyle: {
								padding: 0,
							},
						},
						() =>
							h(
								LazyAssetCard,
								//@ts-ignore
								{
									targetID: "assets_modal",
								},
								(asset: Asset) =>
									asset.type !== "folder"
										? h(NRadio, {
												checked: []
													.concat(
														getProperty(
															modelValue.value,
															CurrentField.value.path,
															[],
														),
													)
													.includes((asset?.publicURL ?? "") as never),
												onUpdateChecked: () =>
													handleSelectAssets(asset.publicURL),
											})
										: null,
							),
					),
			),
		];
	},
});
