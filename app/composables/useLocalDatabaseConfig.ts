/**
 * Local persistence of the database configuration (metadata + table schemas).
 *
 * The middleware normally loads this from the API (served by the service
 * worker's config cache when offline). Persisting a copy in localStorage adds
 * a second, independent fallback: even when the SW cache is evicted or a
 * partial cache state is served, the app can still boot with the real database
 * config purely from local storage — i.e. the app stays accessible offline.
 */

const STORAGE_KEY_PREFIX = "inicontent:db-config:";
/** Guard against pathological sizes (schemas can be large, but not this large). */
const MAX_STORAGE_BYTES = 2_500_000;

export function saveDatabaseConfigLocally(slug: string, database?: Database) {
	if (typeof localStorage === "undefined" || !database || !slug) return;
	try {
		const serialized = JSON.stringify(database);
		if (serialized.length > MAX_STORAGE_BYTES) {
			console.warn(
				"[LocalDatabaseConfig] config too large to persist locally:",
				serialized.length,
			);
			return;
		}
		localStorage.setItem(STORAGE_KEY_PREFIX + slug, serialized);
	} catch (error) {
		console.warn("[LocalDatabaseConfig] Failed to persist config:", error);
	}
}

export function loadDatabaseConfigLocally(slug: string): Database | undefined {
	if (typeof localStorage === "undefined" || !slug) return undefined;
	try {
		const raw = localStorage.getItem(STORAGE_KEY_PREFIX + slug);
		if (!raw) return undefined;
		return JSON.parse(raw) as Database;
	} catch (error) {
		console.warn("[LocalDatabaseConfig] Failed to read config:", error);
		return undefined;
	}
}

export function clearDatabaseConfigLocally(slug: string) {
	if (typeof localStorage === "undefined" || !slug) return;
	try {
		localStorage.removeItem(STORAGE_KEY_PREFIX + slug);
	} catch {
		// ignore
	}
}
