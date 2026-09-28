import { flattenSchema } from "inibase/utils";
import Inison from "inison";

/**
 * Dynamic-page ("template") helpers.
 *
 * A page whose slug contains `[segment]` slots (e.g. `articles/[articleSlug]`)
 * is a template: it renders ONE item of the bound data table. The binding is
 * stored inside the page's content as a pseudo-block named `"Template"` whose
 * `config` is a `PageTemplate` (`{ table, segments }`) — invisible to the
 * builder UI and stripped before rendering.
 */

/**
 * Slots found in a template slug (e.g. `articles/[category]/[slug]` →
 * `["category", "slug"]`).
 */
export function getTemplateSegments(slug: string | null | undefined): string[] {
	if (typeof slug !== "string") return [];
	const matches = String(slug).match(/\[([^\]]+)\]/g) ?? [];
	return [...new Set(matches.map((token) => token.slice(1, -1)))];
}

/**
 * Field types safe to surface as a URL segment lookup key. A dynamic page maps
 * each `[segment]` in its slug to one of these columns and filters the bound
 * table by that column when rendering (e.g. `articles/[slug]` → `slug`).
 * `number`/`date` values are numeric; everything else compares as a plain
 * string. Object/array/table/password/html/json columns are excluded — they
 * cannot identify a row from a single URL segment.
 */
export const templateSegmentFieldTypes = new Set<DB_FieldType>([
	"string",
	"number",
	"email",
	"url",
	"ip",
	"id",
	"date",
]);

/**
 * True when a column can be used as a URL segment lookup key. Multi-type
 * columns (e.g. `["string", "number"]`) are allowed only when every possible
 * type is URL-safe.
 */
export function isTemplateSegmentField(field?: Field | null): boolean {
	if (!field) return false;
	const types = Array.isArray(field.type) ? field.type : [field.type];
	return (
		types.length > 0 &&
		types.every((type) => templateSegmentFieldTypes.has(type as DB_FieldType))
	);
}

/**
 * Decode a URL segment captured from the route back to its stored value.
 * Router params may arrive percent-encoded (e.g. an email `a%40b.com`), but
 * the API stores the decoded value. Safe no-op for values without escape
 * sequences; invalid escapes are returned verbatim.
 */
export function decodeSegmentValue(value: string): string {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

/**
 * Cast a URL-captured segment value to the mapped column's type so the API
 * `where` filter compares like-for-like (e.g. `[id]` on a `number` column
 * queries `42` instead of `"42"`).
 */
export function castSegmentValue(
	field: Field | undefined | null,
	value: string,
): string | number | undefined {
	if (value === "" || value === undefined || value === null) return undefined;
	if (Array.isArray(field?.type)) return value;
	if (field?.type === "number") {
		const numeric = Number(value);
		return Number.isNaN(numeric) ? undefined : numeric;
	}
	// `id` columns compare against the decoded id in the API, matching the
	// route's plain id — keep the raw string like the current behaviour.
	return value;
}

/**
 * A problem found while validating a dynamic page definition. `code` is a
 * translation key suffix under `templateSegments`; `level` decides whether the
 * page can be saved (`error` blocks publishing).
 */
export type TemplateSegmentIssue = {
	segment?: string;
	level: "error" | "warning";
	code:
		| "tableRequired"
		| "uselessBinding"
		| "columnNotFound"
		| "columnTypeUnsupported"
		| "columnNotUnique";
	column?: string;
	type?: string;
};

/**
 * Validate a dynamic page before it is created: every `[segment]` in the slug
 * must resolve to an existing, URL-safe column of the bound table. Warnings are
 * returned for columns that are not `unique`, and for binding a table without
 * any `[segment]` (such a page renders nothing).
 */
export function validatePageTemplate(
	slug: string | null | undefined,
	template: PageTemplate | undefined,
	tables?: Table[],
): TemplateSegmentIssue[] {
	const issues: TemplateSegmentIssue[] = [];
	const segments = getTemplateSegments(slug);

	if (!template?.table) {
		if (segments.length) issues.push({ level: "error", code: "tableRequired" });
		return issues;
	}
	if (!segments.length) {
		issues.push({ level: "warning", code: "uselessBinding" });
		return issues;
	}

	const columns = flattenSchema(
		tables?.find((table) => table.slug === template.table)?.schema ?? [],
	);
	for (const segment of segments) {
		const column = template.segments?.[segment] ?? segment;
		const field = columns.find((entry) => entry.key === column);
		if (!field) {
			issues.push({
				segment,
				level: "error",
				code: "columnNotFound",
				column,
			});
			continue;
		}
		if (!isTemplateSegmentField(field)) {
			issues.push({
				segment,
				level: "error",
				code: "columnTypeUnsupported",
				column,
				type: Array.isArray(field.type)
					? field.type[0]
					: (field.type as string),
			});
			continue;
		}
		if (!field.unique)
			issues.push({
				segment,
				level: "warning",
				code: "columnNotUnique",
				column,
			});
	}
	return issues;
}

export function getPageTemplate(
	page?: { content?: Content[] } | null,
): PageTemplate | undefined {
	const entry = page?.content?.find((block) => block.name === "Template");
	return entry?.config as PageTemplate | undefined;
}

/** Content list without the invisible `Template` pseudo-block. */
export function filterPageContent<T extends { name?: string }>(
	content?: T[] | null,
): T[] | undefined {
	if (!content) return undefined;
	return content.filter((block) => block.name !== "Template");
}

/**
 * True when a value contains `[`/`]` — i.e. it is a dynamic `[segment]`
 * placeholder (e.g. `users/[id]`) and never a real stored slug.
 *
 * Inison (the API's `where` serialization format) treats brackets as array
 * delimiters, so a bracketed slug must never be sent inside a `where` value —
 * the API errors with `Expected ":" after key`.
 */
export function isTemplatePattern(value: unknown): boolean {
	return (
		typeof value === "string" && (value.includes("[") || value.includes("]"))
	);
}

/**
 * Match a URL path against a template slug like `articles/[articleSlug]`.
 * Returns the captured segment values, or `null` when it doesn't match.
 */
export function matchTemplateSlug(
	templateSlug: string,
	urlSegments: string[],
): Record<string, string> | null {
	const parts = String(templateSlug).split("/").filter(Boolean);
	if (parts.length !== urlSegments.length) return null;
	const capture: Record<string, string> = {};
	for (let index = 0; index < parts.length; index++) {
		const part = parts[index];
		if (part.startsWith("[") && part.endsWith("]"))
			capture[part.slice(1, -1)] = urlSegments[index];
		else if (part !== urlSegments[index]) return null;
	}
	return capture;
}

/**
 * Resolve a dynamic slug segment to the value it should take on an item:
 * a column with the same name as the segment, then the `slug` column, then
 * the row `id`. Used to build per-item links to template pages.
 */
export function resolveSegmentValue(
	item: Item | Record<string, unknown> | undefined | null,
	segment: string,
	overrideColumn?: string | number,
): unknown {
	if (!item || typeof item !== "object") return undefined;
	const obj = item as Record<string, unknown>;
	if (overrideColumn !== undefined) return obj[overrideColumn];
	if (Object.hasOwn(obj, segment)) return obj[segment];
	if (Object.hasOwn(obj, "slug")) return obj["slug"];
	return obj["id"];
}

/**
 * Resolve `{{item.<column>}}` bindings in a string (e.g. a template page's SEO
 * title like `{{item.username}} Page`) against the row item the page renders.
 * Unknown columns resolve to an empty string; without an item the template is
 * returned verbatim.
 */
export function resolveItemTemplate(
	template: string | undefined | null,
	item?: Item | Record<string, unknown> | null,
): string | undefined {
	if (typeof template !== "string" || !template) return template ?? undefined;
	if (!item || typeof item !== "object") return template;
	const obj = item as Record<string, unknown>;
	return template.replace(
		/\{\{item\.([^}]+)\}\}/g,
		(_match, column: string) => {
			const key = column.trim();
			const value = Object.hasOwn(obj, key) ? obj[key] : undefined;
			return value === undefined || value === null ? "" : String(value);
		},
	);
}

export function usePageTemplate() {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	/** Scan the current site's pages for one whose dynamic slug matches the URL. */
	async function findTemplatePage(
		urlSegments: string[],
	): Promise<{ page: Page; capture: Record<string, string> } | null> {
		if (!database.value?.slug) return null;
		const res = await $fetch<apiResponse<Page[]>>(
			`${config.public.apiBase}${database.value.slug}/pages`,
			{
				params: {
					options: Inison.stringify({
						perPage: 1000,
						columns: ["*"],
					}),
					locale: Language.value ?? "en",
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		for (const page of res.result ?? []) {
			if (!getPageTemplate(page)?.table) continue;
			const capture = matchTemplateSlug(String(page.slug ?? ""), urlSegments);
			if (capture) return { page, capture };
		}
		return null;
	}

	/**
	 * Fetch the item a dynamic page renders for the captured URL segments.
	 * Each `[segment]` is matched against the column mapped to it (`segments`),
	 * then the segment's own name, then `slug`, then the row `id` — with the
	 * URL value cast to the column type so numeric columns compare as numbers.
	 * All resolved segments are combined with AND for a precise lookup.
	 */
	async function findTemplateItem(
		table: string,
		capture: Record<string, string>,
		segments?: Record<string, string>,
	): Promise<Item | undefined> {
		if (!database.value?.slug) return undefined;
		const params = {
			options: Inison.stringify({ columns: ["*"] }),
			locale: Language.value ?? "en",
			[`${database.value.slug}_sid`]: sessionID.value,
		};
		const columns = flattenSchema(
			database.value.tables?.find((entry) => entry.slug === table)?.schema ??
				[],
		);

		// Resolve every captured segment to a filterable column + typed value.
		const where: Record<string, unknown> = {};
		for (const [segment, encodedValue] of Object.entries(capture)) {
			// Router params may arrive percent-encoded (e.g. an email in the URL
			// as `a%40b.com`); the API stores the decoded value, so decode first.
			const rawValue = decodeSegmentValue(encodedValue);
			// A `[segment]` placeholder captured from the URL (e.g. visiting the
			// template page itself at `/users/[id]`) is not a real row value;
			// stop here instead of sending brackets inside a `where` (Inison
			// parser error on the API).
			if (isTemplatePattern(rawValue)) continue;

			// Prefer the column the page explicitly maps the segment to; then
			// the segment's own name; then the `slug` column (a common default);
			// then the row `id`. `id` is an implicit column that is not always
			// listed in the table schema, so it resolves without a schema entry.
			const candidates = [segments?.[segment], segment, "slug", "id"].filter(
				(column): column is string => Boolean(column),
			);
			for (const column of candidates) {
				const field = columns.find((entry) => entry.key === column);
				if (column === "id" && !field) {
					where[column] = rawValue;
					break;
				}
				if (!isTemplateSegmentField(field)) continue;
				const value = castSegmentValue(field, rawValue);
				if (value === undefined) continue;
				where[column] = value;
				break;
			}
		}
		if (!Object.keys(where).length) return undefined;

		try {
			const res = await $fetch<apiResponse<Item[]>>(
				`${config.public.apiBase}${database.value.slug}/${table}`,
				{
					params: {
						...params,
						where: Inison.stringify(where),
					},
					credentials: "include",
				},
			);
			return res.result?.[0];
		} catch {
			// Table or column missing — dynamic page cannot resolve its item.
			return undefined;
		}
	}

	return { findTemplatePage, findTemplateItem };
}
