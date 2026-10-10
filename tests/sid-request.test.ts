import { strict as assert } from "node:assert";
import { test } from "node:test";
import { rewriteSidRequest } from "../app/composables/sidRequest.ts";

const BASE = "https://app.inicontent.com/dashboard";

test("a delegated child session moves to the child headers, not Authorization", () => {
	// A tenant session presented on a platform route (billing) is a delegated
	// child session: it must not authenticate as the platform caller.
	const rewrite = rewriteSidRequest(
		"https://api.inicontent.com/inicontent/billing/subscription?chuo_sid=CHILD123",
		undefined,
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(rewrite.delegated, true);
	assert.equal(
		rewrite.input,
		"https://api.inicontent.com/inicontent/billing/subscription",
	);
	const headers = new Headers(rewrite.init?.headers);
	assert.equal(headers.get("authorization"), null);
	assert.equal(headers.get("x-inicontent-child-sid"), "CHILD123");
	assert.equal(headers.get("x-inicontent-child-db"), "chuo");
});

test("a platform session on a platform route stays in Authorization", () => {
	const rewrite = rewriteSidRequest(
		"https://api.inicontent.com/inicontent/auth/current?inicontent_sid=PLATFORM1",
		undefined,
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(rewrite.delegated, false);
	assert.equal(
		new Headers(rewrite.init?.headers).get("authorization"),
		"Bearer PLATFORM1",
	);
});

test("a tenant session on its own tenant route stays in Authorization", () => {
	const rewrite = rewriteSidRequest(
		"https://api.inicontent.com/chuo/pages?chuo_sid=OWN1",
		undefined,
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(rewrite.delegated, false);
	assert.equal(
		new Headers(rewrite.init?.headers).get("authorization"),
		"Bearer OWN1",
	);
});

test("a session id in a query never authenticates any more", () => {
	// Regression guard for removing `?{db}_sid=` acceptance from the API.
	const rewrite = rewriteSidRequest(
		"https://api.inicontent.com/inicontent/billing/pricing?chuo_sid=CHILD123",
		undefined,
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(
		rewrite.input,
		"https://api.inicontent.com/inicontent/billing/pricing",
	);
});

test("a single sid moves into a header and out of the URL", () => {
	const rewrite = rewriteSidRequest(
		"https://api.inicontent.com/chuo/assets/images?chuo_sid=SECRET123&locale=en",
		undefined,
		BASE,
	);
	assert.ok(rewrite, "rewrite expected");
	assert.equal(rewrite.sid, "SECRET123");
	assert.equal(rewrite.delegated, false);
	assert.equal(
		rewrite.input,
		"https://api.inicontent.com/chuo/assets/images?locale=en",
	);
	const headers = new Headers(rewrite.init?.headers);
	assert.equal(headers.get("authorization"), "Bearer SECRET123");
});

test("a relative request stays relative", () => {
	const rewrite = rewriteSidRequest(
		"/chuo/pages?chuo_sid=SECRET123&locale=en",
		{ credentials: "include" },
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(rewrite.input, "/chuo/pages?locale=en");
	assert.equal(
		new Headers(rewrite.init?.headers).get("authorization"),
		"Bearer SECRET123",
	);
	assert.equal(rewrite.init?.credentials, "include", "init is preserved");
});

test("ofetch params-style sids are already serialized into the URL", () => {
	// Components pass `params: { [`${slug}_sid`]: sid }`; ofetch turns that into
	// a query string before fetch is ever called, so this is what arrives.
	const rewrite = rewriteSidRequest(
		"https://api.inicontent.com/chuo/pages?where=%7B%7D&chuo_sid=SECRET123",
		{ credentials: "include", method: "POST" },
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(
		rewrite.input,
		"https://api.inicontent.com/chuo/pages?where=%7B%7D",
	);
	assert.equal(
		new Headers(rewrite.init?.headers).get("authorization"),
		"Bearer SECRET123",
	);
	assert.equal(rewrite.init?.method, "POST");
});

test("a Request object is rebuilt without the sid and keeps its method and body", async () => {
	const body = new Blob(["file-bytes"], { type: "text/plain" });
	const request = new Request(
		"https://api.inicontent.com/chuo/assets?chuo_sid=SECRET123",
		{ method: "PUT", body, headers: { "x-upload": "1" } },
	);
	const rewrite = rewriteSidRequest(request, undefined, BASE);
	assert.ok(rewrite);
	assert.ok(rewrite.input instanceof Request);
	const rebuilt = rewrite.input as Request;
	assert.equal(rebuilt.url, "https://api.inicontent.com/chuo/assets");
	assert.equal(rebuilt.method, "PUT");
	assert.equal(rebuilt.headers.get("authorization"), "Bearer SECRET123");
	assert.equal(rebuilt.headers.get("x-upload"), "1", "headers preserved");
	assert.equal(await rebuilt.text(), "file-bytes", "body preserved");
});

test("request without a sid is untouched", () => {
	assert.equal(
		rewriteSidRequest("https://api.inicontent.com/chuo/pages", undefined, BASE),
		undefined,
	);
	assert.equal(
		rewriteSidRequest(
			"https://api.inicontent.com/chuo/pages?locale=en",
			undefined,
			BASE,
		),
		undefined,
	);
	assert.equal(
		rewriteSidRequest(
			"https://api.inicontent.com/chuo/pages?chuo_sid=",
			undefined,
			BASE,
		),
		undefined,
		"empty sid is not a credential",
	);
});

test("a multi-sid request is never guessed at", () => {
	assert.equal(
		rewriteSidRequest(
			"https://api.inicontent.com/chuo/assets?chuo_sid=A&inicontent_sid=B",
			undefined,
			BASE,
		),
		undefined,
		"delegated calls keep the legacy query bridge",
	);
});

test("an Authorization header from the caller wins", () => {
	assert.equal(
		rewriteSidRequest(
			"https://api.inicontent.com/chuo/assets?chuo_sid=SECRET123",
			{ headers: { Authorization: "Bearer CALLER" } },
			BASE,
		),
		undefined,
	);
});

test("parameter names that merely resemble a session are not treated as one", () => {
	// The API matches `key.endsWith("_sid")`, so this is the matching shape.
	for (const query of [
		"sid=x",
		"session_id=y",
		"xsid=z",
		"sid_=x",
		"database_sid_extra=y",
	]) {
		assert.equal(
			rewriteSidRequest(
				`https://api.inicontent.com/chuo/assets?${query}`,
				undefined,
				BASE,
			),
			undefined,
			query,
		);
	}
	// And a real session name is still matched.
	assert.ok(
		rewriteSidRequest(
			"https://api.inicontent.com/chuo/assets?previous_sid=abc",
			undefined,
			BASE,
		),
	);
});

test("a URL instance and a hash are handled", () => {
	const rewrite = rewriteSidRequest(
		new URL("https://api.inicontent.com/chuo/pages?chuo_sid=SECRET#top"),
		undefined,
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(rewrite.input, "https://api.inicontent.com/chuo/pages#top");
});

test("malformed input falls through instead of throwing", () => {
	assert.equal(rewriteSidRequest("http://", undefined, BASE), undefined);
	assert.equal(rewriteSidRequest("::::", undefined, BASE), undefined);
	assert.equal(rewriteSidRequest("", undefined, BASE), undefined);
});
