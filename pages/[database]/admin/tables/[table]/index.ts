import {
	IconEye,
	IconMinus,
	IconPencil,
	IconPlus,
	IconSearch,
	IconSwitchHorizontal,
	IconTableExport,
	IconTableImport,
	IconTools,
	IconTrash,
	IconX,
} from "@tabler/icons-vue";
import { FormatObjectCriteriaValue } from "inibase/utils";
import { getField as getFieldFromSchema } from "inibase/utils";
import { deleteProperty, getProperty, setProperty } from "inidot";
import Inison from "inison";
import {
	NButton,
	NButtonGroup,
	NCard,
	NCollapse,
	NCollapseItem,
	NDataTable,
	NDropdown,
	NFlex,
	NIcon,
	NInputGroup,
	NPopconfirm,
	NPopover,
	NProgress,
	NSelect,
	NSpace,
	useMessage,
} from "naive-ui";
import {
	LazyRenderColumn,
	LazyRenderField,
	LazyTableDrawer,
} from "#components";

export default defineNuxtComponent({
	async setup() {
		onBeforeMount(() => {
			clearNuxtState("Drawer");
		});

		definePageMeta({
			middleware: ["dashboard", "table"],
			layout: "table",
		});

		const route = useRoute(),
			router = useRouter(),
			database = useState<Database>("database"),
			table = useState<Table>("table");

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
				andGroup: "مجموعة و",
				orGroup: "مجموعة أو",
			},
			en: {},
		});

		const Loading = useState<Record<string, boolean>>("Loading", () => ({})),
			{ isMobile } = useDevice(),
			querySearch = ref<string | undefined>(
				route.query.search as string | undefined,
			),
			searchArray = ref<{
				and?: [string | null, string, any][];
				or?: [string | null, string, any][];
			}>(
				route.query.search
					? generateSearchArray(
							Inison.unstringify(route.query.search as string),
						)
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
				simple: isMobile,
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
					Query = {
						...Query,
						page: currentPage !== 1 ? currentPage : undefined,
					};
					router.push({ query: Query });
					queryOptions.value = Inison.stringify({
						...Inison.unstringify(queryOptions.value),
						page: pagination.value.page,
					});
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
							page:
								pagination.value.page === 1 ? undefined : pagination.value.page,
						};
					}
					router.push({ query: Query });
					queryOptions.value = Inison.stringify({
						...Inison.unstringify(queryOptions.value),
						perPage: pageSize,
						page:
							pagination.value.page === 1 ? undefined : pagination.value.page,
					});
				},
			}),
			queryOptions = ref(
				Inison.stringify({
					page: pagination.value.page,
					perPage: pagination.value.pageSize,
					columns: [],
				}),
			),
			{ data: TableData, refresh: refreshTableData } = await useLazyFetch<
				apiResponse<Item[]>
			>(
				`${useRuntimeConfig().public.apiBase}${database.value.slug}/${
					table.value.slug
				}`,
				{
					onRequest: () => {
						Loading.value.TableData = true;
					},
					query: {
						options: queryOptions,
						where: querySearch,
					},
					transform: (res) => {
						Loading.value.TableData = false;
						if (res.options.total && res.options.totalPages) {
							if (
								res.options.perPage &&
								res.options.total < res.options.perPage
							)
								pagination.value.showSizePicker = false;
							pagination.value.pageCount = res.options.totalPages;
							pagination.value.itemCount = res.options.total;
						}
						return res;
					},
				},
			),
			DELETE = async (id: string) => {
				Loading.value.TableData = true;
				const data = await $fetch<apiResponse>(
					`${useRuntimeConfig().public.apiBase}${database.value.slug}/${
						table.value.slug
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
				message.success(data?.message ?? t("error"));
				Loading.value.TableData = false;
			},
			GenerateColumns = () =>
				[
					...(table.value.allowedMethods !== "r"
						? [
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
														database.value.slug
													}/${table.value.slug}`,
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
							]
						: []),
					...(table.value.schema ?? []).map((field) => ({
						title: () =>
							h(NFlex, { align: "center", justify: "start" }, () => [
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
							h(LazyRenderColumn, { value: row[field.key], field }),
					})),
					{
						title: t("actions"),
						fixed: !isMobile ? "right" : false,
						align: "center",
						width: 150,
						key: "actions",
						render(row: { id: any }) {
							return h(NButtonGroup, () => [
								table.value.allowedMethods?.includes("r")
									? h(
											NPopover,
											{},
											{
												trigger: () =>
													h(
														NButton,
														{
															tag: "a",
															href: `/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}`,
															onClick: (e) => {
																e.preventDefault();
																navigateTo(
																	`/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}`,
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
										)
									: null,
								table.value.allowedMethods?.includes("u")
									? h(
											NPopover,
											{},
											{
												trigger: () =>
													h(
														NButton,
														{
															tag: "a",
															href: `/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}/edit`,
															onClick: (e) => {
																e.preventDefault();
																if (!isMobile)
																	Drawer.value = {
																		...Drawer.value,
																		id: row.id,
																		table: table.value.slug as string,
																		data: JSON.parse(JSON.stringify(row)),
																		show: true,
																	};
																else
																	navigateTo(
																		`/${database.value.slug}/admin/tables/${table.value.slug}/${row.id}/edit`,
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
										)
									: null,
								table.value.allowedMethods?.includes("d")
									? h(
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
										)
									: null,
							]);
						},
					},
				].filter((i) => i !== null),
			RenderSearch = (path?: string) =>
				h(
					NCollapse,
					{
						triggerAreas: ["main", "arrow"],
						accordion: true,
						defaultExpandedNames: "0",
					},
					() =>
						Object.entries(
							path ? getProperty(searchArray.value, path) : searchArray.value,
						).map(([condition, items]: any, index) =>
							h(
								NCollapseItem,
								{
									title: t(`${condition}Group`),
									name: index.toString(),
								},
								{
									"header-extra": () =>
										h(NFlex, {}, () => [
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
												NPopover,
												{},
												{
													trigger: () =>
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
																icon: () =>
																	h(NIcon, () => h(IconSwitchHorizontal)),
															},
														),
													default: () =>
														t(
															`convertTo_"${condition === "and" ? "or" : "and"}"_group`,
														),
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
											NFlex,
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
																		table.value.schema as any,
																	);

																return [
																	h(NSelect, {
																		consistentMenuWidth: false,
																		tag: true,
																		filterable: true,
																		value: item[0],
																		onUpdateValue: (v) => {
																			item[0] = v;
																		},
																		options: generateSearchInOptions(
																			table.value.schema,
																		),
																		style: field
																			? {
																					width: "33.33%",
																				}
																			: {},
																	}),
																	...(field
																		? [
																				h(NSelect, {
																					consistentMenuWidth: false,
																					filterable: true,
																					defaultValue: "=",
																					value: item[1],
																					onUpdateValue: (v: string) => {
																						item[1] = v;
																					},
																					options:
																						comparisonOperatorOptions().filter(
																							({ value }) => {
																								if (
																									checkFieldType(field.type, [
																										"number",
																										"date",
																									])
																								)
																									return [
																										"=",
																										"!=",
																										">",
																										">=",
																										"<",
																										"<=",
																									].includes(value);
																								if (
																									checkFieldType(
																										field.type,
																										"array",
																									) ||
																									checkFieldType(
																										field.type,
																										"table",
																									)
																								)
																									return ![
																										">",
																										">=",
																										"<",
																										"<=",
																									].includes(value);
																								return ![
																									">",
																									">=",
																									"<",
																									"<=",
																									"[]",
																									"![]",
																								].includes(value);
																							},
																						),
																					style: {
																						width: "33.33%",
																					},
																				}),
																				h(LazyRenderField, {
																					modelValue: ref({
																						[field.key]: item[2] ?? undefined,
																					}),
																					"onUpdate:modelValue": (v: any) => {
																						item[2] = Array.isArray(
																							v[field.key],
																						)
																							? v[field.key].join(",")
																							: v[field.key];
																					},
																					schema: [
																						{
																							...field,
																							required: false,
																							labelProps: {
																								showLabel: false,
																								style: {
																									width: "33.33%",
																								},
																								showFeedback: false,
																							},
																							inputProps: {
																								onKeydown: ({
																									key,
																								}: KeyboardEvent) => {
																									if (key === "Enter") {
																										querySearch.value =
																											searchArray.value
																												? generateSearchInput(
																														searchArray.value,
																													)
																												: undefined;
																										pagination.value.onChange(
																											1,
																										);
																									}
																								},
																							},
																						},
																					] as any,
																				}),
																			]
																		: []),
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
				);

		watch(querySearch, (v) => {
			const { search, page, ...Query }: any = route.query;
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
				table.value.slug ?? "",
			)} ${t("Table")}`,
			link: [{ rel: "icon", href: database.value?.icon ?? "" }],
		});

		return () => [
			!isMobile ? h(LazyTableDrawer) : null,
			database.value
				? h(
						NCard,
						{
							title: t(table.value.slug) ?? "--",
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
										//             `${useRuntimeConfig().public.apiBase}${database.value.slug}/${table.value.slug}`,
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
												!querySearch.value &&
												(!TableData.value?.result ||
													!database.value.tables ||
													!database.value.tables.find(
														({ slug }) => slug === table.value.slug,
													)?.schema),
											style: {
												maxHeight: "240px",
												width: isMobile ? "350px" : "500px",
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
																	round: true,
																	disabled:
																		!querySearch.value &&
																		(!TableData.value?.result ||
																			!database.value.tables ||
																			!database.value.tables.find(
																				({ slug }) => slug === table.value.slug,
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
																disabled:
																	searchArray.value.and?.length === 1 &&
																	searchArray.value.and[0][0] === null,
																loading: Loading.value.TableData,
																onClick: () => {
																	searchArray.value = {
																		and: [[null, "=", null]],
																	};
																	if (querySearch.value) {
																		querySearch.value = undefined;
																		refreshTableData();
																	}
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
																	querySearch.value = searchArray.value
																		? generateSearchInput(searchArray.value)
																		: undefined;
																	pagination.value.onChange(1);
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
															{
																round: true,
																disabled: UploadProgress.value !== null,
															},
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
									table.value.allowedMethods?.includes("c")
										? h(
												NPopover,
												{},
												{
													trigger: () =>
														h(
															NButton,
															{
																round: true,
																disabled: !table.value.schema,
																tag: "a",
																href: !table.value.schema
																	? null
																	: `/${database.value.slug}/admin/tables/${table.value.slug}/new`,
																onClick: (e) => {
																	e.preventDefault();

																	if (!isMobile)
																		Drawer.value = {
																			...Drawer.value,
																			table: table.value.slug as string,
																			id: null,
																			data: {},
																			show: true,
																		};
																	else
																		navigateTo(
																			!table.value.schema
																				? null
																				: `/${database.value.slug}/admin/tables/${table.value.slug}/new`,
																		);
																},
															},
															{
																icon: () => h(NIcon, () => h(IconPlus)),
															},
														),
													default: () => t("newItem"),
												},
											)
										: null,
								]),
							],
							default: () => {
								const columns = GenerateColumns();
								return h(NDataTable, {
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
									"on-update:checked-row-keys": (keys: never[]) => {
										checkedRowKeys.value = keys;
									},
									"on-update:sorter": (sorter: any) => console.log(sorter),
								});
							},
						},
					)
				: null,
		];
	},
});
