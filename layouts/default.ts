import {
	NMessageProvider,
	NLayout,
	NScrollbar,
	NLayoutHeader,
	NPageHeader,
	NTag,
	NAvatar,
	NBreadcrumb,
	NBreadcrumbItem,
	NSpace,
	NDropdown,
	NButton,
	NLayoutContent,
	NLayoutFooter,
	NText,
	NIcon,
	NPopover,
	NTooltip,
	NButtonGroup,
	NFlex,
} from "naive-ui";
import {
	IconMoon,
	IconSun,
	IconSettings,
	IconCopyright,
	IconUser,
	IconPencil,
	IconLogout,
	IconLanguage,
} from "@tabler/icons-vue";

export default defineNuxtComponent({
	setup: (_, { slots }) => {
		const Language = useGlobalCookie<string>("Language");
		useLanguage({
			ar: {
				settings: "الإعدادات",
				toggleTheme: "تغيير الوضع",
				edit: "تعديل",
				routeAdmin: "لوحة التحكم",
				allRightsReserved: "جميع الحقوق محفوظة",
				logout: "تسجيل الخروج",
				profile: "تعديل الحساب",
				session: "سجل الدخول",
				user: "مستخدم",
				admin: "مدير",
				translation: "ترجمة",
				asset: "ملف",
				tables: "الجداول",
			},
			en: { routeAdmin: "Admin Panel" },
		});

		const route = useRoute(),
			device = useState<Device>("device", () => ({
				width: 0,
			})),
			user = useState<User | null>("user"),
			Theme = useGlobalCookie<string>("Theme"),
			database = useState<Database>("database", () => ({
				slug: "inicontent",
				icon: "/favicon.ico",
			})),
			ThemeConfig = useState<ThemeConfig>("ThemeConfig");

		onMounted(() => {
			device.value = { width: window.innerWidth };
			window.addEventListener(
				"resize",
				() => (device.value = { width: window.innerWidth }),
			);
		});

		return () =>
			h(
				"div",
				h(
					NMessageProvider,
					{
						keepAliveOnHover: true,
						closable: true,
						containerStyle: { top: "70px" },
					},
					() =>
						h(NLayout, { position: "absolute" }, () => [
							h(
								NScrollbar,
								{
									style: "max-height: 65px",
									xScrollable: true,
									trigger: "none",
								},
								() =>
									h(
										NLayoutHeader,
										{
											style: "height: 64px; padding: 15px 24px",
											bordered: true,
										},
										() =>
											h(
												NPageHeader,
												{},
												{
													avatar: () =>
														(route.name as string | undefined)?.startsWith(
															"database",
														)
															? h(
																	NTag,
																	{
																		onClick: () =>
																			navigateTo(`/${database.value.slug}`),
																		strong: true,
																		round: true,
																		bordered: false,
																		style: {
																			cursor: "pointer",
																			fontWeight: 600,
																			...(ThemeConfig.value.revert
																				? Theme.value === "light"
																					? {}
																					: {
																							color: "#000",
																							backgroundColor: "#fff",
																						}
																				: Theme.value === "dark"
																					? {}
																					: {
																							color: "#fff",
																							backgroundColor: "#000",
																						}),
																		},
																	},
																	{
																		default: () => database.value.slug,
																		avatar: () =>
																			h(NAvatar, {
																				style: {
																					backgroundColor: "transparent",
																				},
																				src:
																					database.value?.icon ??
																					"/favicon.ico",
																			}),
																	},
																)
															: h(
																	NTag,
																	{
																		strong: true,
																		round: true,
																		bordered: false,
																	},
																	{
																		default: () => database.value.slug,
																		avatar: () =>
																			h(NAvatar, {
																				src:
																					database.value.icon ?? "/favicon.ico",
																			}),
																	},
																),
													title: () =>
														![
															"index",
															"auth",
															"dashboard",
															"database",
															"database-auth",
														].includes(route.name as string)
															? h(NBreadcrumb, {}, () =>
																	route.path
																		.split("/")
																		.filter(Boolean)
																		.filter(
																			(_path, index) =>
																				!(
																					route.name as string | undefined
																				)?.startsWith("database") ||
																				index !== 0,
																		)
																		.map((childRoute, index) =>
																			h(
																				NBreadcrumbItem,
																				{
																					href: route.path
																						.split("/")
																						.slice(
																							0,
																							index +
																								((
																									route.name as
																										| string
																										| undefined
																								)?.startsWith("database")
																									? 3
																									: 2),
																						)
																						.join("/"),
																					onClick: (e) => {
																						e.preventDefault();
																						navigateTo(
																							route.path
																								.split("/")
																								.slice(
																									0,
																									index +
																										((
																											route.name as
																												| string
																												| undefined
																										)?.startsWith("database")
																											? 3
																											: 2),
																								)
																								.join("/"),
																						);
																					},
																				},
																				() =>
																					t(
																						childRoute === "admin"
																							? "routeAdmin"
																							: childRoute,
																					),
																			),
																		),
																)
															: null,
													extra: () =>
														h(NButtonGroup, () => [
															...(user.value?.id
																? [
																		user.value?.role ===
																		"d7b3d61a582e53ee29b5a1d02a436d55"
																			? h(
																					NTooltip,
																					{},
																					{
																						trigger: () =>
																							h(
																								NButton,
																								{
																									round: true,
																									size: "small",
																								},
																								() =>
																									humanFileSize(
																										database.value.size,
																									),
																							),
																						default: () =>
																							t("totalDatabaseSize"),
																					},
																				)
																			: null,
																		h(
																			NDropdown,
																			{
																				options: [
																					{
																						key: "header",
																						type: "render",
																						render: () =>
																							h(
																								NSpace,
																								{
																									justify: "center",
																									style: {
																										padding: "5px 0",
																									},
																								},
																								() =>
																									h(
																										NText,
																										{
																											strong: true,
																										},
																										() =>
																											(
																												user.value as User
																											).username
																												.charAt(0)
																												.toUpperCase() +
																											(
																												user.value as User
																											).username.slice(1),
																									),
																							),
																					},
																					{
																						key: "header-divider",
																						type: "divider",
																					},
																					{
																						label: t("profile"),
																						key: "edit",
																						icon: () =>
																							h(NIcon, () => h(IconPencil)),
																					},
																					{
																						label: t("logout"),
																						key: "logout",
																						icon: () =>
																							h(NIcon, () => h(IconLogout)),
																					},
																				],
																				onSelect: async (v) => {
																					switch (v) {
																						case "edit":
																							navigateTo(
																								`/${
																									route.params.database
																								}/admin/tables/user/${
																									(user.value as User).id
																								}/edit`,
																							);
																							break;
																						case "logout":
																							await $fetch(
																								`${
																									useRuntimeConfig().public
																										.apiBase
																								}${
																									route.params.database ??
																									"inicontent"
																								}/auth/signout`,
																								{},
																							);
																							user.value = null;
																							await navigateTo(
																								route.params.database
																									? `/${route.params.database}/auth`
																									: "/auth",
																							);
																							break;
																					}
																				},
																			},
																			() =>
																				h(
																					NButton,
																					{
																						size: "small",
																						round: true,
																					},
																					{
																						icon: () =>
																							h(NIcon, () => h(IconUser)),
																					},
																				),
																		),
																		user.value?.role ===
																		"d7b3d61a582e53ee29b5a1d02a436d55"
																			? h(
																					NPopover,
																					{},
																					{
																						trigger: () =>
																							h(
																								NButton,
																								{
																									size: "small",
																									round: true,
																									tag: "a",
																									href: `/${route.params.database}/admin/settings`,
																									onClick: (e) => {
																										e.preventDefault();
																										navigateTo(
																											`/${route.params.database}/admin/settings`,
																										);
																									},
																								},
																								{
																									icon: () =>
																										h(NIcon, () =>
																											h(IconSettings),
																										),
																								},
																							),
																						default: () =>
																							t("databaseSettings"),
																					},
																				)
																			: null,
																	]
																: []),
															h(
																NPopover,
																{},
																{
																	trigger: () =>
																		h(
																			NButton,
																			{
																				size: "small",
																				round: true,
																				onClick: () =>
																					Theme.value === "dark"
																						? (Theme.value = "light")
																						: (Theme.value = "dark"),
																			},
																			{
																				icon: () =>
																					h(NIcon, () =>
																						Theme.value === "light"
																							? h(IconMoon)
																							: h(IconSun),
																					),
																			},
																		),
																	default: () => t("toggleTheme"),
																},
															),
															h(
																NDropdown,
																{
																	value: Language.value,
																	options: [
																		{
																			label: "Arabic",
																			key: "ar",
																		},
																		{
																			label: "English",
																			key: "en",
																		},
																	],
																	onSelect: (v) => (Language.value = v),
																},
																() =>
																	h(
																		NButton,
																		{ size: "small", round: true },
																		{
																			icon: () =>
																				h(NIcon, () => h(IconLanguage)),
																			default: () => null,
																		},
																	),
															),
														]),
												},
											),
									),
							),
							h(
								NLayoutContent,
								{
									id: "container",
									position: "absolute",
									style: {
										top: "64px",
										height: "calc(~'100vh - 98px')",
									},
									nativeScrollbar: false,
									contentStyle: {
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										padding: "24px",
										height: "max-content",
									},
								},
								() => (slots.default ? slots.default() : null),
							),
						]),
				),
			);
	},
});
