import type { IDBPDatabase, IDBPTransaction } from "idb";
import { openDB } from "idb";

export const BROWSER_CONTAINMENT_VERSION = "browser-storage-v1";

/**
 * Offline IndexedDB layout.
 *
 * Pre-containment (v1/v2 for the queue, v1 for thumbnails) the app persisted
 * unsynced clinical edits and thumbnails. The containment migration emptied
 * those stores. Non-PHI databases now get them back, but the *legacy* stores are
 * preserved read-only under their `quarantined-*` names and are never replayed.
 */
export const OFFLINE_QUEUE_DB = "inicontent-offline-queue";
export const OFFLINE_QUEUE_STORE = "pending-mutations";
export const OFFLINE_ID_MAP_STORE = "resolved-ids";
export const OFFLINE_QUEUE_VERSION = 4;

export const QUARANTINE_STORE = "quarantined-mutations-v1";
export const QUARANTINED_ID_MAP_STORE = "quarantined-resolved-ids-v1";

export const THUMBNAIL_DB = "inicontent-thumbnails";
export const THUMBNAIL_STORE = "thumbnails";
export const THUMBNAIL_VERSION = 3;

/**
 * Bring a legacy/contained offline-queue database up to the live schema:
 * quarantine any pre-containment stores (read-only, never replayed) and create
 * fresh, empty live stores for non-PHI offline use.
 */
export function upgradeOfflineQueue(
	database: IDBPDatabase,
	oldVersion: number,
	_newVersion: number | null,
	transaction: IDBPTransaction<unknown, string[], "versionchange">,
): void {
	const hadPending = database.objectStoreNames.contains(OFFLINE_QUEUE_STORE);
	const hadResolved = database.objectStoreNames.contains(OFFLINE_ID_MAP_STORE);
	const hadQuarantine = database.objectStoreNames.contains(QUARANTINE_STORE);
	const hadQuarantinedIdMap = database.objectStoreNames.contains(
		QUARANTINED_ID_MAP_STORE,
	);

	let pendingSlotFree = !hadPending;
	if (oldVersion < 3) {
		if (hadPending && !hadQuarantine) {
			transaction.objectStore(OFFLINE_QUEUE_STORE).name = QUARANTINE_STORE;
			pendingSlotFree = true;
		}
	}
	// `resolved-ids` has no keyPath, so it is created only when genuinely absent.
	const resolvedSlotFree =
		!hadResolved || (oldVersion < 3 && !hadQuarantinedIdMap);
	if (oldVersion < 3 && hadResolved && !hadQuarantinedIdMap)
		transaction.objectStore(OFFLINE_ID_MAP_STORE).name =
			QUARANTINED_ID_MAP_STORE;

	if (pendingSlotFree) {
		const store = database.createObjectStore(OFFLINE_QUEUE_STORE, {
			keyPath: "id",
		});
		store.createIndex("timestamp", "timestamp", { unique: false });
		store.createIndex("status", "status", { unique: false });
		store.createIndex("database", "database", { unique: false });
	}
	if (resolvedSlotFree) database.createObjectStore(OFFLINE_ID_MAP_STORE);
}

/** Recreate the live thumbnail store, dropping any pre-containment cache. */
export function upgradeThumbnails(database: IDBPDatabase): void {
	if (database.objectStoreNames.contains(THUMBNAIL_STORE))
		database.deleteObjectStore(THUMBNAIL_STORE);
	const store = database.createObjectStore(THUMBNAIL_STORE, {
		keyPath: "key",
	});
	store.createIndex("timestamp", "timestamp", { unique: false });
}

/** CacheStorage names that hold API responses or personal assets. */
export function isSensitiveCache(name: string): boolean {
	return (
		/^inicontent-(api|config|static|icon)-cache(-v2)?$/.test(name) ||
		name.startsWith("workbox-precache-")
	);
}

/** Only the pre-containment cache names — safe to purge on every boot. */
export function isLegacySensitiveCache(name: string): boolean {
	return (
		/^inicontent-(api|config|static|icon)-cache$/.test(name) ||
		name.startsWith("workbox-precache-")
	);
}

/** Legacy localStorage keys, dropped once on boot. */
function purgeLegacyStorage(): void {
	if (typeof localStorage === "undefined") return;
	for (let index = localStorage.length - 1; index >= 0; index--) {
		const key = localStorage.key(index);
		if (key?.startsWith("inicontent:db-config:")) localStorage.removeItem(key);
	}
}

/** Repeatable; never touches synced data or the quarantined legacy stores. */
export async function purgeLegacyCopies(): Promise<void> {
	if (typeof caches !== "undefined") {
		const names = await caches.keys();
		await Promise.all(
			names.filter(isLegacySensitiveCache).map((name) => caches.delete(name)),
		);
	}
	purgeLegacyStorage();
}

/** Full purge — used at a session boundary and whenever a PHI database is in
 * use. Removes both the legacy and the live offline caches plus the local
 * database-config copies. Never touches queued mutations. */
export async function purgeBrowserCopies(): Promise<void> {
	if (typeof caches !== "undefined") {
		const names = await caches.keys();
		await Promise.all(
			names.filter(isSensitiveCache).map((name) => caches.delete(name)),
		);
	}
	if (typeof localStorage !== "undefined") {
		for (let index = localStorage.length - 1; index >= 0; index--) {
			const key = localStorage.key(index);
			if (
				key?.startsWith("inicontent:db-config:") ||
				key?.startsWith("inicontent:db-config-v2:") ||
				key === "emailTemplates.customVariables"
			)
				localStorage.removeItem(key);
		}
	}
}

/** Version upgrades close the legacy API: old bundles opening v1/v2 fail.
 * Existing old connections must close before an upgrade can commit. Report the
 * block and wait: never delete a database to force past an open clinical draft.
 */
export async function migrateBrowserPersistence(
	onBlocked: () => void,
): Promise<boolean> {
	await purgeLegacyCopies();
	// Workbox expiration indexes contain cached request URLs (including old SID
	// query parameters), even after the corresponding CacheStorage is deleted.
	const expiration = await openDB("workbox-expiration", 2, {
		blocked: onBlocked,
		upgrade(db) {
			if (db.objectStoreNames.contains("cache-entries"))
				db.deleteObjectStore("cache-entries");
		},
	});
	expiration.close();
	const thumbnails = await openDB(THUMBNAIL_DB, THUMBNAIL_VERSION, {
		blocked: onBlocked,
		upgrade: upgradeThumbnails,
	});
	thumbnails.close();
	const queue = await openDB(OFFLINE_QUEUE_DB, OFFLINE_QUEUE_VERSION, {
		blocked: onBlocked,
		upgrade: upgradeOfflineQueue,
	});
	try {
		// Count only: no body, URL, session token or clinical value enters UI state.
		return (
			queue.objectStoreNames.contains(QUARANTINE_STORE) &&
			(await queue.count(QUARANTINE_STORE)) > 0
		);
	} finally {
		queue.close();
	}
}
