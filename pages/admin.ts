import {
	useMessage,
	NCard,
	NModal,
	NSpace,
	NButton,
	NIcon,
	NForm,
	NCollapse,
	NCollapseItem,
	type FormInst,
} from "naive-ui";
import {
	IconPlus,
	IconDeviceFloppy,
	IconSettings,
	IconArrowRight,
} from "@tabler/icons-vue";
import { LazyTableGrid, LazyRenderFields } from "#components";

export default defineNuxtComponent({
	async setup() {
		definePageMeta({
			middleware: "dashboard",
		});

		useLanguage({
			ar: {
				newItem: "عنصر جديد",
				tableSettings: "إعدادات الجدول",
			},
			en: {},
		});

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Database = false;

		const database = useState<Database>("database"),
			message = useMessage(),
			{ isMobile } = useDevice(),
			{ data: databases } = await useFetch<apiResponse<Database[]>>(
				`${useRuntimeConfig().public.apiBase}inicontent/database`,
			),
			defaultOpenedDatabase = ref(databases.value?.result[0]?.slug ?? null),
			ShowDatabaseModal = ref(false),
			DatabaseRef = ref<FormInst | null>(null),
			DatabaseModal = ref<Database>(),
			DatabaseSave = async () => {
				DatabaseRef.value?.validate(async (errors: any) => {
					if (!errors) {
						const bodyContent = JSON.parse(JSON.stringify(DatabaseModal.value));
						Loading.value.Database = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}inicontent/database${
								bodyContent.id ? `/${bodyContent.slug}` : ""
							}`,
							{
								method: bodyContent.id ? "PUT" : "POST",
								body: bodyContent,
							},
						);
						if (!data.result) return message.error(data.message);

						if (databases.value) {
							if (databases.value.result)
								databases.value.result.push(data.result);
							else databases.value.result = [data.result];
							defaultOpenedDatabase.value = data.result.slug;
						}
						Loading.value.Database = false;
						ShowDatabaseModal.value = false;
						message.success(data.message);

						Loading.value.Database = false;
					} else message.error("The inputs are Invalid");
				});
			};

		useHead({
			title: `${database.value.slug} | Dashboard`,
			link: [{ rel: "icon", href: database.value?.icon ?? "" }],
		});

		return () =>
			h(
				NCard,
				{ title: t("databases"), style: "background: none", bordered: false },
				{
					"header-extra": () =>
						h(
							NButton,
							{
								circle: true,
								onClick: () => {
									DatabaseModal.value = {};
									ShowDatabaseModal.value = true;
								},
							},
							{ icon: () => h(NIcon, () => h(IconPlus)) },
						),
					default: () => [
						h(
							NModal,
							{
								show: ShowDatabaseModal.value,
								"on-update:show": (v: boolean) => (ShowDatabaseModal.value = v),
								style: {
									width: !isMobile ? "600px" : "100%",
								},
								preset: "card",
								title:
									DatabaseModal.value &&
									Object.hasOwn(DatabaseModal.value, "id")
										? t("update_database")
										: t("create_database"),
								bordered: false,
								segmented: {
									footer: "soft",
								},
							},
							{
								default: () =>
									h(
										NForm,
										{
											ref: DatabaseRef,
											model: DatabaseModal.value,
										},
										() =>
											h(LazyRenderFields, {
												modelValue: DatabaseModal.value,
												schema: [
													{
														id: 1,
														key: "slug",
														type: "string",
														required: true,
													},
													{
														id: 2,
														key: "icon",
														type: "url",
														subType: "upload",
														required: true,
													},
													{
														id: 3,
														key: "allowedDomains",
														type: "array",
														children: "url",
														required: false,
													},
													{
														id: 4,
														key: "languages",
														type: "array",
														subType: "select",
														children: "string",
														values: Languages,
														required: false,
													},
													{
														id: 5,
														key: "roles",
														type: "array",
														subType: "tags",
														children: "string",
														disabledItems: [0, 1, 2],
														defaultValue: ["admin", "user", "guest"],
														required: false,
													},
												],
											}),
									),
								footer: () =>
									h(NSpace, { justify: "end" }, () => [
										h(
											NButton,
											{
												loading: Loading.value.Database,
												onClick: DatabaseSave,
											},
											{
												default: () =>
													DatabaseModal.value &&
													Object.hasOwn(DatabaseModal.value, "id")
														? t("save")
														: t("create"),
												icon: () => h(NIcon, () => h(IconDeviceFloppy)),
											},
										),
									]),
							},
						),
						databases.value?.result?.length
							? h(
									NCollapse,
									{
										defaultExpandedNames: defaultOpenedDatabase.value,
										onUpdateExpandedNames: (v) =>
											(defaultOpenedDatabase.value = v ? v[0] : null),
										triggerAreas: ["main", "arrow"],
										accordion: true,
									},
									() =>
										databases.value?.result?.map((childDatabase) =>
											h(
												NCollapseItem,
												{
													title: t(childDatabase.slug),
													name: childDatabase.slug,
												},
												{
													"header-extra": () =>
														h(NSpace, {}, () => [
															h(
																NButton,
																{
																	tag: "a",
																	href: `/${childDatabase.slug}/admin/settings`,
																	onClick: (e) => {
																		e.preventDefault();
																		navigateTo(
																			`/${childDatabase.slug}/admin/settings`,
																		);
																	},
																	circle: true,
																	type: "primary",
																},
																{ icon: () => h(NIcon, () => h(IconSettings)) },
															),
															h(
																NButton,
																{
																	tag: "a",
																	href: `/${childDatabase.slug}/admin`,
																	onClick: (e) => {
																		e.preventDefault();
																		navigateTo(`/${childDatabase.slug}/admin`);
																	},
																	circle: true,
																	type: "primary",
																},
																{
																	icon: () => h(NIcon, () => h(IconArrowRight)),
																},
															),
														]),
													default: () =>
														h(LazyTableGrid, { modelValue: childDatabase }),
												},
											),
										),
								)
							: null,
					],
				},
			);
	},
});
