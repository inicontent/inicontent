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

function requestHeaders(
	input: string | URL | Request,
	init: RequestInit | undefined,
): HeadersInit | undefined {
	return typeof input === "string" || input instanceof URL
		? init?.headers
		: input.headers;
}

function materialize(
	input: string | URL | Request,
	init: RequestInit | undefined,
	headers: Headers,
	target: string,
	sid: string,
	delegated: boolean,
): SidRewrite {
	if (typeof input === "string" || input instanceof URL) {
		return { input: target, init: { ...init, headers }, sid, delegated };
	}
	// A Request object: copy it onto the cleaned URL, keeping its headers.
	// `duplex` is part of the fetch spec for streamed bodies but the DOM
	// `RequestInit` type lags behind, so declare it on the options object.
	const requestInit: RequestInit & { duplex?: "half" | "full" } = {
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
	};
	const request = new Request(target, requestInit);
	return { input: request, init: undefined, sid, delegated };
}

/**
 * Rewrite a request's session handling at the network boundary.
 *
 * `regionOrigins` are the **secondary** region API origins this deployment
 * knows about. The main-region platform session (`inicontent_sid`) is removed
 * from any request headed to them — before it can be moved into an
 * `Authorization` header — because a secondary region must never receive the
 * main region's credential. The region authenticates with its own host-only
 * regional session cookie instead, which `credentials: "include"` sends.
 */
export function rewriteSidRequest(
	input: string | URL | Request,
	init: RequestInit | undefined,
	base: string,
	regionOrigins: readonly string[] = [],
): SidRewrite | undefined {
	const url = requestURL(input, base);
	if (!url) return undefined;

	let strippedMain = false;
	if (
		regionOrigins.includes(url.origin) &&
		url.searchParams.has("inicontent_sid")
	) {
		url.searchParams.delete("inicontent_sid");
		strippedMain = true;
	}

	const sid = singleSid(url);

	if (!sid) {
		if (!strippedMain) return undefined;
		// Nothing to authenticate with; hand back the cleaned request so the
		// main session still leaves the URL.
		return materialize(
			input,
			init,
			new Headers(requestHeaders(input, init)),
			cleanPath(url, base),
			"",
			false,
		);
	}
	const [key, value] = sid;

	const existing =
		headerValue(init, "authorization") ??
		(input instanceof Request ? input.headers.get("authorization") : null);
	// A caller-supplied Authorization header wins — but a stripped main session
	// must still leave the URL, so return the cleaned request rather than a
	// pass-through.
	if (existing && !strippedMain) return undefined;

	const headers = new Headers(requestHeaders(input, init));
	if (existing) {
		return materialize(input, init, headers, cleanPath(url, base), "", false);
	}

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
	if (delegated) {
		headers.set(CHILD_SESSION_HEADER, value);
		headers.set(CHILD_DATABASE_HEADER, ownSlug);
	} else {
		headers.set("authorization", `Bearer ${value}`);
	}

	return materialize(input, init, headers, target, value, delegated);
}
