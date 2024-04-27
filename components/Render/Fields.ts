// TO-DO:
// Add fields: Mention, Range, Slider
import {
	NIcon,
	NButton,
	NCollapse,
	NCollapseItem,
	NPopover,
	NText,
	NCard,
	NDataTable,
} from "naive-ui";
import { IconPlus, IconTrash, IconChevronRight } from "@tabler/icons-vue";
import { isArrayOfObjects } from "inibase/utils";
import {
	LazyRenderFieldTable,
	LazyRenderFieldHtml,
	LazyRenderFieldRole,
	LazyRenderFieldText,
	LazyRenderFieldPassword,
	LazyRenderFieldNumber,
	LazyRenderFieldDate,
	LazyRenderFieldEmail,
	LazyRenderFieldUrl,
	LazyRenderFieldColor,
	LazyRenderFieldUpload,
	LazyRenderFieldRadio,
	LazyRenderFieldTextarea,
	LazyRenderFieldId,
	LazyRenderFieldSelect,
	LazyRenderFieldBoolean,
	LazyRenderFieldCheckbox,
	LazyRenderFieldTags,
} from "#components";
import { getProperty, setProperty, deleteProperty, hasProperty } from "inidot";

export default defineNuxtComponent({
	props: {
		schema: {
			type: Object as PropType<Schema | never>,
			default: [],
		},
		modelValue: {
			type: Object as PropType<any>,
			default: {},
		},
	},
	setup: (props) => {
		useLanguage({
			ar: {
				delete: "حذف",
				actions: "أوامر",
			},
			en: {},
		});
		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Drawer = false;
		const modelValue = toRef(props, "modelValue"),
			schema = toRef(props, "schema"),
			RenderField = (
				field: Field,
				path?: string,
				isAbsolutePath?: boolean,
			): any => {
				const fieldPath =
					(path ?? "") +
					(isAbsolutePath ? "" : getPath(schema.value, field.id));
				if (
					field.defaultValue &&
					!hasProperty(
						modelValue.value,
						(path ?? "") +
							(isAbsolutePath ? "" : getPath(schema.value, field.id)),
					)
				)
					setProperty(
						modelValue.value,
						(path ?? "") +
							(isAbsolutePath ? "" : getPath(schema.value, field.id)),
						field.defaultValue,
					);

				if (
					field.subType &&
					((Array.isArray(field.type) && field.type.includes("array")) ||
						(typeof field.type === "string" && field.type === "array"))
				)
					field.isArray = true;

				let deletectedFieldType = field.subType ?? field.type;
				if (
					Array.isArray(deletectedFieldType) &&
					hasProperty(
						modelValue.value,
						(path ?? "") +
							(isAbsolutePath ? "" : getPath(schema.value, field.id)),
					)
				)
					deletectedFieldType = getField(
						field.subType ?? field.type,
						getProperty(
							modelValue.value,
							(path ?? "") +
								(isAbsolutePath ? "" : getPath(schema.value, field.id)),
						),
					).key;
				switch (deletectedFieldType) {
					case "string":
						return RenderField(
							{
								...field,
								type: "text",
							},
							path,
							isAbsolutePath,
						);
					case "role":
						return h(LazyRenderFieldRole, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "id":
						return h(LazyRenderFieldId, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "text":
						return h(LazyRenderFieldText, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "textarea":
						return h(LazyRenderFieldTextarea, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "radio":
						return h(LazyRenderFieldRadio, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "object":
						return h(
							NCollapse,
							{
								displayDirective: "show",
								style: {
									margin: "0 0 20px",
								},
								arrowPlacement: "right",
								triggerAreas: ["main", "arrow"],
								accordion: true,
							},
							() =>
								h(
									NCollapseItem,
									{
										title: t(field.key),
										name:
											(path ?? "") +
											(isAbsolutePath ? "" : getPath(schema.value, field.id)),
									},
									() =>
										h(
											"div",
											{
												style: {
													padding: "0 0 0 10px",
												},
											},
											(field.children as Schema).map((child: any) =>
												RenderField(child, path, isAbsolutePath),
											),
										),
								),
						);
					case "array":
						if (!field.children) throw new Error("no children");
						if (field.subType)
							return RenderField(
								{
									...field,
									type: field.subType,
									isArray: true,
								} as Field,
								path,
								isAbsolutePath,
							);
						if (!isArrayOfObjects(field.children))
							return RenderField(
								{
									...field,
									type: "tags",
									isArray: true,
								} as Field,
								path,
								isAbsolutePath,
							);

						return field.children.filter(
							(f: any) => f.type === "array" && isArrayOfObjects(f.children),
						).length
							? h(
									NCollapse,
									{
										displayDirective: "show",
										style: {
											margin: "0 0 20px",
										},
										arrowPlacement: "right",
										triggerAreas: ["main", "arrow"],
										accordion: true,
									},
									{
										arrow: () =>
											!hasProperty(
												modelValue.value,
												(path ?? "") +
													(isAbsolutePath
														? ""
														: getPath(schema.value, field.id)),
											) ||
											getProperty(
												modelValue.value,
												(path ?? "") +
													(isAbsolutePath
														? ""
														: getPath(schema.value, field.id)),
												[],
											)?.length === 0
												? ""
												: h(NIcon, () => h(IconChevronRight)),
										default: () =>
											h(
												NCollapseItem,
												{
													displayDirective: "show",
													disabled:
														!hasProperty(
															modelValue.value,
															(path ?? "") +
																(isAbsolutePath
																	? ""
																	: getPath(schema.value, field.id)),
														) ||
														getProperty(
															modelValue.value,
															(path ?? "") +
																(isAbsolutePath
																	? ""
																	: getPath(schema.value, field.id)),
															[],
														)?.length === 0,
													title: t(field.key),
													name:
														(path ?? "") +
														(isAbsolutePath
															? ""
															: getPath(schema.value, field.id)),
												},
												{
													"header-extra": () =>
														h(
															NButton,
															{
																size: "small",
																round: true,
																onClick: () =>
																	setProperty(
																		modelValue.value,
																		`${
																			(path ?? "") +
																			(isAbsolutePath
																				? ""
																				: getPath(schema.value, field.id))
																		}.${
																			getProperty(
																				modelValue.value,
																				(path ?? "") +
																					(isAbsolutePath
																						? ""
																						: getPath(schema.value, field.id)),
																				[],
																			)?.length ?? 0
																		}`,
																		field.onCreate
																			? field.onCreate instanceof Function
																				? field.onCreate(
																						getProperty(
																							modelValue.value,
																							(path ?? "") +
																								(isAbsolutePath
																									? ""
																									: getPath(
																											schema.value,
																											field.id,
																										)),
																							[],
																						)?.length ?? 0,
																					)
																				: field.onCreate
																			: {},
																	),
															},
															{
																icon: () => h(NIcon, () => h(IconPlus)),
															},
														),
													default: () =>
														h(
															NCollapse,
															{
																displayDirective: "show",
																accordion: true,
															},
															() =>
																getProperty(
																	modelValue.value,
																	path ??
																		(isAbsolutePath
																			? ""
																			: getPath(schema.value, field.id)),
																	[],
																)?.map((_item: any, index: number) =>
																	h(
																		NCollapseItem,
																		{
																			displayDirective: "show",
																			title: `${t(field.key)} ${index}`,
																			name: `${
																				(path ?? "") +
																				(isAbsolutePath
																					? ""
																					: getPath(schema.value, field.id))
																			}.${index}`,
																		},
																		{
																			"header-extra": () =>
																				h(
																					NButton,
																					{
																						disabled:
																							field.disabledItems?.includes(
																								index,
																							),
																						quaternary: true,
																						circle: true,
																						type: "error",
																						onClick: () =>
																							deleteProperty(
																								modelValue.value,
																								`${
																									(path ?? "") +
																									(isAbsolutePath
																										? ""
																										: getPath(
																												schema.value,
																												field.id,
																											))
																								}.${index}`,
																							),
																					},
																					{
																						icon: () =>
																							h(NIcon, () => h(IconTrash)),
																					},
																				),
																			default: () =>
																				(field.children as Schema).map(
																					(child) =>
																						RenderField(
																							{
																								...child,
																								...(field.disabledItems
																									? {
																											inputProps: {
																												disabled:
																													field.disabledItems?.includes(
																														index,
																													),
																											},
																										}
																									: {}),
																							},
																							`${
																								(path ?? "") +
																								(isAbsolutePath
																									? ""
																									: getPath(
																											schema.value,
																											field.id,
																										))
																							}.${index}.${child.key}`,
																							true,
																						),
																				),
																		},
																	),
																),
														),
												},
											),
									},
								)
							: h(
									NCard,
									{
										title: t(field.key),
										bordered: false,
										contentStyle: {
											paddingLeft: 0,
											paddingRight: 0,
										},
										headerStyle: {
											paddingTop: 0,
											paddingLeft: 0,
											paddingRight: 0,
										},
									},
									{
										"header-extra": () =>
											field.disableActions === true
												? null
												: h(
														NButton,
														{
															size: "small",
															round: true,
															onClick() {
																const currentFieldValue = getProperty(
																	modelValue.value,
																	(path ?? "") +
																		(isAbsolutePath
																			? ""
																			: getPath(schema.value, field.id)),
																);
																if (currentFieldValue)
																	if (Array.isArray(currentFieldValue))
																		setProperty(
																			modelValue.value,
																			`${
																				(path ?? "") +
																				(isAbsolutePath
																					? ""
																					: getPath(schema.value, field.id))
																			}.${currentFieldValue.length}`,
																			field.onCreate
																				? field.onCreate instanceof Function
																					? field.onCreate(
																							currentFieldValue.length,
																						)
																					: field.onCreate
																				: {},
																		);
																	else
																		setProperty(
																			modelValue.value,
																			`${
																				(path ?? "") +
																				(isAbsolutePath
																					? ""
																					: getPath(schema.value, field.id))
																			}`,
																			[
																				field.onCreate
																					? field.onCreate instanceof Function
																						? field.onCreate(0)
																						: field.onCreate
																					: {},
																			],
																		);
																else
																	setProperty(
																		modelValue.value,
																		`${
																			(path ?? "") +
																			(isAbsolutePath
																				? ""
																				: getPath(schema.value, field.id))
																		}`,
																		[
																			field.onCreate
																				? field.onCreate instanceof Function
																					? field.onCreate(0)
																					: field.onCreate
																				: {},
																		],
																	);
															},
														},
														{
															icon: () => h(NIcon, () => h(IconPlus)),
														},
													),
										default: () =>
											h(NDataTable, {
												columns: [
													...(field.children as any).map((child: any) => ({
														width:
															t(child.key) && child.key.length > 10
																? child.key.length * 15
																: 200,
														title: () => [
															t(child.key),
															child.required
																? h(
																		NText,
																		{
																			type: "error",
																		},
																		() => " *",
																	)
																: null,
														],
														key: `${
															(path ?? "") +
															(isAbsolutePath
																? ""
																: getPath(schema.value, field.id))
														}.${child.key}`,
														render: (_item: any, index: number) =>
															RenderField(
																{
																	...child,
																	...(field.disabledItems?.includes(index)
																		? {
																				inputProps: {
																					disabled: true,
																				},
																			}
																		: {}),
																	labelProps: {
																		style: {
																			marginTop: "24px",
																		},
																		showLabel: false,
																	},
																	isArray: true,
																	isTable: true,
																},
																`${
																	(path ?? "") +
																	(isAbsolutePath
																		? ""
																		: getPath(schema.value, field.id))
																}.${index}.${child.key}`,
																true,
															),
													})),
													field.disableActions === true
														? {}
														: {
																title: t("actions"),
																fixed: "right",
																align: "center",
																width: 100,
																key: "actions",
																render(_row, index) {
																	return h(
																		NPopover,
																		{},
																		{
																			trigger: () =>
																				h(
																					NButton,
																					{
																						disabled:
																							field.disabledItems?.includes(
																								index,
																							),
																						strong: true,
																						secondary: true,
																						circle: true,
																						type: "error",
																						onClick: () =>
																							deleteProperty(
																								modelValue.value,
																								`${
																									(path ?? "") +
																									(isAbsolutePath
																										? ""
																										: getPath(
																												schema.value,
																												field.id,
																											))
																								}.${index}`,
																							),
																					},
																					{
																						icon: () =>
																							h(NIcon, () => h(IconTrash)),
																					},
																				),
																			default: () => t("delete"),
																		},
																	);
																},
															},
												],
												data: getProperty(
													modelValue.value,
													(path ?? "") +
														(isAbsolutePath
															? ""
															: getPath(schema.value, field.id)),
													[],
												),
												scrollX: (field.children as Schema).reduce(
													(accumulator: number, child: any) => {
														return (
															accumulator +
															(t(child.key) && child.key.length > 10
																? child.key.length * 15
																: 200)
														);
													},
													100,
												),
											}),
									},
								);
					case "table":
						return h(LazyRenderFieldTable, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "upload":
						return h(LazyRenderFieldUpload, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "color":
						return h(LazyRenderFieldColor, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "url":
						return h(LazyRenderFieldUrl, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "email":
						return h(LazyRenderFieldEmail, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "date":
						return h(LazyRenderFieldDate, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "html":
						return h(LazyRenderFieldHtml, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "number":
						return h(LazyRenderFieldNumber, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "password":
						return h(LazyRenderFieldPassword, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "boolean":
						return h(LazyRenderFieldBoolean, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "select":
						return h(LazyRenderFieldSelect, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "checkbox":
						return h(LazyRenderFieldCheckbox, {
							modelValue,
							path: fieldPath,
							field,
						});
					case "tags":
						return h(LazyRenderFieldTags, {
							modelValue,
							path: fieldPath,
							field,
						});

					default:
						console.log(
							"no field:",
							getProperty(
								modelValue.value,
								(path ?? "") +
									(isAbsolutePath ? "" : getPath(schema.value, field.id)),
							),
							field.type,
						);
						return null;
				}
			};

		return () => schema.value.map((item) => RenderField(item));
	},
});
