import {
	NFormItem,
	NIcon,
	NButton,
	NSpace,
	NSelect,
	NAvatar,
	NTag,
	NDrawer,
	NDrawerContent,
	NForm,
	type FormInst,
	useMessage,
} from "naive-ui";
import { IconDeviceFloppy, IconPencil, IconPlus } from "@tabler/icons-vue";
import { deepMerge } from "inibase/utils";
import { getProperty, setProperty, hasProperty } from "inidot";
import Inison from "inison";
import { LazyRenderFields } from "#components";

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
		const Language = useGlobalCookie("Language");

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Drawer = false;

		const modelValue = toRef(props, "modelValue"),
			route = useRoute(),
			field = props.field,
			path = props.path,
			Drawer = ref<{
				show: boolean;
				id?: null | string;
				table?: null | string;
				data?: any;
			}>({
				show: false,
				id: null,
				table: null,
				data: {},
			}),
			database = useState<Database>("database"),
			OPTIONS = ref<any>({}),
			DrawerFormRef = ref<FormInst | null>(null),
			message = useMessage(),
			UpdateDrawer = async () => {
				DrawerFormRef.value?.validate(async (errors) => {
					if (!errors) {
						Loading.value.Drawer = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${
								route.params.database ?? "inicontent"
							}/${Drawer.value.table}/${Drawer.value.id}`,
							{
								method: "PUT",
								body: Drawer.value.data,
							},
						);
						if (!data.result) return message.error(t("error"));

						if (data.result?.id) {
							message.success(data.message);
							Loading.value.Drawer = false;
							Drawer.value.show = false;
							Drawer.value.data = {};
						} else message.error(data.message);
						Loading.value.Drawer = false;
					} else message.error("The inputs are Invalid");
				});
			},
			CreateDrawer = async () => {
				DrawerFormRef.value?.validate(async (errors) => {
					if (!errors) {
						Loading.value.Drawer = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${
								route.params.database ?? "inicontent"
							}/${Drawer.value.table}`,
							{
								method: "POST",
								body: Drawer.value.data,
							},
						);
						if (!data.result) return message.error(t("error"));

						if (data.result?.id) {
							message.success(data.message);
							Loading.value.Drawer = false;
							Drawer.value.show = false;
							Drawer.value.data = {};
						} else message.error(data.message);
						Loading.value.Drawer = false;
					} else message.error("The inputs are Invalid");
				});
			};

		return () => [
			h(
				NFormItem,
				{
					path,
					rule: {
						type: !field.isArray ? "object" : "array",
						required: field.required,
						trigger: "change",
						message: "Please select an option",
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				{
					label: () =>
						h(NSpace, {}, () => [
							t(field.key),
							!field.isArray && hasProperty(modelValue.value, `${path}.id`)
								? h(
										NButton,
										{
											circle: true,
											secondary: true,
											size: "tiny",
											onClick: () => {
												Drawer.value.table = field.table;
												Drawer.value.id = getProperty(
													modelValue.value,
													`${path}.id`,
												);
												Drawer.value.data = getProperty(modelValue.value, path);
												Drawer.value.show = true;
											},
										},
										{ icon: () => h(NIcon, () => h(IconPencil)) },
									)
								: null,
							database.value.tables
								?.find(({ slug }) => slug === field.table)
								?.allowedMethods?.includes("c")
								? h(
										NButton,
										{
											circle: true,
											secondary: true,
											size: "tiny",
											onClick() {
												Drawer.value.table = field.table;
												Drawer.value.show = true;
											},
										},
										{ icon: () => h(NIcon, () => h(IconPlus)) },
									)
								: null,
						]),
					default: () =>
						h(NSelect, {
							value: hasProperty(modelValue.value, path)
								? !field.isArray
									? []
											.concat(getProperty(modelValue.value, path, []))
											.map((i: any) => i.id)[0]
									: []
											.concat(getProperty(modelValue.value, path, []))
											.map((i: any) => i.id)
								: null,
							onUpdateValue: (_value, option: any) =>
								setProperty(
									modelValue.value,
									path,
									Array.isArray(option)
										? option.map((i: any) => i.raw)
										: option.raw,
								),
							options: getProperty(modelValue.value, path)
								? deepMerge(
										[]
											.concat(getProperty(modelValue.value, path, []))
											.map((single_value: any) => ({
												label: renderLabel(
													database.value.tables?.find(
														({ slug }) => slug === field.table,
													)?.label,
													database.value.tables?.find(
														({ slug }) => slug === field.table,
													)?.schema,
													single_value,
												),
												value: single_value.id,
												image: field.image
													? getProperty(single_value, field.image, null)
													: null,
												raw: single_value,
											})),
										OPTIONS.value ? OPTIONS.value[field.key] ?? [] : [],
									)
								: OPTIONS.value
									? OPTIONS.value[field.key]
									: [],
							remote: true,
							clearable: true,
							filterable: true,
							loading: Loading.value[`options_${field.key}`],
							multiple: !!field.isArray,
							renderLabel: field.image
								? (option: any) =>
										h(
											"div",
											{
												style: {
													padding: "5px",
													display: "flex",
													alignItems: "center",
												},
											},
											[
												h(NAvatar, {
													src: []
														.concat(option.image)
														.map((link: string) =>
															link.includes("inicontent") &&
															[
																"png",
																"jpg",
																"jpeg",
																"ico",
																"webp",
																"svg",
																"gif",
															].includes(link?.split(".")?.pop() ?? "")
																? `${link}?fit=80`
																: link,
														)[0],
													round: true,
													size: "large",
													style:
														Language.value === "ar"
															? {
																	marginLeft: "12px",
																}
															: {
																	marginRight: "12px",
																},
												}),
												option.label,
											],
										)
								: undefined,
							renderTag: ({
								option,
								handleClose,
							}: {
								option: any;
								handleClose: () => void;
							}) =>
								field.image
									? !field.isArray
										? h(
												"div",
												{
													style: {
														display: "flex",
														alignItems: "center",
													},
												},
												() => [
													h(NAvatar, {
														src: ([] as string[])
															.concat(option.image)
															.map((link) =>
																link.includes("inicontent") &&
																[
																	"png",
																	"jpg",
																	"jpeg",
																	"ico",
																	"webp",
																	"svg",
																	"gif",
																].includes(link?.split(".")?.pop() ?? "")
																	? `${link}?fit=24`
																	: link,
															)[0],
														round: true,
														size: 24,
														style:
															Language.value === "ar"
																? {
																		marginLeft: "12px",
																	}
																: {
																		marginRight: "12px",
																	},
													}),
													option.label,
												],
											)
										: h(
												NTag,
												{
													style: {
														padding: "0 6px 0 4px",
													},
													round: true,
													closable: true,
													onClose: (e) => {
														e.stopPropagation();
														handleClose();
													},
												},
												{
													default: () =>
														h(
															"div",
															{
																style: {
																	display: "flex",
																	alignItems: "center",
																},
															},
															() => [
																h(NAvatar, {
																	src: []
																		.concat(option.image as any)
																		.map((link: string) =>
																			link.includes("inicontent") &&
																			[
																				"png",
																				"jpg",
																				"jpeg",
																				"ico",
																				"webp",
																				"svg",
																				"gif",
																			].includes(link?.split(".")?.pop() ?? "")
																				? `${link}?fit=22`
																				: link,
																		)[0],
																	round: true,
																	size: 22,
																	style:
																		Language.value === "ar"
																			? {
																					marginLeft: "4px",
																				}
																			: {
																					marginRight: "4px",
																				},
																}),
																option.label,
															],
														),
												},
											)
									: option.label,
							onSearch: async (v) => {
								if (v.length > 3) {
									Loading.value[`options_${field.key}`] = true;
									OPTIONS.value[field.key] =
										(
											await $fetch<apiResponse>(
												`${useRuntimeConfig().public.apiBase}${
													route.params.database ?? "inicontent"
												}/${field.table}`,
												{
													params: {
														where: Inison.stringify({
															or:
																field.searchIn?.reduce((result, searchKey) => {
																	Object.assign(result, {
																		[searchKey]: `*%${v}%`,
																	});
																	return result;
																}, {}) ?? "",
														}),
													},
												},
											)
										).result?.map((single_result: any) => ({
											label: renderLabel(
												database.value.tables?.find(
													({ slug }) => slug === field.table,
												)?.label,
												database.value.tables?.find(
													({ slug }) => slug === field.table,
												)?.schema,
												single_result,
											),
											value: single_result.id,
											image: field.image
												? Array.isArray(getProperty(single_result, field.image))
													? getProperty(single_result, `${field.image}[0]`)
													: getProperty(single_result, field.image)
												: null,
											raw: single_result,
										})) ?? [];
									Loading.value[`options_${field.key}`] = false;
								}
							},
						}),
				},
			),
			h(
				NDrawer,
				{
					show: Drawer.value.show,
					"on-update:show": (v: boolean) => (Drawer.value.show = v),
					resizable: true,
					placement: Language.value === "ar" ? "left" : "right",
				},
				() =>
					h(
						NDrawerContent,
						{
							title: Drawer.value.id
								? `${t(Drawer.value.table)} | ${Drawer.value.id}`
								: `${t("new")} ${t(Drawer.value.table)}`,
							closable: true,
							nativeScrollbar: false,
						},
						{
							footer: () =>
								h(
									NButton,
									{
										round: true,
										secondary: true,
										type: "primary",
										onClick: Drawer.value.id ? UpdateDrawer : CreateDrawer,
										loading: Loading.value.Drawer,
									},
									{
										icon: () => h(NIcon, () => h(IconDeviceFloppy)),
										default: () => (Drawer.value.id ? "UPDATE" : "CREATE"),
									},
								),
							default: () =>
								h(
									NForm,
									{
										ref: DrawerFormRef as any,
										model: Drawer.value.data as any,
									},
									() =>
										h(LazyRenderFields, {
											modelValue: Drawer.value.data,
											schema:
												database.value.tables?.find(
													(item: any) => item.slug === Drawer.value.table,
												)?.schema ?? ([] as any),
										}),
								),
						},
					),
			),
		];
	},
});
