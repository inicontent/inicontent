/** A3 containment: legacy records are preserved by browserContainment migration.
 * Normal application code cannot read, replay, modify or discard quarantined work.
 */
type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * A single queued mutation that could not be sent to the remote API because
 * the device was offline (or the request failed transiently).
 */
export type PendingMutation = {
	/** unique id for this queued mutation */
	id: string;
	method: Exclude<HTTPMethod, "GET">;
	/** full API url, including protocol and host */
	url: string;
	/** request body (if any) — kept as raw JSON-safe data */
	body: Record<string, any> | string | null;
	/** request query params (if any) */
	params?: Record<string, any>;
	/** database slug scope */
	database: string;
	/** table slug scope (if applicable) */
	table: string;
	timestamp: number;
	retryCount: number;
	status: "pending" | "retrying" | "conflict";
	/** populated when status === 'conflict': what the server currently has */
	conflictData?: { local: any; server: any } | null;
	errorMessage?: string | null;
	kind?: "item" | "schema";
	/** Snapshot needed to resolve references even after a reload. */
	tables?: any[];
};

function disabled(): never {
	throw new Error("offlinePersistenceDisabled");
}
export async function enqueueMutation(
	_mutation: Omit<
		PendingMutation,
		"id" | "timestamp" | "retryCount" | "status"
	>,
): Promise<PendingMutation> {
	return disabled();
}
export async function getPendingMutations(): Promise<PendingMutation[]> {
	return [];
}
export async function getAllMutations(): Promise<PendingMutation[]> {
	return [];
}
export async function getMutationsByScope(
	_database: string,
	_table?: string,
): Promise<PendingMutation[]> {
	return [];
}
export async function removeMutation(_id: string): Promise<void> {
	disabled();
}
export async function markConflict(
	_id: string,
	_serverData: unknown,
	_errorMessage?: string,
): Promise<PendingMutation | undefined> {
	return disabled();
}
export async function incrementRetry(_id: string): Promise<void> {
	disabled();
}
export async function requeueMutation(
	_id: string,
	_body?: PendingMutation["body"],
): Promise<void> {
	disabled();
}
export async function getPendingCount(): Promise<number> {
	return 0;
}
export async function getConflictCount(): Promise<number> {
	return 0;
}
export async function getPendingCountByScope(
	_database: string,
	_table?: string,
): Promise<number> {
	return 0;
}
export async function getConflicts(): Promise<PendingMutation[]> {
	return [];
}
export async function clearAllMutations(): Promise<void> {
	disabled();
}
export async function getPendingCreates(
	_database: string,
	_table: string,
): Promise<Item[]> {
	return [];
}
export async function completeMutation(
	_mutation: PendingMutation,
	_realId?: string,
): Promise<void> {
	disabled();
}
