import {
	NCard,
	NIcon,
	NButton,
	NSpace,
	NEllipsis,
	NPopover,
	useMessage,
} from "naive-ui";
import { IconPrinter, IconPencil, IconSettings } from "@tabler/icons-vue";
import { LazyRenderDatas } from "#components";
export default defineNuxtComponent({
	async setup() {
		definePageMeta({
			middleware: ["dashboard", "table"],
			layout: "table",
		});

		useLanguage({
			ar: {
				print: "طباعة",
				edit: "تعديل",
			},
			en: {
				print: "Print",
				edit: "Edit",
			},
		});

		const route = useRoute(),
			database = useState<Database>("database"),
			table = database.value.tables?.find(
				({ slug }) => slug === route.params.table,
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
										`/${route.params.database}/admin/tables/${route.params.table}`,
									),
								1000,
							);
						}
						return res.result;
					},
				},
			),
			label = renderLabel(table?.label, table?.schema, single.value);
		useHead({
			title: `${t(database.value.slug)} | ${t(
				route.params.table as string,
			)} ${t("table")} : ${label}`,
			link: [{ rel: "icon", href: database.value.icon ?? "" }],
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
						h(NSpace, {}, () => [
							h(
								NPopover,
								{},
								{
									trigger: () =>
										h(
											NButton,
											{
												disabled: true,
												circle: true,
												secondary: true,
											},
											{
												icon: () => h(NIcon, () => h(IconSettings)),
											},
										),
									default: () => t("settings"),
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
												tag: "a",
												href: `/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}/edit`,
												onClick: (e) => {
													e.preventDefault();
													navigateTo(
														`/${route.params.database}/admin/tables/${route.params.table}/${route.params.id}/edit`,
													);
												},
												circle: true,
												secondary: true,
												type: "info",
											},
											{
												icon: () => h(NIcon, () => h(IconPencil)),
											},
										),
									default: () => t("edit"),
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
												circle: true,
												secondary: true,
												type: "primary",
												onClick: () => window.print(),
											},
											{
												icon: () => h(NIcon, () => h(IconPrinter)),
											},
										),
									default: () => t("print"),
								},
							),
						]),
					action: () =>
						h(NSpace, { justify: "end" }, () => [
							h(
								NButton,
								{
									round: true,
									secondary: true,
									type: "primary",
									onClick: () => window.print(),
								},
								{
									icon: () => h(NIcon, () => h(IconPrinter)),
									default: () => t("print"),
								},
							),
						]),
					default: () =>
						h(LazyRenderDatas, {
							modelValue: single.value as Item,
							schema: table?.schema,
						}),
				},
			);
	},
});
