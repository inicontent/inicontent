import {
	NFormItem,
	NInput,
	NUpload,
	NIcon,
	NButton,
	NSpace,
	NPopover,
	NUploadDragger,
	NText,
	NTooltip,
	NDrawer,
	NDrawerContent,
	NRadio,
} from "naive-ui";
import { IconPlus, IconUpload, IconLink, IconBooks } from "@tabler/icons-vue";
import { getProperty, setProperty, deleteProperty, hasProperty } from "inidot";
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
			CurrentField: any = ref(null),
			showAssetsModal = ref(false),
			uploadButtons = [
				h(
					NButton,
					{
						circle: true,
						strong: true,
						secondary: true,
						size: "tiny",
					},
					{ icon: () => h(NIcon, () => h(IconLink)) },
				),
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
							h(
								NInput,
								{
									inputProps: { type: "url" },
									onUpdateValue(url) {
										CurrentField.value = {
											path: path,
											...field,
										};
										handleSelectAssets(url);
									},
									placeholder: "Link",
									clearable: true,
								},
								{
									suffix: () => h(NIcon, () => h(IconLink)),
								},
							),
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
									onClick() {
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
					rule: !field.isArray
						? {
								required: field.required,
								trigger: "change",
								message: "This field is required",
							}
						: {
								type: "array",
								required: field.required,
								trigger: "change",
								message: "This field is required",
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
								onUpdateFileList: (files) =>
									files.every((file) => !file)
										? deleteProperty(modelValue.value, path)
										: setProperty(
												modelValue.value,
												path,
												!field.isArray
													? files
															.filter((file) => file)
															.map((file) => file.url)[0]
													: files
															.filter((file) => file)
															.map((file) => file.url),
											),
								max: !field.isArray ? 1 : undefined,
								multiple: !!field.isArray,
								accept: field.accept
									? generateAcceptedFileType(field.accept)
									: undefined,
								action: `${useRuntimeConfig().public.apiBase}${
									database.value.slug ?? "inicontent"
								}/asset`,
								fileList: hasProperty(modelValue.value, path)
									? ([]
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
											) as any)
									: undefined,
								onFinish: ({ file, event }: any) => {
									if (event?.target?.response) {
										const response = JSON.parse(event.target.response).result;
										file.url = response.publicURL;
										file.name = response.name;
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
									? h(NUploadDragger, () => [
											h(
												"div",
												{
													style: {
														marginBottom: "12px",
													},
												},
												h(NIcon, { size: 48, depth: 3 }, () => h(IconUpload)),
											),
											h(
												NText,
												{ style: { "font-size": "16px" } },
												() => "Click or drag a file to this area to upload",
											),
										])
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
					"on-update:show": (v: boolean) => (showAssetsModal.value = v),
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
