import {
	NDataTable,
	NCard,
	NA,
	NIcon,
	NIconWrapper,
	NTag,
	NTime,
	NSpace,
	NText,
	NPopover,
	NImageGroup,
	NImage,
	NButton,
	NEllipsis,
	NPopconfirm,
	useMessage,
	NCollapse,
	NCollapseItem,
	NAvatar,
	NInputGroup,
	NInput,
	NDatePicker,
	NSelect,
	NDropdown,
	NProgress,
	NButtonGroup,
} from "naive-ui";
import {
	IconCheck,
	IconX,
	IconPencil,
	IconTrash,
	IconSearch,
	IconSettings,
	IconPlus,
	IconTools,
	IconMinus,
	IconFileUpload,
	IconTableImport,
	IconTableExport,
	IconEye,
	IconSwitchHorizontal,
} from "@tabler/icons-vue";
import { ClientOnly, LazyTableDrawer } from "#components";
import { isArrayOfObjects, FormatObjectCriteriaValue } from "inibase/utils";
import { getProperty, setProperty, deleteProperty } from "inidot";
import { getField as getFieldFromSchema } from "inibase/utils";
import Inison from "inison";

export default defineNuxtComponent({
	async setup() {
		onBeforeMount(() => {
			clearNuxtState(["Drawer", "searchInput", "searchArray"]);
		});

		definePageMeta({
			middleware: ["dashboard", "table"],
			layout: "table",
		});

		const route = useRoute(),
			router = useRouter(),
			database = useState<Database>("database");

		useLanguage({
			ar: {
				clickToCopy: "نسخ",
				textCopied: "تم نسخ النص",
				viewTheItem: "مُعاينة العنصر",
				new: "جديد",
				createdAt: "أُضيف",
				updatedAt: "عُدِّل",
				update: "تحديث",
				create: "إنشاء",
				delete: "حذف",
				theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
				edit: "تعديل",
				published: "المنشورة",
				trash: "سلة المهملات",
				id: "المُعرف",
				actions: "الأوامر",
				tableSettings: "إعدادات الجدول",
				search: "بحث",
				reset: "إفراغ",
				tools: "الأدوات",
			},
			en: {},
		});

		const parseSearchInput = (search: any) => {
			const RETURN: any = {};
			for (const [condition, items] of Object.entries(search)) {
				if (!RETURN[condition]) RETURN[condition] = [];
				for (const [key, value] of Object.entries(items)) {
					if (["and", "or"].includes(key))
						RETURN[condition].push({ [key]: parseSearchInput(value) });
					else
						RETURN[condition].push([key, ...FormatObjectCriteriaValue(value)]);
				}
			}
			return RETURN;
		};

		const Loading = useState<Record<string, boolean>>("Loading", () => ({})),
			device = useState<Device>("device"),
			searchInput = useState<string | undefined>(
				"searchInput",
				() => route.query.search as string | undefined,
			),
			searchArray = useState<{
				and?: [string | null, string, any][];
				or?: [string | null, string, any][];
			}>("searchArray", () =>
				route.query.search
					? parseSearchInput(Inison.unstringify(route.query.search as string))
					: { and: [[null, "=", null]] },
			);
		Loading.value.TableData = false;

		const message = useMessage(),
			ImportInput = ref(),
			UploadProgress = ref<null | number>(null),
			Drawer = useState<{
				show: boolean;
				id: null | string;
				table: null | string;
				data: any;
			}>("Drawer", () => ({
				show: false,
				id: null,
				table: null,
				data: {},
			})),
			TableDataRef = useState(() => null),
			checkedRowKeys = useState(() => []),
			pagination = ref({
				page: route.query.page ? Number(route.query.page) : 1,
				pageCount: 1,
				showSizePicker: true,
				pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
				itemCount: 0,
				pageSizes: [15, 30, 60, 100, 500],
				prefix: ({ itemCount }: any) => itemCount,
				onChange: async (currentPage: number) => {
					pagination.value.page = currentPage;
					let { page, ...Query }: any = route.query;
					if (currentPage !== 1) Query = { ...Query, page: currentPage };
					router.push({ query: Query });
					return refreshTableData();
				},
				onUpdatePageSize: async (pageSize: number) => {
					const OLD_pageSize = JSON.parse(
						JSON.stringify(pagination.value.pageSize),
					);
					pagination.value.pageSize = pageSize;
					let { perPage, page, ...Query }: any = route.query;
					if (pageSize !== 15) {
						pagination.value.page = Math.round(
							OLD_pageSize < pageSize
								? page / (pageSize / OLD_pageSize)
								: page * (pageSize / OLD_pageSize),
						);
						Query = {
							...Query,
							perPage: pageSize,
							page: pagination.value.page,
						};
					}
					router.push({ query: Query });
					return refreshTableData();
				},
			}),
			{ data: TableData, refresh: refreshTableData } = await useLazyFetch<
				apiResponse<Item[]>
			>(
				`${useRuntimeConfig().public.apiBase}${route.params.database}/${
					route.params.table
				}`,
				{
					key: Inison.stringify({
						database: route.params.database,
						table: route.params.table,
						page: pagination.value.page,
						perPage: pagination.value.pageSize,
						columns: [],
						where: searchInput.value,
					}),
					onRequest: () => {
						Loading.value.TableData = true;
					},
					server: false,
					query: {
						options: Inison.stringify({
							page: pagination.value.page,
							perPage: pagination.value.pageSize,
							columns: [],
						}),
						where: searchInput.value,
					},
					transform: (res) => {
						Loading.value.TableData = false;
						if (res.options.total < res.options.perPage)
							pagination.value.showSizePicker = false;
						pagination.value.pageCount = res.options.totalPages;
						pagination.value.itemCount = res.options.total;
						return res;
					},
				},
			),
			DELETE = async (id: string) => {
				Loading.value.TableData = true;
				const data = await $fetch<apiResponse>(
					`${useRuntimeConfig().public.apiBase}${route.params.database}/${
						route.params.table
					}/${id}`,
					{
						method: "DELETE",
					},
				);
				if (TableData.value)
					TableData.value.result = TableData.value.result.filter(
						(item) => item.id && item.id !== id,
					);
				pagination.value.itemCount--;
				message.success(data?.message ?? "Error");
				Loading.value.TableData = false;
			},
			RenderSchema = (value: any, field: any): any => {
				if (value === null || value === undefined)
					switch (field.subType ?? field.type) {
						case "boolean":
							return h(
								NIconWrapper,
								{
									color: "red",
									borderRadius: 50,
									size: 18,
								},
								() =>
									h(
										NIcon,
										{
											size: 16,
										},
										() => h(IconX),
									),
							);
						case "array":
							return h(
								NButton,
								{
									circle: true,
								},
								{
									default: () =>
										h(NText, { depth: 3 }, { default: () => "[--]" }),
								},
							);
						case "object":
							return h(
								NButton,
								{
									circle: true,
								},
								{
									default: () =>
										h(NText, { depth: 3 }, { default: () => "{--}" }),
								},
							);
						default:
							return h(NText, { depth: 3 }, () => "--");
					}

				if (
					field.subType &&
					((Array.isArray(field.type) && field.type.includes("array")) ||
						(typeof field.type === "string" && field.type === "array"))
				)
					field.isArray = true;

				let deletectedFieldType = field.subType ?? field.type;
				if (Array.isArray(deletectedFieldType))
					deletectedFieldType = getField(
						field.subType ?? field.type,
						value,
					).key;
				switch (deletectedFieldType) {
					case "id":
						return h(
							NPopover,
							{},
							{
								trigger: () =>
									h(
										NButton,
										{
											size: "small",
											onClick: async () => {
												await copyToClipboard(value);
												message.success(t("textCopied"));
											},
											secondary: true,
											round: true,
										},
										() =>
											h(
												NEllipsis,
												{ tooltip: false, style: "max-width:50px" },
												() => value,
											),
									),
								default: () => t("clickToCopy"),
							},
						);
					case "table":
						return field.isArray
							? [].concat(value).map((col: any) =>
									h(
										NButton,
										{
											tag: "a",
											href: `/${route.params.database}/admin/tables/${field.key}/${col.id}/edit`,
											onClick: (e) => {
												e.preventDefault();
												if (device.value.width >= 700)
													Drawer.value = {
														...Drawer.value,
														id: col.id,
														table: field.key,
														data: {},
														show: true,
													};
												else
													navigateTo(
														`/${route.params.database}/admin/tables/${field.key}/${col.id}/edit`,
													);
											},
											loading: Loading.value[`Drawer_${field.key}_${col.id}`],
											size: "small",
											round: true,
										},
										field.image
											? {
													icon: () =>
														h(NIcon, () =>
															h(NAvatar, {
																style: {
																	width: "18px",
																	height: "18px",
																},
																round: true,
																src: []
																	.concat(
																		getProperty(col, field.image, []) as any,
																	)
																	.map((link: string) =>
																		link?.includes("inicontent") &&
																		[
																			"png",
																			"jpg",
																			"jpeg",
																			"ico",
																			"webp",
																			"svg",
																			"gif",
																		].includes(link.split(".").pop() ?? "")
																			? `${link}?fit=18`
																			: link,
																	)[0],
															}),
														),
													default: () =>
														h(
															NEllipsis,
															{
																tooltip: true,
																style: {
																	maxWidth: `${
																		field.key && t(field.key).length > 10
																			? t(field.key).length * 12
																			: 120
																	}px`,
																},
															},
															() =>
																field.label
																	? field.label
																			.map((single_label: any) =>
																				getProperty(col, single_label),
																			)
																			.join(" ")
																	: col.id,
														),
												}
											: {
													icon: () =>
														h(NIcon, () =>
															h("span", {}, field.key.charAt(0).toUpperCase()),
														),
													default: () =>
														h(
															NEllipsis,
															{
																tooltip: true,
																style: {
																	maxWidth: `${
																		field.key && t(field.key).length > 10
																			? t(field.key).length * 12
																			: 120
																	}px`,
																},
															},
															() =>
																field.label
																	? field.label
																			.map((single_label: any) =>
																				getProperty(col, single_label),
																			)
																			.join(" ")
																	: col.id,
														),
												},
									),
								)
							: h(
									NButton,
									{
										tag: "a",
										href: `/${route.params.database}/admin/tables/${
											field.key
										}/${([].concat(value)[0] as any).id}/edit`,
										onClick: (e) => {
											e.preventDefault();
											if (device.value.width >= 700)
												Drawer.value = {
													...Drawer.value,
													id: ([].concat(value)[0] as any).id,
													table: field.key,
													data: {},
													show: true,
												};
											else
												navigateTo(
													`/${route.params.database}/admin/tables/${
														field.key
													}/${([].concat(value)[0] as any).id}/edit`,
												);
										},
										loading:
											Loading.value[
												`Drawer_${field.key}_${([].concat(value)[0] as any).id}`
											],
										size: "small",
										round: true,
									},
									{
										icon: () =>
											h(
												NIcon,
												field.image
													? () => {
															const img = []
																.concat(
																	getProperty(value, field.image, []) as any,
																)
																.map((link: string) =>
																	link?.includes("inicontent") &&
																	[
																		"png",
																		"jpg",
																		"jpeg",
																		"ico",
																		"webp",
																		"svg",
																		"gif",
																	].includes(link.split(".").pop() ?? "")
																		? `${link}?fit=18`
																		: link,
																)[0];
															return img
																? h(NAvatar, {
																		style: {
																			width: "18px",
																			height: "18px",
																		},
																		round: true,
																		src: img,
																	})
																: h(
																		"span",
																		{},
																		field.key.charAt(0).toUpperCase(),
																	);
														}
													: () =>
															h("span", {}, field.key.charAt(0).toUpperCase()),
											),
										default: () =>
											h(
												NEllipsis,
												{
													tooltip: true,
													style: {
														maxWidth: `${
															field.key && t(field.key).length > 10
																? t(field.key).length * 12
																: 120
														}px`,
													},
												},
												() =>
													renderLabel(
														database.value.tables?.find(
															({ slug }) => slug === field.key,
														)?.label,
														database.value.tables?.find(
															({ slug }) => slug === field.key,
														)?.schema,
														[].concat(value)[0] as any,
													),
											),
									},
								);
					case "email":
						return h(
							NA,
							{ href: `mailto:${value}`, target: "_blank" },
							{
								default: () =>
									h(
										NEllipsis,
										{
											tooltip: true,
											style: {
												maxWidth: `${
													field.key && t(field.key).length > 10
														? t(field.key).length * 12
														: 120
												}px`,
											},
										},
										() =>
											h(
												NA,
												{ href: `mailto:${value}`, target: "_blank" },
												() => value,
											),
									),
							},
						);
					case "password":
						return h(
							NEllipsis,
							{
								tooltip: false,
								style: {
									maxWidth: `${
										field.key && t(field.key).length > 10
											? t(field.key).length * 12
											: 120
									}px`,
								},
							},
							() => Array.from(Array(value.length), () => "•"),
						);
					case "boolean":
						return h(
							NIconWrapper,
							{
								color: value === true ? "green" : "red",
								borderRadius: 50,
								size: 18,
							},
							() =>
								h(
									NIcon,
									{
										size: 16,
									},
									() => h(value === true ? IconCheck : IconX),
								),
						);
					case "url":
						return h(
							NA,
							{ href: value, target: "_blank" },
							{
								default: () =>
									h(
										NEllipsis,
										{
											tooltip: true,
											style: {
												maxWidth: `${
													field.key && t(field.key).length > 10
														? t(field.key).length * 12
														: 120
												}px`,
											},
										},
										() => h(NA, { href: value, target: "_blank" }, () => value),
									),
							},
						);
					case "color":
						return h(
							NTag,
							{
								round: true,
								style: {
									backgroundColor: value,
								},
							},
							() =>
								h(
									NText,
									{ style: { mixBlendMode: "difference" } },
									() => value,
								),
						);
					case "select":
					case "tags":
						return h(NSpace, () =>
							[].concat(value).map((_value) =>
								h(
									NTag,
									{
										round: true,
										bordered: false,
									},
									() =>
										h(
											NEllipsis,
											{
												tooltip: false,
												style: {
													maxWidth: `${
														field.key && t(field.key).length > 10
															? t(field.key).length * 12
															: 120
													}px`,
												},
											},
											() => _value,
										),
								),
							),
						);
					case "html":
						return h(
							NPopover,
							{
								style: {
									maxHeight: "240px",
									maxWidth: "300px",
								},
								trigger: "click",
								scrollable: true,
							},
							{
								trigger: () =>
									h(
										NButton,
										{
											circle: true,
										},
										{
											default: () =>
												h(NText, { depth: 3 }, { default: () => "..." }),
										},
									),
								default: () => h("div", { innerHTML: value }),
							},
						);
					case "date":
						return h(
							NPopover,
							{},
							{
								trigger: () =>
									h(NTime, {
										time: Number(value),
										type: "relative",
									}),
								default: () =>
									h(NTime, {
										time: Number(value),
									}),
							},
						);
					case "upload":
						return [].concat(value).length === 1
							? [].concat(value).map((link: string) =>
									["png", "jpg", "jpeg", "ico", "webp", "svg", "gif"].includes(
										link.split(".").pop() ?? "",
									)
										? h(NImage, {
												src: link?.includes("inicontent")
													? `${link}?fit=32`
													: link,
												previewSrc: link,
												width: 32,
											})
										: h(NIcon, () => h(IconFileUpload)),
								)
							: h(NImageGroup, () =>
									h(NSpace, { align: "center" }, () =>
										[].concat(value).length > 3
											? [
													...[]
														.concat(value)
														.slice(0, 3)
														.map((link: string) =>
															[
																"png",
																"jpg",
																"jpeg",
																"ico",
																"webp",
																"svg",
																"gif",
															].includes(link.split(".").pop() ?? "")
																? h(NImage, {
																		src: link?.includes("inicontent")
																			? `${link}?fit=32`
																			: link,
																		previewSrc: link,
																		width: 32,
																	})
																: h(NIcon, () => h(IconFileUpload)),
														),
													`+${[].concat(value).length - 3}`,
												]
											: [].concat(value).map((link: string) =>
													[
														"png",
														"jpg",
														"jpeg",
														"ico",
														"webp",
														"svg",
														"gif",
													].includes(link.split(".").pop() ?? "")
														? h(NImage, {
																src: link?.includes("inicontent")
																	? `${link}?fit=32`
																	: link,
																previewSrc: link,
																width: 32,
															})
														: h(NIcon, () => h(IconFileUpload)),
												),
									),
								);
					case "role":
						return h(
							NTag,
							{ round: true, bordered: false },
							{
								default: () =>
									h(
										NEllipsis,
										{
											tooltip: false,
											style: {
												maxWidth: `${
													field.key && t(field.key).length > 10
														? t(field.key).length * 12
														: 120
												}px`,
											},
										},
										() =>
											t(
												database.value.roles?.find(({ id }) => id === value)
													?.name,
											),
									),
								icon: () =>
									h(
										"span",
										{ style: { padding: "0 5px" } },
										database.value.roles
											?.find(({ id }) => id === value)
											?.name.charAt(0)
											.toUpperCase(),
									),
							},
						);
					case "string":
						if (field.subType)
							return RenderSchema(value, { ...field, type: field.subType });
						return RenderSchema(value, { ...field, type: "text" });
					case "array":
						if (!field.children) throw new Error("no children");
						if (field.subType)
							return RenderSchema(value, {
								...field,
								type: field.subType,
								isArray: true,
							});
						if (!isArrayOfObjects(field.children))
							return RenderSchema(value, {
								...field,
								type: "tags",
								isArray: true,
							});

						return h(
							NPopover,
							{
								trigger: "click",
								scrollable: true,
								style: {
									maxHeight: "240px",
								},
							},
							{
								trigger: () =>
									h(
										NButton,
										{
											circle: true,
										},
										{ default: () => "[...]" },
									),
								default: () =>
									h(
										NCollapse,
										{ accordion: true, arrowPlacement: "right" },
										() =>
											[].concat(value).map((_item, index) =>
												h(
													NCollapseItem,
													{
														title: `${field.key} ${index + 1}`,
													},
													() =>
														h(NSpace, { vertical: true }, () =>
															field.children.map((child: any) =>
																h(
																	NSpace,
																	{
																		align: "center",
																	},
																	() => [
																		h("strong", `${t(child.key)}:`),
																		RenderSchema(
																			getProperty(_item, child.key),
																			child,
																		),
																	],
																),
															),
														),
												),
											),
									),
							},
						);
					case "object":
						return h(
							NPopover,
							{
								trigger: "click",
							},
							{
								trigger: () =>
									h(
										NButton,
										{
											circle: true,
										},
										{ default: () => "{...}" },
									),
								default: () =>
									h(NSpace, { vertical: true }, () =>
										field.children.map((child: { key: any; slug: any }) =>
											h(NSpace, { align: "center", inline: true }, () => [
												h("strong", `${child.key}:`),
												RenderSchema(getProperty(value, child.key), child),
											]),
										),
									),
							},
						);
					default:
						return value
							? h(
									NEllipsis,
									{
										tooltip: false,
										style: {
											maxWidth: `${
												field.key && t(field.key).length > 10
													? t(field.key).length * 12
													: 120
											}px`,
										},
									},
									() => value,
								)
							: h(NText, { depth: 3 }, () => "--");
				}
			},
			GenerateColumns = () =>
				[
					{
						type: "selection",
						fixed: "left",
						options: [
							{
								label: t("delete"),
								key: "delete",
								disabled: checkedRowKeys.value.length === 0,
								icon: () => h(NIcon, () => h(IconTrash)),
								onSelect: async () => {
									Loading.value.TableData = true;
									await $fetch<apiResponse>(
										`${useRuntimeConfig().public.apiBase}${
											route.params.database
										}/${route.params.table}`,
										{
											method: "DELETE",
											body: checkedRowKeys.value,
										} as any,
									);
									message.success("Deleted Successfully");
									await refreshTableData();
								},
							},
						],
					},
					...(
						database.value.tables?.find(
							({ slug }) => slug === route.params.table,
						)?.schema ?? []
					).map((field: any) => ({
						title: () =>
							h(NSpace, { align: "center" }, () => [
								getField(
									Array.isArray(field.subType ?? field.type) &&
										(field.subType ?? field.type).includes("table")
										? "table"
										: field.subType ?? field.type,
								).icon(),
								t(field.key),
							]),
						width: t(field.key).length > 10 ? t(field.key).length * 13 : 130,
						key: field.key,
						render: (row: { [x: string]: any }) =>
							RenderSchema(row[field.key], field),
					})),
					{
						title: t("actions"),
						fixed: device.value.width > 400 ? "right" : false,
						align: "center",
						width: 150,
						key: "actions",
						render(row: { id: any }) {
							return h(NButtonGroup, () => [
								h(
									NPopover,
									{},
									{
										trigger: () =>
											h(
												NButton,
												{
													tag: "a",
													href: `/${route.params.database}/admin/tables/${route.params.table}/${row.id}`,
													onClick: (e) => {
														e.preventDefault();
														navigateTo(
															`/${route.params.database}/admin/tables/${route.params.table}/${row.id}`,
														);
													},
													secondary: true,
													circle: true,
													type: "primary",
												},
												{ icon: () => h(NIcon, () => h(IconEye)) },
											),
										default: () => t("viewTheItem"),
									},
								),
								h(
									NPopover,
									{},
									{
										trigger: () =>
											h(
												NButton,
												{
													tag: "a",
													href: `/${route.params.database}/admin/tables/${route.params.table}/${row.id}/edit`,
													onClick: (e) => {
														e.preventDefault();
														if (device.value.width >= 700)
															Drawer.value = {
																...Drawer.value,
																id: row.id,
																table: route.params.table as string,
																data: JSON.parse(JSON.stringify(row)),
																show: true,
															};
														else
															navigateTo(
																`/${route.params.database}/admin/tables/${route.params.table}/${row.id}/edit`,
															);
													},
													secondary: true,
													circle: true,
													type: "info",
												},
												{ icon: () => h(NIcon, () => h(IconPencil)) },
											),
										default: () => t("edit"),
									},
								),
								h(
									NPopconfirm,
									{
										onPositiveClick: () => DELETE(row.id),
									},
									{
										trigger: () =>
											h(
												NPopover,
												{},
												{
													trigger: () =>
														h(
															NButton,
															{
																strong: true,
																secondary: true,
																circle: true,
																type: "error",
															},
															{
																icon: () => h(NIcon, () => h(IconTrash)),
															},
														),
													default: () => t("delete"),
												},
											),
										default: () => t("theFollowingActionIsIrreversible"),
									},
								),
							]);
						},
					},
				].filter((i) => i !== null),
			RenderSearch = (path?: string) =>
				h(
					NCollapse,
					{
						triggerAreas: ["main", "arrow"],
					},
					() =>
						Object.entries(
							path ? getProperty(searchArray.value, path) : searchArray.value,
						).map(([condition, items]: any, index) =>
							h(
								NCollapseItem,
								{
									title: t(`${condition}Group`),
								},
								{
									"header-extra": () =>
										h(NSpace, {}, () => [
											h(
												NDropdown,
												{
													options: [
														{
															key: "and",
															label: t("andGroup"),
														},
														{
															key: "or",
															label: t("orGroup"),
														},
													],
													style: {
														maxHeight: "200px",
													},
													scrollable: true,
													onSelect: (selected_condition) =>
														setProperty(
															searchArray.value,
															`${path ? `${path}.` : ""}${condition}.${
																items.length
															}.${selected_condition}`,
															[[null, "=", null]],
														),
												},
												() =>
													h(
														NButton,
														{
															onClick: () =>
																setProperty(
																	searchArray.value,
																	`${path ? `${path}.` : ""}${condition}.${
																		items.length
																	}`,
																	[null, "=", null],
																),
															circle: true,
															size: "small",
														},
														{
															icon: () => h(NIcon, () => h(IconPlus)),
														},
													),
											),
											h(
												NButton,
												{
													onClick: () => {
														setProperty(
															searchArray.value,
															`${path ? `${path}.` : ""}${
																condition === "and" ? "or" : "and"
															}`,
															getProperty(
																searchArray.value,
																`${path ? `${path}.` : ""}${condition}`,
																[[null, "=", null]],
															),
														);
														deleteProperty(
															searchArray.value,
															`${path ? `${path}.` : ""}${condition}`,
														);
													},
													circle: true,
													size: "small",
												},
												{
													icon: () => h(NIcon, () => h(IconSwitchHorizontal)),
												},
											),
											h(
												NButton,
												{
													disabled:
														`${path ? `${path}.` : ""}${condition}` === "and" ||
														`${path ? `${path}.` : ""}${condition}` === "or",
													onClick: () =>
														deleteProperty(
															searchArray.value,
															`${path ? `${path}.` : ""}${condition}`,
														),
													circle: true,
													size: "small",
												},
												{
													icon: () => h(NIcon, () => h(IconTrash)),
												},
											),
										]),
									default: () =>
										h(
											NSpace,
											{
												itemStyle: {
													width: "100%",
												},
											},
											() =>
												items.map((item: any, index: string | number) =>
													Array.isArray(item)
														? h(NInputGroup, () => {
																let field: Field | null = null;
																if (item[0])
																	field = getFieldFromSchema(
																		item[0],
																		database.value.tables?.find(
																			({ slug }) => slug === route.params.table,
																		)?.schema as any,
																	);

																return [
																	h(NSelect, {
																		consistentMenuWidth: false,
																		tag: true,
																		filterable: true,
																		value: item[0],
																		onUpdateValue: (v, option) => (item[0] = v),
																		options:
																			database.value.tables
																				?.find(
																					({ slug }) =>
																						slug === route.params.table,
																				)
																				?.schema?.map(
																					(_item, _index: number, schema) =>
																						GenerateSearchInOptions(
																							schema,
																							_item,
																						),
																				)
																				.flat(Number.POSITIVE_INFINITY) ?? [],
																		style: {
																			width: "33.33%",
																		},
																	}),
																	h(NSelect, {
																		consistentMenuWidth: false,
																		filterable: true,
																		defaultValue: "=",
																		value: item[1],
																		onUpdateValue: (v) => (item[1] = v),
																		options:
																			field &&
																			checkFieldType(field.type, [
																				"number",
																				"date",
																			])
																				? ComparisonOperatorOptions().filter(
																						({ value }) =>
																							[
																								"=",
																								"!=",
																								">",
																								">=",
																								"<",
																								"<=",
																							].includes(value),
																					)
																				: ComparisonOperatorOptions().filter(
																						({ value }) =>
																							![">", ">=", "<", "<="].includes(
																								value,
																							),
																					),
																		style: {
																			width: "33.33%",
																		},
																	}),
																	(() => {
																		switch (field?.type ?? null) {
																			case "date":
																				if (!item[2]) item[2] = Date.now();
																				return h(NDatePicker, {
																					value: Number(item[2]),
																					onConfirm: (v) => (item[2] = v),
																					type: "datetime",
																				});
																			default:
																				return h(NInput, {
																					value: item[2],
																					onUpdateValue: (v) => (item[2] = v),
																					style: {
																						width: "33.33%",
																					},
																				});
																		}
																	})(),

																	h(
																		NButton,
																		{
																			disabled: items.length === 1,
																			onClick: () =>
																				deleteProperty(
																					searchArray.value,
																					`${
																						path ? `${path}.` : ""
																					}${condition}.${index}`,
																				),
																		},
																		{
																			icon: () => h(NIcon, () => h(IconMinus)),
																		},
																	),
																];
															})
														: RenderSearch(
																`${
																	path ? `${path}.` : ""
																}${condition}.${index}`,
															),
												),
										),
								},
							),
						),
				),
			generateSearchInput = (search: any) => {
				const RETURN: any = {};
				for (const [condition, items] of Object.entries(search)) {
					for (const item of items) {
						if (!RETURN[condition]) RETURN[condition] = {};
						if (Array.isArray(item))
							RETURN[condition][item[0]] = `${item[1]}${item[2]}`;
						else RETURN[condition] = generateSearchInput(item);
					}
				}
				return RETURN;
			};

		watch(searchInput, (v) => {
			const { search, ...Query }: any = route.query;
			return v
				? router.push({
						query: {
							...(Query ?? {}),
							search: Inison.stringify(v),
						},
					})
				: router.push({
						query: Query ?? {},
					});
		});

		useHead({
			title: `${database.value.slug} | ${t(
				database.value.tables?.find(({ slug }) => slug === route.params.table)
					?.slug ?? "",
			)} ${t("Table")}`,
			link: [{ rel: "icon", href: database.value?.icon ?? "" }],
		});

		return () => [
			device.value.width >= 700 ? h(LazyTableDrawer) : null,
			database.value
				? h(
						NCard,
						{
							title:
								t(
									database.value.tables?.find(
										({ slug }) => slug === route.params.table,
									)?.slug,
								) ?? "--",
							style: {
								background: "none",
							},
							headerStyle: { paddingRight: 0, paddingLeft: 0 },
							contentStyle: "padding: 0",
							bordered: false,
						},
						{
							"header-extra": () => [
								h("input", {
									style: { display: "none" },
									ref: ImportInput,
									type: "file",
									accept: ".json,.csv,.xml",
									onChange: async (e: any) => {
										// const reader = new FileReader();
										// reader.addEventListCheckener(
										//   "load",
										//   async (event: any) => {
										//     try {
										//       let items,
										//         chunkSize = 500;
										//       switch (e.target.files[0].type) {
										//         case "application/json":
										//           items = JSON.parse(event.target.result);
										//           break;
										//       }
										//       if (items && items.length > 0) {
										//         UploadProgress.value = 0;
										//         let newItems = [
										//           ...Array(Math.ceil(items.length / chunkSize)),
										//         ].map((_, index) => index);
										//         for await (const index of newItems) {
										//           const { data }:any = await useFetch<apiResponse>(
										//             `${useRuntimeConfig().public.apiBase}${route.params.database}/${route.params.table}`,
										//             {
										//               method: "POST",
										//               body: items.splice(0, chunkSize),
										//             }
										//           );
										//           if (
										//             data.value &&
										//             data.value.result &&
										//             data.value.result.length > 0
										//           ) {
										//             UploadProgress.value =
										//               ((index + 1) * 100) / newItems.length;
										//             if (UploadProgress.value === 100) {
										//               message.success(data.value.message);
										//               setTimeout(
										//                 () => (UploadProgress.value = null),
										//                 1500
										//               );
										//             }
										//           } else message.error(data.value.message);
										//         }
										//         refreshTableData();
										//       } else message.error("File not valid");
										//     } catch (error) {
										//       console.log(error);
										//     }
										//     e.target.value = null;
										//   }
										// );
										// reader.readAsText(e.target.files[0]);
									},
								}),
								h(NButtonGroup, {}, () => [
									h(
										NPopover,
										{
											disabled:
												!searchInput.value &&
												(!TableData.value?.result ||
													!database.value.tables ||
													!database.value.tables.find(
														({ slug }) => slug === route.params.table,
													)?.schema),
											style: {
												maxHeight: "240px",
												width: device.value.width < 800 ? "350px" : "500px",
											},
											placement: "bottom-end",
											trigger: "click",
											scrollable: true,
										},
										{
											trigger: () =>
												h(
													NPopover,
													{},
													{
														trigger: () =>
															h(
																NButton,
																{
																	disabled:
																		!searchInput.value &&
																		(!TableData.value?.result ||
																			!database.value.tables ||
																			!database.value.tables.find(
																				({ slug }) =>
																					slug === route.params.table,
																			)?.schema),
																},
																{
																	icon: () => h(NIcon, () => h(IconSearch)),
																},
															),
														default: () => t("search"),
													},
												),
											footer: () =>
												h(NSpace, { justify: "end" }, () => [
													h(NSpace, {}, () => [
														h(
															NButton,
															{
																disabled: !!searchInput.value,
																loading: Loading.value.TableData,
																onClick: () => {
																	searchArray.value = {
																		and: [[null, "=", null]],
																	};
																	searchInput.value = undefined;
																	refreshTableData();
																},
															},
															{
																icon: () => h(NIcon, () => h(IconX)),
																default: () => t("reset"),
															},
														),
														h(
															NButton,
															{
																loading: Loading.value.TableData,
																onClick: async () => {
																	searchInput.value =
																		searchArray.value &&
																		Object.values(searchArray.value).length > 0
																			? generateSearchInput(searchArray.value)
																			: undefined;
																	refreshTableData();
																},
															},
															{
																icon: () => h(NIcon, () => h(IconSearch)),
																default: () => t("search"),
															},
														),
													]),
												]),
											default: () => RenderSearch(),
										},
									),
									h(
										NDropdown,
										{
											options: [
												{
													icon: () => h(NIcon, () => h(IconTableImport)),
													label: t("import"),
													disabled: true,
													key: "import",
												},
												{
													icon: () => h(NIcon, () => h(IconTableExport)),
													label: t("export"),
													key: "export",
													disabled: true,
													children: [
														{
															label: t("export_current_data"),
															key: "export_current_data",
														},
														{
															label: t("export_all_data"),
															key: "export_all_data",
														},
													],
												},
											],
											trigger: "click",
											onSelect: (v) => {
												switch (v) {
													case "import":
														ImportInput.value.click();
														break;
													case "export_current_data":
														break;
													case "export_all_data":
														break;
												}
											},
										},
										() =>
											h(
												NPopover,
												{},
												{
													trigger: () =>
														h(
															NButton,
															{ disabled: UploadProgress.value !== null },
															{
																icon: () =>
																	UploadProgress.value !== null
																		? h(NProgress, {
																				type: "circle",
																				showIndicator: false,
																				status:
																					UploadProgress.value < 100
																						? "warning"
																						: "success",
																				percentage: UploadProgress.value,
																				strokeWidth: 20,
																			})
																		: h(NIcon, () => h(IconTools)),
															},
														),
													default: () => t("tools"),
												},
											),
									),
									h(
										NPopover,
										{},
										{
											trigger: () =>
												h(
													NButton,
													{
														disabled:
															!database.value.tables ||
															!database.value.tables.find(
																({ slug }) => slug === route.params.table,
															)?.schema,
														tag: "a",
														href:
															!database.value.tables ||
															!database.value.tables.find(
																({ slug }) => slug === route.params.table,
															)?.schema
																? null
																: `/${route.params.database}/admin/tables/${route.params.table}/new`,
														onClick: (e) => {
															e.preventDefault();

															if (device.value.width >= 700)
																Drawer.value = {
																	...Drawer.value,
																	table: route.params.table as string,
																	id: null,
																	data: {},
																	show: true,
																};
															else
																navigateTo(
																	!database.value.tables ||
																		!database.value.tables.find(
																			({ slug }) => slug === route.params.table,
																		)?.schema
																		? null
																		: `/${route.params.database}/admin/tables/${route.params.table}/new`,
																);
														},
													},
													{
														icon: () => h(NIcon, () => h(IconPlus)),
													},
												),
											default: () => t("newItem"),
										},
									),
								]),
							],
							default: () => {
								const columns = GenerateColumns();
								return h(ClientOnly, () =>
									h(NDataTable, {
										scrollX: columns.reduce((accumulator, value) => {
											return accumulator + (value.width ?? 0);
										}, 40),
										resizable: true,
										id: "DataTable",
										remote: true,
										ref: TableDataRef as any,
										columns: columns as any,
										data: TableData.value?.result || [],
										loading: Loading.value.TableData,
										pagination: pagination.value,
										rowKey: (row) => row.id,
										checkedRowKeys: checkedRowKeys.value,
										"on-update:checked-row-keys": (keys: never[]) =>
											(checkedRowKeys.value = keys),
										"on-update:sorter": (sorter: any) => console.log(sorter),
									}),
								);
							},
						},
					)
				: null,
		];
	},
});
