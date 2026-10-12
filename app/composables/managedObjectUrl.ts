/**
 * C2a client integration — Blob object URL lifecycle.
 *
 * An object URL keeps its Blob reachable for the lifetime of the document.
 * Without explicit revocation, a preview or download URL created for one user
 * survives component teardown and, across a session change, stays a live handle
 * to the previous user's media. Every in-memory object URL is created through a
 * scope here so it can be revoked on disposal and on a session boundary.
 */

type ObjectUrlApi = {
	createObjectURL: (blob: Blob) => string;
	revokeObjectURL: (url: string) => void;
};

export type ObjectUrlScope = {
	/** Create a tracked object URL owned by this scope. */
	create: (blob: Blob) => string;
	/** Revoke one URL if this scope still owns it. Idempotent. */
	release: (url: string) => void;
	/** Revoke every URL this scope created. Idempotent. */
	releaseAll: () => void;
};

/** `undefined` = use the platform; `null` = force "unsupported" (tests). */
let overrideApi: ObjectUrlApi | null | undefined;

/** Test seam. Pass `undefined` to restore the platform implementation. */
export function setObjectUrlApi(api?: ObjectUrlApi | null): void {
	overrideApi = api;
}

function currentApi(): ObjectUrlApi | null {
	if (overrideApi !== undefined) return overrideApi;
	const url = (globalThis as { URL?: Partial<ObjectUrlApi> }).URL;
	return url &&
		typeof url.createObjectURL === "function" &&
		typeof url.revokeObjectURL === "function"
		? (url as ObjectUrlApi)
		: null;
}

const scopeUrls = new Map<ObjectUrlScope, Set<string>>();

export function createObjectUrlScope(): ObjectUrlScope {
	const urls = new Set<string>();
	const scope: ObjectUrlScope = {
		create(blob) {
			const api = currentApi();
			if (!api) throw new Error("objectUrlUnsupported");
			const url = api.createObjectURL(blob);
			urls.add(url);
			return url;
		},
		release(url) {
			if (!urls.delete(url)) return;
			currentApi()?.revokeObjectURL(url);
			if (!urls.size) scopeUrls.delete(scope);
		},
		releaseAll() {
			if (!scopeUrls.has(scope)) return;
			const api = currentApi();
			for (const url of urls) api?.revokeObjectURL(url);
			urls.clear();
			scopeUrls.delete(scope);
		},
	};
	scopeUrls.set(scope, urls);
	return scope;
}

/** Revoke every URL from every scope — call on a session boundary. */
export function releaseAllObjectUrls(): void {
	for (const scope of [...scopeUrls.keys()]) scope.releaseAll();
}

/** Number of live tracked URLs. Used by tests and diagnostics. */
export function managedObjectUrlCount(): number {
	let count = 0;
	for (const urls of scopeUrls.values()) count += urls.size;
	return count;
}
