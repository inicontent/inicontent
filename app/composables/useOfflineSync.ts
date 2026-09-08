import {
	getConflicts,
	getPendingCount,
	getPendingMutations,
	incrementRetry,
	markConflict,
	removeMutation,
	requeueMutation,
} from "./useOfflineQueue";

type SyncResult = {
	id: string;
	method: string;
	url: string;
	status: "success" | "conflict" | "error" | "skipped";
	message?: string;
};

const MAX_RETRIES = 5;

/** Bound for a single mutation/conflict request so a hung request can never
 * block the sync loop forever (navigator.onLine can stay true even when the
 * device has no real route to the API). Generous enough that slow-but-working
 * API calls are NOT mistaken for offline failures. */
const REQUEST_TIMEOUT_MS = 30_000;

let initialized = false;

/**
 * Manages background sync of offline-queued mutations. On reconnect (or when
 * explicitly triggered) it drains the queue in order, re-sending each mutation
 * to the remote API. Conflicted writes are parked for manual resolution.
 *
 * Shared state is stored in Nuxt `useState` so every consumer (Header badge,
 * conflict drawer, etc.) observes the same values.
 */
export function useOfflineSync() {
	const isOnline = useState<boolean>("offline_isOnline", () =>
		typeof navigator === "undefined" ? true : navigator.onLine !== false,
	);
	const isSyncing = useState<boolean>("offline_isSyncing", () => false);
	const syncResults = useState<SyncResult[]>("offline_syncResults", () => []);
	const conflicts = useState<any[]>("offline_conflicts", () => []);
	const pendingCount = useState<number>("offline_pendingCount", () => 0);

	async function refreshCounts() {
		pendingCount.value = await getPendingCount();
		conflicts.value = await getConflicts();
	}

	/**
	 * Send a single queued mutation to the API.
	 * @returns true on success, 'conflict' on 409/4xx conflict, false on transient failure
	 */
	async function sendMutation(mutation: any): Promise<boolean | "conflict"> {
		const fetchOptions: Record<string, any> = {
			method: mutation.method,
			credentials: "include",
			timeout: REQUEST_TIMEOUT_MS,
		};
		if (mutation.method !== "DELETE") {
			fetchOptions.body = mutation.body ?? undefined;
		}
		if (mutation.params && Object.keys(mutation.params).length > 0) {
			fetchOptions.params = mutation.params;
		}

		try {
			const res = await $fetch(mutation.url, fetchOptions);
			// Some endpoints return a response with .code on conflict-like states
			if (res && typeof res === "object" && "code" in res) {
				const code = (res as any).code;
				if (code === 409 || code === "409" || code === "CONFLICT") {
					return "conflict";
				}
			}
			// A response means it worked — remove from queue.
			await removeMutation(mutation.id);
			return true;
		} catch (error: any) {
			const status = error?.response?.status ?? error?.status;
			// Treat 4xx (except network) as conflict, not retryable.
			if (status && status >= 400 && status < 500) {
				return "conflict";
			}
			// 5xx / network errors: retryable
			return false;
		}
	}

	async function syncPendingMutations(): Promise<SyncResult[]> {
		if (isSyncing.value) return syncResults.value;
		isSyncing.value = true;
		const results: SyncResult[] = [];

		try {
			const mutations = await getPendingMutations();
			if (mutations.length === 0) {
				return results;
			}

			// Nothing to do if the user is explicitly offline (e.g. "Sync now"
			// clicked while offline) — every request would fail. The online
			// event listener re-triggers sync automatically on reconnect.
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				return results;
			}

			for (const mutation of mutations) {
				// Stop if we've gone offline mid-sync
				if (typeof navigator !== "undefined" && !navigator.onLine) break;

				let outcome: boolean | "conflict" = false;
				let attempts = 0;
				while (attempts <= MAX_RETRIES) {
					outcome = await sendMutation(mutation);
					if (outcome === true || outcome === "conflict") break;
					await incrementRetry(mutation.id);
					attempts++;
					await new Promise((r) => setTimeout(r, 500 * Math.min(attempts, 4)));
				}

				if (outcome === true) {
					results.push({
						id: mutation.id,
						method: mutation.method,
						url: mutation.url,
						status: "success",
					});
				} else if (outcome === "conflict") {
					// Fetch current server value to present to the resolution UI.
					let serverData: any = null;
					try {
						const serverRes = await $fetch(mutation.url, {
							method: "GET",
							credentials: "include",
							timeout: REQUEST_TIMEOUT_MS,
						});
						serverData = serverRes;
					} catch {
						serverData = null;
					}
					await markConflict(mutation.id, serverData);
					results.push({
						id: mutation.id,
						method: mutation.method,
						url: mutation.url,
						status: "conflict",
					});
				} else {
					results.push({
						id: mutation.id,
						method: mutation.method,
						url: mutation.url,
						status: "error",
						message: "Max retries reached",
					});
				}
			}

			syncResults.value = results;
			return results;
		} catch (error) {
			// Never let an unexpected failure wedge the sync flag — the finally
			// below resets it, but log so we can trace what interrupted the sync.
			console.warn("[OfflineSync] Sync interrupted:", error);
			return results;
		} finally {
			// Always clear the flag so the UI can never show an endless spinner.
			isSyncing.value = false;

			// Refresh any cached Nuxt data so the UI shows the synced state.
			try {
				await refreshNuxtData();
			} catch (error) {
				console.warn("[OfflineSync] refreshNuxtData failed:", error);
			}
			try {
				await refreshCounts();
			} catch (error) {
				console.warn("[OfflineSync] refreshCounts failed:", error);
			}
		}
	}

	function initSync() {
		if (initialized) return;
		initialized = true;

		if (typeof window !== "undefined") {
			window.addEventListener("online", () => {
				isOnline.value = true;
				syncPendingMutations();
			});
			window.addEventListener("offline", () => {
				isOnline.value = false;
			});

			// Kick off the initial queue count (runs once, independent of any
			// component lifecycle so callers can invoke it anywhere).
			refreshCounts().then(() => {});
		}
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

// Convenience exports for components that only need conflict management
export async function resolveConflictKeepLocal(id: string) {
	await requeueMutation(id);
	// Immediately try to sync it
	const state = useOfflineSync();
	await state.syncPendingMutations();
}

export async function resolveConflictKeepServer(id: string) {
	await removeMutation(id);
}

/** Discard ALL local changes (server wins for everything). */
export async function discardAllConflicts() {
	const all = await getConflicts();
	for (const c of all) {
		await removeMutation(c.id);
	}
}
