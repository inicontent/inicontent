import { flattenSchema } from "inibase/utils";
import { isVideoMediaValue } from "./useForm";

/** One gallery entry — a plain URL plus whether it renders as a video. */
export type ProductMedia = {
	url: string;
	video: boolean;
};

export type ProductView = {
	gallery?: ProductMedia[];
	image?: ProductMedia;
	title?: string;
	tagline?: string;
	price?: number;
	oldPrice?: number;
	description?: string;
	rating?: number;
	reviews?: number;
	badge?: string;
	/** true when values come from the block's demo config (no live item bound). */
	isDemo: boolean;
};

/**
 * Resolver backing the single-product page block.
 *
 * A single-product page is a dynamic ("template") page whose slug matches one
 * item of a data table (the "Template" block binding). That item lives in the
 * shared `templateItem` state while the page renders. The block maps product
 * columns by their Inison field ids and resolves them against that item; when
 * no item is bound (e.g. Builder previews) it falls back to the `demo` config.
 */
export function useProduct(modelValue: Ref<Product>) {
	const database = useState<Database>("database");
	const templateItem = useState<Item | null>("templateItem", () => null);

	const productId = computed(() => templateItem.value?.id);

	// Rating & review count may be aggregated from a linked table (e.g. a
	// reviews table) instead of a single mapped column.
	const ratingSource = computed(() => modelValue.value?.ratingSource);
	const reviewsSource = computed(() => modelValue.value?.reviewsSource);
	const ratingAggregation = useAggregation(ratingSource, productId);
	const reviewsAggregation = useAggregation(reviewsSource, productId);

	const selectedTable = computed(() =>
		database.value?.tables?.find(
			(table) => table.slug === modelValue.value?.table,
		),
	);

	const flatSchema = computed(() =>
		selectedTable.value?.schema
			? flattenSchema(selectedTable.value.schema)
			: [],
	);

	/** Resolve the value of a mapped column (by field id) on the item. */
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

	function resolveImages(value: unknown): ProductMedia[] {
		if (!value) return [];
		const list = Array.isArray(value)
			? value.flatMap((v) => (Array.isArray(v) ? v : [v]))
			: [value];
		return list
			.map((leaf) => {
				const url = resolveUrl(leaf);
				if (!url) return undefined;
				return { url, video: isVideoMediaValue(leaf) };
			})
			.filter((m): m is ProductMedia => Boolean(m));
	}

	function resolveUrl(value: unknown): string | undefined {
		if (typeof value === "string") return value;
		if (value && typeof value === "object") {
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

	function resolveNumber(value: unknown): number | undefined {
		if (value === undefined || value === null) return undefined;
		if (typeof value === "number") return value;
		if (Array.isArray(value)) return resolveNumber(value[0]);
		if (typeof value === "object") {
			const obj = value as Record<string, unknown>;
			return resolveNumber(obj.value);
		}
		const parsed = parseFloat(String(value));
		return Number.isFinite(parsed) ? parsed : undefined;
	}

	/** Prefer mapped live-item values, falling back to the demo product. */
	const product = computed<ProductView>(() => {
		const demo = modelValue.value?.demo;
		const item = templateItem.value;

		const mapped = item
			? {
					gallery: resolveImages(
						resolveField(item, modelValue.value?.galleryField),
					),
					title: resolveText(resolveField(item, modelValue.value?.titleField)),
					tagline: resolveText(
						resolveField(item, modelValue.value?.taglineField),
					),
					price: resolveNumber(
						resolveField(item, modelValue.value?.priceField),
					),
					oldPrice: resolveNumber(
						resolveField(item, modelValue.value?.oldPriceField),
					),
					description: resolveText(
						resolveField(item, modelValue.value?.descriptionField),
					),
					rating: resolveNumber(
						resolveField(item, modelValue.value?.ratingField),
					),
					reviews: resolveNumber(
						resolveField(item, modelValue.value?.reviewsField),
					),
					badge: resolveText(resolveField(item, modelValue.value?.badgeField)),
				}
			: {};

		const gallery = mapped.gallery?.length
			? mapped.gallery
			: resolveImages(demo?.gallery);

		// An aggregation that is configured but not ready yet (loading or no
		// item bound) must not fall back to the marketing demo values.
		const rating = ratingAggregation.enabled.value
			? ratingAggregation.value.value
			: (mapped.rating ?? demo?.rating);
		const reviews = reviewsAggregation.enabled.value
			? reviewsAggregation.value.value
			: (mapped.reviews ?? demo?.reviews);

		return {
			gallery,
			image: gallery[0],
			title: mapped.title ?? demo?.title,
			tagline: mapped.tagline ?? demo?.tagline,
			price: mapped.price ?? demo?.price,
			oldPrice: mapped.oldPrice ?? demo?.oldPrice,
			description: mapped.description ?? demo?.description,
			rating,
			reviews,
			badge: mapped.badge ?? demo?.badge,
			isDemo: !item,
		};
	});

	return {
		product,
		selectedTable,
		templateItem,
		ratingAggregation,
		reviewsAggregation,
	};
}
