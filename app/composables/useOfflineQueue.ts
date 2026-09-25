import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import {
	mapOfflineReferences,
	replaceTemporaryReference,
} from "./offlineReferences";

const DB_NAME = "inicontent-offline-queue";
const STORE_NAME = "pending-mutations";
const DB_VERSION = 2;
const ID_MAP_STORE = "resolved-ids";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * A single queued mutation that could not be sent to the remote API because
 * the device was offline (or the request failed transiently).
 */
export type PendingMutation = {
	/** unique id for this queued mutation */
	id: string;
	method: Exclude<HTTPMethod, "GET">;
	/** full API url, including protocol and host */
	url: string;
	/** request body (if any) — kept as raw JSON-safe data */
	body: Record<string, any> | string | null;
	/** request query params (if any) */
	params?: Record<string, any>;
	/** database slug scope */
	database: string;
	/** table slug scope (if applicable) */
	table: string;
	timestamp: number;
	retryCount: number;
	status: "pending" | "retrying" | "conflict";
	/** populated when status === 'conflict': what the server currently has */
	conflictData?: { local: any; server: any } | null;
	errorMessage?: string | null;
	kind?: "item" | "schema";
	/** Snapshot needed to resolve references even after a reload. */
	tables?: any[];
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function initDB(): Promise<IDBPDatabase> {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(ID_MAP_STORE))
					db.createObjectStore(ID_MAP_STORE);
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
					store.createIndex("timestamp", "timestamp", { unique: false });
					store.createIndex("status", "status", { unique: false });
					store.createIndex("database", "database", { unique: false });
				}
			},
		});
	}
	return dbPromise;
}

/**
 * Push a mutation onto the offline queue. No-op when the app is online and the
 * request could be sent directly, but kept here so callers can enqueue
 * unconditionally after a failed fetch.
 */
export async function enqueueMutation(
	mutation: Omit<PendingMutation, "id" | "timestamp" | "retryCount" | "status">,
): Promise<PendingMutation> {
	// Make the body JSON-safe before persisting — IndexedDB uses structured
	// clone, which throws on functions/cycles. Falling back to JSON.stringify
	// guarantees we never lose a queued change because of an exotic value.
	let safeBody = mutation.body;
	if (safeBody !== null && typeof safeBody === "object") {
		try {
			const clone = structuredClone(safeBody);
			JSON.stringify(clone); // throws on non-serializable values
			safeBody = clone as typeof safeBody;
		} catch {
			try {
				safeBody = JSON.parse(JSON.stringify(safeBody)) as typeof safeBody;
			} catch {
				throw new Error("Cannot persist this change");
			}
		}
	}

	const record: PendingMutation = {
		...mutation,
		body: safeBody,
		id: randomID(),
		timestamp: Date.now(),
		retryCount: 0,
		status: "pending",
	};
	const records: PendingMutation[] = [];
	async function prepare(entry: PendingMutation): Promise<void> {
		if (entry.kind !== "schema") {
			const schema =
				entry.tables?.find((table) => table.slug === entry.table)?.schema ?? [];
			entry.body = await mapOfflineReferences(
				entry.body,
				schema,
				async (value, field) => {
					if (!value || typeof value !== "object") return value;
					if (value.id != null) return value.id;
					const target = entry.tables?.find(
						(table) => table.slug === field.table,
					);
					if (!target) throw new Error("offlineInvalidReference");
					const url = new URL(entry.url);
					const segments = url.pathname.split("/");
					const dbIndex = segments.lastIndexOf(entry.database);
					if (dbIndex < 0) throw new Error("offlineInvalidReference");
					url.pathname = [...segments.slice(0, dbIndex + 1), field.table].join(
						"/",
					);
					const child: PendingMutation = {
						...entry,
						id: randomID(),
						method: "POST",
						url: url.href,
						table: field.table,
						body: value,
					};
					await prepare(child);
					return `pending__${child.id}`;
				},
			);
		}
		records.push(entry);
	}
	await prepare(record);
	const db = await initDB();
	const tx = db.transaction([STORE_NAME, ID_MAP_STORE], "readwrite");
	const store = tx.objectStore(STORE_NAME);
	const idMap = (await tx.objectStore(ID_MAP_STORE).get(record.database)) ?? {};
	const all = await store.getAll();
	let timestamp = Math.max(Date.now(), ...all.map((m) => m.timestamp + 1));
	for (const entry of records) {
		entry.timestamp = timestamp++;
		for (const [temp, id] of Object.entries(idMap)) {
			entry.body = replaceTemporaryReference(entry.body, temp, String(id));
			entry.url = replaceUrlReference(entry.url, temp, String(id));
		}
		await store.put(entry);
	}
	await tx.done;
	return record;
}

/** Fetch all pending (non-conflict) mutations, oldest first. */
export async function getPendingMutations(): Promise<PendingMutation[]> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all
			.filter((m) => m.status !== "conflict")
			.sort((a, b) => a.timestamp - b.timestamp);
	} catch (error) {
		console.warn("[OfflineQueue] Failed to read mutations:", error);
		return [];
	}
}

/** Fetch every queued mutation including conflicts. */
export async function getAllMutations(): Promise<PendingMutation[]> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all.sort((a, b) => a.timestamp - b.timestamp);
	} catch (error) {
		console.warn("[OfflineQueue] Failed to read mutations:", error);
		throw error;
	}
}

/** Get all mutations scoped to a specific database (and optionally table). */
export async function getMutationsByScope(
	database: string,
	table?: string,
): Promise<PendingMutation[]> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all
			.filter((m) => m.database === database && (!table || m.table === table))
			.sort((a, b) => a.timestamp - b.timestamp);
	} catch (error) {
		console.warn("[OfflineQueue] Failed to read scoped mutations:", error);
		return [];
	}
}

/** Drop a mutation from the queue after successful sync or user discard. */
export async function removeMutation(id: string): Promise<void> {
	try {
		const db = await initDB();
		await db.delete(STORE_NAME, id);
	} catch (error) {
		console.warn(`[OfflineQueue] Failed to remove mutation ${id}:`, error);
		throw error;
	}
}

/** Mark a mutation as conflicted, storing both sides for later resolution. */
export async function markConflict(
	id: string,
	serverData: any,
	errorMessage?: string,
): Promise<PendingMutation | undefined> {
	try {
		const db = await initDB();
		const existing = await db.get(STORE_NAME, id);
		if (!existing) return undefined;
		const updated: PendingMutation = {
			...existing,
			status: "conflict",
			errorMessage,
			conflictData: { local: existing.body, server: serverData },
		};
		await db.put(STORE_NAME, updated);
		return updated;
	} catch (error) {
		console.warn(`[OfflineQueue] Failed to mark conflict for ${id}:`, error);
		throw error;
	}
}

/** Increment the retry counter for a mutation that failed transiently. */
export async function incrementRetry(id: string): Promise<void> {
	try {
		const db = await initDB();
		const existing = await db.get(STORE_NAME, id);
		if (!existing) return;
		await db.put(STORE_NAME, {
			...existing,
			retryCount: (existing.retryCount ?? 0) + 1,
			status: "pending",
		});
	} catch (error) {
		console.warn(`[OfflineQueue] Failed to increment retry for ${id}:`, error);
	}
}

/** Re-queue a conflicted mutation (user chose "keep local"). */
export async function requeueMutation(
	id: string,
	body?: PendingMutation["body"],
): Promise<void> {
	try {
		const db = await initDB();
		const existing = await db.get(STORE_NAME, id);
		if (!existing) return;
		await db.put(STORE_NAME, {
			...existing,
			status: "pending",
			body: body === undefined ? existing.body : body,
			errorMessage: null,
			retryCount: 0,
			conflictData: null,
		});
	} catch (error) {
		console.warn(`[OfflineQueue] Failed to requeue mutation ${id}:`, error);
		throw error;
	}
}

/** Total count of pending mutations (excluding conflicts). */
export async function getPendingCount(): Promise<number> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all.filter((m) => m.status !== "conflict").length;
	} catch (error) {
		return 0;
	}
}

/** Total count of conflicted mutations. */
export async function getConflictCount(): Promise<number> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all.filter((m) => m.status === "conflict").length;
	} catch (error) {
		return 0;
	}
}

/** Number of pending mutations scoped to a database (optional table). */
export async function getPendingCountByScope(
	database: string,
	table?: string,
): Promise<number> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all.filter(
			(m) =>
				m.status !== "conflict" &&
				m.database === database &&
				(!table || m.table === table),
		).length;
	} catch (error) {
		return 0;
	}
}

/** All converged mutations for a given scope. */
export async function getConflicts(): Promise<PendingMutation[]> {
	try {
		const db = await initDB();
		const all = await db.getAll(STORE_NAME);
		return all
			.filter((m) => m.status === "conflict")
			.sort((a, b) => a.timestamp - b.timestamp);
	} catch (error) {
		return [];
	}
}

export async function clearAllMutations(): Promise<void> {
	try {
		const db = await initDB();
		await db.clear(STORE_NAME);
	} catch (error) {
		console.warn("[OfflineQueue] Failed to clear queue:", error);
	}
}

/**
 * Build virtual rows for queued POST (create) mutations scoped to a table, so
 * items created while offline still appear in the table view until they sync.
 * Each virtual row carries a `__pending` marker (with the queued mutation id)
 * and a synthetic id so the grid can key it without colliding with real ids.
 */
export async function getPendingCreates(
	database: string,
	table: string,
): Promise<Item[]> {
	try {
		const mutations = await getMutationsByScope(database, table);
		return mutations
			.filter((m) => m.method === "POST" && m.kind !== "schema")
			.map((m) => {
				const body =
					m.body && typeof m.body === "object" && !Array.isArray(m.body)
						? (m.body as Record<string, any>)
						: {};
				return {
					...body,
					id: `${String(body.id ?? "")}` || `pending__${m.id}`,
					__pending: { queuedId: m.id },
				} as Item;
			});
	} catch (error) {
		console.warn("[OfflineQueue] Failed to build pending creates:", error);
		return [];
	}
}

/** Substitute ids and remove the child in one durable transaction. */
function replaceUrlReference(url: string, temp: string, id: string) {
	return url
		.split("/")
		.map((part) =>
			decodeURIComponent(part) === temp ? encodeURIComponent(id) : part,
		)
		.join("/");
}

export async function completeMutation(
	mutation: PendingMutation,
	realId?: string,
) {
	const db = await initDB();
	const tx = db.transaction([STORE_NAME, ID_MAP_STORE], "readwrite");
	const store = tx.objectStore(STORE_NAME);
	if (realId) {
		const temp = `pending__${mutation.id}`;
		const maps = tx.objectStore(ID_MAP_STORE);
		const mapping = (await maps.get(mutation.database)) ?? {};
		mapping[temp] = realId;
		await maps.put(mapping, mutation.database);
		for (const entry of await store.getAll()) {
			if (entry.database !== mutation.database) continue;
			entry.body = replaceTemporaryReference(entry.body, temp, realId);
			entry.url = replaceUrlReference(entry.url, temp, realId);
			await store.put(entry);
		}
	}
	await store.delete(mutation.id);
	await tx.done;
}
