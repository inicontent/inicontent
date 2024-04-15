import {
	IconDeviceFloppy,
	IconEye,
	IconArrowDown,
	IconArrowUp,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-vue";
import {
	NButton,
	NButtonGroup,
	NCard,
	NCascader,
	NDropdown,
	NEmpty,
	NFlex,
	NIcon,
	NInputGroup,
	NPopover,
	NScrollbar,
	NSelect,
	NSpace,
	NTabPane,
	NTabs,
	NTag,
	type CascaderOption,
	type SelectOption,
	type SelectGroupOption,
	NTooltip,
} from "naive-ui";
import { isArrayOfObjects, isValidID } from "inibase/utils";

export default defineNuxtComponent({
	async setup() {
		onMounted(() => {
			document.onkeydown = (e) => {
				if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
				e.preventDefault();
				saveFlow();
			};
		});

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		const database = useState<Database>("database"),
			table = useState<Table>("table"),
			tableCopy = ref(JSON.parse(JSON.stringify(table.value))),
			currentFlow = ref<string>("onRequest"),
			currentFlowCard = ref<string>(),
			Hover = useState<Record<string | number, boolean>>("Hover", () => ({})),
			saveFlow = async () => {
				Loading.value.updateTable = true;
				const bodyContent = JSON.parse(JSON.stringify(tableCopy.value));
				await $fetch<apiResponse>(
					`${useRuntimeConfig().public.apiBase}inicontent/database/${
						database.value.slug
					}/${table.value.slug}`,
					{
						method: "PUT",
						body: (({ onResponse, onRequest }) => ({
							onResponse,
							onRequest,
						}))(bodyContent),
					},
				);
				Loading.value.updateTable = false;
			},
			flattenSchema = (schema: Schema, keepParents = false) => {
				const result: Schema = [];

				function flattenHelper(item: Field, parentKey: string) {
					if (item.children && isArrayOfObjects(item.children)) {
						if (keepParents)
							result.push((({ children, ...rest }) => rest)(item));
						for (const child of item.children) flattenHelper(child, item.key);
					} else
						result.push({
							...item,
							key: parentKey ? `${parentKey}.${item.key}` : item.key,
						});
				}
				for (const item of schema) flattenHelper(item, "");

				return result;
			},
			generateFlowCascaderOptions = (
				withWhereOr = true,
				withUser?: boolean,
			) => {
				const result: CascaderOption[] = [];
				if (withUser) {
					let userSchema = database.value.tables?.find(
						({ slug }) => slug === "user",
					)?.schema;
					if (userSchema) {
						userSchema = flattenSchema(userSchema);
						result.push({
							label: "@user",
							value: "@user",
							children: userSchema.map(({ id, key }) => ({
								label: key,
								value: `@user.${id}`,
							})),
						});
					}
				}
				if (table.value.schema) {
					const schema = flattenSchema(table.value.schema);
					result.push({
						label: "@where",
						value: "@where",
						children: [
							...(withWhereOr
								? [
										{
											label: "or",
											value: "@where.or",
											children: schema.map(({ id, key }) => ({
												label: key,
												value: `@where.or.${id}`,
											})),
										},
									]
								: []),
							...schema.map(({ id, key }) => ({
								label: key,
								value: `@where.${id}`,
							})),
						],
					});
					result.push({
						label: "@data",
						value: "@data",
						children: schema.map(({ id, key }) => ({
							label: key,
							value: `@data.${id}`,
						})),
					});
				}
				return result;
			},
			generateFlowSelectOptions = (
				value: string,
				withWhereOr = true,
				withUser?: boolean,
			) => {
				const result: (SelectOption | SelectGroupOption)[] = [];
				if (value === "@method")
					return ["get", "post", "put", "delete"].map((method) => ({
						label: method.toUpperCase(),
						value: method.toUpperCase(),
					}));

				result.push({
					label: "@null",
					value: "null",
				});

				if (
					value &&
					(value === "@user.c12f82766d02ae29c6a94a3acf11cda4" ||
						(table.value.slug === "user" &&
							value.endsWith(".c12f82766d02ae29c6a94a3acf11cda4")))
				)
					// @user.role
					result.push({
						key: "@role",
						label: "@role",
						type: "group",
						children: database.value.roles?.map(({ name, id }) => ({
							label: name,
							value: id,
						})),
					});
				if (withUser) {
					let userSchema = database.value.tables?.find(
						({ slug }) => slug === "user",
					)?.schema;
					if (userSchema) {
						userSchema = flattenSchema(userSchema);
						result.push({
							key: "@user",
							label: "@user",
							type: "group",
							children: userSchema.map(({ id, key }) => ({
								label: `@user.${key}`,
								value: `@user.${id}`,
							})),
						});
					}
				}
				if (table.value.schema) {
					const schema = flattenSchema(table.value.schema);
					result.push({
						key: "@where",
						label: "@where",
						type: "group",
						children: [
							...(withWhereOr
								? [
										{
											key: "@where.or",
											label: "or",
											type: "group",
											children: schema.map(({ id, key }) => ({
												label: `@where.or.${key}`,
												value: `@where.or.${id}`,
											})),
										},
									]
								: []),
							...schema.map(({ id, key }) => ({
								label: `@where.${key}`,
								value: `@where.${id}`,
							})),
						],
					});
					result.push({
						key: "@data",
						label: "@data",
						type: "group",
						children: schema.map(({ id, key }) => ({
							label: `@data.${key}`,
							value: `@data.${id}`,
						})),
					});
				}
				return result;
			},
			formatValue = (
				value?: string | number | boolean | null,
				property: keyof Field = "key",
				defaultValue?: string,
			) => {
				if (
					value &&
					typeof value === "string" &&
					(value.startsWith("@user.") ||
						value.startsWith("@data.") ||
						value.startsWith("@where."))
				) {
					const splitedValue = value.split("."),
						lastItem = splitedValue.pop();
					let schema =
						splitedValue[0] === "@user"
							? database.value?.tables?.find(({ slug }) => slug === "user")
									?.schema
							: table.value.schema;
					if (schema) {
						schema = flattenSchema(schema, true);
						const item = schema.find(({ id }) => id === lastItem);

						if (!item) return undefined;

						if (property === "key")
							return `${splitedValue.join(".")}.${item?.key}`;

						return item[property] ?? defaultValue;
					}
				}
				return value || defaultValue;
			},
			DropdownProps = (flow: FlowType, index: number) => ({
				options: [
					{
						label: t("delete"),
						key: "delete",
						icon: () => h(NIcon, () => h(IconTrash)),
					},
					{
						label: t("moveUp"),
						key: "moveUp",
						icon: () => h(NIcon, () => h(IconArrowUp)),
						disabled: index === 0,
					},
					{
						label: t("moveDown"),
						key: "moveDown",
						icon: () => h(NIcon, () => h(IconArrowDown)),
						disabled: index + 1 === flow.length,
					},
				],
				onSelect(key: string) {
					switch (key) {
						case "delete":
							flow.splice(index, 1);
							break;
						case "moveUp": {
							const element = flow[index];
							flow.splice(index, 1);
							flow.splice(index - 1, 0, element);
							break;
						}
						case "moveDown": {
							const element = flow[index];
							flow.splice(index, 1);
							flow.splice(index + 1, 0, element);
							break;
						}
					}
				},
			}),
			renderFlow = (flows?: FlowType[]) =>
				h(
					"div",
					{
						class: "masonry",
					},
					[
						...(flows?.map((flow, index) =>
							h(
								"div",
								{
									onmouseover: () =>
										(Hover.value[`${currentFlow.value}-${index}`] = true),
									onmouseleave: () =>
										(Hover.value[`${currentFlow.value}-${index}`] = false),
								},
								[
									h(
										NButtonGroup,
										{
											vertical: true,
											size: "small",
											style: {
												position: "absolute",
												top: 0,
												right: 0,
												zIndex: 999999,
												...(Hover.value[`${currentFlow.value}-${index}`]
													? {}
													: { visibility: "hidden" }),
											},
										},
										() => [
											h(
												NButton,
												{
													secondary: true,
													type: "primary",
													onClick: () =>
														(currentFlowCard.value =
															currentFlowCard.value ===
															`${currentFlow.value}-${index}`
																? undefined
																: `${currentFlow.value}-${index}`),
												},
												() =>
													h(NIcon, () =>
														h(
															currentFlowCard.value ===
																`${currentFlow.value}-${index}`
																? IconEye
																: IconPencil,
														),
													),
											),
											h(
												NButton,
												{
													secondary: true,
													type: "error",
													onClick() {
														if (flows) {
															if (
																currentFlowCard.value ===
																`${currentFlow.value}-${index}`
															)
																currentFlowCard.value = undefined;
															flows.splice(index, 1);
														}
													},
												},
												() => h(NIcon, () => h(IconTrash)),
											),
										],
									),
									h(
										NCard,
										{
											hoverable: true,
											contentStyle: { padding: 0 },
										},
										() =>
											h(
												NScrollbar,
												{
													xScrollable: true,
												},
												() =>
													h(
														NFlex,
														{
															vertical: true,
															wrap: false,
															style: { padding: "20px 22px" },
														},
														() => [
															flow?.length
																? undefined
																: h(NEmpty, {
																		style: { padding: "20px 22px" },
																	}),
															currentFlowCard.value ===
															`${currentFlow.value}-${index}`
																? renderWriteFlow(flow)
																: renderReadFlow(flow),
														],
													),
											),
									),
								],
							),
						) ?? []),
						h(
							NPopover,
							{ placement: "bottom" },
							{
								trigger: () =>
									h(
										NCard,
										{
											style: {
												cursor: "pointer",
											},
											contentStyle: {
												padding: "15px 0",
											},
											onClick: () => {
												if (flows && Array.isArray(flows))
													currentFlowCard.value = `${currentFlow.value}-${
														flows.push([]) - 1
													}`;
												else {
													flows = [];
													currentFlowCard.value = `${currentFlow.value}-${
														flows.push([]) - 1
													}`;
												}
											},
											hoverable: true,
										},
										() =>
											h(
												NSpace,
												{
													justify: "center",
													align: "center",
												},
												() => h(NIcon, { size: 36 }, () => h(IconPlus)),
											),
									),
								default: () => t("newCard"),
							},
						),
					],
				),
			renderReadFlow = (flow?: FlowType) =>
				flow?.map(([firstValue, secondValue, thirdValue]) => {
					if (thirdValue !== undefined) {
						if (firstValue === "set")
							return h(NFlex, { align: "center", wrap: false }, () => [
								h(NFlex, { wrap: false, size: 0 }, () => [
									h(
										NTag,
										{
											type: "info",
											bordered: false,
											style: {
												padding: "0 13px",
												borderRadius: "50px 0 0 50px",
											},
										},
										() => t("set"),
									),
									h(
										NTag,
										{
											type: "primary",
											bordered: false,
											style: {
												paddingRight: "10px",
												borderRadius: "0 50px 50px 0",
											},
										},
										() => formatValue(secondValue),
									),
								]),
								Array.isArray(thirdValue)
									? h(NScrollbar, { xScrollable: true }, () =>
											h(NFlex, { wrap: false }, () =>
												thirdValue.map((value: any) =>
													h(
														NTag,
														{
															bordered: false,
															round: true,
														},
														() =>
															String(
																secondValue &&
																	(secondValue ===
																		"@user.c12f82766d02ae29c6a94a3acf11cda4" ||
																		(table.value.slug === "user" &&
																			secondValue.endsWith(
																				".c12f82766d02ae29c6a94a3acf11cda4",
																			))) &&
																	isValidID(value)
																	? database.value.roles?.find(
																			({ id }) => id === value,
																		)?.name
																	: formatValue(value),
															),
													),
												),
											),
										)
									: h(
											NTag,
											{
												bordered: false,
												round: true,
											},
											() =>
												String(
													secondValue &&
														(secondValue ===
															"@user.c12f82766d02ae29c6a94a3acf11cda4" ||
															(table.value.slug === "user" &&
																secondValue.endsWith(
																	".c12f82766d02ae29c6a94a3acf11cda4",
																))) &&
														isValidID(thirdValue)
														? database.value.roles?.find(
																({ id }) => id === thirdValue,
															)?.name
														: formatValue(thirdValue),
												),
										),
							]);

						return h(NFlex, { align: "center", wrap: false }, () => [
							h(NFlex, { wrap: false, size: 0 }, () => [
								h(
									NTag,
									{
										type: "info",
										bordered: false,
										style: {
											padding: "0 14px",
											borderRadius: "50px 0 0 50px",
										},
									},
									() => t("if"),
								),
								h(
									NTag,
									{
										type: "primary",
										bordered: false,
										style: {
											paddingRight: "10px",
											borderRadius: "0 50px 50px 0",
										},
									},
									() => formatValue(firstValue),
								),
							]),
							h(
								NTooltip,
								{},
								{
									trigger: () =>
										h(
											NTag,
											{
												round: true,
												bordered: false,
												size: "small",
											},
											() => secondValue,
										),
									default: () =>
										ComparisonOperatorOptions.find(
											({ value }) => value === secondValue,
										)?.label,
								},
							),
							Array.isArray(thirdValue)
								? h(
										NFlex,
										{
											wrap: false,
											size: [4, 8],
										},
										() =>
											thirdValue.map((value: any) =>
												h(
													NTag,
													{
														bordered: false,
														round: true,
													},
													() =>
														String(
															firstValue &&
																(firstValue ===
																	"@user.c12f82766d02ae29c6a94a3acf11cda4" ||
																	(table.value.slug === "user" &&
																		firstValue.endsWith(
																			".c12f82766d02ae29c6a94a3acf11cda4",
																		))) &&
																isValidID(value)
																? database.value.roles?.find(
																		({ id }) => id === value,
																	)?.name
																: formatValue(value),
														),
												),
											),
									)
								: h(
										NTag,
										{
											bordered: false,
											round: true,
										},
										() =>
											String(
												(firstValue &&
												(firstValue ===
													"@user.c12f82766d02ae29c6a94a3acf11cda4" ||
													(table.value.slug === "user" &&
														firstValue.endsWith(
															".c12f82766d02ae29c6a94a3acf11cda4",
														))) &&
												isValidID(thirdValue)
													? database.value.roles?.find(
															({ id }) => id === thirdValue,
														)?.name
													: formatValue(thirdValue)) ?? null,
											),
									),
						]);
					}
					if (firstValue === "error")
						return h(NFlex, { align: "center", wrap: false }, () => [
							h(
								NTag,
								{
									type: "info",
									bordered: false,
									round: true,
								},
								() => t("throwError"),
							),
							h(
								NTag,
								{
									type: "error",
									bordered: false,
									round: true,
								},
								() => secondValue,
							),
						]);

					return h(NFlex, { align: "center", wrap: false }, () => [
						h(
							NTag,
							{
								type: "info",
								bordered: false,
								round: true,
							},
							() => t(firstValue),
						),
						Array.isArray(secondValue)
							? h(
									NFlex,
									{
										wrap: false,
										size: [4, 8],
									},
									() =>
										(secondValue as string[]).map((value: any) =>
											h(
												NTag,
												{
													bordered: false,
													round: true,
												},
												() => formatValue(value),
											),
										),
								)
							: h(
									NTag,
									{
										bordered: false,
										round: true,
									},
									() => formatValue(secondValue),
								),
					]);
				}) ?? h(NEmpty, { style: { padding: "20px 22px" } }),
			renderWriteFlow = (flow: FlowType) =>
				h(
					NFlex,
					{
						vertical: true,
					},
					() => [
						...(flow?.map(([firstValue, secondValue, thirdValue], index) => {
							if (thirdValue !== undefined) {
								if (firstValue === "set")
									return h(NInputGroup, () => [
										h(NDropdown, DropdownProps(flow, index), () =>
											h(
												NButton,
												{
													size: "small",
													type: "info",
													secondary: true,
													style: {
														borderRadius: "50px 0 0 50px",
														width: "47px",
													},
												},
												() => t("set"),
											),
										),
										h(NCascader, {
											size: "small",
											style: {
												height: "fit-content",
											},
											options: generateFlowCascaderOptions(),
											checkStrategy: "child",
											expandTrigger: "hover",
											showPath: true,
											separator: ".",
											filterable: true,
											value: secondValue,
											onUpdateValue(value: string) {
												flow[index][1] = value;
											},
										}),
										h(NSelect, {
											size: "small",
											style: {
												borderRadius: "0 50px 50px 0!important",
												overflow: "hidden",
											},
											consistentMenuWidth: false,
											filterable: true,
											tag: true,
											options: generateFlowSelectOptions(
												secondValue,
												false,
												true,
											),
											value: String(thirdValue),
											onUpdateValue(value: string) {
												flow[index][2] = value === "null" ? null : value;
											},
										}),
									]);

								return h(NInputGroup, () => [
									h(NDropdown, DropdownProps(flow, index), () =>
										h(
											NButton,
											{
												size: "small",
												type: "info",
												secondary: true,
												style: {
													borderRadius: "50px 0 0 50px",
													width: "37px",
												},
											},
											() => t("if"),
										),
									),
									h(NCascader, {
										size: "small",
										style: {
											height: "fit-content",
											maxWidth: "156px",
										},
										options: [
											...generateFlowCascaderOptions(true, true),
											{ label: "@method", value: "@method" },
										],
										checkStrategy: "child",
										expandTrigger: "hover",
										showPath: true,
										separator: ".",
										filterable: true,
										value: firstValue,
										onUpdateValue(value: string) {
											flow[index][0] = value as any;
										},
									}),
									h(NSelect, {
										size: "small",
										consistentMenuWidth: false,
										style: {
											width: "136px",
										},
										filterable: true,
										renderTag: ({ option }) => option.value,
										options: checkFieldType(
											formatValue(firstValue, "type", "string"),
											["number", "date"],
										)
											? ComparisonOperatorOptions.filter(
													({ value }) => !["*", "!*"].includes(value),
												)
											: ComparisonOperatorOptions.filter(
													({ value }) =>
														![
															">",
															">=",
															"<",
															"<=",
															...(firstValue === "@method" ? ["*", "!*"] : []),
														].includes(value),
												),
										value: secondValue,
										onUpdateValue(value: string) {
											flow[index][1] = value;
										},
									}),
									h(NSelect, {
										size: "small",
										style: {
											borderRadius: "0 50px 50px 0!important",
											overflow: "hidden",
										},
										consistentMenuWidth: false,
										filterable: true,
										tag: true,
										maxTagCount: "responsive",
										multiple: ["[]", "![]"].includes(secondValue as string),
										options: generateFlowSelectOptions(firstValue, false, true),
										defaultValue: `${thirdValue}`,
										onUpdateValue(value: string) {
											flow[index][2] = value === "null" ? null : value;
										},
									}),
								]);
							}
							if (firstValue === "error")
								return h(NInputGroup, () => [
									h(NDropdown, DropdownProps(flow, index), () =>
										h(
											NButton,
											{
												size: "small",
												type: "info",
												secondary: true,
												style: {
													borderRadius: "50px 0 0 50px",
													width: "96px",
												},
											},
											() => t("throwError"),
										),
									),
									h(NSelect, {
										size: "small",
										style: {
											borderRadius: "0 50px 50px 0!important",
											overflow: "hidden",
										},
										consistentMenuWidth: false,
										filterable: true,
										tag: true,
										options: [{ label: "accessDenied", value: "accessDenied" }],
										value: secondValue,
										onUpdateValue(value: string) {
											flow[index][1] = value;
										},
									}),
								]);

							return h(NFlex, { align: "center", wrap: false }, () => [
								h(
									NTag,
									{
										type: "info",
										bordered: false,
										round: true,
									},
									() => t(firstValue),
								),
								Array.isArray(secondValue)
									? h(
											NFlex,
											{
												wrap: false,
												size: [4, 8],
											},
											() =>
												(secondValue as string[]).map((value: any) =>
													h(
														NTag,
														{
															bordered: false,
															round: true,
														},
														() => formatValue(value),
													),
												),
										)
									: h(
											NTag,
											{
												bordered: false,
												round: true,
											},
											() => formatValue(secondValue),
										),
							]);
						}) ?? []),
						h(
							NDropdown,
							{
								showArrow: true,
								options: [
									{
										key: "if",
										label: t("condition"),
									},
									{
										key: "set",
										label: t("set"),
										show: table.value.slug !== "asset",
									},
									{
										key: "unset",
										label: t("unset"),
										show: table.value.slug !== "asset",
									},
									{
										key: "error",
										label: t("throwError"),
									},
								],
								onSelect(value) {
									if (!flow) flow = [];
									switch (value) {
										case "if":
											flow.push([null, null, null] as any);
											break;
										case "set":
											flow.push(["set", null, null] as any);
											break;
										default:
											flow.push([value, null] as any);
											break;
									}
								},
							},
							() =>
								h(
									NButton,
									{ style: { margin: "auto" }, round: true, dashed: true },
									() => h(NIcon, () => h(IconPlus)),
								),
						),
					],
				);
		if (!tableCopy.value.onRequest) tableCopy.value.onRequest = [];
		if (!tableCopy.value.onResponse) tableCopy.value.onResponse = [];
		return () => [
			h(
				NButton,
				{
					style: {
						bottom: "15px",
						right: "18px",
						zIndex: 9999997,
						position: "fixed",
					},
					circle: true,
					secondary: false,
					loading: Loading.value.updateTable,
					type: "primary",
					onClick: saveFlow,
				},
				{
					icon: () => h(NIcon, () => h(IconDeviceFloppy)),
				},
			),
			h(
				NTabs,
				{
					type: "segment",
					animated: true,
					value: currentFlow.value,
					onUpdateValue(value: string) {
						currentFlow.value = value;
					},
				},
				() => [
					h(NTabPane, { name: "onRequest", tab: "onRequest" }, () =>
						renderFlow(tableCopy.value.onRequest),
					),
					h(NTabPane, { name: "onResponse", tab: "onResponse" }, () =>
						renderFlow(tableCopy.value.onResponse),
					),
				],
			),
		];
	},
});
