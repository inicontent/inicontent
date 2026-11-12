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
	creatableRegions,
	isRegionCreatable,
	isRegionSelectable,
	isSingleRegion,
	normalizePinnedRegion,
	normalizeRegionApiUrl,
	normalizeRegionCode,
	parseRegionSelection,
	REGIONAL_STATE_KEYS,
	regionApiBase,
	resolvePinnedSelection,
	resolveSelectionAgainstCatalog,
	selectableRegions,
	serializeRegionSelection,
	toRegionOption,
	withTrailingSlash,
} from "../app/composables/region.ts";
import { useApiBase } from "../app/composables/useApiBase.ts";
import { useRegion } from "../app/composables/useRegion.ts";

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

test("availability follows the registry flags and fails closed", () => {
	// A missing flag is the registry's documented default (enabled/accepting),
	// which `toRegionOption` normalises to an explicit `true`…
	const open = toRegionOption({ code: "main", apiUrl: "https://api.x" });
	assert.ok(open);
	assert.equal(isRegionSelectable(open), true);
	assert.equal(isRegionCreatable(open), true);

	// …an explicit `false` is final on both axes.
	const disabled = toRegionOption({
		code: "ae-1",
		apiUrl: "https://ae.api.x",
		enabled: false,
	});
	assert.ok(disabled);
	assert.equal(isRegionSelectable(disabled), false);
	assert.equal(isRegionCreatable(disabled), false);

	// A region that stopped accepting databases still serves the ones it hosts.
	const closed = toRegionOption({
		code: "sa-1",
		apiUrl: "https://sa.api.x",
		acceptNewDatabases: false,
	});
	assert.ok(closed);
	assert.equal(isRegionSelectable(closed), true);
	assert.equal(isRegionCreatable(closed), false);

	// A value that is not a region at all is refused, never assumed available.
	assert.equal(isRegionSelectable(undefined as never), false);
	assert.equal(isRegionSelectable(null as never), false);
	assert.equal(isRegionCreatable(undefined as never), false);
});

test("the selectable and creatable catalogs filter and order deterministically", () => {
	const catalog = [
		{
			code: "za-1",
			name: "Zulu",
			apiUrl: "https://za.api.x",
			enabled: true,
			acceptNewDatabases: true,
		},
		{
			code: "sa-1",
			name: "Saudi Arabia",
			apiUrl: "https://sa.api.x",
			enabled: true,
			acceptNewDatabases: false,
		},
		{
			code: "ae-1",
			name: "UAE",
			apiUrl: "https://ae.api.x",
			enabled: false,
			acceptNewDatabases: true,
		},
		{
			code: "main",
			name: "Main",
			apiUrl: "https://api.x",
			enabled: true,
			acceptNewDatabases: true,
		},
	];

	// A disabled region is not offered; one closed to new databases is
	// selectable but not creatable.
	assert.deepEqual(
		selectableRegions(catalog).map(({ code }) => code),
		["main", "sa-1", "za-1"],
	);
	assert.deepEqual(
		creatableRegions(catalog).map(({ code }) => code),
		["main", "za-1"],
	);
	// The caller's catalog is never reordered in place.
	assert.deepEqual(
		catalog.map(({ code }) => code),
		["za-1", "sa-1", "ae-1", "main"],
	);
});

test("equal display names order the same whatever the input order", () => {
	const sameNames = [
		{
			code: "b-1",
			name: "Europe",
			apiUrl: "https://b.api.x",
			enabled: true,
			acceptNewDatabases: true,
		},
		{
			code: "a-1",
			name: "Europe",
			apiUrl: "https://a.api.x",
			enabled: true,
			acceptNewDatabases: true,
		},
	];
	const reversed = [...sameNames].reverse();

	assert.deepEqual(
		selectableRegions(sameNames).map(({ code }) => code),
		["a-1", "b-1"],
	);
	assert.deepEqual(
		selectableRegions(reversed).map(({ code }) => code),
		["a-1", "b-1"],
	);
	assert.deepEqual(
		creatableRegions(reversed).map(({ code }) => code),
		["a-1", "b-1"],
	);
});

test("a fresh or single-region catalog has no region choice to offer", () => {
	const main = {
		code: "main",
		name: "Main",
		apiUrl: "https://api.x",
		enabled: true,
		acceptNewDatabases: true,
	};
	const sa = {
		code: "sa-1",
		name: "Saudi Arabia",
		apiUrl: "https://sa.api.x",
		enabled: true,
		acceptNewDatabases: true,
	};
	const closed = {
		code: "ae-1",
		name: "UAE",
		apiUrl: "https://ae.api.x",
		enabled: true,
		acceptNewDatabases: false,
	};

	// A catalog that has not loaded yet must not flash a picker…
	assert.equal(isSingleRegion([]), true);
	// …and a single creatable region is the default, not a choice.
	assert.equal(isSingleRegion([main]), true);
	// A region closed to new databases adds no creatable choice.
	assert.equal(isSingleRegion([main, closed]), true);
	// Two creatable regions make a picker meaningful.
	assert.equal(isSingleRegion([main, sa]), false);
});

/**
 * `useRegion` reaches for Nuxt's runtime globals (`useRuntimeConfig`,
 * `useState`, `useCookie`, `computed`, `$fetch`, `clearNuxtState`) and
 * `useRegionSession` for `useScopedCookie`. Reproduce them so the reactive
 * wrapper runs under node:test — the same approach as `translate.test.ts`.
 */
function mockNuxt(options: {
	region?: string;
	result?: unknown[];
	regionalDatabasePaths?: boolean;
}): void {
	const states = new Map<string, { value: unknown }>();
	const globals = globalThis as Record<string, unknown>;

	globals.useRuntimeConfig = () => ({
		public: {
			apiBase: "https://api.x/",
			mainApiBase: "https://api.x/",
			region: options.region ?? "",
			regionalDatabasePaths: options.regionalDatabasePaths ?? false,
		},
	});
	globals.useState = (key: string, init?: () => unknown) => {
		if (!states.has(key))
			states.set(key, { value: typeof init === "function" ? init() : init });
		return states.get(key);
	};
	globals.useCookie = () => ({ value: null });
	globals.useScopedCookie = () => ({ value: undefined });
	globals.computed = (fn: () => unknown) => ({
		get value() {
			return fn();
		},
	});
	globals.clearNuxtState = () => {};
	globals.clearNuxtData = () => {};
	globals.$fetch = async () => ({ result: options.result ?? [] });
}

test("a single-entry catalog loads and keeps a pinned deployment on its region", async () => {
	mockNuxt({
		region: "eu-1",
		result: [
			{
				code: "eu-1",
				name: "Europe",
				apiUrl: "https://api.x",
				enabled: true,
				acceptNewDatabases: true,
			},
		],
	});

	const region = useRegion();
	await region.loadRegions();

	// One catalog entry is enough to resolve, project and count against.
	assert.equal(region.catalog.value.length, 1);
	assert.deepEqual(
		region.selectableCatalog.value.map(({ code }) => code),
		["eu-1"],
	);
	assert.deepEqual(
		region.creatableCatalog.value.map(({ code }) => code),
		["eu-1"],
	);
	assert.equal(region.isSingleRegion.value, true);

	// The pinned deployment resolves its own region from that entry…
	await region.bootstrap();
	assert.equal(region.regionError.value, null);
	assert.deepEqual(region.selection.value, {
		code: "eu-1",
		apiUrl: "https://api.x",
	});
	assert.equal(region.apiBase.value, "https://api.x/");

	// …and cannot be switched away from it.
	assert.equal(
		await region.select({ code: "sa-1", apiUrl: "https://sa.api.x" }),
		null,
	);
	assert.equal(region.selection.value?.code, "eu-1");
});

test("an empty SaaS catalog routes EU links to the main API without opening onboarding", async () => {
	mockNuxt({ regionalDatabasePaths: true });
	const region = useRegion();
	await region.bootstrap(null, "eu");
	assert.equal(region.regionError.value, null);
	assert.deepEqual(region.selection.value, {
		code: "main",
		apiUrl: "https://api.x",
	});
	assert.deepEqual(region.creatableCatalog.value, []);

	await region.bootstrap(null, "sa-1");
	assert.equal(region.regionError.value, "regionNotFound");
});

test("a regional API is never the fallback for platform database or catalog requests", async () => {
	mockNuxt({});
	const globals = globalThis as Record<string, unknown>;
	globals.useRuntimeConfig = () => ({
		public: { apiBase: "https://eu.api.inicontent.com/" },
	});
	globals.$fetch = async (url: string) => {
		assert.equal(url, "https://api.inicontent.com/inicontent/regions");
		return { result: [] };
	};
	const useState = globals.useState as (key: string) => { value: unknown };
	useState("database").value = { slug: "inicontent" };

	assert.equal(useApiBase(), "https://api.inicontent.com/");
	assert.equal(useApiBase("pteam-platform"), "https://eu.api.inicontent.com/");
	await useRegion().loadRegions();
});
