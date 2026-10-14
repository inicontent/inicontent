/**
 * Region selection (multi-region plan, M1/M2 — client side).
 *
 * There is deliberately **no global database locator**: a database lives in
 * exactly one region, and a region resolves to a single API origin. A
 * fixed-region app pins its region at build time (`INICONTENT_REGION`); a
 * multi-region app lets the user choose one explicitly, and every request then
 * targets that region's origin.
 *
 * This module holds the pure parts — parsing, validation and resolution — so
 * they are testable without a Nuxt runtime. The reactive wrapper lives in
 * `useRegion.ts`.
 */

export interface RegionOption {
	code: string;
	name: string;
	country?: string;
	currency?: string;
	apiUrl: string;
	enabled: boolean;
	acceptNewDatabases: boolean;
}

export interface RegionSelection {
	code: string;
	apiUrl: string;
}

/** State key holding the active [`RegionSelection`]. */
export const REGION_STATE_KEY = "region";
/** State key holding the fetched region catalog. */
export const REGION_CATALOG_KEY = "region-catalog";
/** Cookie persisting the active selection across reloads. */
export const REGION_COOKIE = "inicontent_region";

/**
 * Region-scoped Nuxt state. Every entry caches data resolved against the active
 * region (its database, user, table, translations, billing) — none of it may
 * survive a region switch, or the next region would read the previous one's
 * data. `clearNuxtState(REGIONAL_STATE_KEYS)` is what `useRegion` calls.
 */
export const REGIONAL_STATE_KEYS = [
	"database",
	"user",
	"table",
	"translations",
	"unfoundTranslations",
	"tableTranslationOverlays",
	"subscription-pricing",
	"subscription-data",
	"subscription-usage",
	"subscription-loading",
	"subscription-error",
] as const;

const REGION_CODE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

/** Lower-case and validate a region code; `null` when it is not a valid code. */
export function normalizeRegionCode(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const code = value.trim().toLowerCase();
	return REGION_CODE_PATTERN.test(code) ? code : null;
}

/**
 * Reduce a region API URL to an absolute origin (plus optional path). Mirrors
 * the API's own normalisation so a stored or returned URL is trustworthy before
 * it becomes the request base. Only `https` is accepted, except loopback.
 */
export function normalizeRegionApiUrl(value: unknown): string | null {
	if (typeof value !== "string" || !value.trim()) return null;
	try {
		const url = new URL(value.trim());
		if (url.protocol !== "https:" && url.protocol !== "http:") return null;
		if (
			url.protocol === "http:" &&
			!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
		)
			return null;
		if (url.search || url.hash) return null;
		return url.origin + (url.pathname.replace(/\/+$/, "") || "");
	} catch {
		return null;
	}
}

/** Ensure a base ends in `/` so callers can concatenate a path directly. */
export function withTrailingSlash(base: string): string {
	return base.endsWith("/") ? base : `${base}/`;
}

/** Normalise a region record (from the registry) into an option, or `null`. */
export function toRegionOption(value: unknown): RegionOption | null {
	if (!value || typeof value !== "object") return null;
	const region = value as Record<string, unknown>;

	const code = normalizeRegionCode(region.code);
	const apiUrl = normalizeRegionApiUrl(region.apiUrl);
	if (!code || !apiUrl) return null;

	const name =
		typeof region.name === "string" && region.name.trim()
			? region.name.trim()
			: code;
	const country =
		typeof region.country === "string" && region.country.trim()
			? region.country.trim().toUpperCase()
			: undefined;
	const currency =
		typeof region.currency === "string" && region.currency.trim()
			? region.currency.trim().toUpperCase()
			: undefined;

	return {
		code,
		name,
		...(country ? { country } : {}),
		...(currency ? { currency } : {}),
		apiUrl,
		enabled: region.enabled !== false,
		acceptNewDatabases: region.acceptNewDatabases !== false,
	};
}

/**
 * Parse a persisted selection — a JSON string (cookie) or an object — into a
 * validated selection, or `null`. Anything malformed is discarded rather than
 * trusted as a request base.
 */
export function parseRegionSelection(value: unknown): RegionSelection | null {
	let raw = value;
	if (typeof raw === "string") {
		const text = raw.trim();
		if (!text) return null;
		try {
			raw = JSON.parse(text);
		} catch {
			return null;
		}
	}
	if (!raw || typeof raw !== "object") return null;

	const record = raw as Record<string, unknown>;
	const code = normalizeRegionCode(record.code);
	const apiUrl = normalizeRegionApiUrl(record.apiUrl);
	if (!code || !apiUrl) return null;

	return { code, apiUrl };
}

/** Serialize a selection for a cookie; `""` when there is none to persist. */
export function serializeRegionSelection(
	selection: RegionSelection | null | undefined,
): string {
	if (!selection) return "";
	return JSON.stringify({ code: selection.code, apiUrl: selection.apiUrl });
}

/**
 * The request base for the active region: the selected region's origin, else
 * the configured fallback (the main/default API base).
 */
export function regionApiBase(
	selection: RegionSelection | null | undefined,
	fallback: string,
): string {
	return selection?.apiUrl || fallback;
}

/** The region a deployment is pinned to at build time, lower-cased. */
export function normalizePinnedRegion(value: unknown): string {
	return normalizeRegionCode(value) ?? "";
}

/**
 * Reduce a persisted selection to one the trusted catalog vouches for.
 *
 * The catalog (served by the main region) is the **only** authority for
 * `code → apiUrl`. A selection living in a cookie is attacker-influenceable, so
 * a request base is never taken from it directly: the code must match a
 * catalog entry *and* its URL must still agree. Anything else resolves to
 * `null` — the caller then falls back to the configured default rather than
 * pointing requests at an origin the main region never published.
 */
export function resolveSelectionAgainstCatalog(
	selection: RegionSelection | null | undefined,
	catalog: readonly RegionOption[],
): RegionSelection | null {
	if (!selection) return null;
	const match = catalog.find((region) => region.code === selection.code);
	if (!match) return null;

	const apiUrl = normalizeRegionApiUrl(match.apiUrl);
	if (!apiUrl || apiUrl !== normalizeRegionApiUrl(selection.apiUrl))
		return null;

	return { code: match.code, apiUrl };
}

/**
 * The selection a **pinned** deployment must target, resolved from the catalog
 * (the deployment knows its region code, not its API URL). Returns `null` when
 * the region is absent or carries no usable URL — the caller must then fail
 * closed rather than silently target a different region.
 */
export function resolvePinnedSelection(
	pinned: unknown,
	catalog: readonly RegionOption[],
): RegionSelection | null {
	const code = normalizeRegionCode(pinned);
	if (!code) return null;

	const match = catalog.find((region) => region.code === code);
	const apiUrl = match ? normalizeRegionApiUrl(match.apiUrl) : null;
	if (!apiUrl) return null;

	return { code, apiUrl };
}
