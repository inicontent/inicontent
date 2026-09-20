import { getMutationsByScope } from "./useOfflineQueue";

/**
 * Resolve a single item when its network fetch fails while offline — used by
 * the item detail and standalone edit pages, which live *outside* the table
 * grid and therefore don't have the row already in memory.
 *
 * Sources, in order:
 * 1. A queued mutation (offline PUT of that exact item) — the user's own
 *    latest local edit is returned so the form keeps what they typed.
 * 2. The service worker's runtime caches — either the exact item URL (if it
 *    was viewed online before) or any cached *list* response for the table
 *    that contains the item (the table view is usually what was cached).
 *
 * Returns undefined when nothing is available (a true offline cold miss).
 */
export async function getOfflineItem(
	database: string,
	table: string,
	id: string,
	itemUrl: string,
): Promise<Item | undefined> {
	try {
		// 1. Queued mutations for this table — a pending PUT of this item wins.
		const mutations = await getMutationsByScope(database, table);
		for (const mutation of mutations) {
			if (mutation.method !== "PUT" && mutation.method !== "POST") continue;
			let mutationId: string | undefined;
			try {
				const pathname = new URL(mutation.url).pathname;
				mutationId = pathname.split("/").filter(Boolean).pop();
			} catch {
				mutationId = undefined;
			}
			if (String(mutationId ?? "") !== String(id)) continue;
			if (mutation.method === "POST") {
				// A POST only matches when its body carried this exact id (rare —
				// offline creates use a synthetic pending__ id).
				if (String((mutation.body as any)?.id ?? "") !== String(id)) continue;
			}
			const body = mutation.body;
			if (body && typeof body === "object" && !Array.isArray(body))
				return { ...(body as Record<string, any>) } as Item;
		}

		// 2. SW runtime caches.
		if (typeof caches === "undefined") return undefined;
		const cacheNames = await caches.keys();
		for (const cacheName of cacheNames) {
			const cache = await caches.open(cacheName);
			// 2a. Exact cached response for this item URL (ignore the query
			// string — e.g. the `options`/`columns` param — only the path
			// identifies which item this is).
			const exact = await cache.match(itemUrl, { ignoreSearch: true });
			const fromExact = await extractItem(exact, id);
			if (fromExact) return fromExact;
			// 2b. Scan cached list responses for the item (a GET of the table
			// grid is usually what got cached while online).
			const keys = await cache.keys();
			for (const request of keys) {
				const response = await cache.match(request);
				if (!response) continue;
				const found = await extractItemFromList(response, id);
				if (found) return found;
			}
		}
	} catch (error) {
		console.warn("[OfflineItem] Lookup failed:", error);
	}
	return undefined;
}

async function extractItem(
	response: Response | undefined,
	id: string,
): Promise<Item | undefined> {
	if (!response) return undefined;
	try {
		const json = await response.json();
		const item = json?.result;
		if (
			item &&
			typeof item === "object" &&
			String(item.id ?? "") === String(id)
		)
			return item as Item;
	} catch {
		// not JSON — skip
	}
	return undefined;
}

async function extractItemFromList(
	response: Response,
	id: string,
): Promise<Item | undefined> {
	try {
		const json = await response.json();
		const list = Array.isArray(json?.result)
			? (json.result as Item[])
			: undefined;
		if (!list) return undefined;
		return list.find((item) => String(item?.id ?? "") === String(id));
	} catch {
		return undefined;
	}
}
