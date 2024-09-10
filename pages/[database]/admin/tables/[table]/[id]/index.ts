import { IconPencil, IconPrinter, IconSettings } from "@tabler/icons-vue";
import { NButton, NCard, NEllipsis, NIcon, NPopover, NSpace } from "naive-ui";
import { LazyRenderDatas } from "#components";
export default defineNuxtComponent({
	async setup() {
		clearNuxtState("itemLabel");

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
			table = useState<Table>("table"),
			{ data: single } = await useFetch<apiResponse<Item>["result"]>(
				`${useRuntimeConfig().public.apiBase}${database.value.slug}/${
					table.value.slug
				}/${route.params.id}`,
				{
					transform: (res) => res.result,
				},
			);
		if (!single.value || !single.value.id)
			throw createError({
				statusCode: 404,
				statusMessage: "Page Not Found",
				fatal: true,
			});

		const itemLabel = useState("itemLabel", () =>
			renderLabel(table.value.label, table.value.schema, single.value),
		);

		useHead({
			title: `${t(database.value.slug)} | ${t(
				table.value.slug,
			)} > ${itemLabel.value}`,
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
						h(NEllipsis, () => `${t(table.value.slug)} : ${itemLabel.value}`),
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
												href: `/${database.value.slug}/admin/tables/${table.value.slug}/${route.params.id}/edit`,
												onClick: (e) => {
													e.preventDefault();
													navigateTo(
														`/${database.value.slug}/admin/tables/${table.value.slug}/${route.params.id}/edit`,
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
							schema: table.value.schema,
						}),
				},
			);
	},
});
