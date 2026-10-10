/** Cached API rows and quarantined mutations must never be used as a read fallback. */
export async function getOfflineItem(
	_database: string,
	_table: string,
	_id: string,
	_itemUrl: string,
): Promise<Item | undefined> {
	return undefined;
}
