import Inison from "inison";
import type { InjectionKey } from "vue";

import {
	buildFieldIndex,
	type ComputedFieldRef,
	evaluateComputedRow,
} from "./computedEval.ts";

/**
 * Injection key for {@link ComputedPreviewContext}. A symbol so it cannot
 * collide with another provide/inject pair in the form tree.
 */
export const COMPUTED_PREVIEW_KEY: InjectionKey<ComputedPreviewContext> =
	Symbol("inicontent:computedPreview");

/**
 * Live preview of computed-field values for the item form.
 *
 * The engine recomputes every computed column on write and stores the result,
 * so the value shown after a save always comes from the API. While the user is
 * still editing, though, the form would otherwise show whatever was stored on
 * the last save — stale the moment any input changes. This composable
 * recomputes in the browser so the form agrees with what the next save will
 * produce, with no request and no write.
 *
 * Rules:
 *  - the row is never mutated (see `computedEval.ts`), so a computed value can
 *    never leak into a create/update body, and the form's deep watcher in
 *    `components/Form/index.vue` never fires on our account;
 *  - anything that cannot be evaluated (an expression not compiled yet, an
 *    unreadable link, an arithmetic error) falls back to the stored value — a
 *    preview never surfaces an error in the middle of a form;
 *  - link hops resolve once per linked row and are cached for the session, so
 *    retyping an unrelated input issues no further reads.
 */
export function useComputedPreview() {
	const database = useState<Database>("database");
	const Language = useScopedCookie<LanguagesType>(
		"language",
		database.value?.slug,
	);
	const config = useRuntimeConfig();
	const sessionID = useState<string | undefined>("sessionID");

	/**
	 * Previewed values keyed by dotted column key. `total` holds a number,
	 * `items.lineTotal` an array with one entry per element.
	 */
	const preview = ref<Record<string, number | number[]>>({});
	/** True while an evaluation is in flight. */
	const pending = ref(false);
	/** Last evaluation failure — for debugging only, never shown in the form. */
	const lastError = ref<string>();

	const tableIndexCache = new Map<string, Map<number, ComputedFieldRef>>();
	const linkedCache = new Map<string, Map<string | number, any>>();

	/**
	 * Recompute every compiled computed column of `row` against `schema`.
	 * Leaves the previous preview in place when evaluation fails, so the form
	 * keeps showing the last known good (or stored) values.
	 */
	async function compute(
		schema: Schema | undefined | null,
		row: Record<string, any> | undefined | null,
		table: string,
	): Promise<void> {
		// Offline, or nothing to do.
		if (typeof navigator !== "undefined" && navigator.onLine === false) return;
		if (!schema?.length || !row) return;
		if (!schema.some((field) => typeof field.computed !== "undefined")) return;

		pending.value = true;
		try {
			preview.value = await evaluateComputedRow(schema, toRaw(row), {
				table,
				getTableIndex: async (target: string) => {
					const cached = tableIndexCache.get(target);
					if (cached) return cached;
					const targetTable = database.value.tables?.find(
						({ slug }) => slug === target,
					);
					if (!targetTable?.schema) return undefined;
					const index = buildFieldIndex(targetTable.schema);
					tableIndexCache.set(target, index);
					return index;
				},
				resolveLinkedRow: async (target, column, id) => {
					const cacheKey = `${target}\u0000${column}`;
					let map = linkedCache.get(cacheKey);
					if (!map) {
						map = new Map();
						linkedCache.set(cacheKey, map);
					}
					if (map.has(id)) return map.get(id);
					// The engine resolves hops server-side with its own
					// privileges; if we cannot read the linked table, cache the miss
					// and let the preview fall back to the stored value.
					try {
						const response = await $fetch<apiResponse<Record<string, any>>>(
							`${config.public.apiBase}${database.value.slug}/${target}/${id}`,
							{
								params: {
									options: Inison.stringify({ columns: [column] }),
									locale: Language.value,
									[`${database.value.slug}_sid`]: sessionID.value,
								},
								credentials: "include",
							},
						);
						const value = response.result ? response.result[column] : null;
						map.set(id, value ?? null);
						return value ?? null;
					} catch {
						map.set(id, null);
						return null;
					}
				},
			});
			lastError.value = undefined;
		} catch (error) {
			// Keep the previous preview (or the stored values) rather than
			// blanking the field.
			lastError.value = error instanceof Error ? error.message : String(error);
		} finally {
			pending.value = false;
		}
	}

	/**
	 * Value to display for a top-level field: the freshly computed one when
	 * available, otherwise the stored value. Computed children of an array column
	 * are handled by `ComputedPreviewContext.displayValue`, which indexes the
	 * per-element results.
	 */
	function displayValue(
		field: Field,
		row: Record<string, any> | undefined | null,
	) {
		const stored = row?.[field.key];
		const value = preview.value[field.key];
		if (value === undefined || value === null) return stored;
		return value;
	}

	/** Drop cached link reads (e.g. after the session or table changed). */
	function reset() {
		preview.value = {};
		tableIndexCache.clear();
		linkedCache.clear();
		lastError.value = undefined;
	}

	return { preview, pending, lastError, compute, displayValue, reset };
}
