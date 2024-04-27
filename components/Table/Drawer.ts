import { LazyRenderFields } from "#components";
import {
	IconExternalLink,
	IconChevronRight,
	IconChevronLeft,
	IconDeviceFloppy,
} from "@tabler/icons-vue";
import {
	useMessage,
	NDrawer,
	NDrawerContent,
	NText,
	NIcon,
	NSpace,
	NButton,
	NForm,
} from "naive-ui";

export default defineNuxtComponent({
	setup() {
		onMounted(() => {
			document.onkeydown = (e) => {
				if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
				e.preventDefault();
				Drawer.value.id ? UpdateDrawer() : CreateDrawer();
			};
		});

		const Language = useGlobalCookie("Language"),
			drawerWidth = useGlobalCookie<number>("drawerWidth");

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.DrawerContent = false;
		Loading.value.Drawer = false;

		const route = useRoute(),
			message = useMessage(),
			database = useState<Database>("database"),
			DrawerFormRef = useState(() => null),
			{ isMobile } = useDevice(),
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
			LoadDrawer = async () => {
				Loading.value[`Drawer_${Drawer.value.table}_${Drawer.value.id}`] = true;
				Drawer.value.data = (
					await $fetch<apiResponse>(
						`${useRuntimeConfig().public.apiBase}${route.params.database}/${
							Drawer.value.table
						}/${Drawer.value.id}`,
					)
				).result;
				Loading.value[`Drawer_${Drawer.value.table}_${Drawer.value.id}`] =
					false;
				Drawer.value.show = true;
			},
			UpdateDrawer = async () => {
				(DrawerFormRef.value as any)?.validate(async (errors: any) => {
					if (!errors) {
						const bodyContent = JSON.parse(JSON.stringify(Drawer.value));
						Loading.value.DrawerContent = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${route.params.database}/${
								bodyContent.table
							}/${bodyContent.id}`,
							{
								method: "PUT",
								body: bodyContent.data,
							},
						);
						if (!data) return message.error(t("error"));

						if (data.result?.id) {
							message.success(data.message);
							Loading.value.DrawerContent = false;
							Drawer.value = {
								...Drawer.value,
								id: null,
								data: {},
								table: null,
								show: false,
							};
							await refreshNuxtData();
						} else message.error(data.message);
						Loading.value.DrawerContent = false;
					} else message.error("The inputs are Invalid");
				});
			},
			CreateDrawer = async () => {
				(DrawerFormRef.value as any)?.validate(async (errors: any) => {
					if (!errors) {
						const bodyContent = JSON.parse(JSON.stringify(Drawer.value));
						Loading.value.DrawerContent = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${route.params.database}/${
								bodyContent.table
							}`,
							{
								method: "POST",
								body: bodyContent.data,
							},
						);
						if (!data) return message.error(t("error"));

						if (data.result?.id) {
							message.success(data.message);
							Loading.value.DrawerContent = false;
							Drawer.value = {
								...Drawer.value,
								id: null,
								data: {},
								table: null,
								show: false,
							};
							await refreshNuxtData();
						} else message.error(data.message);
						Loading.value.DrawerContent = false;
					} else message.error("The inputs are Invalid");
				});
			};

		watch(Drawer, (v) => {
			if (v?.show && v.id && !Object.keys(v.data).length) LoadDrawer();
		});

		return () =>
			h(
				NDrawer,
				{
					show: Drawer.value.show,
					onUpdateShow: (v: boolean) => (Drawer.value.show = v),
					width: isMobile ? "100%" : drawerWidth.value,
					onUpdateWidth: (w: any) => (drawerWidth.value = w),
					resizable: true,
					placement: Language.value === "ar" ? "left" : "right",
				},
				() =>
					h(
						NDrawerContent,
						{
							closable: true,
							nativeScrollbar: false,
						},
						{
							header: () =>
								Drawer.value.id
									? [
											t("edit"),
											" ",
											h(
												NText,
												{
													tag: "a",
													href: `/${route.params.database}/admin/tables/${Drawer.value.table}/${Drawer.value.id}/edit`,
													onClick(e: MouseEvent) {
														e.preventDefault();
														navigateTo(
															`/${route.params.database}/admin/tables/${Drawer.value.table}/${Drawer.value.id}/edit`,
														);
													},
													style: {
														cursor: "pointer",
													},
													type: "primary",
												},
												() => [
													t(Drawer.value.table),
													h(NIcon, () => h(IconExternalLink)),
												],
											),
										]
									: [t("new"), " ", t(Drawer.value.table)],
							footer: () =>
								h(
									NSpace,
									{
										style: {
											width: "100%",
										},
										justify: !isMobile ? "space-between" : "end",
									},
									() => [
										!isMobile
											? h(
													NButton,
													{
														round: true,
														secondary: true,
														type: "info",
														onClick: () =>
															(drawerWidth.value =
																drawerWidth.value >= window.screen.width / 2
																	? 251
																	: window.screen.width - 2),
													},
													{
														icon: () =>
															h(NIcon, () =>
																h(
																	drawerWidth.value >= window.screen.width / 2
																		? IconChevronRight
																		: IconChevronLeft,
																),
															),
													},
												)
											: null,
										h(
											NButton,
											{
												round: true,
												secondary: true,
												type: "primary",
												onClick: Drawer.value.id ? UpdateDrawer : CreateDrawer,
												loading: Loading.value.DrawerContent,
											},
											{
												icon: () => h(NIcon, () => h(IconDeviceFloppy)),
												default: () =>
													Drawer.value.id ? t("update") : t("create"),
											},
										),
									],
								),
							default: () =>
								h(
									NForm,
									{
										ref: DrawerFormRef,
										model: Drawer.value.data,
									},
									() =>
										h(LazyRenderFields, {
											modelValue: Drawer.value.data,
											schema:
												database.value.tables
													?.find(({ slug }) => slug === Drawer.value.table)
													?.schema?.filter(
														({ key }) =>
															![
																"id",
																"createdAt",
																"createdBy",
																"updatedAt",
															].includes(key),
													) ?? [],
										}),
								),
						},
					),
			);
	},
});
