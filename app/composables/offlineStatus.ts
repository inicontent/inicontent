/**
 * Visibility rule for the header's sync status button.
 *
 * The button is a network/sync affordance and nothing else: it appears only
 * when the app is offline, a sync is running, or changes/conflicts are still
 * waiting. An available app update or an install prompt deliberately does NOT
 * count — those get their own button (components/Offline/PwaStatus.vue), so a
 * background service-worker update can never make a "sync" button show up
 * when there is nothing to sync.
 */
export function shouldShowSyncStatus({
	isOnline,
	isSyncing,
	pendingCount,
	conflictCount,
}: {
	isOnline: boolean;
	isSyncing: boolean;
	pendingCount: number;
	conflictCount: number;
}): boolean {
	return !isOnline || isSyncing || pendingCount > 0 || conflictCount > 0;
}