import Inison from "inison";
import { nextOfflineMutation } from "./offlineOrder";
import {
	mapOfflineReferences,
	resolveOfflineReference,
	temporaryReferences,
} from "./offlineReferences";
import {
	loadDatabaseConfigLocally,
	saveDatabaseConfigLocally,
} from "./useLocalDatabaseConfig";
import {
	completeMutation,
	getAllMutations,
	getConflicts,
	getPendingCount,
	markConflict,
	type PendingMutation,
	removeMutation,
	requeueMutation,
} from "./useOfflineQueue";

type SyncResult = {
	id: string;
	method: string;
	url: string;
	status: "success" | "conflict" | "error";
	message?: string;
};
const REQUEST_TIMEOUT_MS = 30_000;
let initialized = false;

/** Manual replay only. Every failure remains a durable barrier until edited or discarded. */
export function useOfflineSync() {
	const isOnline = useState<boolean>(
		"offline_isOnline",
		() => typeof navigator === "undefined" || navigator.onLine !== false,
	);
	const isSyncing = useState<boolean>("offline_isSyncing", () => false);
	const syncResults = useState<SyncResult[]>("offline_syncResults", () => []);
	const conflicts = useState<PendingMutation[]>("offline_conflicts", () => []);
	const pendingCount = useState<number>("offline_pendingCount", () => 0);
	const database = useState<Database>("database");

	async function refreshCounts() {
		pendingCount.value = await getPendingCount();
		conflicts.value = await getConflicts();
	}

	async function sendMutation(
		mutation: PendingMutation,
		queue: PendingMutation[],
	) {
		const tables = mutation.tables ?? database.value?.tables ?? [];
		let body = mutation.body;
		if (mutation.kind !== "schema") {
			body = await mapOfflineReferences(
				body,
				tables.find((table) => table.slug === mutation.table)?.schema ?? [],
				async (value, field) => {
					const url = new URL(mutation.url);
					const parts = url.pathname.split("/");
					const index = parts.lastIndexOf(mutation.database);
					if (index < 0) throw new Error("offlineInvalidReference");
					url.pathname = [...parts.slice(0, index + 1), field.table].join("/");
					return resolveOfflineReference(
						value,
						field,
						tables.find((table) => table.slug === field.table),
						(where, page) =>
							$fetch(url.href, {
								credentials: "include",
								retry: 0,
								timeout: REQUEST_TIMEOUT_MS,
								params: {
									...mutation.params,
									return: undefined,
									where,
									options: Inison.stringify({ page, perPage: 100 }),
								},
							}),
						getPath,
					);
				},
			);
		}
		const response: any = await $fetch(mutation.url, {
			method: mutation.method,
			credentials: "include",
			retry: 0,
			timeout: REQUEST_TIMEOUT_MS,
			body: mutation.method === "DELETE" ? undefined : (body ?? undefined),
			params: {
				...mutation.params,
				...(mutation.method === "POST" ? { return: true } : {}),
			},
		});
		if (
			!response ||
			typeof response !== "object" ||
			response.result == null ||
			response.result === false ||
			response.code === "CONFLICT" ||
			Number(response.code) >= 400
		) {
			throw new Error(response?.message || "offlineSyncFailed");
		}
		const realId = response.result?.id;
		const temp = `pending__${mutation.id}`;
		if (
			mutation.method === "POST" &&
			!realId &&
			queue.some(
				(entry) =>
					temporaryReferences(entry.body).includes(temp) ||
					entry.url.includes(temp),
			)
		) {
			throw new Error("offlineMissingCreatedId");
		}
		if (
			mutation.kind === "schema" &&
			database.value?.slug === mutation.database &&
			response.result &&
			typeof response.result === "object"
		) {
			const index = database.value.tables?.findIndex(
				(table) =>
					table.slug === mutation.table || table.slug === response.result.slug,
			);
			if (index !== undefined && index >= 0 && database.value.tables) {
				database.value.tables[index] = response.result;
				saveDatabaseConfigLocally(mutation.database, database.value);
			}
		}
		await completeMutation(
			mutation,
			realId == null ? undefined : String(realId),
		);
	}

	async function drain(): Promise<SyncResult[]> {
		const results: SyncResult[] = [];
		try {
			while (isOnline.value && navigator.onLine !== false) {
				const queue = await getAllMutations();
				let mutation = queue[0];
				if (!mutation) break;
				try {
					mutation = nextOfflineMutation(queue)!;
					if (mutation.status === "conflict") break;
					await sendMutation(mutation, queue);
					results.push({
						id: mutation.id,
						method: mutation.method,
						url: mutation.url,
						status: "success",
					});
				} catch (error: any) {
					const message =
						error?.data?.message ?? error?.message ?? "offlineSyncFailed";
					await markConflict(mutation.id, error?.data ?? null, message);
					results.push({
						id: mutation.id,
						method: mutation.method,
						url: mutation.url,
						status: "error",
						message,
					});
					break;
				}
			}
			return results;
		} finally {
			syncResults.value = results;
			isSyncing.value = false;
			await refreshCounts();
			if (results.some((result) => result.status === "success"))
				await refreshNuxtData();
		}
	}

	async function syncPendingMutations(): Promise<SyncResult[]> {
		if (isSyncing.value || typeof window === "undefined")
			return syncResults.value;
		isSyncing.value = true;
		// A second open tab must not replay the same queue concurrently.
		try {
			if (navigator.locks)
				return await navigator.locks.request("inicontent-offline-sync", drain);
			return await drain();
		} finally {
			isSyncing.value = false;
		}
	}

	function initSync() {
		if (initialized || typeof window === "undefined") return;
		initialized = true;
		isOnline.value = navigator.onLine !== false;
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
	id: string,
	body?: PendingMutation["body"],
) {
	const state = useOfflineSync();
	if (state.isSyncing.value) return;
	await requeueMutation(id, body);
	await state.syncPendingMutations();
	await state.refreshCounts();
}

export async function resolveConflictKeepServer(id: string) {
	const state = useOfflineSync();
	if (state.isSyncing.value) return;
	const database = useState<Database>("database");
	const mutation = (await getAllMutations()).find((entry) => entry.id === id);
	await removeMutation(id);
	if (
		mutation?.kind === "schema" &&
		database.value?.slug === mutation.database
	) {
		const saved = loadDatabaseConfigLocally(mutation.database)?.tables?.find(
			(table) => table.slug === mutation.table,
		);
		const index = database.value.tables?.findIndex(
			(table) =>
				table.slug === mutation.table ||
				table.slug === (mutation.body as any)?.slug,
		);
		if (saved && index !== undefined && index >= 0 && database.value.tables)
			database.value.tables[index] = saved;
	}
	await state.syncPendingMutations();
	await state.refreshCounts();
}
