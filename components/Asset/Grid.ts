import {
	NGrid,
	NGi,
	NImage,
	NIcon,
	NSkeleton,
	NA,
	NDrawer,
	NDrawerContent,
	NSpace,
	NText,
	NTime,
	NTooltip,
	NEmpty,
	NButton,
	NPopconfirm,
	useMessage,
	NFlex,
} from "naive-ui";
import { LazyAssetIcon } from "#components";
import { IconTrash } from "@tabler/icons-vue";

export default defineNuxtComponent({
	props: {
		modelValue: (Array || null) as PropType<Asset[] | null>,
		targetID: String,
		isAssetRoute: Boolean,
	},
	setup: (props, { slots, emit }) => {
		const Loading = useState<Record<string, boolean>>("Loading", () => ({})),
			Hover = useState<Record<string | number, boolean>>("Hover", () => ({}));

		const modelValue = toRef(props, "modelValue"),
			path = useState("path"),
			ThemeConfig = useState<ThemeConfig>("ThemeConfig"),
			Theme = useGlobalCookie("Theme"),
			route = useRoute(),
			message = useMessage(),
			database = useState<Database>("database"),
			CurrentAsset = useState<Asset & { show?: boolean }>("asset", () => ({})),
			Language = useGlobalCookie("Language"),
			deleteAsset = async (name: string) => {
				Loading.value[`deleteAsset${name}`] = true;
				const data = await $fetch<apiResponse>(
						`${useRuntimeConfig().public.apiBase}${database.value.slug}/asset${
							path.value ?? ""
						}/${name}`,
						{
							method: "DELETE",
						},
					),
					singleAsset = modelValue.value?.find((asset) => asset.name === name);
				if (data?.result) {
					emit(
						"update:modelValue",
						modelValue.value?.filter((asset) => asset.name !== name),
					);

					if (database.value.size)
						database.value.size -= singleAsset?.size ?? 0;
					message.success(data?.message ?? t("success"));
				} else message.error(data?.message ?? t("error"));
				Loading.value[`deleteAsset${name}`] = false;
			};

		useLanguage({
			ar: {
				name: "الإسم",
				size: "الحجم",
				type: "النوع",
				link: "الرابط",
				createdAt: "تاريخ الرفع",
				theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
			},
			en: {},
		});

		return () => [
			h(
				NDrawer,
				{
					show: CurrentAsset.value.show === true,
					"on-update:show": (v: boolean) =>
						v === false ? (CurrentAsset.value.show = false) : null,
					placement: Language.value === "ar" ? "left" : "right",
				},
				() =>
					h(
						NDrawerContent,
						{ nativeScrollbar: false, closable: true },
						{
							header: () => CurrentAsset.value.name,
							default: () =>
								h(NSpace, { vertical: true }, () => [
									CurrentAsset.value.type !== "folder" &&
									["png", "jpg", "jpeg", "ico", "webp", "svg", "gif"].includes(
										CurrentAsset.value.publicURL?.split(".").pop() ?? "",
									)
										? h(NImage, {
												style: {
													width: "100%",
													height: "200px",
													borderRadius: "15px",
													background:
														Theme.value === "dark"
															? "rgb(0 0 0 / 21%)"
															: "rgb(179 179 179 / 20%)",
												},
												src: `${CurrentAsset.value.publicURL}?fit=200&q=1`,
												previewSrc: CurrentAsset.value.publicURL,
												imgProps: { width: "100%", height: "200px" },
											})
										: h(
												NIcon,
												{
													style: {
														width: "100%",
														height: "200px",
														borderRadius: "15px",
														background:
															Theme.value === "dark"
																? "rgb(0 0 0 / 21%)"
																: "rgb(179 179 179 / 20%)",
													},
												},
												() =>
													h(
														NA,
														{
															href: CurrentAsset.value.publicURL,
															target: "_blank",
														},
														() =>
															h(LazyAssetIcon, {
																type: CurrentAsset.value.type,
																style: {
																	width: "100%",
																	height: "100%",
																},
															}),
													),
											),
									h(
										"div",
										{},
										{
											default: () => [
												h(NText, { strong: true }, () => `${t("name")}: `),
												h(NText, () => CurrentAsset.value.name),
											],
										},
									),
									h(
										"div",
										{},
										{
											default: () => [
												h(NText, { strong: true }, () => `${t("size")}: `),
												h(NText, () =>
													humanFileSize(CurrentAsset.value.size ?? 0),
												),
											],
										},
									),
									h(
										"div",
										{},
										{
											default: () => [
												h(NText, { strong: true }, () => `${t("type")}: `),
												h(NText, () => CurrentAsset.value.type),
											],
										},
									),
									h(
										"div",
										{},
										{
											default: () => [
												h(NText, { strong: true }, () => `${t("link")}: `),
												h(
													NA,
													{
														target: "_blank",
														href: CurrentAsset.value.publicURL,
													},
													() => CurrentAsset.value.publicURL,
												),
											],
										},
									),
									h(
										"div",
										{},
										{
											default: () => [
												h(NText, { strong: true }, () => `${t("createdAt")}: `),
												h(NTime, {
													time: Number(CurrentAsset.value.createdAt),
													type: "relative",
												}),
											],
										},
									),
								]),
						},
					),
			),
			modelValue.value === undefined || modelValue.value?.length
				? h(
						NGrid,
						{
							xGap: "12px",
							yGap: "12px",
							cols: "100:2 200:3 300:4 400:5 500:6 700:8 900:11",
						},
						() =>
							modelValue.value && !Loading.value.AssetData
								? modelValue.value
										.toSorted((a, b) =>
											a.type === b.type ? 0 : a.type === "folder" ? -1 : 1,
										)
										.map((asset) =>
											h(NGi, () =>
												h(
													NTooltip,
													{},
													{
														default: () => asset.name,
														trigger: () =>
															h(
																NFlex,
																{
																	onmouseover: () =>
																		(Hover.value[asset.name as string] = true),
																	onmouseleave: () =>
																		(Hover.value[asset.name as string] = false),
																	style: {
																		position: "relative",
																	},
																},
																() => [
																	h(
																		NFlex,
																		{
																			vertical: true,
																			style: {
																				position: "absolute",
																				top: "5px",
																				right: "5px",
																				zIndex: 9,
																			},
																		},
																		() => [
																			slots.default
																				? slots.default(asset)
																				: null,
																			h(
																				NPopconfirm,
																				{
																					zIndex: 999999,
																					showIcon: false,
																					onPositiveClick: () =>
																						deleteAsset(asset.name as string),
																				},
																				{
																					activator: () =>
																						h(
																							NButton,
																							{
																								type: "error",
																								text: true,
																								loading:
																									Loading.value[
																										`deleteAsset${asset.name}`
																									],
																								style: {
																									...(Hover.value[
																										asset.name as string
																									]
																										? {}
																										: { visibility: "hidden" }),
																								},
																							},
																							{
																								icon: () =>
																									h(NIcon, () => h(IconTrash)),
																							},
																						),
																					default: () =>
																						t(
																							"theFollowingActionIsIrreversible",
																						),
																				},
																			),
																		],
																	),
																	asset.type !== "folder" &&
																	[
																		"png",
																		"jpg",
																		"jpeg",
																		"ico",
																		"avif",
																		"webp",
																		"svg",
																		"gif",
																	].includes(
																		asset.publicURL?.split(".").pop() ?? "",
																	)
																		? h(NImage, {
																				class: "asset",
																				onClick: () =>
																					(CurrentAsset.value = {
																						...asset,
																						show: true,
																					}),
																				previewDisabled: true,
																				intersectionObserverOptions: {
																					root: `#${
																						props.targetID ?? "container"
																					}`,
																				},
																				lazy: true,
																				src: `${asset.publicURL}?fit=100&q=1`,
																				imgProps: {
																					style: {
																						width: "100%",
																						height: "100px",
																					},
																				},
																			})
																		: h(
																				NIcon,
																				{
																					class: "asset",
																					onClick: () =>
																						asset.type === "folder"
																							? props.isAssetRoute
																								? navigateTo(
																										`${route.path}/${asset.name}`,
																									)
																								: (path.value = `${
																										path.value ?? ""
																									}/${asset.name}`)
																							: (CurrentAsset.value = {
																									...asset,
																									show: true,
																								}),
																				},
																				() =>
																					h(LazyAssetIcon, {
																						type: asset.type,
																						style: {
																							color:
																								ThemeConfig.value
																									.primaryColor ?? "#fff",
																							width: "100%",
																							height: "100px",
																						},
																					}),
																			),
																],
															),
													},
												),
											),
										)
								: [...Array(15).keys()].map(() =>
										h(NGi, () =>
											h(NSkeleton, {
												style: {
													width: "100%",
													height: "100px",
													borderRadius: "15px",
												},
											}),
										),
									),
					)
				: h(NEmpty),
		];
	},
});
