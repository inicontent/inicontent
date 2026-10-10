import type { PendingMutation } from "./useOfflineQueue";

let initialized = false;
/** Connectivity status only while persisted work is quarantined. */
export function useOfflineSync() {
	const isOnline = useState<boolean>(
		"offline_isOnline",
		() => typeof navigator === "undefined" || navigator.onLine !== false,
	);
	const isSyncing = useState<boolean>("offline_isSyncing", () => false);
	const syncResults = useState<unknown[]>("offline_syncResults", () => []);
	const conflicts = useState<PendingMutation[]>("offline_conflicts", () => []);
	const pendingCount = useState<number>("offline_pendingCount", () => 0);
	async function refreshCounts() {
		pendingCount.value = 0;
		conflicts.value = [];
	}
	async function syncPendingMutations(): Promise<never> {
		throw new Error("offlinePersistenceDisabled");
	}
	function initSync() {
		if (initialized || typeof window === "undefined") return;
		initialized = true;
		window.addEventListener("online", () => {
			isOnline.value = true;
		});
		window.addEventListener("offline", () => {
			isOnline.value = false;
		});
		void refreshCounts();
	}
	return {
		isOnline,
		isSyncing,
		syncResults,
		conflicts,
		pendingCount,
		syncPendingMutations,
		refreshCounts,
		initSync,
	};
}
export async function resolveConflictKeepLocal(
	_id: string,
	_body?: PendingMutation["body"],
): Promise<never> {
	throw new Error("offlinePersistenceDisabled");
}
export async function resolveConflictKeepServer(_id: string): Promise<never> {
	throw new Error("offlinePersistenceDisabled");
}
