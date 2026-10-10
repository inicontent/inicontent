import { purgeBrowserCopies } from "./browserContainment";
/** A3: thumbnails may be generated in memory, but never read/written on disk. */
export async function getCachedThumbnail(_key: string): Promise<string | null> {
	return null;
}
export async function cacheThumbnail(
	_key: string,
	_dataUrl: string,
	_expirationDays = 30,
): Promise<void> {}
export async function clearExpiredThumbnails(): Promise<void> {
	await purgeBrowserCopies();
}
export async function clearAllCache(): Promise<void> {
	await purgeBrowserCopies();
}
export async function getCacheStats(): Promise<{
	total: number;
	expired: number;
	size: number;
}> {
	return { total: 0, expired: 0, size: 0 };
}
