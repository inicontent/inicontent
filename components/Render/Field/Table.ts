import { IconDeviceFloppy, IconPencil, IconPlus } from "@tabler/icons-vue";
import { deepMerge, isArrayOfObjects, isObject } from "inibase/utils";
import { getProperty, hasProperty, setProperty } from "inidot";
import Inison from "inison";
import {
	type FormInst,
	NAvatar,
	NButton,
	NDrawer,
	NDrawerContent,
	NFlex,
	NForm,
	NFormItem,
	NIcon,
	NSelect,
	NTag,
	type SelectOption,
	useMessage,
} from "naive-ui";
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
	async setup(props) {
		const Language = useGlobalCookie("Language");

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Drawer = false;

		const modelValue = toRef(props, "modelValue"),
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
			options = ref<SelectOption[]>(),
			DrawerFormRef = ref<FormInst | null>(null),
			message = useMessage(),
			UpdateDrawer = async () => {
				DrawerFormRef.value?.validate(async (errors) => {
					if (!errors) {
						Loading.value.Drawer = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${
								useRuntimeConfig().public.databaseName ?? "inicontent"
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
								useRuntimeConfig().public.databaseName ?? "inicontent"
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
			},
			singleOption = (option: any) => ({
				label: renderLabel(
					database.value.tables?.find(({ slug }) => slug === field.table)
						?.label,
					database.value.tables?.find(({ slug }) => slug === field.table)
						?.schema,
					option,
				),
				value: option.id,
				image: field.image
					? Array.isArray(getProperty(option, field.image))
						? getProperty(option, `${field.image}[0]`)
						: getProperty(option, field.image)
					: null,
			}),
			loadOptions = async (searchValue?: string | number) => {
				Loading.value[`options_${field.key}`] = true;
				const data =
					(
						await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${
								useRuntimeConfig().public.databaseName ?? "inicontent"
							}/${field.table}`,
							searchValue
								? {
										params: {
											where: Inison.stringify({
												or:
													field.searchIn?.reduce((result, searchKey) => {
														Object.assign(result, {
															[searchKey]: `*%${searchValue}%`,
														});
														return result;
													}, {}) ?? "",
											}),
										},
									}
								: undefined,
						)
					).result?.map(singleOption) ?? [];
				if (getProperty(modelValue.value, path))
					options.value = [
						...(options.value as any).slice(
							0,
							field.isArray ? getProperty(modelValue.value, path).length : 1,
						),
						...data,
					];
				else options.value = data;
				Loading.value[`options_${field.key}`] = false;
			},
			renderTag = field.image
				? ({
						option,
						handleClose,
					}: {
						option: any;
						handleClose: () => void;
					}) =>
						!field.isArray
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
				: undefined;

		if (hasProperty(modelValue.value, path)) {
			if (
				(Array.isArray(getProperty(modelValue.value, path)) &&
					getProperty(modelValue.value, path).every(isObject)) ||
				isObject(getProperty(modelValue.value, path))
			)
				options.value = []
					.concat(getProperty(modelValue.value, path))
					.map(singleOption);
			else
				options.value =
					(
						await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${
								useRuntimeConfig().public.databaseName ?? "inicontent"
							}/${field.table}`,
							{
								params: {
									where: Inison.stringify({
										id: `[]${[]
											.concat(getProperty(modelValue.value, path))
											.join(",")}`,
									}),
								},
							},
						)
					).result?.map(singleOption) ?? [];
		}

		return () => [
			h(
				NFormItem,
				{
					path,
					rule: {
						type: !field.isArray ? "object" : "array",
						required: field.required,
						trigger: "change",
						min: field.isArray ? field.min : undefined,
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				{
					label: () =>
						h(NFlex, { align: "center", size: "small" }, () => [
							t(field.key),
							!field.isArray &&
							hasProperty(modelValue.value, `${path}.id`) &&
							database.value.tables
								?.find(({ slug }) => slug === field.table)
								?.allowedMethods?.includes("u")
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
								? field.isArray
									? isArrayOfObjects(getProperty(modelValue.value, path))
										? getProperty(modelValue.value, path).map(
												({ id }: Item) => id,
											)
										: getProperty(modelValue.value, path)
									: isObject(getProperty(modelValue.value, path))
										? getProperty(modelValue.value, path).id
										: getProperty(modelValue.value, path)
								: null,
							onUpdateValue: (value) =>
								setProperty(modelValue.value, path, value),
							options: options.value,
							remote: true,
							clearable: true,
							filterable: true,
							loading: Loading.value[`options_${field.key}`],
							multiple: !!field.isArray,
							consistentMenuWidth: false,
							maxTagCount: "responsive",
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
							renderTag,
							async onFocus() {
								if (options.value) {
									if (field.isArray) {
										if (
											options.value.length !==
											getProperty(modelValue.value, path).length
										)
											return;
									} else if (options.value.length > 1) return;
								}
								await loadOptions();
							},
							onSearch: async (v) => {
								if (v.length > 1) await loadOptions(v);
							},
						}),
				},
			),
			h(
				NDrawer,
				{
					show: Drawer.value.show,
					"on-update:show": (v: boolean) => {
						Drawer.value.show = v;
					},
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
