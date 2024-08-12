import { NLayout, NLayoutSider, NMenu, NLayoutContent, NIcon } from "naive-ui";
import {
	IconPlus,
	IconEye,
	IconFolders,
	IconLanguage,
	IconUsers,
	IconFingerprint,
} from "@tabler/icons-vue";
import { NuxtLayout, NuxtLink } from "#components";

export default defineComponent({
	setup: (props, { slots }) => {
		const Language = useCookie("Language");

		useLanguage({
			ar: {
				showAll: "أظهر الكل",
				newItem: "عنصر جديد",
			},
			en: {},
		});

		const route = useRoute(),
			Window = useState("Window", () => ({
				width: 0,
			})),
			user = useState("user"),
			isMenuOpen = useState("isMenuOpen", () => false),
			database = useState("database");

		return () =>
			h(
				"div",
				h(NuxtLayout, { name: "default" }, () =>
					h(
						NLayout,
						{
							position: "absolute",
							hasSider: true,
						},
						() => [
							h(
								NLayoutSider,
								{
									collapsed: !isMenuOpen.value,
									onCollapse: () => (isMenuOpen.value = false),
									onExpand: () => (isMenuOpen.value = true),
									style: "z-index: 999",
									bordered: true,
									showTrigger: "bar",
									collapseMode: "width",
									collapsedWidth: device.value.width < 700 ? 0 : 64,
									width: 240,
									nativeScrollbar: false,
								},
								() =>
									h(NMenu, {
										collapsed: !isMenuOpen.value,
										collapsedIconSize: 22,
										collapsedWidth: device.value.width < 700 ? 0 : 64,
										options: database.value.tables
											? [
													...(database.value.tables
														?.filter(
															({ slug, allowedMethods }) =>
																![
																	"user",
																	"session",
																	"asset",
																	"translation",
																].includes(slug) &&
																allowedMethods?.includes("r"),
														)
														.map(({ slug, allowedMethods }) => ({
															label: () =>
																h(
																	NuxtLink,
																	{
																		to: `/${route.params.database}/admin/tables/${slug}`,
																	},
																	{ default: () => t(slug) },
																),
															key: slug,
															icon: () => t(slug).charAt(0).toUpperCase(),
															children: allowedMethods?.includes("c")
																? [
																		{
																			label: () =>
																				h(
																					NuxtLink,
																					{
																						to: `/${route.params.database}/admin/tables/${slug}`,
																					},
																					{ default: () => t("showAll") },
																				),
																			key: slug,
																			icon: () => h(NIcon, () => h(IconEye)),
																		},
																		{
																			label: () =>
																				h(
																					NuxtLink,
																					{
																						to: `/${route.params.database}/admin/tables/${slug}/new`,
																					},
																					{ default: () => t("newItem") },
																				),
																			key: `new-${slug}`,
																			icon: () => h(NIcon, () => h(IconPlus)),
																		},
																	]
																: null,
														})) ?? []),
													database.value.tables?.filter(
														({ slug, allowedMethods }) =>
															[
																"user",
																"session",
																"asset",
																"translation",
															].includes(slug) && allowedMethods?.includes("r"),
													).length
														? {
																key: "divider-1",
																type: "divider",
															}
														: null,
													...(database.value.tables
														?.filter(
															({ slug, allowedMethods }) =>
																[
																	"user",
																	"session",
																	"asset",
																	"translation",
																].includes(slug) &&
																allowedMethods?.includes("r"),
														)
														.map(({ slug, allowedMethods }) => ({
															label: () =>
																h(
																	NuxtLink,
																	{
																		to: `/${route.params.database}/admin/tables/${slug}`,
																	},
																	{ default: () => t(slug) },
																),
															key: slug,
															icon: () =>
																h(NIcon, () => {
																	switch (slug) {
																		case "asset":
																			return h(IconFolders);
																		case "translation":
																			return h(IconLanguage);
																		case "user":
																			return h(IconUsers);
																		case "session":
																			return h(IconFingerprint);
																		default:
																			return t(slug).charAt(0).toUpperCase();
																	}
																}),
															children: allowedMethods?.includes("c")
																? [
																		{
																			label: () =>
																				h(
																					NuxtLink,
																					{
																						to: `/${route.params.database}/admin/tables/${slug}`,
																					},
																					{ default: () => t("showAll") },
																				),
																			key: slug,
																			icon: () => h(NIcon, () => h(IconEye)),
																		},
																		{
																			label: () =>
																				h(
																					NuxtLink,
																					{
																						to: `/${route.params.database}/admin/tables/${slug}/new`,
																					},
																					{ default: () => t("newItem") },
																				),
																			key: `new-${slug}`,
																			icon: () => h(NIcon, () => h(IconPlus)),
																		},
																	]
																: null,
														})) ?? []),
												]
											: [],
										defaultExpandedKeys: [
											route.params.table ??
												route.path.split("/").filter(Boolean).pop(),
										],
										value:
											route.params.table ??
											route.path.split("/").filter(Boolean).pop(),
										accordion: true,
									}),
							),
							h(
								NLayoutContent,
								{
									position: "absolute",
									contentStyle: {
										padding:
											device.value.width < 700
												? "24px"
												: Language.value === "ar"
													? "24px 88px 24px 24px"
													: "24px 24px 24px 88px",
									},
									nativeScrollbar: false,
									id: "page_content",
								},
								() => [
									isMenuOpen.value
										? h("div", {
												onClick: () => (isMenuOpen.value = false),
												style: {
													width: "100%",
													height: "100%",
													right: "0px",
													top: "0px",
													backgroundColor: "#0000006e",
													position: "absolute",
													zIndex: 99,
													cursor: "pointer",
												},
											})
										: null,
									slots.default(),
								],
							),
						],
					),
				),
			);
	},
});
