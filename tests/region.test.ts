/**
 * Multi-region (M1/M2) — client-side region selection.
 *
 * The pure parsing/validation/resolution helpers are exercised directly so the
 * request base a region resolves to cannot be a forged or malformed URL, and a
 * persisted selection round-trips. `useRegion` (reactive) and `useApiBase` are
 * thin wrappers over these.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	normalizePinnedRegion,
	normalizeRegionApiUrl,
	normalizeRegionCode,
	parseRegionSelection,
	REGIONAL_STATE_KEYS,
	regionApiBase,
	resolvePinnedSelection,
	resolveSelectionAgainstCatalog,
	serializeRegionSelection,
	toRegionOption,
	withTrailingSlash,
} from "../app/composables/region.ts";

test("region codes are lower-cased and restricted to a safe alphabet", () => {
	assert.equal(normalizeRegionCode("SA-1"), "sa-1");
	assert.equal(normalizeRegionCode("  main "), "main");
	for (const value of ["", "-sa", "sa-", "sa 1", "sa_1", "a".repeat(40), 42])
		assert.equal(normalizeRegionCode(value), null, `value: ${value}`);
});

test("a region API URL is reduced to an absolute origin", () => {
	assert.equal(
		normalizeRegionApiUrl("https://sa.api.inicontent.com/"),
		"https://sa.api.inicontent.com",
	);
	assert.equal(
		normalizeRegionApiUrl("https://sa.api.inicontent.com/prefix/"),
		"https://sa.api.inicontent.com/prefix",
	);
	assert.equal(
		normalizeRegionApiUrl("http://localhost:3433/"),
		"http://localhost:3433",
	);
	// Plain http is refused off loopback; queries, hashes and non-http too.
	for (const value of [
		"http://sa.api.inicontent.com",
		"ftp://x",
		"not-a-url",
		"",
		"https://x?a=1",
		"https://x#h",
		undefined,
	])
		assert.equal(normalizeRegionApiUrl(value), null, `value: ${String(value)}`);
});

test("withTrailingSlash never doubles a slash", () => {
	assert.equal(withTrailingSlash("https://api.x"), "https://api.x/");
	assert.equal(withTrailingSlash("https://api.x/"), "https://api.x/");
});

test("a region record is normalised into an option", () => {
	const option = toRegionOption({
		code: "SA-1",
		name: "  Saudi Arabia ",
		country: "sa",
		currency: "sar",
		apiUrl: "https://sa.api.inicontent.com/",
		enabled: true,
		acceptNewDatabases: false,
		// Infrastructure detail the projection should drop.
		provider: "hetzner",
		id: "r1",
	});
	assert.deepEqual(option, {
		code: "sa-1",
		name: "Saudi Arabia",
		country: "SA",
		currency: "SAR",
		apiUrl: "https://sa.api.inicontent.com",
		enabled: true,
		acceptNewDatabases: false,
	});
});

test("a region option without a valid code or URL is discarded", () => {
	assert.equal(toRegionOption({ code: "SA 1", apiUrl: "https://x" }), null);
	assert.equal(toRegionOption({ code: "sa-1", apiUrl: "javascript:x" }), null);
	assert.equal(toRegionOption(null), null);
	assert.equal(toRegionOption("sa-1"), null);
});

test("enabled and acceptNewDatabases default to true", () => {
	const option = toRegionOption({ code: "main", apiUrl: "https://api.x" });
	assert.equal(option?.enabled, true);
	assert.equal(option?.acceptNewDatabases, true);
	assert.equal(option?.name, "main");
});

test("a selection round-trips through a cookie and rejects junk", () => {
	const selection = { code: "sa-1", apiUrl: "https://sa.api.inicontent.com" };
	const serialized = serializeRegionSelection(selection);
	assert.deepEqual(parseRegionSelection(serialized), selection);
	// Object form is accepted too.
	assert.deepEqual(parseRegionSelection(selection), selection);

	for (const value of [
		"",
		"not json",
		"{}",
		'{"code":"sa-1"}',
		'{"code":"SA 1","apiUrl":"https://x"}',
		'{"code":"sa-1","apiUrl":"javascript:x"}',
		null,
		42,
	])
		assert.equal(parseRegionSelection(value), null, `value: ${String(value)}`);
});

test("regionApiBase prefers the selection and falls back to the default", () => {
	const fallback = "https://api.inicontent.com/";
	assert.equal(
		regionApiBase({ code: "sa-1", apiUrl: "https://sa.api.x" }, fallback),
		"https://sa.api.x",
	);
	assert.equal(regionApiBase(null, fallback), fallback);
	assert.equal(regionApiBase(undefined, fallback), fallback);
});

test("a pinned region is normalised, or empty when absent", () => {
	assert.equal(normalizePinnedRegion("SA-1"), "sa-1");
	assert.equal(normalizePinnedRegion(""), "");
	assert.equal(normalizePinnedRegion(undefined), "");
	assert.equal(normalizePinnedRegion("SA 1"), "");
});

test("region-scoped state keys are unique and cover the cached data", () => {
	const keys = REGIONAL_STATE_KEYS as readonly string[];
	assert.equal(new Set(keys).size, keys.length, "keys must be unique");
	for (const key of ["database", "user", "table", "translations"])
		assert.ok(keys.includes(key), `missing ${key}`);
});

test("a persisted selection is trusted only when the catalog vouches for it", () => {
	const catalog = [
		{
			code: "main",
			name: "Main",
			apiUrl: "https://api.inicontent.com",
			enabled: true,
			acceptNewDatabases: true,
		},
		{
			code: "sa-1",
			name: "Saudi Arabia",
			apiUrl: "https://sa.api.inicontent.com",
			enabled: true,
			acceptNewDatabases: true,
		},
	];

	// Matching code *and* URL resolves to the catalog's own entry.
	assert.deepEqual(
		resolveSelectionAgainstCatalog(
			{ code: "sa-1", apiUrl: "https://sa.api.inicontent.com/" },
			catalog,
		),
		{ code: "sa-1", apiUrl: "https://sa.api.inicontent.com" },
	);

	// A code the catalog does not know is dropped…
	assert.equal(
		resolveSelectionAgainstCatalog(
			{ code: "evil", apiUrl: "https://evil.example.com" },
			catalog,
		),
		null,
	);
	// …and so is a known code re-pointed at a foreign origin.
	assert.equal(
		resolveSelectionAgainstCatalog(
			{ code: "sa-1", apiUrl: "https://evil.example.com" },
			catalog,
		),
		null,
	);

	assert.equal(resolveSelectionAgainstCatalog(null, catalog), null);
	assert.equal(
		resolveSelectionAgainstCatalog(
			{ code: "sa-1", apiUrl: "https://sa.api.inicontent.com" },
			[],
		),
		null,
	);
});

test("a pinned region resolves from the catalog, or fails closed", () => {
	const catalog = [
		{
			code: "sa-1",
			name: "Saudi Arabia",
			apiUrl: "https://sa.api.inicontent.com",
			enabled: true,
			acceptNewDatabases: true,
		},
	];

	assert.deepEqual(resolvePinnedSelection("SA-1", catalog), {
		code: "sa-1",
		apiUrl: "https://sa.api.inicontent.com",
	});
	// Absent from the catalog → no base, never a different region.
	assert.equal(resolvePinnedSelection("ae-1", catalog), null);
	assert.equal(resolvePinnedSelection("", catalog), null);
	assert.equal(resolvePinnedSelection(undefined, catalog), null);
	// An empty catalog (unreachable main region) never yields a base.
	assert.equal(resolvePinnedSelection("sa-1", []), null);
});
