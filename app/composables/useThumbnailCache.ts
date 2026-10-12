import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import {
	THUMBNAIL_DB as DB_NAME,
	THUMBNAIL_VERSION as DB_VERSION,
	THUMBNAIL_STORE as STORE_NAME,
	upgradeThumbnails,
} from "./browserContainment";
import { isPhiDatabase } from "./phiGuard";

let db: IDBPDatabase | null = null;

/**
 * Initialize the thumbnail cache database
 */
async function initDB(): Promise<IDBPDatabase> {
	if (db) return db;
	try {
		db = await openDB(DB_NAME, DB_VERSION, { upgrade: upgradeThumbnails });
		return db;
	} catch (error) {
		console.warn("Failed to initialize thumbnail cache:", error);
		throw error;
	}
}

/**
 * Get cached thumbnail from IndexedDB
 * @param key - Unique key for the asset
 * @returns Cached thumbnail data URL or null if not found
 */
export async function getCachedThumbnail(key: string): Promise<string | null> {
	if (isPhiDatabase()) return null;
	try {
		const database = await initDB();
		const cached = await database.get(STORE_NAME, key);
		return cached?.data || null;
	} catch (error) {
		console.warn(`Failed to retrieve cached thumbnail for ${key}:`, error);
		return null;
	}
}

/**
 * Cache a generated thumbnail in IndexedDB
 * @param key - Unique key for the asset
 * @param dataUrl - Generated thumbnail data URL
 * @param expirationDays - Cache expiration in days (default: 30)
 */
export async function cacheThumbnail(
	key: string,
	dataUrl: string,
	expirationDays = 30,
): Promise<void> {
	if (isPhiDatabase()) return;
	try {
		const database = await initDB();
		const expirationTime = Date.now() + expirationDays * 24 * 60 * 60 * 1000;
		await database.put(STORE_NAME, {
			key,
			data: dataUrl,
			timestamp: Date.now(),
			expiration: expirationTime,
		});
	} catch (error) {
		console.warn(`Failed to cache thumbnail for ${key}:`, error);
	}
}

/**
 * Clear expired thumbnails from cache
 */
export async function clearExpiredThumbnails(): Promise<void> {
	try {
		const database = await initDB();
		const allThumbnails = await database.getAll(STORE_NAME);
		const now = Date.now();
		for (const thumbnail of allThumbnails) {
			if (thumbnail.expiration && thumbnail.expiration < now)
				await database.delete(STORE_NAME, thumbnail.key);
		}
	} catch (error) {
		console.warn("Failed to clear expired thumbnails:", error);
	}
}

/**
 * Clear all the cache
 */
export async function clearAllCache(): Promise<void> {
	try {
		const database = await initDB();
		await database.clear(STORE_NAME);
	} catch (error) {
		console.warn("Failed to clear all thumbnails:", error);
	}
}

/**
 * Get cache stats (useful for debugging)
 */
export async function getCacheStats(): Promise<{
	total: number;
	expired: number;
	size: number;
}> {
	try {
		const database = await initDB();
		const allThumbnails = await database.getAll(STORE_NAME);
		const now = Date.now();
		let totalSize = 0;
		let expiredCount = 0;
		for (const thumbnail of allThumbnails) {
			if (thumbnail.expiration && thumbnail.expiration < now) expiredCount++;
			totalSize += thumbnail.data?.length || 0;
		}
		return {
			total: allThumbnails.length,
			expired: expiredCount,
			size: totalSize, // in bytes
		};
	} catch (error) {
		console.warn("Failed to get cache stats:", error);
		return { total: 0, expired: 0, size: 0 };
	}
}
