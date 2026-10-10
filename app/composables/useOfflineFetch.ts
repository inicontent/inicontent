/** Online-only requests during A3 containment. Failed writes remain failures. */
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

export function useOfflineFetch<T = unknown>() {
	const config = useRuntimeConfig();
	async function request(
		pathOrUrl: string,
		options: Record<string, any> = {},
	): Promise<T> {
		const url = /^https?:\/\//i.test(pathOrUrl)
			? pathOrUrl
			: `${useApiBase()}${pathOrUrl}`;
		const { offline: _metadata, ...fetchOptions } = options;
		// Legacy temporary IDs must never be sent as ordinary server records.
		if (
			url.includes("pending__") ||
			JSON.stringify(options.body ?? null).includes("pending__")
		)
			throw new Error("offlinePersistenceDisabled");
		return await $fetch<T>(url, {
			...fetchOptions,
			cache: "no-store",
			retry: 0,
			timeout: options.timeout ?? 30_000,
		} as any);
	}
	return { request, isNetworkError };
}
export function isOfflineQueuedResult<T>(
	value: T | { __offlineQueued: true; queuedId?: string } | null | undefined,
): value is { __offlineQueued: true; queuedId?: string } {
	return !!value && typeof value === "object" && "__offlineQueued" in value;
}
