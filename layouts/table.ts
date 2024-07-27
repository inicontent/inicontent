import {
	IconEye,
	IconFingerprint,
	IconFolders,
	IconLanguage,
	IconPlus,
	IconSettings,
	IconUsers,
	IconWebhook,
} from "@tabler/icons-vue";
import { NIcon, NLayout, NLayoutContent, NLayoutSider, NMenu } from "naive-ui";
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
			defaultValue = ref(),
			renderSingleItem = ({ slug, allowedMethods }: Table) => {
				const itemChildren = [
					...(slug !== "asset" && allowedMethods?.includes("c")
						? [
								{
									label: () =>
										h(
											NuxtLink,
											{
												onClick: () => {
													defaultValue.value = slug;
												},
												to: `/${database.value.slug}/admin/tables/${slug}`,
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
												onClick: () => {
													defaultValue.value = `${slug}-new`;
												},
												to: `/${database.value.slug}/admin/tables/${slug}/new`,
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
															onClick: () => {
																defaultValue.value = `${slug}-settings`;
															},
															to: `/${database.value.slug}/admin/tables/${slug}/settings`,
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
												onClick: () => {
													defaultValue.value = `${slug}-flows`;
												},
												to: `/${database.value.slug}/admin/tables/${slug}/flows`,
											},
											{ default: () => t("flows") },
										),
									key: `${slug}-flows`,
									icon: () => h(NIcon, () => h(IconWebhook)),
								},
							]
						: []),
				];
				return {
					label: () =>
						h(
							NuxtLink,
							{
								onClick: () => {
									defaultValue.value = slug;
								},
								to: `/${database.value.slug}/admin/tables/${slug}`,
							},
							{ default: () => t(slug) },
						),
					key: itemChildren.length ? `${slug}Group` : slug,
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
					children: itemChildren.length ? itemChildren : undefined,
				};
			};
		const lastPathInRoute = decodeURIComponent(
			route.path.split("/").filter(Boolean).at(-1) ?? "",
		);
		if (table.value?.slug) {
			if (lastPathInRoute && lastPathInRoute !== table.value.slug)
				defaultValue.value = `${table.value.slug}-${lastPathInRoute}`;
			else defaultValue.value = table.value.slug;
		} else defaultValue.value = decodeURI(lastPathInRoute?.toString() ?? "");

		return () =>
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
								onUpdateCollapsed: (collapsed) => {
									isMenuOpen.value = !collapsed;
								},
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
									onMouseover: () => {
										isMenuOpen.value = true;
									},
									onMouseleave: () => {
										isMenuOpen.value = false;
									},
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
															].includes(slug) && allowedMethods?.includes("r"),
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
															["user", "session", "asset"].includes(slug) &&
															allowedMethods?.includes("r"),
													)
													.map(renderSingleItem) ?? []),
											]
										: []) as any,
									expandedKeys: table.value?.slug
										? [`${table.value.slug}Group`]
										: [],
									value: defaultValue.value ?? undefined,
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
											onClick: () => {
												isMenuOpen.value = false;
											},
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
			);
	},
});
