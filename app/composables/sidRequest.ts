/**
 * Move tenant session IDs out of URLs into the `Authorization` header.
 *
 * Pure, framework-free and dependency-free so it can be unit-tested outside a
 * browser: everything it needs (URL, Headers, Request) is a platform global.
 *
 * Only a single `*_sid` query parameter is rewritten. A request carrying
 * several is a delegated/multi-tenant call, which must not be guessed at, so
 * it is passed through untouched. An `Authorization` header supplied by the
 * caller always wins.
 */

export interface SidRewrite {
	input: string | URL | Request;
	init?: RequestInit;
	sid: string;
	/** Where the session ended up: own-session `Authorization`, or the delegated child header. */
	delegated: boolean;
}

/** Header carrying a delegated child session on a platform route. */
export const CHILD_SESSION_HEADER = "x-inicontent-child-sid";
/** Header naming the tenant that delegated session belongs to. */
export const CHILD_DATABASE_HEADER = "x-inicontent-child-db";

function requestURL(
	input: string | URL | Request,
	base: string,
): URL | undefined {
	try {
		if (typeof input === "string") return new URL(input, base);
		if (input instanceof URL) return input;
		if (typeof Request !== "undefined" && input instanceof Request)
			return new URL(input.url, base);
	} catch {
		return undefined;
	}
}

function singleSid(url: URL): [string, string] | undefined {
	let found: [string, string] | undefined;
	for (const [key, value] of url.searchParams.entries()) {
		if (!key.endsWith("_sid") || !value) continue;
		// Ambiguous: more than one session parameter, do not guess.
		if (found !== undefined) return undefined;
		found = [key, value];
	}
	return found;
}

function cleanPath(url: URL, base: string): string {
	const path = `${url.pathname}${url.search}${url.hash}`;
	try {
		// Keep relative requests relative so same-origin semantics are kept.
		return new URL(path, base).href === url.href ? path : url.href;
	} catch {
		return url.href;
	}
}

function headerValue(
	init: RequestInit | undefined,
	name: string,
): string | null {
	if (!init?.headers) return null;
	try {
		return new Headers(init.headers).get(name);
	} catch {
		return null;
	}
}

export function rewriteSidRequest(
	input: string | URL | Request,
	init: RequestInit | undefined,
	base: string,
): SidRewrite | undefined {
	const url = requestURL(input, base);
	if (!url) return undefined;
	const sid = singleSid(url);
	if (!sid) return undefined;
	const [key, value] = sid;

	const existing =
		headerValue(init, "authorization") ??
		(input instanceof Request ? input.headers.get("authorization") : null);
	if (existing) return undefined;

	url.searchParams.delete(key);
	const target = cleanPath(url, base);

	// Which header? A session whose own slug matches the route's database is
	// the caller's own session and belongs in `Authorization`. On a platform
	// route (`/inicontent/...`) a session belonging to another tenant is a
	// delegated child session: it still must not travel in a URL, so it moves
	// to the child-session headers the API resolves for owner-to-tenant access.
	const routeDatabase = url.pathname.split("/").filter(Boolean)[0];
	const ownSlug = key.slice(0, -"_sid".length);
	const delegated = ownSlug !== routeDatabase;
	const headers = new Headers(
		typeof input === "string" || input instanceof URL
			? init?.headers
			: input.headers,
	);
	if (delegated) {
		headers.set(CHILD_SESSION_HEADER, value);
		headers.set(CHILD_DATABASE_HEADER, ownSlug);
	} else {
		headers.set("authorization", `Bearer ${value}`);
	}

	if (typeof input === "string" || input instanceof URL) {
		return { input: target, init: { ...init, headers }, sid: value, delegated };
	}

	// A Request object: copy it onto the cleaned URL, keeping its headers.
	const request = new Request(target, {
		method: input.method,
		headers,
		body: input.body,
		// A streamed body requires the duplex hint in every engine.
		duplex: input.body ? "half" : undefined,
		credentials: input.credentials,
		cache: input.cache,
		redirect: input.redirect,
		referrer: input.referrer,
		referrerPolicy: input.referrerPolicy,
		integrity: input.integrity,
		keepalive: input.keepalive,
		signal: input.signal,
		mode: input.mode,
	});
	return { input: request, init: undefined, sid: value, delegated };
}
