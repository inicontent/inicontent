import Inison from "inison";
import {
	applyConfigOverlay,
	BLOCK_CONFIG_OVERLAY_FIELD,
	type ConfigDiff,
	collectFieldPathsById,
	fieldIdByPath,
	flattenOverlay,
	PAGE_TRANSLATABLE_PATHS,
	type PageFieldChange,
} from "./translationOverlay";

// ─── API-backed loading/saving ───────────────────────────────────────────────

type OverlayEntry = { id: string | number; translation: string };
type TranslationRow = Item & {
	original?: string;
	translation?: string;
	locale?: unknown;
	table?: unknown;
	field?: unknown;
	item?: unknown;
};

// Module-level caches keyed by `${database}:${scope}:${item}:${locale}` so
// shared blocks and repeated locale switches never refetch needlessly.
const overlayCache = new Map<string, Map<string, OverlayEntry>>();
const inFlight = new Map<string, Promise<Map<string, OverlayEntry>>>();

export function useTranslationOverlay() {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	const pagesTable = computed<Table | undefined>(() =>
		database.value?.tables?.find((table) => table.slug === "pages"),
	);
	const blocksTable = computed<Table | undefined>(() =>
		database.value?.tables?.find((table) => table.slug === "blocks"),
	);

	function sidParams(locale: string) {
		return { locale, [`${database.value?.slug}_sid`]: sessionID.value };
	}

	function cacheKey(scope: string, item: unknown, locale: string) {
		return `${database.value?.slug ?? ""}:${scope}:${String(item)}:${locale}`;
	}

	/** Fetch translation rows matching a where (already scoped to a locale). */
	async function fetchRows(
		where: Record<string, unknown>,
		locale: string,
	): Promise<TranslationRow[]> {
		if (!database.value?.slug) return [];
		try {
			const res = await $fetch<apiResponse<TranslationRow[]>>(
				`${config.public.apiBase}${database.value.slug}/translations`,
				{
					params: {
						where: Inison.stringify(where),
						options: Inison.stringify({
							perPage: 1000,
							columns: [
								"original",
								"locale",
								"translation",
								"field",
								"item",
								"table",
							],
						}),
						...sidParams(locale),
					},
					credentials: "include",
				},
			);
			return res.result ?? [];
		} catch (error) {
			console.error("[useTranslationOverlay] fetch translations error", error);
			return [];
		}
	}

	async function loadOverlay(
		key: string,
		load: () => Promise<Map<string, OverlayEntry>>,
	): Promise<Map<string, OverlayEntry>> {
		const cached = overlayCache.get(key);
		if (cached) return cached;
		const existing = inFlight.get(key);
		if (existing) return existing;
		const request = load().finally(() => inFlight.delete(key));
		inFlight.set(key, request);
		const result = await request;
		overlayCache.set(key, result);
		return result;
	}

	function invalidateScope(scope: string, item: unknown, locale: string) {
		overlayCache.delete(cacheKey(scope, item, locale));
	}

	/**
	 * Load the existing page overlays (slug/SEO translations) for a page.
	 * Returns path → { id, translation }.
	 */
	async function loadPageOverlays(
		pageId: string | number,
		locale: string,
	): Promise<Map<string, OverlayEntry>> {
		const table = pagesTable.value;
		if (!table?.id || !pageId) return new Map();
		const scope = "page";
		return loadOverlay(cacheKey(scope, pageId, locale), async () => {
			const rows = await fetchRows(
				{ table: table.id, item: String(pageId), locale },
				locale,
			);
			const pathsById = table.schema
				? collectFieldPathsById(table.schema)
				: new Map<string, string>();
			const known = new Set(PAGE_TRANSLATABLE_PATHS as readonly string[]);
			const map = new Map<string, OverlayEntry>();
			for (const row of rows) {
				const path = pathsById.get(String(row.field));
				if (!path || !known.has(path)) continue;
				map.set(path, {
					id: row.id as string | number,
					translation: String(row.translation ?? ""),
				});
			}
			return map;
		});
	}

	/**
	 * Load block-config overlays for the given block ids. Returns a map of
	 * block id → path → { id, translation }.
	 */
	async function loadBlockOverlays(
		blockIds: (string | number)[],
		locale: string,
	): Promise<Map<string, Map<string, OverlayEntry>>> {
		const table = blocksTable.value;
		if (!table?.id) return new Map();
		const ids = [...new Set(blockIds.map(String).filter(Boolean))];
		if (!ids.length) return new Map();

		const result = new Map<string, Map<string, OverlayEntry>>();
		const missing: string[] = [];
		for (const id of ids) {
			const key = cacheKey("block", id, locale);
			const cached = overlayCache.get(key);
			if (cached) result.set(id, cached);
			else missing.push(id);
		}
		if (!missing.length) return result;

		// One scoped query for all missing blocks of this page; the `item`
		// criteria is an Inison `in` match over the stored block row ids.
		const rows = await fetchRows(
			{
				table: table.id,
				item: missing,
				locale,
				field: BLOCK_CONFIG_OVERLAY_FIELD,
			},
			locale,
		);
		const byItem = new Map<string, Map<string, OverlayEntry>>();
		for (const row of rows) {
			const itemKey = String(row.item ?? "");
			let map = byItem.get(itemKey);
			if (!map) {
				map = new Map();
				byItem.set(itemKey, map);
			}
			map.set(String(row.original ?? ""), {
				id: row.id as string | number,
				translation: String(row.translation ?? ""),
			});
		}
		for (const id of missing) {
			const map = byItem.get(id) ?? new Map();
			overlayCache.set(cacheKey("block", id, locale), map);
			result.set(id, map);
		}
		return result;
	}

	/**
	 * Apply the cached block-config overlays to a page's content (deep-copies
	 * the page; canonical `config` is never mutated). Block configs are stored
	 * as arrays, but overlays are dotted paths — normalize each block's config
	 * to object form before merging (same as the builder's editing model).
	 */
	async function applyPageBlockOverlays(
		page: Page | null | undefined,
		locale: string | null | undefined,
	): Promise<Page | null | undefined> {
		if (!page || !locale) return page;
		const blockIds = (page.content ?? [])
			.map((block) => block.id)
			.filter((id): id is string | number => Boolean(id));
		const overlays = await loadBlockOverlays(blockIds, locale);
		if (!overlays.size) return page;
		const merged = JSON.parse(JSON.stringify(page)) as Page;
		for (const block of merged.content ?? []) {
			const overlay = overlays.get(String(block.id));
			if (!overlay?.size || !block.config) continue;
			const type = String(block.name ?? "").split("/")[0] as Blocks;
			const schema = blockTypes[type]?.schema;
			const config = Array.isArray(block.config)
				? convertArrayToObject(block.config, schema ?? [])
				: (block.config as Record<string, unknown>);
			if (config && typeof config === "object")
				block.config = applyConfigOverlay(
					config,
					flattenOverlay(overlay),
				) as Content["config"];
		}
		return merged;
	}

	/** Create or update a translation record; returns the stored id. */
	async function upsertTranslation(record: {
		table: string | number;
		item: string | number;
		field: number;
		locale: string;
		original?: string;
		translation: string;
		existingId?: string | number | null;
	}): Promise<string | number | undefined> {
		if (!database.value?.slug) return undefined;
		const url = `${config.public.apiBase}${database.value.slug}/translations`;
		if (record.existingId !== undefined && record.existingId !== null) {
			await $fetch(`${url}/${String(record.existingId)}`, {
				method: "PUT",
				body: { translation: record.translation },
				params: sidParams(record.locale),
				credentials: "include",
			});
			return record.existingId;
		}
		const res = await $fetch<apiResponse<TranslationRow[] | TranslationRow>>(
			url,
			{
				method: "POST",
				body: {
					table: record.table,
					item: record.item,
					field: record.field,
					locale: record.locale,
					original: record.original,
					translation: record.translation,
				},
				params: sidParams(record.locale),
				credentials: "include",
			},
		);
		const created = res.result;
		const id = Array.isArray(created)
			? created[0]?.id
			: (created as TranslationRow | undefined)?.id;
		return id;
	}

	async function removeTranslation(id: string | number, locale: string) {
		if (!database.value?.slug) return;
		await $fetch(
			`${config.public.apiBase}${database.value.slug}/translations/${String(id)}`,
			{
				method: "DELETE",
				params: sidParams(locale),
				credentials: "include",
			},
		);
	}

	/**
	 * Persist the page-field overlays. `changes` come from
	 * `diffPageFieldsWithReset`: values equal to the canonical source (or
	 * empty) delete the record so the page falls back to canonical; anything
	 * else upserts the translation.
	 */
	async function savePageOverlays(
		pageId: string | number,
		locale: string,
		changes: PageFieldChange[],
		existing: Map<string, OverlayEntry>,
	): Promise<void> {
		const table = pagesTable.value;
		if (!table?.id || !changes.length) return;
		for (const change of changes) {
			const fieldId = fieldIdByPath(table.schema, change.path);
			if (fieldId === undefined) continue;
			const entry = existing.get(change.path);
			const isReset =
				change.to === change.from ||
				typeof change.to !== "string" ||
				change.to.trim() === "";
			if (isReset) {
				if (entry?.id) await removeTranslation(entry.id, locale);
				existing.delete(change.path);
				continue;
			}
			const id = await upsertTranslation({
				table: table.id,
				item: String(pageId),
				field: fieldId,
				locale,
				original: change.from || undefined,
				translation: change.to,
				existingId: entry?.id ?? null,
			});
			if (id !== undefined)
				existing.set(change.path, { id, translation: change.to });
		}
		invalidateScope("page", String(pageId), locale);
	}

	/**
	 * Persist block-config overlays for changed fields (from
	 * `diffConfigsWithReset`). Shared blocks are translated once — the record
	 * is keyed by the block id, so every page referencing the block gets the
	 * same localized config.
	 */
	async function saveBlockOverlays(
		blockId: string | number,
		locale: string,
		changes: ConfigDiff[],
		existing: Map<string, OverlayEntry>,
	): Promise<void> {
		const table = blocksTable.value;
		if (!table?.id || !changes.length) return;
		for (const change of changes) {
			const entry = existing.get(change.path);
			const isReset =
				change.to === change.from ||
				typeof change.to !== "string" ||
				change.to.trim() === "";
			if (isReset) {
				if (entry?.id) await removeTranslation(entry.id, locale);
				existing.delete(change.path);
				continue;
			}
			const id = await upsertTranslation({
				table: table.id,
				item: String(blockId),
				field: BLOCK_CONFIG_OVERLAY_FIELD,
				locale,
				original: change.path,
				translation: change.to,
				existingId: entry?.id ?? null,
			});
			if (id !== undefined)
				existing.set(change.path, { id, translation: change.to });
		}
		invalidateScope("block", String(blockId), locale);
	}

	return {
		loadPageOverlays,
		loadBlockOverlays,
		applyPageBlockOverlays,
		savePageOverlays,
		saveBlockOverlays,
	};
}
