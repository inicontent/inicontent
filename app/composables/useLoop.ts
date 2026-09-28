import { flattenSchema } from "inibase/utils";
import Inison from "inison";
import { resolveTemplatePageHref } from "./itemBindings";
import { isVideoMediaValue } from "./useForm";

export type LoopCard = {
	id?: string;
	image?: string;
	imageIsVideo?: boolean;
	title?: string;
	subtitle?: string;
	/** small badge line, e.g. category or type */
	tag?: string;
	/** secondary meta line, e.g. price or "client · year" */
	meta?: string;
	description?: string;
	link?: string;
	/** Extra header line rendered above the tag/title (resolved from cardHeaderTemplate). */
	cardHeader?: string;
};

type LoopWithRepeatItems = Loop & { repeatItems?: unknown[] };

// Small module-level dedupe: the Builder renders several mini-previews of the
// same block (one per design) plus the live preview, all fetching the same
// table. Cache by (database, table, limit) to avoid hammering the API.
const loopsCache = new Map<string, Item[]>();

export function useLoop(modelValue: Ref<Loop>) {
	const database = useState<Database>("database");
	const runtimeConfig = useRuntimeConfig();
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	const isManual = computed(() => modelValue.value.dataSourceMode === "manual");
	const tableSlug = computed(() =>
		isManual.value ? undefined : modelValue.value.table,
	);
	const limit = computed(() => modelValue.value.limit ?? 6);
	const repeatItems = computed(() => {
		const items = (modelValue.value as LoopWithRepeatItems).repeatItems;
		return Array.isArray(items) ? items : [];
	});
	const hasRepeatItems = computed(() => repeatItems.value.length > 0);

	const selectedTable = computed(() =>
		database.value.tables?.find((t) => t.slug === tableSlug.value),
	);

	const flatSchema = computed(() =>
		selectedTable.value?.schema
			? flattenSchema(selectedTable.value.schema)
			: [],
	);

	const cacheKey = computed(
		() => `${database.value.slug}:${tableSlug.value}:${limit.value}`,
	);

	const items = ref<Item[]>([]);
	const loading = ref(false);

	async function fetchItems() {
		if (hasRepeatItems.value) {
			items.value = [];
			return;
		}
		if (!tableSlug.value) {
			items.value = [];
			return;
		}
		const cached = loopsCache.get(cacheKey.value);
		if (cached) {
			items.value = cached;
			return;
		}
		loading.value = true;
		try {
			const request = await $fetch<apiResponse<Item[]>>(
				`${runtimeConfig.public.apiBase}${database.value.slug}/${tableSlug.value}`,
				{
					params: {
						options: Inison.stringify({
							page: 1,
							perPage: limit.value,
							columns: ["*"],
						}),
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			);
			items.value = request.result ?? [];
			loopsCache.set(cacheKey.value, items.value);
		} finally {
			loading.value = false;
		}
	}

	watch([tableSlug, limit, hasRepeatItems], fetchItems, { immediate: true });

	/** Resolve the value of a mapped column (by field id) on a raw item. */
	function resolveField(item: Item, fieldId?: string | number): unknown {
		if (!fieldId || !item || typeof item !== "object") return undefined;
		const path = getPath(flatSchema.value, fieldId);
		if (!path) return undefined;
		return path.split(".").reduce<unknown>((value, key) => {
			if (value === null || value === undefined || typeof value !== "object")
				return undefined;
			return (value as Record<string, unknown>)[key];
		}, item);
	}

	function resolveImage(value: unknown): string | undefined {
		if (!value) return undefined;
		if (typeof value === "string") return value;
		if (Array.isArray(value)) return resolveImage(value[0]);
		if (typeof value === "object") {
			const obj = value as Record<string, unknown>;
			if (typeof obj.publicURL === "string") return obj.publicURL;
			if (typeof obj.url === "string") return obj.url;
		}
		return undefined;
	}

	function resolveText(value: unknown): string | undefined {
		if (value === undefined || value === null) return undefined;
		if (typeof value === "string" || typeof value === "number")
			return String(value);
		if (Array.isArray(value)) {
			const parts = value.map(resolveText).filter(Boolean) as string[];
			return parts.length ? parts.join(" · ") : undefined;
		}
		return undefined;
	}

	function firstValue(...values: unknown[]): unknown {
		return values.find(
			(value) =>
				value !== undefined &&
				value !== null &&
				!(typeof value === "string" && value.trim() === ""),
		);
	}

	/** Resolve a dot-separated path on a plain object. */
	function resolveByPath(obj: unknown, path: string): unknown {
		if (!obj || typeof obj !== "object" || !path) return undefined;
		return path.split(".").reduce<unknown>((value, key) => {
			if (value === null || value === undefined || typeof value !== "object")
				return undefined;
			return (value as Record<string, unknown>)[key];
		}, obj);
	}

	/**
	 * Resolve `{{columnName}}` placeholders in a template string against an
	 * item's columns. Nested paths (e.g. `{{author.name}}`) are supported.
	 */
	function resolveCardHeaderTemplate(
		template: string,
		item: Record<string, unknown>,
	): string {
		return template.replace(
			/\{\{\s*([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\s*\}\}/g,
			(_match: string, path: string) => {
				const val = resolveByPath(item, path);
				if (val === null || val === undefined) return _match;
				return String(val);
			},
		);
	}

	function toRepeatCard(value: unknown, index: number): LoopCard {
		if (!value || typeof value !== "object" || Array.isArray(value)) {
			return {
				id: String(index),
				title: resolveText(value),
			};
		}

		const row = value as Record<string, unknown>;
		const rawImage = firstValue(
			row.image,
			row.imageField,
			row.galleryField,
			row.logo,
			row.avatar,
		);
		return {
			id: resolveText(firstValue(row.id, row.key)) ?? String(index),
			image: resolveImage(rawImage),
			imageIsVideo: isVideoMediaValue(rawImage),
			cardHeader: resolveCardHeaderTemplate(
				modelValue.value?.cardHeaderTemplate ?? "",
				row,
			),
			title: resolveText(
				firstValue(row.title, row.titleField, row.heading, row.name, row.label),
			),
			subtitle: resolveText(
				firstValue(row.subtitle, row.subtitleField, row.price, row.value),
			),
			tag: resolveText(
				firstValue(row.tag, row.tagsField, row.category, row.type),
			),
			meta: resolveText(firstValue(row.meta, row.metaField)),
			description: resolveText(
				firstValue(row.description, row.descriptionField, row.text),
			),
			link: resolveText(firstValue(row.link, row.linkField, row.url, row.href)),
		};
	}

	function toCard(item: Item): LoopCard {
		const rawImage = resolveField(item, modelValue.value.imageField);
		return {
			id: String(item.id ?? ""),
			image: resolveImage(rawImage),
			imageIsVideo: isVideoMediaValue(rawImage),
			cardHeader: resolveCardHeaderTemplate(
				modelValue.value?.cardHeaderTemplate ?? "",
				item as Record<string, unknown>,
			),
			title: resolveText(resolveField(item, modelValue.value.titleField)),
			subtitle: resolveText(resolveField(item, modelValue.value.subtitleField)),
			tag: resolveText(resolveField(item, modelValue.value.tagsField)),
			meta: resolveText(resolveField(item, modelValue.value.metaField)),
			description: resolveText(
				resolveField(item, modelValue.value.descriptionField),
			),
			link: cardLink(item),
		};
	}

	// Page map shared with the whole app — page links are stored by ID and
	// resolved to the current locale's slug here and at render time.
	const { pagesMap } = usePageLinks();
	const route = useRoute();
	const routeDatabasePrefix = computed(() => {
		const value = route.params.database;
		const slug = Array.isArray(value) ? value[0] : value;
		return typeof slug === "string" && slug
			? `/${slug.replace(/^\/+|\/+$/g, "")}`
			: "";
	});

	/**
	 * Card button URL. When the block has a `link` to a page template
	 * (a page whose slug has `[segment]` slots), the URL is built per item —
	 * each segment is filled from the item (matching column → slug → id).
	 * Otherwise the item's `linkField` value is used, or a demo link.
	 */
	function cardLink(item: Item): string | undefined {
		const link = modelValue.value?.link;
		if (link && typeof link !== "string" && link.type === "page") {
			const pageSlug = pagesMap.value.get(String(link.id))?.slug;
			if (pageSlug) {
				return resolveTemplatePageHref(
					String(pageSlug),
					item as Item & Record<string, unknown>,
					modelValue.value?.linkSegments,
					routeDatabasePrefix.value,
				);
			}
		}
		return resolveText(resolveField(item, modelValue.value.linkField));
	}

	function toDemoCard(entry: Loop["demo"][number]): LoopCard {
		const row = (entry ?? {}) as Record<string, unknown>;
		return {
			id: resolveText(entry?.id),
			image: resolveImage(entry?.image),
			imageIsVideo: isVideoMediaValue(entry?.image),
			cardHeader: resolveCardHeaderTemplate(
				modelValue.value?.cardHeaderTemplate ?? "",
				row,
			),
			title: resolveText(entry?.title),
			subtitle: resolveText(entry?.subtitle),
			tag: resolveText(entry?.tag),
			meta: resolveText(entry?.meta),
			description: resolveText(entry?.description),
			link: resolveText(entry?.link),
		};
	}

	const cards = computed<LoopCard[]>(() => {
		if (hasRepeatItems.value) return repeatItems.value.map(toRepeatCard);
		if (!tableSlug.value) return (modelValue.value.demo ?? []).map(toDemoCard);
		return (items.value ?? []).map(toCard);
	});

	/** Unique non-empty tag values across all cards — powers the tag filter bar. */
	const tags = computed<string[]>(() =>
		[
			...new Set(
				cards.value
					.map((card) => card.tag?.trim())
					.filter((tag): tag is string => !!tag),
			),
		].sort((a, b) => a.localeCompare(b)),
	);

	return {
		tableSlug,
		limit,
		selectedTable,
		flatSchema,
		items,
		loading,
		cards,
		tags,
		toCard,
	};
}
