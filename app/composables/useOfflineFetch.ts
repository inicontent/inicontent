import { isValidID } from "inibase/utils";
import { mapOfflineReferences, temporaryReferences } from "./offlineReferences";
import { enqueueMutation, getAllMutations } from "./useOfflineQueue";

/** Bound for a single request so offline/hung connections fail fast instead of
 * spinning the loading UI forever. Set high enough that slow-but-working API
 * calls are not mistaken for offline failures. */
const REQUEST_TIMEOUT_MS = 30_000;

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type OfflineFetchOptions = {
	/** database slug (used for queue scoping) */
	database?: string;
	/** table slug (used for queue scoping) */
	table?: string;
	/** if true, this is a read-only request and should NOT be queued — it will just throw */
	readonly?: boolean;
	kind?: "item" | "schema";
	tables?: any[];
};

/**
 * Determine whether a thrown fetch error is caused by a network-level problem
 * (no connectivity) rather than a server/4xx/5xx error that we must propagate.
 */
export function isNetworkError(error: unknown): boolean {
	if (!error) return false;
	const e = error as any;
	// ofetch/nuxt fetch errors wrap the cause
	if (e?.cause) {
		if (e.cause.name === "FetchError" || e.cause.name === "TypeError")
			return true;
		if (
			e.cause.code === "ECONNREFUSED" ||
			e.cause.code === "ENOTFOUND" ||
			e.cause.code === "ECONNRESET" ||
			e.cause.code === "UND_ERR_CONNECT_TIMEOUT"
		)
			return true;
		// ofetch request timeout / user abort — treat the same as a network
		// failure so timed-out mutations get queued instead of lost.
		if (e.cause.name === "TimeoutError" || e.cause.name === "AbortError")
			return true;
	}
	if (e?.name === "TypeError") return true;
	if (typeof e?.message === "string" && e.message.includes("[TimeoutError]"))
		return true;
	if (e?.code && ["ECONNREFUSED", "ENOTFOUND", "ECONNRESET"].includes(e.code))
		return true;
	// Message-based detection — wrappers on different platforms (Chrome/Safari/
	// ofetch) sometimes only expose the failure through the message text.
	const message = `${e?.message ?? ""} ${e?.cause?.message ?? ""}`;
	if (
		/(Failed to fetch|Load failed|NetworkError|Network request failed|Internet connection appears to be offline|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|ERR_NETWORK_|ERR_ABORTED|socket hang up|fetch failed|getaddrinfo|network unreachable)/i.test(
			message,
		)
	)
		return true;
	// Offline navigator check as a fallback
	if (typeof navigator !== "undefined" && navigator.onLine === false)
		return true;
	return false;
}

/**
 * A failed request can also be a "junk" response — e.g. the device is on a
 * network that answers every request with an HTML stub (captive portal,
 * offline/local proxy, DNS-hijack page). The request technically got a
 * response, but it's not the JSON the API would return, so it must be treated
 * like a network failure (silent fallback) rather than a real server error.
 */
export function isJunkResponse(error: unknown): boolean {
	if (!error) return false;
	const e = error as any;
	// ofetch stores the raw response body in `data` when parsing fails.
	const data = e?.data ?? e?.cause?.data;
	if (typeof data === "string" && /^\s*</.test(data)) return true;
	// The response object (headers) is exposed on the FetchError or its cause.
	const response = e?.response ?? e?.cause?.response;
	if (!response || typeof response !== "object") return false;
	try {
		const contentType =
			typeof response.headers?.get === "function"
				? (response.headers.get("content-type") ?? "")
				: "";
		return /text\/html/i.test(contentType);
	} catch {
		return false;
	}
}

/**
 * HTTP methods considered mutations — these get queued when they fail with a
 * network error and the app is offline.
 */
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Offline-aware wrapper around Nuxt `$fetch`.
 *
 * - For GET requests it behaves exactly like $fetch but throws a typed error
 *   the caller can catch (so UI still knows it failed).
 * - For mutation requests (POST/PUT/PATCH/DELETE) it enqueues the request into
 *   the offline queue when a network error occurs, so changes are not lost and
 *   can be synced later.
 *
 * Returns an object describing what happened so callers can react (e.g. show a
 * toast whether the write was queued).
 */
export function useOfflineFetch<T = unknown>() {
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;
	const databaseState = useState<Database>("database");

	function buildUrl(
		path: string,
		localDatabase?: string,
	): { url: string; scopeDatabase: string } {
		// path may be a full URL or a relative API path/full apiBase URL
		if (/^https?:\/\//i.test(path)) {
			return { url: path, scopeDatabase: localDatabase ?? "" };
		}
		return {
			url: `${apiBase}${path}`,
			scopeDatabase: localDatabase ?? "",
		};
	}

	/**
	 * Perform an offline-aware request.
	 *
	 * @param pathOrUrl  relative path (e.g. "db/table/123") or full URL
	 * @param options    ofetch options merged with offline metadata
	 */
	async function request(
		pathOrUrl: string,
		options: {
			method?: string;
			body?: any;
			params?: Record<string, any>;
			query?: Record<string, any>;
			credentials?: RequestCredentials;
			offline?: OfflineFetchOptions;
			[key: string]: any;
		} = {},
	): Promise<T> {
		const method = (options.method ?? "GET").toUpperCase();
		const offline = options.offline ?? {};
		const { url, scopeDatabase } = buildUrl(pathOrUrl, offline.database);

		const isMutation = MUTATION_METHODS.has(method) && !offline.readonly;
		async function queue() {
			const queued = await enqueueMutation({
				method: method as Exclude<HTTPMethod, "GET">,
				url,
				body: options.body ?? null,
				params: options.params ?? options.query,
				database: offline.database ?? scopeDatabase ?? "inicontent",
				table: offline.table ?? "",
				kind: offline.kind ?? "item",
				tables: JSON.parse(
					JSON.stringify(offline.tables ?? databaseState.value?.tables ?? []),
				),
			});
			await useOfflineSync().refreshCounts();
			return { __offlineQueued: true, queuedId: queued.id } as unknown as T;
		}
		let unresolvedReference =
			temporaryReferences(options.body).length > 0 || url.includes("pending__");
		if (isMutation && offline.kind !== "schema") {
			const schema =
				(offline.tables ?? databaseState.value?.tables)?.find(
					(table) => table.slug === offline.table,
				)?.schema ?? [];
			await mapOfflineReferences(options.body, schema, async (value) => {
				if (
					typeof value === "string" &&
					!isValidID(value) &&
					!/^\d+$/.test(value)
				)
					unresolvedReference = true;
				return value;
			});
		}
		// Once a queue exists, new writes join it until the user chooses to sync.
		if (
			isMutation &&
			typeof window !== "undefined" &&
			(navigator.onLine === false ||
				unresolvedReference ||
				(await getAllMutations()).length > 0)
		)
			return queue();
		try {
			const { offline: _metadata, ...fetchOptions } = options;
			return await $fetch<T>(url, {
				...fetchOptions,
				retry: 0,
				timeout: options.timeout ?? REQUEST_TIMEOUT_MS,
			} as any);
		} catch (error) {
			if (isMutation && (isNetworkError(error) || isJunkResponse(error)))
				return queue();
			throw error;
		}
	}

	return { request, isNetworkError };
}

/**
 * Type guard: is this a result that was queued for a later sync instead of being
 * applied against the live server?
 */
export function isOfflineQueuedResult<T>(
	value: T | { __offlineQueued: true; queuedId?: string } | null | undefined,
): value is { __offlineQueued: true; queuedId?: string } {
	return !!value && typeof value === "object" && "__offlineQueued" in value;
}
