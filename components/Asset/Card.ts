import { LazyAssetGrid } from "#components";
import {
	NBreadcrumb,
	NBreadcrumbItem,
	NButton,
	NCard,
	NFlex,
	NIcon,
	NPagination,
	NPopover,
	NProgress,
	NSpin,
	NUpload,
	NUploadFileList,
	NUploadTrigger,
	useMessage,
} from "naive-ui";
import { IconCheck, IconPlus } from "@tabler/icons-vue";
import Inison from "inison";

export default defineNuxtComponent({
	props: {
		targetID: String,
	},
	async setup(props, { slots }) {
		onBeforeMount(() => clearNuxtState("path"));

		const database = useState<Database>("database"),
			{ isMobile } = useDevice(),
			Loading = useState<Record<string, boolean>>("Loading", () => ({})),
			route = useRoute(),
			router = useRouter(),
			pagination = reactive({
				page: route.query.page ? Number(route.query.page) : 1,
				pageCount: 0,
				pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
				showSizePicker: true,
				itemCount: 0,
			}),
			message = useMessage(),
			path = useState<string | null>("path"),
			{ data: assets, refresh: refreshAssets } = await useLazyAsyncData(
				`asset${
					path.value ??
					(route.params.folder
						? `/${[].concat(route.params.folder as any).join("/")}`
						: "")
				}`,
				() =>
					$fetch<apiResponse<Asset[]>>(
						`${useRuntimeConfig().public.apiBase}${database.value.slug}/asset${
							path.value ??
							(route.params.folder
								? `/${[].concat(route.params.folder as any).join("/")}`
								: "")
						}`,
						{
							onRequest: () => {
								Loading.value.AssetData = true;
							},
							query: {
								options: Inison.stringify({
									page: pagination.page,
									perPage: pagination.pageSize,
								}),
							},
						},
					),
				{
					transform: (res) => {
						Loading.value.AssetData = false;

						if (res.options.total === 0) pagination.showSizePicker = false;
						pagination.pageCount = res.options.total_pages;
						pagination.itemCount = res.options.total;
						return res.result;
					},
				},
			),
			UploadProgress = ref<number>(0);

		watch(path, () => {
			pagination.page = 1;
			pagination.itemCount = 0;
			refreshAssets();
		});

		return () =>
			h(
				NCard,
				{
					id: "assets_card",
					style: {
						height: "fit-content",
					},
				},
				{
					header: () =>
						route.params.folder || route.params.folder === ""
							? t("assets")
							: h(NBreadcrumb, () => [
									h(
										NBreadcrumbItem,
										{
											onClick: () => {
												path.value = "";
											},
										},
										() => t("assets"),
									),
									...(path.value
										?.split("/")
										.slice(1)
										.map((singlePath, index, originalArray) =>
											h(
												NBreadcrumbItem,
												{
													onClick: () => {
														path.value = `/${originalArray
															.slice(0, index + 1)
															.join("/")}`;
													},
												},
												() => singlePath,
											),
										) ?? []),
								]),
					default: () =>
						h(NFlex, { vertical: true, align: "center" }, () => [
							h(
								LazyAssetGrid,
								{
									modelValue: assets.value,
									"onUpdate:modelValue": (v: Asset[]) => {
										assets.value = v;
									},
									isAssetRoute: !!(
										route.params.folder || route.params.folder === ""
									),
									targetID: props.targetID ?? "assets_card",
								},
								slots.default ? slots.default : undefined,
							),
							pagination.itemCount && pagination.pageCount > 1
								? h(NPagination, {
										style: { marginTop: "25px" },
										simple: !!isMobile,
										pageSizes: [15, 30, 60, 100, 500],
										prefix: ({ itemCount }: any) => itemCount,
										onUpdatePage: async (currentPage: number) => {
											pagination.page = currentPage;
											let { page, ...Query }: any = route.query;
											if (currentPage !== 1)
												Query = { ...Query, page: currentPage };
											if (route.params.folder || route.params.folder === "")
												router.push({ query: Query });
											return refreshAssets();
										},
										onUpdatePageSize: async (pageSize: number) => {
											const OLD_pageSize = JSON.parse(
												JSON.stringify(pagination.pageSize),
											);
											pagination.pageSize = pageSize;
											let { perPage, page, ...Query }: any = route.query;
											if (pageSize !== 15) {
												const newPage = Math.round(
													OLD_pageSize < pageSize
														? page / (pageSize / OLD_pageSize)
														: page * (pageSize / OLD_pageSize),
												);
												pagination.page = Number.isNaN(newPage) ? 1 : newPage;
												Query = {
													...Query,
													perPage: pageSize,
													page: pagination.page,
												};
											}
											if (route.params.folder || route.params.folder === "")
												router.push({ query: Query });
											return refreshAssets();
										},
										...pagination,
									})
								: null,
						]),
					"header-extra": () =>
						h(
							NUpload,
							{
								multiple: true,
								abstract: true,
								action: `${useRuntimeConfig().public.apiBase}${
									database.value.slug
								}/asset${
									path.value ??
									(route.params.folder
										? `/${[].concat(route.params.folder as any).join("/")}`
										: "")
								}`,
								onUpdateFileList: async (fileList) => {
									if (fileList.length) {
										if (UploadProgress.value < 100) {
											UploadProgress.value =
												fileList
													.filter((file) => file.status !== "finished")
													.reduce(
														(sum, file) => sum + (file.percentage ?? 0),
														0,
													) /
												fileList.filter((file) => file.status !== "finished")
													.length;
											if (UploadProgress.value === 0) UploadProgress.value = 1;
										} else {
											if (
												fileList.every((file) => file.status === "finished")
											) {
												await new Promise<void>((resolve) =>
													setTimeout(resolve, 2000),
												);
												UploadProgress.value = 10000;
												await new Promise<void>((resolve) =>
													setTimeout(resolve, 5000),
												);
												UploadProgress.value = 0;
											} else UploadProgress.value = 1000;
										}
									}
								},
								onFinish: ({ file, event }: any) => {
									if (event?.target?.response) {
										const response: apiResponse<Asset> = JSON.parse(
											event.target.response,
										);
										file.url = response.result.publicURL;
										file.name = response.result.name;
										if (assets.value) assets.value?.push(response.result);
										else assets.value = [response.result];
										if (!database.value.size) database.value.size = 0;
										database.value.size += response.result.size ?? 0;
										return file;
									}
									return file;
								},
								onRemove: async ({ file }) => {
									const data = await $fetch<apiResponse>(
											`${useRuntimeConfig().public.apiBase}${
												database.value.slug
											}/asset${
												path.value ??
												(route.params.folder
													? `/${[]
															.concat(route.params.folder as any)
															.join("/")}`
													: "")
											}/${file.name}`,
											{ method: "DELETE" },
										),
										singleAsset = assets.value?.find(
											(asset) => asset.name === file.name,
										);
									if (data.result) {
										if (assets.value)
											assets.value = assets.value.filter(
												(asset) => asset.name !== file.name,
											);
										message.success(data?.message ?? t("success"));
										if (database.value.size)
											database.value.size -= singleAsset?.size ?? 0;
										return true;
									}
									message.error(data?.message ?? t("error"));
									return false;
								},
							},
							() =>
								h(
									NPopover,
									{
										trigger: "manual",
										placement: "bottom-end",
										show: UploadProgress.value > 0,
									},
									{
										trigger: () =>
											h(NUploadTrigger, { abstract: false }, () =>
												h(
													NButton,
													{
														round: true,
													},
													{
														icon: () => {
															if (UploadProgress.value > 0) {
																switch (UploadProgress.value) {
																	case 10000:
																		return h(NIcon, () => h(IconCheck));
																	case 1000:
																		return h(NSpin, { size: 16 });
																	default:
																		return h(NProgress, {
																			type: "circle",
																			showIndicator: false,
																			status:
																				UploadProgress.value === 100
																					? "success"
																					: "warning",
																			percentage: UploadProgress.value,
																			strokeWidth: 20,
																		});
																}
															}
															return h(NIcon, () => h(IconPlus));
														},
													},
												),
											),
										default: () => h(NUploadFileList),
									},
								),
						),
				},
			);
	},
});
