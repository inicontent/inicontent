import { NLayout, NLayoutSider, NMenu, NLayoutContent, NIcon } from "naive-ui";
import {
	IconPlus,
	IconEye,
	IconFolders,
	IconLanguage,
	IconUsers,
	IconFingerprint,
	IconWebhook,
	IconSettings,
} from "@tabler/icons-vue";
import { NuxtLayout, NuxtLink } from "#components";

export default defineComponent({
	setup: (_, { slots }) => {
		const Language = useGlobalCookie<string>("Language");

		useLanguage({
			ar: {
				showAll: "أظهر الكل",
				newItem: "عنصر جديد",
			},
			en: {},
		});

		const route = useRoute(),
			{ isMobile } = useDevice(),
			user = useState<User>("user"),
			table = useState<Table>("table"),
			isMenuOpen = useState("isMenuOpen", () => false),
			database = useState<Database>("database"),
			renderSingleItem = ({ slug, allowedMethods }: Table) => ({
				label: () =>
					h(
						NuxtLink,
						{
							onClick: () => (isMenuOpen.value = false),
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
				children: [
					...(slug !== "asset" && allowedMethods?.includes("c")
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
									key: `${slug}-new`,
									icon: () => h(NIcon, () => h(IconPlus)),
								},
							]
						: []),
					...(user.value?.role === "d7b3d61a582e53ee29b5a1d02a436d55"
						? [
								...(slug !== "asset"
									? [
											{
												label: () =>
													h(
														NuxtLink,
														{
															to: `/${route.params.database}/admin/tables/${slug}/settings`,
														},
														{ default: () => t("settings") },
													),
												key: `${slug}-settings`,
												icon: () => h(NIcon, () => h(IconSettings)),
											},
										]
									: []),
								{
									label: () =>
										h(
											NuxtLink,
											{
												to: `/${route.params.database}/admin/tables/${slug}/flows`,
											},
											{ default: () => t("flows") },
										),
									key: `${slug}-flows`,
									icon: () => h(NIcon, () => h(IconWebhook)),
								},
							]
						: []),
				],
			});

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
									onUpdateCollapsed: (collapsed) =>
										(isMenuOpen.value = !collapsed),
									style: "z-index: 999",
									bordered: true,
									showTrigger: "bar",
									collapseMode: "width",
									collapsedWidth: isMobile ? 0 : 64,
									width: 240,
									nativeScrollbar: false,
								},
								() =>
									h(NMenu, {
										collapsed: !isMenuOpen.value,
										collapsedIconSize: 22,
										collapsedWidth: isMobile ? 0 : 64,
										onMouseover: () => (isMenuOpen.value = true),
										onMouseleave: () => (isMenuOpen.value = false),
										options: (database.value.tables
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
														.map(renderSingleItem) ?? []),
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
														.map(renderSingleItem) ?? []),
												]
											: []) as any,
										expandedKeys: table.value?.slug
											? [table.value?.slug]
											: undefined,
										value: (() => {
											const lastPathInRoute = route.path
												.split("/")
												.filter(Boolean)
												.at(-1);
											if (table.value?.slug) {
												if (
													lastPathInRoute &&
													lastPathInRoute !== table.value.slug
												)
													return `${table.value.slug}-${lastPathInRoute}`;
												return table.value.slug;
											}
											return lastPathInRoute;
										})(),
										accordion: true,
									}),
							),
							h(
								NLayoutContent,
								{
									position: "absolute",
									contentStyle: {
										padding: isMobile
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
									slots.default ? slots.default() : null,
								],
							),
						],
					),
				),
			);
	},
});
