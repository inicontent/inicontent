import { flattenSchema } from "inibase/utils";
import Inison from "inison";

/**
 * Reusable data-source for a metric (rating, review count, …) computed from a
 * linked table's rows instead of a single column. The editor picks a table,
 * the column that links each row to the current item, an optional value
 * column, and the math to apply (avg / sum / count / min / max).
 *
 * `AggregateSource` is shared globally via `types/index.d.ts`.
 */

type AggregationResult = {
	/** resulting number (avg/sum/count/min/max), undefined while loading or when unavailable */
	value: Ref<number | undefined>;
	/** number of rows included in the aggregation */
	count: Ref<number>;
	loading: Ref<boolean>;
	/** set when an aggregate source is configured (used to skip demo fallback) */
	enabled: Ref<boolean>;
};

/** Module-level dedupe: the Builder renders several mini-previews of the same
 * block plus the live render, all fetching the same table + filter. */
const aggregationCache = new Map<string, Item[]>();

export function useAggregation(
	source: Ref<AggregateSource | undefined>,
	productId: Ref<string | number | undefined>,
): AggregationResult {
	const database = useState<Database>("database");
	const runtimeConfig = useRuntimeConfig();
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	const tableSlug = computed(() => source.value?.table);

	const selectedTable = computed(() =>
		database.value?.tables?.find((table) => table.slug === tableSlug.value),
	);

	const flatSchema = computed(() =>
		selectedTable.value?.schema
			? flattenSchema(selectedTable.value.schema)
			: [],
	);

	const productColumnKey = computed(() => {
		const id = source.value?.productColumn;
		return id === undefined || id === null
			? undefined
			: getPath(flatSchema.value, id);
	});

	const valueColumnKey = computed(() => {
		const id = source.value?.valueColumn;
		return id === undefined || id === null
			? undefined
			: getPath(flatSchema.value, id);
	});

	/** Rows are fetched only on a live item page (a product id must be known to
	 * filter by). A table without a product column aggregates over all rows. */
	const enabled = computed(
		() =>
			!!tableSlug.value &&
			(productColumnKey.value ? productId.value !== undefined : true),
	);

	const rows = ref<Item[]>([]);
	const loading = ref(false);

	async function fetchRows() {
		if (!enabled.value || !tableSlug.value) {
			rows.value = [];
			return;
		}
		const key = `${database.value?.slug}:${tableSlug.value}:${productColumnKey.value ?? "*"}:${productId.value ?? "*"}`;
		const cached = aggregationCache.get(key);
		if (cached) {
			rows.value = cached;
			return;
		}
		loading.value = true;
		try {
			const params: Record<string, unknown> = {
				options: Inison.stringify({ columns: ["*"] }),
				[`${database.value?.slug}_sid`]: sessionID.value,
			};
			if (productColumnKey.value && productId.value !== undefined)
				params.where = Inison.stringify({
					[productColumnKey.value]: productId.value,
				});
			const request = await $fetch<apiResponse<Item[]>>(
				`${runtimeConfig.public.apiBase}${database.value?.slug}/${tableSlug.value}`,
				{ params, credentials: "include" },
			);
			rows.value = request.result ?? [];
			aggregationCache.set(key, rows.value);
		} finally {
			loading.value = false;
		}
	}

	// Refetch when the table, the link column or the current product change
	// (the value column only changes the math, not the fetched rows).
	watch([tableSlug, productColumnKey, productId], fetchRows, {
		immediate: true,
	});

	function rowValue(row: Item): number | undefined {
		if (!valueColumnKey.value) return undefined;
		const raw = valueColumnKey.value
			.split(".")
			.reduce<unknown>(
				(value, key) =>
					value && typeof value === "object"
						? (value as Record<string, unknown>)[key]
						: undefined,
				row,
			);
		if (typeof raw === "number") return raw;
		if (typeof raw === "string") {
			const parsed = parseFloat(raw);
			return Number.isFinite(parsed) ? parsed : undefined;
		}
		return undefined;
	}

	const value = ref<number | undefined>(undefined);
	const count = ref(0);

	const recompute = () => {
		if (loading.value || !enabled.value || !rows.value.length) {
			value.value = undefined;
			count.value = rows.value.length;
			return;
		}
		count.value = rows.value.length;
		const aggregation = source.value?.aggregation ?? "avg";
		if (aggregation === "count") {
			value.value = rows.value.length;
			return;
		}
		const values = rows.value
			.map(rowValue)
			.filter((v): v is number => v !== undefined);
		if (!values.length) {
			value.value = undefined;
			return;
		}
		switch (aggregation) {
			case "sum":
				value.value = values.reduce((a, b) => a + b, 0);
				break;
			case "avg":
				value.value = values.reduce((a, b) => a + b, 0) / values.length;
				break;
			case "min":
				value.value = Math.min(...values);
				break;
			case "max":
				value.value = Math.max(...values);
				break;
			default:
				value.value = undefined;
		}
	};

	// Recompute when rows or the aggregation settings change.
	watch(
		[loading, rows, () => source.value?.aggregation, valueColumnKey],
		recompute,
		{ immediate: true },
	);

	return { value, count, loading, enabled };
}
