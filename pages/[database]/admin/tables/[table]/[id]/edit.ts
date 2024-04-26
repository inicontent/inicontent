import {
	NCard,
	NIcon,
	NButton,
	NSpace,
	NEllipsis,
	NPopover,
	NPopconfirm,
	NForm,
	useMessage,
	type FormInst,
} from "naive-ui";
import {
	IconDeviceFloppy,
	IconSend,
	IconTrash,
	IconEye,
} from "@tabler/icons-vue";

import { LazyRenderFields } from "#components";

export default defineNuxtComponent({
	async setup() {
		definePageMeta({
			middleware: ["dashboard", "table"],
			layout: "table",
		});

		onMounted(() => {
			document.onkeydown = (e) => {
				if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
				e.preventDefault();
				UPDATE();
			};
		});

		useLanguage({
			ar: {
				view: "مُعاينة",
				update: "حِفظ",
				publish: "نشر",
				delete: "حذف",
				theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
			},
			en: {},
		});

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.UPDATE = false;
		Loading.value.DELETE = false;
		Loading.value.EDITOR = false;

		const route = useRoute(),
			database = useState<Database>("database"),
			table = database.value.tables?.find(
				(item) => item.slug === route.params.table,
			),
			message = useMessage(),
			{ data: single } = await useFetch<Item>(
				`${useRuntimeConfig().public.apiBase}${route.params.database}/${
					route.params.table
				}/${route.params.id}`,
				{
					transform: (res: any) => {
						if (!res.result || !res.result.id) {
							message.error("Item not found");
							setTimeout(
								() =>
									navigateTo(
										`/${route.params.database}/admin/tables/${route.params.table}/new`,
									),
								1000,
							);
						}
						return res.result as Item;
					},
				},
			),
			formRef = ref<FormInst | null>(null),
			UPDATE = async (publish = false) => {
				formRef.value?.validate(async (errors) => {
					if (!errors) {
						const bodyContent = JSON.parse(JSON.stringify(single.value));
						Loading.value.UPDATE = true;
						const data = await $fetch<apiResponse<Item>>(
							`${useRuntimeConfig().public.apiBase}${route.params.database}/${
								route.params.table
							}/${route.params.id}`,
							{
								method: "PUT",
								body: bodyContent,
							},
						);
						if (data.result?.id) {
							single.value = data.result;
							message.success(data.message);
						} else message.error(data.message);
						Loading.value.UPDATE = false;
					} else message.error("The inputs are Invalid");
				});
			},
			DELETE = async () => {
				Loading.value.DELETE = true;
				const data = await $fetch<apiResponse<Item>>(
					`${useRuntimeConfig().public.apiBase}${route.params.database}/${
						route.params.table
					}/${route.params.id}`,
					{
						method: "DELETE",
					},
				);
				if (data.result) {
					message.success(data.message);
					Loading.value.DELETE = false;
					return navigateTo(
						`/${route.params.database}/admin/tables/${route.params.table}`,
					);
				}
				message.error(data.message);
				Loading.value.DELETE = false;
			},
			label = renderLabel(table?.label, table?.schema, single.value);

		useHead({
			title: `${database.value.slug} | ${t(route.params.table as string)} ${t(
				"table",
			)} : ${label}`,
			link: [{ rel: "icon", href: database.value?.icon ?? "" }],
		});
		return () =>
			h(
				NCard,
				{
					style: "height: fit-content",
				},
				{
					header: () =>
						h(NEllipsis, () => `${t(route.params.table as string)} : ${label}`),
					"header-extra": () =>
						table?.schema?.filter(
							({ key }) =>
								!["id", "createdAt", "createdBy", "updatedAt"].includes(key),
						).length
							? h(NSpace, {}, () => [
									h(
										NPopover,
										{},
										{
											trigger: () =>
												h(
													NButton,
													{
														tag: "a",
														href: `/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}`,
														onClick: (e) => {
															e.preventDefault();
															navigateTo(
																`/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}`,
															);
														},
														circle: true,
														secondary: true,
													},
													{
														icon: () => h(NIcon, () => h(IconEye)),
													},
												),
											default: () => t("view"),
										},
									),
									h(
										NPopconfirm,
										{ onPositiveClick: DELETE },
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
																	secondary: true,
																	circle: true,
																	type: "error",
																	loading: Loading.value.DELETE,
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
									h(
										NPopover,
										{},
										{
											trigger: () =>
												h(
													NButton,
													{
														secondary: true,
														circle: true,
														type: "primary",
														onClick: async () => await UPDATE(),
														loading: Loading.value.UPDATE,
													},
													{
														icon: () => h(NIcon, () => h(IconDeviceFloppy)),
													},
												),
											default: () => t("update"),
										},
									),
								])
							: null,
					action: () =>
						h(NSpace, { justify: "end" }, () => [
							h(
								NPopconfirm,
								{ onPositiveClick: DELETE },
								{
									trigger: () =>
										h(
											NButton,
											{
												round: true,
												secondary: true,
												type: "error",
												loading: Loading.value.DELETE,
											},
											{
												icon: () => h(NIcon, () => h(IconTrash)),
												default: () => t("delete"),
											},
										),
									default: () => t("theFollowingActionIsIrreversible"),
								},
							),
							h(
								NButton,
								{
									round: true,
									secondary: true,
									type: "primary",
									onClick: async () => await UPDATE(),
									loading: Loading.value.UPDATE,
								},
								{
									icon: () => h(NIcon, () => h(IconDeviceFloppy)),
									default: () => t("update"),
								},
							),
						]),
					default: () =>
						h(
							NForm,
							{
								model: single.value as any,
								ref: formRef as any,
							},
							() =>
								h(LazyRenderFields, {
									modelValue: single.value,
									schema: table?.schema?.filter(
										({ key }) =>
											!["id", "createdAt", "createdBy", "updatedAt"].includes(
												key,
											),
									),
								}),
						),
				},
			);
	},
});
