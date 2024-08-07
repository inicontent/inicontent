import {
	IconArrowRight,
	IconChevronRight,
	IconDots,
	IconFingerprint,
	IconFolders,
	IconLanguage,
	IconLetterCase,
	IconPlus,
	IconSettings,
	IconUsers,
	IconWebhook,
} from "@tabler/icons-vue";
import {
	NButton,
	NCard,
	NDropdown,
	NGi,
	NGrid,
	NH4,
	NIcon,
	NIconWrapper,
	NInput,
	NInputGroup,
	NPopover,
	NSpace,
	useMessage,
} from "naive-ui";

export default defineNuxtComponent({
	props: {
		modelValue: {
			type: Object as PropType<Database>,
			default: {},
		},
	},
	setup: (props) => {
		useLanguage({
			ar: {
				newTable: "جدول جديد",
				newItem: "عنصر جديد",
				tableSettings: "إعدادات الجدول",
				tableFlows: "تدفقات الجدول",
			},
			en: {},
		});
		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Table = false;

		const user = useState<User>("user"),
			database = toRef(props, "modelValue"),
			Hover = useState<Record<string | number, boolean>>("Loading", () => ({})),
			message = useMessage(),
			Table = ref<string | null>(null),
			createTable = async () => {
				if (Table.value) {
					const bodyContent = JSON.parse(JSON.stringify(Table.value));
					Loading.value.Table = true;
					const data = await $fetch<apiResponse>(
						`${useRuntimeConfig().public.apiBase}inicontent/database/${
							database.value.slug
						}/${bodyContent}`,
						{
							method: "POST",
						},
					);
					if (data.result) {
						database.value.tables?.push(data.result);
						message.success(data.message);
						Table.value = null;
					} else message.error(data.message ?? t("error"));
					Loading.value.Table = false;
				} else message.error("The inputs are Invalid");
			};
		Hover.value = {};
		return () =>
			h(NGrid, { xGap: 12, yGap: 12, cols: "1 500:2 800:4" }, () => [
				...(database.value.tables
					?.filter(({ allowedMethods }) => allowedMethods?.includes("r"))
					.toSorted(
						(a, b) =>
							Number(
								["user", "session", "translation", "asset"].includes(b.slug),
							) -
							Number(
								["user", "session", "translation", "asset"].includes(a.slug),
							),
					)
					.map((table) =>
						h(NGi, () =>
							h(
								NCard,
								{
									onClick: () =>
										navigateTo(
											`/${database.value.slug}/admin/tables/${table.slug}`,
										),
									style: {
										cursor: "pointer",
									},
									hoverable: true,
								},
								{
									header: () =>
										h(NSpace, () => [
											h(NIconWrapper, { borderRadius: 50 }, () =>
												h(NIcon, { style: "font-style: normal" }, () => {
													switch (table.slug) {
														case "asset":
															return h(IconFolders);
														case "translation":
															return h(IconLanguage);
														case "user":
															return h(IconUsers);
														case "session":
															return h(IconFingerprint);
														default:
															return t(table.slug).charAt(0).toUpperCase();
													}
												}),
											),
											h(NH4, { style: "margin-bottom: 0" }, () =>
												t(table.slug),
											),
										]),
									"header-extra": () =>
										h(
											NDropdown,
											{
												options: [
													{
														key: `/${database.value.slug}/admin/tables/${table.slug}/new`,
														label: t("newItem"),
														icon: () => h(NIcon, () => h(IconPlus)),
														show:
															table.slug !== "asset" &&
															table.allowedMethods?.includes("c"),
													},
													{
														key: `/${database.value.slug}/admin/tables/${table.slug}/settings`,
														label: t("tableSettings"),
														icon: () => h(NIcon, () => h(IconSettings)),
														show:
															table.slug !== "asset" &&
															user.value?.role ===
																"d7b3d61a582e53ee29b5a1d02a436d55",
													},
													{
														key: `/${database.value.slug}/admin/tables/${table.slug}/flows`,
														label: t("tableFlows"),
														icon: () => h(NIcon, () => h(IconWebhook)),
														show:
															user.value?.role ===
															"d7b3d61a582e53ee29b5a1d02a436d55",
													},
												],
												renderLabel: (option) =>
													h(
														"a",
														{
															href: option.key,
															onClick: (e) => {
																e.preventDefault();
																navigateTo(option.key as string);
															},
														},
														option.label as string,
													),
											},
											() =>
												h(
													NButton,
													{
														circle: true,
														onmouseover: () => {
															Hover.value[table.slug] = true;
														},
														onmouseleave: () => {
															Hover.value[table.slug] = false;
														},
													},
													{
														icon: () =>
															h(NIcon, () =>
																h(
																	Hover.value[table.slug]
																		? IconArrowRight
																		: IconDots,
																),
															),
													},
												),
										),
								},
							),
						),
					) ?? []),
				h(NGi, () =>
					h(
						NPopover,
						{ placement: "bottom" },
						{
							trigger: () =>
								h(
									NPopover,
									{
										trigger: "click",
									},
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

										default: () =>
											h(NInputGroup, () => [
												h(
													NInput,
													{
														onUpdateValue: (value) => {
															Table.value = value;
														},
														onKeydown: ({ key }) =>
															key === "Enter" ? createTable() : null,
														placeholder: t("tableSlug"),
													},
													{
														suffix: () => h(NIcon, () => h(IconLetterCase)),
													},
												),
												h(
													NButton,
													{ onClick: createTable },
													{ icon: () => h(NIcon, () => h(IconChevronRight)) },
												),
											]),
									},
								),
							default: () => t("newTable"),
						},
					),
				),
			]);
	},
});
