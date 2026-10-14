/**
 * M3 — regional session transport on the client.
 *
 * The main-region platform session must never reach a secondary region. These
 * are the pure rules `zzz-sid-header.client.ts` applies at the `window.fetch`
 * boundary, plus the region-origin collection and the explicit-region deep-link
 * parse. Tested directly so the boundary cannot silently regress into leaking
 * the main session or accepting an unvalidated region code.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	apiUrlOrigin,
	collectRegionOrigins,
	regionCodeFromQuery,
} from "../app/composables/region.ts";
import { rewriteSidRequest } from "../app/composables/sidRequest.ts";

const BASE = "https://app.inicontent.com/dashboard";
const MAIN = "https://api.inicontent.com";
const SA = "https://sa.api.inicontent.com";
const AE = "https://ae.api.inicontent.com";

const catalog = [
	{
		code: "main",
		name: "Main",
		apiUrl: MAIN,
		enabled: true,
		acceptNewDatabases: true,
	},
	{
		code: "sa-1",
		name: "Saudi Arabia",
		apiUrl: SA,
		enabled: true,
		acceptNewDatabases: true,
	},
	{
		code: "ae-1",
		name: "UAE",
		apiUrl: `${AE}/`,
		enabled: true,
		acceptNewDatabases: true,
	},
];

test("the main-region session is stripped, never forwarded, to a secondary region", () => {
	const rewrite = rewriteSidRequest(
		`${SA}/inicontent/databases?inicontent_sid=MAINSID`,
		undefined,
		BASE,
		[SA],
	);
	assert.ok(rewrite, "a rewrite is returned so the URL is cleaned");
	assert.equal(rewrite.input, `${SA}/inicontent/databases`);
	// It must not become an Authorization header on the region either.
	const headers = new Headers(rewrite.init?.headers);
	assert.equal(headers.get("authorization"), null);
	assert.equal(rewrite.sid, "");
});

test("the main-region session still authenticates on the main origin", () => {
	const rewrite = rewriteSidRequest(
		`${MAIN}/inicontent/databases?inicontent_sid=MAINSID`,
		undefined,
		BASE,
		[SA, AE],
	);
	assert.ok(rewrite);
	assert.equal(rewrite.input, `${MAIN}/inicontent/databases`);
	assert.equal(
		new Headers(rewrite.init?.headers).get("authorization"),
		"Bearer MAINSID",
	);
});

test("a region request without the main session is left untouched", () => {
	assert.equal(
		rewriteSidRequest(`${SA}/inicontent/regions?locale=en`, undefined, BASE, [
			SA,
		]),
		undefined,
	);
});

test("an empty region-origin list preserves the original rewriting", () => {
	// No region context (default region) behaves exactly as before: a single
	// session moves to Authorization. This is the non-breaking default.
	const rewrite = rewriteSidRequest(
		`${MAIN}/inicontent/auth/current?inicontent_sid=PLATFORM1`,
		undefined,
		BASE,
	);
	assert.ok(rewrite);
	assert.equal(
		new Headers(rewrite.init?.headers).get("authorization"),
		"Bearer PLATFORM1",
	);
});

test("region origins exclude the main origin and dedupe trailing paths", () => {
	const origins = collectRegionOrigins({
		selection: { code: "sa-1", apiUrl: `${SA}/` },
		catalog,
		mainApiUrl: MAIN,
	}).sort();
	assert.deepEqual(origins, [AE, SA]);
});

test("region origins never treat a missing catalog as permission to leak", () => {
	// With nothing known, the only excluded origin is the main one; the active
	// selection still contributes.
	assert.deepEqual(
		collectRegionOrigins({
			selection: { code: "sa-1", apiUrl: SA },
			catalog: [],
			mainApiUrl: MAIN,
		}),
		[SA],
	);
	assert.deepEqual(collectRegionOrigins({ catalog: [], mainApiUrl: MAIN }), []);
});

test("an explicit deep-link region code is normalized and validated", () => {
	assert.equal(regionCodeFromQuery({ region: "SA-1" }), "sa-1");
	assert.equal(regionCodeFromQuery({ region: "  main  " }), "main");
	// First value wins when the query is repeated.
	assert.equal(regionCodeFromQuery({ region: ["ae-1", "sa-1"] }), "ae-1");
	for (const value of ["", "sa 1", "sa_1", "-sa", 42, null])
		assert.equal(
			regionCodeFromQuery({ region: value }),
			null,
			`value: ${String(value)}`,
		);
	assert.equal(regionCodeFromQuery({}), null);
	assert.equal(regionCodeFromQuery(undefined), null);
	assert.equal(regionCodeFromQuery("region=sa-1"), null);
});

test("apiUrlOrigin reduces a region URL to a bare origin", () => {
	assert.equal(apiUrlOrigin(`${SA}/prefix/`), SA);
	assert.equal(apiUrlOrigin("not-a-url"), null);
	assert.equal(apiUrlOrigin(undefined), null);
});
