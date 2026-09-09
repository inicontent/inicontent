import { isObject } from "inibase/utils";
import Inison from "inison";
import type { Ref } from "vue";
import { effectScope } from "vue";

/**
 * Client-side cache of referenced-table items fetched by id.
 *
 * Table references can arrive as full item objects (primary locale) or as raw
 * ids (translated values, stored backend overlays). When only ids are present,
 * grid columns and table fields need the referenced item's label fields. This
 * composable collects every id referenced on the current render pass and
 * fetches them all in ONE batched request per referenced table, then serves the
 * results reactively from a module-level cache.
 *
 * The cache is keyed to the current UI language (requests carry a `locale`
 * param), so when the language changes the cache is cleared and every id
 * referenced so far is re-fetched in a single batched request per table.
 */
const itemsCache = reactive(new Map<string, Record<string, Item>>());
const pending = new Map<string, Set<string>>();
// All ids ever registered this session, used to re-fetch after a language
// switch without relying on components re-mounting.
const registeredByTable = new Map<string, Set<string>>();
// Bumped on every language switch. Captured at request start so a response
// that resolved in the *previous* language is discarded instead of overwriting
// the fresh cache with stale labels.
let cacheVersion = 0;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// Captured synchronously at the first register() call (component setup) so the
// deferred flush can use composables without an active setup context.
let runtime:
	| {
			config: ReturnType<typeof useRuntimeConfig>;
			database: Ref<Database | undefined>;
			sessionID: Ref<string | null>;
			language: Ref<string | null>;
	  }
	| undefined;

function ensureRuntime() {
	if (runtime) return runtime;
	runtime = {
		config: useRuntimeConfig(),
		database: useState<Database | undefined>("database"),
		sessionID: useSessionCookie(),
		language: useLanguageCookie(),
	};
	return runtime;
}

// Installed once, detached from any component scope so it survives unmounts.
let languageListenerInstalled = false;

function installLanguageListener() {
	if (languageListenerInstalled || import.meta.server) return;
	languageListenerInstalled = true;
	effectScope(true).run(() => {
		const Language = ensureRuntime().language;
		watch(Language, () => clearCacheOnLanguageChange());
	});
}

function clearCacheOnLanguageChange() {
	cacheVersion++;
	itemsCache.clear();
	pending.clear();
	// Re-queue every id referenced so far and fetch them under the new locale.
	for (const [tableSlug, ids] of registeredByTable) {
		if (!ids.size) continue;
		pending.set(tableSlug, new Set(ids));
	}
	scheduleFlush();
}

function scheduleFlush() {
	if (flushTimer !== null) return;
	flushTimer = setTimeout(() => {
		flushTimer = null;
		void flushPending();
	}, 0);
}

async function flushPending() {
	const batches = [...pending.entries()];
	pending.clear();
	for (const [tableSlug, ids] of batches) {
		const unique = [...new Set([...ids].filter(Boolean))];
		if (!unique.length) continue;
		try {
			await fetchByIds(tableSlug, unique);
		} catch {
			// leave the ids uncached; a later register() pass can retry
		}
	}
}

async function fetchByIds(tableSlug: string, ids: string[]) {
	const { config, database, sessionID, language } = ensureRuntime();
	if (!database.value?.slug) return;
	const table = database.value.tables?.find(({ slug }) => slug === tableSlug);
	const version = cacheVersion;
	const requestedLocale = language.value;
	const request = await $fetch<apiResponse<Item[]>>(
		`${config.public.apiBase}${database.value.slug}/${tableSlug}`,
		{
			params: {
				where: Inison.stringify({ id: `[]${ids.join(",")}` }),
				// `perPage: -1` is required: without it inibase caps results at the
				// default of 15 rows, silently dropping every id past the first 15.
				options: Inison.stringify({
					columns: table?.columns,
					perPage: -1,
				}),
				locale: requestedLocale ?? undefined,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			cache: "no-cache",
			credentials: "include",
		},
	);
	// Discard responses that resolved after the language changed — their labels
	// belong to a previous locale and must not overwrite the fresh cache.
	if (version !== cacheVersion) return;
	const result = request?.result;
	if (!Array.isArray(result) || !result.length) return;
	const freshMap: Record<string, Item> = {
		...(itemsCache.get(tableSlug) ?? {}),
	};
	for (const item of result) {
		if (!item || item.id === undefined || item.id === null) continue;
		freshMap[String(item.id)] = item;
	}
	itemsCache.set(tableSlug, freshMap);
}

export default function useReferencedItems(tableSlug: string | undefined) {
	const items = computed<Record<string, Item>>(() =>
		tableSlug ? (itemsCache.get(tableSlug) ?? {}) : {},
	);

	/**
	 * Queue any raw id(s) in a value into the page's single batched fetch.
	 * Already-resolved object values are ignored and never trigger a request.
	 */
	function register(value: unknown) {
		if (import.meta.server || !tableSlug) return;
		installLanguageListener();

		const entries = ([] as unknown[]).concat(value);
		const missing = new Set<string>();
		let knownIds = registeredByTable.get(tableSlug);
		if (!knownIds) {
			knownIds = new Set();
			registeredByTable.set(tableSlug, knownIds);
		}
		for (const entry of entries) {
			if (entry === undefined || entry === null) continue;
			if (isObject(entry)) continue; // already-resolved object: no fetch
			const id = String(entry).trim();
			if (!id) continue;
			knownIds.add(id);
			if (itemsCache.get(tableSlug)?.[id]) continue;
			missing.add(id);
		}
		if (!missing.size) return;

		let set = pending.get(tableSlug);
		if (!set) {
			set = new Set();
			pending.set(tableSlug, set);
		}
		for (const id of missing) set.add(id);
		scheduleFlush();
	}

	return { items, register };
}
