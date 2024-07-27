import { IconSend } from "@tabler/icons-vue";
import {
	type FormInst,
	NButton,
	NCard,
	NEllipsis,
	NForm,
	NIcon,
	NPopover,
	NSpace,
	useMessage,
} from "naive-ui";
import { LazyRenderField } from "#components";

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
				CREATE();
			};
		});

		useLanguage({
			ar: {
				new: "جديد",
				publish: "نشر",
			},
			en: {
				new: "New",
				publish: "Publish",
			},
		});

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.CREATE = false;

		const route = useRoute(),
			database = useState<Database>("database"),
			schema = database.value.tables
				?.find(({ slug }) => slug === route.params.table)
				?.schema?.filter(
					(field) =>
						!["id", "createdAt", "createdBy", "updatedAt"].includes(field.key),
				),
			message = useMessage(),
			single = ref({}),
			formRef = ref<FormInst | null>(null),
			CREATE = async () => {
				formRef.value?.validate(async (errors) => {
					if (!errors) {
						const bodyContent = JSON.parse(JSON.stringify(single.value));
						Loading.value.CREATE = true;
						const data = await $fetch<apiResponse>(
							`${useRuntimeConfig().public.apiBase}${route.params.database}/${
								route.params.table
							}`,
							{
								method: "POST",
								body: bodyContent,
							},
						);
						Loading.value.CREATE = false;

						if (!data.result || !data.result.id)
							return message.error(data.message);

						message.success(data.message);
						return navigateTo(
							`/${route.params.database}/admin/tables/${route.params.table}/${data.result.id}/edit`,
						);
					}
					message.error("The inputs are Invalid");
				});
			};

		useHead({
			title: `${database.value.slug} | ${t("new")} ${t(
				database.value.tables?.find(({ slug }) => slug === route.params.table)
					?.slug ?? "--",
			)}`,
			link: [{ rel: "icon", href: database.value?.icon ?? "" }],
		});
		return () =>
			h(
				NCard,
				{
					title: `${t("new")} ${t(
						database.value.tables?.find(
							({ slug }) => slug === route.params.table,
						)?.slug ?? "--",
					)}`,
					style: "height: fit-content",
				},
				{
					header: () =>
						h(
							NEllipsis,
							() =>
								`${t("new")} ${t(
									database.value.tables?.find(
										({ slug }) => slug === route.params.table,
									)?.slug ?? "--",
								)}`,
						),
					"header-extra": () =>
						schema && schema.length > 4
							? h(NSpace, {}, () => [
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
														onClick: CREATE,
														loading: Loading.value.CREATE,
													},
													{
														icon: () => h(NIcon, () => h(IconSend)),
													},
												),
											default: () => t("publish"),
										},
									),
								])
							: null,
					action: () =>
						h(NSpace, { justify: "end" }, () => [
							h(
								NButton,
								{
									round: true,
									secondary: true,
									type: "primary",
									onClick: CREATE,
									loading: Loading.value.CREATE,
								},
								{
									icon: () => h(NIcon, () => h(IconSend)),
									default: () => t("publish"),
								},
							),
						]),
					default: () =>
						h(
							NForm,
							{
								model: single.value,
								ref: formRef,
							},
							() =>
								h(LazyRenderField, {
									modelValue: single.value,
									schema: schema,
								}),
						),
				},
			);
	},
});
