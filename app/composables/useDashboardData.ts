import Inison from "inison";
import { flattenSchema } from "inibase/utils";
import renderLabel from "~/composables/renderLabel";

type WidgetDataResult = {
	value: Ref<number | null>;
	data: Ref<Item[]>;
	groups: Ref<{ name: string; value: number }[]>;
	timeSeries: Ref<{ date: string; value: number }[]>;
	loading: Ref<boolean>;
	refresh: () => Promise<void>;
};

export function useDashboardData(
	widget: Widget,
	databaseSlug: string,
	dateRangeOverride?: Ref<WidgetDateRange | undefined>,
): WidgetDataResult {
	const config = useRuntimeConfig();
	const sessionID = useCookie<string | null>("sessionID", { sameSite: true });
	const Language = useCookie<LanguagesType>("language", { sameSite: true });
	const database = useState<Database>("database");

	const value = ref<number | null>(null);
	const data = ref<Item[]>([]);
	const groups = ref<{ name: string; value: number }[]>([]);
	const timeSeries = ref<{ date: string; value: number }[]>([]);
	const loading = ref(false);

	function getDateRangeMs(range?: WidgetDateRange): number | null {
		const day = 86400000;
		switch (range) {
			case "7d":
				return 7 * day;
			case "30d":
				return 30 * day;
			case "90d":
				return 90 * day;
			case "1y":
				return 365 * day;
			default:
				return null;
		}
	}

	function groupByDate(
		items: Item[],
		dateField: string,
		range?: WidgetDateRange,
	) {
		const map = new Map<string, number>();
		for (const item of items) {
			const raw = item[dateField];
			if (!raw) continue;
			const d = new Date(raw as number);
			const rangeMs = getDateRangeMs(range);
			let key: string;
			if (!rangeMs || rangeMs <= 30 * 86400000) {
				key = d.toISOString().slice(0, 10);
			} else if (rangeMs <= 90 * 86400000) {
				const weekStart = new Date(d);
				weekStart.setDate(d.getDate() - d.getDay());
				key = weekStart.toISOString().slice(0, 10);
			} else {
				key = d.toISOString().slice(0, 7);
			}
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return Array.from(map.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, value]) => ({ date, value }));
	}

	function getFieldLabel(item: Item, field: string): string {
		const raw = item[field];
		if (raw == null) return "unknown";
		if (typeof raw === "object") {
			const sourceTable = database.value?.tables?.find(
				(t) => t.slug === widget.table,
			);
			const schema = sourceTable?.schema
				? flattenSchema(sourceTable.schema as any)
				: [];
			const fieldDef = schema.find((f: Field) => f.key === field);
			if (fieldDef?.table) {
				const refTable = database.value?.tables?.find(
					(t) => t.slug === fieldDef.table,
				);
				return renderLabel(refTable, raw as Item) || String(raw);
			}
			return String(raw);
		}
		return String(raw);
	}

	function groupByField(items: Item[], field: string) {
		const map = new Map<string, number>();
		for (const item of items) {
			const val = getFieldLabel(item, field);
			map.set(val, (map.get(val) ?? 0) + 1);
		}
		return Array.from(map.entries())
			.sort(([, a], [, b]) => b - a)
			.map(([name, value]) => ({ name, value }));
	}

	function getColumnsForField(field: string): string[] {
		const sourceTable = database.value?.tables?.find(
			(t) => t.slug === widget.table,
		);
		if (!sourceTable?.columns) return [field];
		// Find dot-path columns that start with this field (e.g. "المساحة.name")
		const nested = sourceTable.columns.filter(
			(col) => col.startsWith(`${field}.`) || col === `${field}.*`,
		);
		// Always include the field itself + any nested sub-columns for label rendering
		return nested.length ? [field, ...nested] : [field];
	}

	async function fetchItems(opts: {
		perPage?: number;
		sort?: Record<string, number>;
		where?: Record<string, any>;
		columns?: string[];
	}): Promise<apiResponse<Item[]>> {
		const slug =
			database.value?.slug === "inicontent" && !databaseSlug
				? ""
				: `${databaseSlug}/`;
		return $fetch<apiResponse<Item[]>>(
			`${config.public.apiBase}${slug}${widget.table}`,
			{
				params: {
					locale: Language.value,
					[`${databaseSlug}_sid`]: sessionID.value,
					options: Inison.stringify({
						perPage: opts.perPage ?? 1000,
						page: 1,
						...(opts.sort ? { sort: opts.sort } : {}),
						...(opts.columns ? { columns: opts.columns   } : {}),
					}),
					...(opts.where ? { where: Inison.stringify(opts.where) } : {}),
				},
				credentials: "include",
			},
		);
	}

	async function refresh() {
		loading.value = true;
		try {
			const activeDateRange = dateRangeOverride?.value ?? widget.dateRange;
			const rangeMs = getDateRangeMs(activeDateRange);
			const dateField = widget.dateField ?? "createdAt";
			const whereDate =
				rangeMs ? { [dateField]: `>${Date.now() - rangeMs}` } : undefined;

			switch (widget.type) {
				case "counter": {
					if (
						widget.operation === "count" ||
						!widget.operation ||
						!widget.field
					) {
						const res = await fetchItems({
							perPage: 1,
                            columns: ["id"],
							where: whereDate,
						});
						value.value = res.options?.total ?? 0;
					} else {
						const res = await fetchItems({
							perPage: 1000,
							columns: [widget.field],
							where: whereDate,
						});
						const items = res.result ?? [];
						const nums = items
							.map((i) => Number(i[widget.field!]))
							.filter((n) => !Number.isNaN(n));
						if (widget.operation === "sum")
							value.value = nums.reduce((a, b) => a + b, 0);
						else if (widget.operation === "max")
							value.value = nums.length ? Math.max(...nums) : 0;
						else if (widget.operation === "min")
							value.value = nums.length ? Math.min(...nums) : 0;
					}
					break;
				}
				case "line": {
					const res = await fetchItems({
						perPage: 1000,
						columns: [dateField],
						sort: { [dateField]: 1 },
						where: whereDate,
					});
					data.value = res.result ?? [];
					timeSeries.value = groupByDate(
						data.value,
						dateField,
						activeDateRange,
					);
					break;
				}
				case "bar":
				case "pie": {
					const field = widget.groupBy ?? widget.field;
					if (!field) break;
					const res = await fetchItems({
						perPage: 1000,
						columns: getColumnsForField(field),
						where: whereDate,
					});
					data.value = res.result ?? [];
					groups.value = groupByField(data.value, field);
					break;
				}
				case "recent": {
					const res = await fetchItems({
						perPage: widget.limit ?? 10,
						sort: { createdAt: -1 },
						where: whereDate,
					});
					data.value = res.result ?? [];
					break;
				}
			}
		} catch (e) {
			console.error(`[Dashboard] Widget "${widget.title}" fetch error:`, e);
		} finally {
			loading.value = false;
		}
	}

	if (dateRangeOverride) {
		watch(dateRangeOverride, () => refresh());
	}

	return { value, data, groups, timeSeries, loading, refresh };
}
