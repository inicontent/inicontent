import {
	useMessage,
	NCard,
	NSpace,
	NButton,
	NIcon,
	NGrid,
	NGi,
	NForm,
	NAnchor,
	NAnchorLink,
	type FormInst,
	NTooltip,
	NPopconfirm,
	NEmpty,
} from "naive-ui";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-vue";
import { LazyRenderFields } from "#components";

export default defineNuxtComponent({
	async setup() {
		definePageMeta({
			middleware: "dashboard",
		});

		onMounted(() => {
			document.onkeydown = (e) => {
				if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
				e.preventDefault();
				updateDatabase();
			};
		});

		useLanguage({
			ar: {
				save: "حِفظ",
				slug: "الإسم",
				allowedMethods: "الأوامر المسموح بها",
				allowedDomains: "النِطاقات المسموح بها",
				languages: "اللغات",
				roles: "الأدوار",
				guest: "زائر",
				icon: "أيقونة",
				generalSettings: "إعدادات عامة",
				translationSettings: "إعدادات الترجمة",
				emailSettings: "إعدادات البريد",
				theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
			},
			en: {},
		});

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.updateDatabase = false;
		Loading.value.deleteDatabase = false;

		const route = useRoute(),
			{ isMobile } = useDevice(),
			router = useRouter(),
			database = useState<Database>("database"),
			message = useMessage(),
			databaseRef = ref<FormInst | null>(null),
			databaseCopy = ref(
				JSON.parse(
					JSON.stringify({
						...database.value,
						roles: database.value.roles?.map(({ name }) => name),
					}),
				),
			),
			updateDatabase = async () => {
				databaseRef.value?.validate(async (errors) => {
					if (!errors) {
						const bodyContent = JSON.parse(JSON.stringify(databaseCopy.value));
						Loading.value.updateDatabase = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}inicontent/database/${
								database.value.slug
							}`,
							{
								method: "PUT",
								body: bodyContent,
							},
						);
						if (data.result) {
							database.value = { ...database.value, ...data.result };
							if (route.params.database !== database.value.slug)
								router.replace({
									params: { database: database.value.slug },
								});
							Loading.value.updateDatabase = false;
							message.success(data.message);
						} else message.error(data.message);
						Loading.value.updateDatabase = false;
					} else message.error("The inputs are Invalid");
				});
			},
			deleteDatabase = async () => {
				Loading.value.deleteDatabase = true;
				const data = await $fetch<apiResponse>(
					`${useRuntimeConfig().public.apiBase}inicontent/database/${
						database.value.slug
					}`,
					{
						method: "DELETE",
					},
				);
				if (data.result) {
					database.value = {};
					Loading.value.deleteDatabase = false;
					message.success(data.message);
					setTimeout(async () => {
						clearNuxtState("database");
						await navigateTo("/admin");
					}, 800);
				} else message.error(data.message);
				Loading.value.deleteDatabase = false;
			};

		useHead({
			title: `${database.value.slug} | ${t("Settings")}`,
			link: [{ rel: "icon", href: database.value?.icon ?? "" }],
		});

		return () =>
			h(
				NGrid,
				{
					xGap: 12,
					cols: 12,
					layoutShiftDisabled: true,
				},
				() => [
					h(NGi, { span: !isMobile ? 10 : 12 }, () =>
						h(
							NCard,
							{
								title: `${database.value.slug} ${t("settings")}`,
								hoverable: true,
							},
							{
								"header-extra": () =>
									h(NSpace, () => [
										h(
											NTooltip,
											{},
											{
												trigger: () =>
													h(
														NPopconfirm,
														{
															showIcon: false,
															onPositiveClick: deleteDatabase,
														},
														{
															activator: () =>
																h(
																	NButton,
																	{
																		type: "error",
																		tertiary: true,
																		round: true,
																		loading: Loading.value.deleteDatabase,
																	},
																	{
																		icon: () => h(NIcon, () => h(IconTrash)),
																	},
																),
															default: () =>
																t("theFollowingActionIsIrreversible"),
														},
													),
												default: () => t("deleteDatabase"),
											},
										),
										h(
											NButton,
											{
												round: true,
												loading: Loading.value.updateDatabase,
												onClick: updateDatabase,
											},
											{
												default: () => t("save"),
												icon: () => h(NIcon, () => h(IconDeviceFloppy)),
											},
										),
									]),
								default: () =>
									h(NSpace, { vertical: true }, () => [
										h(
											NCard,
											{
												title: t("generalSettings"),
												id: "generalSettings",
												hoverable: true,
											},
											() => [
												h(
													NForm,
													{
														ref: databaseRef,
														model: databaseCopy.value,
													},
													() =>
														h(LazyRenderFields, {
															modelValue: databaseCopy.value,
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
											],
										),
										h(
											NCard,
											{
												title: t("translationSettings"),
												id: "translationSettings",
												hoverable: true,
											},
											() => h(NEmpty, { description: t("soon") }),
										),
										h(
											NCard,
											{
												title: t("emailSettings"),
												id: "emailSettings",
												hoverable: true,
											},
											() => h(NEmpty, { description: t("soon") }),
										),
									]),
							},
						),
					),
					!isMobile
						? h(NGi, { span: 2 }, () => [
								h(
									NAnchor,
									{
										affix: true,
										listenTo: "#container",
										top: 88,
										style: "z-index: 1",
										bound: 90,
									},
									() => [
										h(NAnchorLink, {
											title: t("generalSettings"),
											href: "#generalSettings",
										}),
										h(NAnchorLink, {
											title: t("translationSettings"),
											href: "#translationSettings",
										}),
										h(NAnchorLink, {
											title: t("emailSettings"),
											href: "#emailSettings",
										}),
									],
								),
							])
						: null,
				],
			);
	},
});
