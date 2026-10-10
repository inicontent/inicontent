import { openDB } from "idb";

export const BROWSER_CONTAINMENT_VERSION = "browser-storage-v1";
export const QUARANTINE_STORE = "quarantined-mutations-v1";

export function isSensitiveCache(name: string): boolean {
	return (
		/^inicontent-(api|config|static|icon)-cache$/.test(name) ||
		name.startsWith("workbox-precache-")
	);
}

/** Repeatable; never touches unsynced mutations or arbitrary app storage. */
export async function purgeBrowserCopies(): Promise<void> {
	if (typeof caches !== "undefined") {
		for (const name of await caches.keys())
			if (isSensitiveCache(name)) await caches.delete(name);
	}
	if (typeof localStorage !== "undefined") {
		for (let index = localStorage.length - 1; index >= 0; index--) {
			const key = localStorage.key(index);
			if (
				key?.startsWith("inicontent:db-config:") ||
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
	await purgeBrowserCopies();
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
	const thumbnails = await openDB("inicontent-thumbnails", 2, {
		blocked: onBlocked,
		upgrade(db) {
			if (db.objectStoreNames.contains("thumbnails"))
				db.deleteObjectStore("thumbnails");
			// A deliberately empty tombstone DB prevents legacy v1 code reopening it.
		},
	});
	thumbnails.close();
	const queue = await openDB("inicontent-offline-queue", 3, {
		blocked: onBlocked,
		upgrade(db, _oldVersion, _newVersion, transaction) {
			if (db.objectStoreNames.contains("pending-mutations"))
				transaction.objectStore("pending-mutations").name = QUARANTINE_STORE;
			if (db.objectStoreNames.contains("resolved-ids"))
				transaction.objectStore("resolved-ids").name =
					"quarantined-resolved-ids-v1";
		},
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
