import {
	NIcon,
	NIconWrapper,
	NButton,
	NText,
	NA,
	NImage,
	NImageGroup,
	NAvatar,
	NTag,
	NTime,
	NPopover,
	NCollapse,
	NCollapseItem,
	NEllipsis,
	NSpace,
	useMessage,
} from "naive-ui";
import { IconCheck, IconFileUpload, IconX } from "@tabler/icons-vue";
import { getProperty } from "inidot";
import { isArrayOfObjects } from "inibase/utils";

export default defineNuxtComponent({
	props: {
		field: {
			type: Object as PropType<Field | never>,
			default: {},
		},
		value: {
			default: null,
		},
	},
	setup: (props) => {
		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Drawer = false;

		const value = props.value,
			field = props.field,
			{ isMobile } = useDevice(),
			message = useMessage(),
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
			database = useState<Database>("database"),
			renderColumn = (_value: any, _field: Field): any => {
				if (_value === null || _value === undefined)
					switch (_field.subType ?? _field.type) {
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
					_field.subType &&
					((Array.isArray(_field.type) && _field.type.includes("array")) ||
						(typeof _field.type === "string" && _field.type === "array"))
				)
					_field.isArray = true;

				let deletectedFieldType = _field.subType ?? _field.type;
				if (Array.isArray(deletectedFieldType))
					deletectedFieldType = getField(
						_field.subType ?? _field.type,
						_value,
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
												await copyToClipboard(_value);
												message.success(t("textCopied"));
											},
											secondary: true,
											round: true,
										},
										() =>
											h(
												NEllipsis,
												{ tooltip: false, style: "max-width:50px" },
												() => _value,
											),
									),
								default: () => t("clickToCopy"),
							},
						);
					case "table":
						return [].concat(_value).map((col: Item & { id: string }) =>
							h(
								NButton,
								{
									tag: "a",
									href: `/admin/tables/${_field.table}/${col.id}/edit`,
									onClick: (e) => {
										e.preventDefault();
										if (!isMobile)
											Drawer.value = {
												...Drawer.value,
												id: col.id,
												table: _field.table as string,
												data: {},
												show: true,
											};
										else
											navigateTo(
												`/admin/tables/${_field.table}/${col.id}/edit`,
											);
									},
									loading: Loading.value[`Drawer_${_field.table}_${col.id}`],
									size: "small",
									round: true,
								},
								{
									icon: () =>
										h(
											NIcon,
											_field.image
												? () => {
														const img = []
															.concat(
																getProperty(_value, _field.image as string, []),
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
																	(_field.table as string)
																		.charAt(0)
																		.toUpperCase(),
																);
													}
												: () =>
														h(
															"span",
															{},
															(_field.table as string).charAt(0).toUpperCase(),
														),
										),
									default: () =>
										h(
											NEllipsis,
											{
												tooltip: true,
												style: {
													maxWidth: `${
														_field.key && t(_field.key).length > 10
															? t(_field.key).length * 12
															: 120
													}px`,
												},
											},
											() =>
												renderLabel(
													database.value.tables?.find(
														({ slug }) => slug === _field.table,
													)?.label,
													database.value.tables?.find(
														({ slug }) => slug === _field.table,
													)?.schema,
													col,
												),
										),
								},
							),
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
													_field.key && t(_field.key).length > 10
														? t(_field.key).length * 12
														: 120
												}px`,
											},
										},
										() =>
											h(
												NA,
												{ href: `mailto:${value}`, target: "_blank" },
												() => _value,
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
										_field.key && t(_field.key).length > 10
											? t(_field.key).length * 12
											: 120
									}px`,
								},
							},
							() => Array.from(Array(String(_value).length), () => "•"),
						);
					case "boolean":
						return h(
							NIconWrapper,
							{
								color: _value === true ? "green" : "red",
								borderRadius: 50,
								size: 18,
							},
							() =>
								h(
									NIcon,
									{
										size: 16,
									},
									() => h(_value === true ? IconCheck : IconX),
								),
						);
					case "url":
						return h(
							NA,
							{ href: _value, target: "_blank" },
							{
								default: () =>
									h(
										NEllipsis,
										{
											tooltip: true,
											style: {
												maxWidth: `${
													_field.key && t(_field.key).length > 10
														? t(_field.key).length * 12
														: 120
												}px`,
											},
										},
										() =>
											h(NA, { href: _value, target: "_blank" }, () => _value),
									),
							},
						);
					case "color":
						return h(
							NTag,
							{
								round: true,
								style: {
									backgroundColor: _value,
								},
							},
							() =>
								h(
									NText,
									{ style: { mixBlendMode: "difference" } },
									() => _value,
								),
						);
					case "select":
					case "tags":
						return h(NSpace, () =>
							[].concat(_value).map((_v) =>
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
														_field.key && t(_field.key).length > 10
															? t(_field.key).length * 12
															: 120
													}px`,
												},
											},
											() => _v,
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
								default: () => h("div", { innerHTML: _value }),
							},
						);
					case "date":
						return h(
							NPopover,
							{},
							{
								trigger: () =>
									h(NTime, {
										time: Number(_value),
										type: _field.date ? "date" : "relative",
									}),
								default: () =>
									h(NTime, {
										time: Number(_value),
										type: _field.date ? "relative" : "date",
									}),
							},
						);
					case "upload":
						return [].concat(_value).length === 1
							? [].concat(_value).map((link: string) =>
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
										[].concat(_value).length > 3
											? [
													...[]
														.concat(_value)
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
													`+${[].concat(_value).length - 3}`,
												]
											: [].concat(_value).map((link: string) =>
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
													_field.key && t(_field.key).length > 10
														? t(_field.key).length * 12
														: 120
												}px`,
											},
										},
										() =>
											t(
												database.value.roles?.find(({ id }) => id === _value)
													?.name,
											),
									),
								icon: () =>
									h(
										"span",
										{ style: { padding: "0 5px" } },
										database.value.roles
											?.find(({ id }) => id === _value)
											?.name.charAt(0)
											.toUpperCase(),
									),
							},
						);
					case "string":
						if (_field.subType)
							return renderColumn(_value, { ..._field, type: _field.subType });
						return renderColumn(_value, { ..._field, type: "text" });
					case "array":
						if (!_field.children) throw new Error("no children");
						if (_field.subType)
							return renderColumn(_value, {
								..._field,
								type: _field.subType,
								isArray: true,
							});
						if (!isArrayOfObjects(_field.children))
							return renderColumn(_value, {
								..._field,
								type: _field.children === "table" ? "table" : "tags",
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
											[].concat(_value).map((_item, index) =>
												h(
													NCollapseItem,
													{
														title: `${_field.key} ${index + 1}`,
													},
													() =>
														h(NSpace, { vertical: true }, () =>
															(_field.children as Schema).map((child) =>
																h(
																	NSpace,
																	{
																		align: "center",
																	},
																	() => [
																		h("strong", `${t(child.key)}:`),
																		renderColumn(
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
										(_field.children as Schema).map((child) =>
											h(NSpace, { align: "center", inline: true }, () => [
												h("strong", `${child.key}:`),
												renderColumn(getProperty(_value, child.key), child),
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
												_field.key && t(_field.key).length > 10
													? t(_field.key).length * 12
													: 120
											}px`,
										},
									},
									() => _value,
								)
							: h(NText, { depth: 3 }, () => "--");
				}
			};

		return () => renderColumn(value, field);
	},
});
