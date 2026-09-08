import type { IDBPDatabase } from "idb";
import { openDB } from "idb";

const DB_NAME = "inicontent-offline-queue";
const STORE_NAME = "pending-mutations";
const DB_VERSION = 1;

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
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function initDB(): Promise<IDBPDatabase> {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
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
				safeBody = null;
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
	try {
		const db = await initDB();
		await db.put(STORE_NAME, record);
	} catch (error) {
		console.warn("[OfflineQueue] Failed to enqueue mutation:", error);
	}
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
		return [];
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
			.filter(
				(m) =>
					m.database === database &&
					(!table || m.table === table) &&
					m.status !== "conflict",
			)
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
	}
}

/** Mark a mutation as conflicted, storing both sides for later resolution. */
export async function markConflict(
	id: string,
	serverData: any,
): Promise<PendingMutation | undefined> {
	try {
		const db = await initDB();
		const existing = await db.get(STORE_NAME, id);
		if (!existing) return undefined;
		const updated: PendingMutation = {
			...existing,
			status: "conflict",
			conflictData: { local: existing.body, server: serverData },
		};
		await db.put(STORE_NAME, updated);
		return updated;
	} catch (error) {
		console.warn(`[OfflineQueue] Failed to mark conflict for ${id}:`, error);
		return undefined;
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
export async function requeueMutation(id: string): Promise<void> {
	try {
		const db = await initDB();
		const existing = await db.get(STORE_NAME, id);
		if (!existing) return;
		await db.put(STORE_NAME, {
			...existing,
			status: "pending",
			retryCount: 0,
			conflictData: null,
		});
	} catch (error) {
		console.warn(`[OfflineQueue] Failed to requeue mutation ${id}:`, error);
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
