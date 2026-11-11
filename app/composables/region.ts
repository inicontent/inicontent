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
/**
 * State key holding an explicit region-resolution failure. A **pinned**
 * deployment that cannot resolve its region must stop region-scoped work with
 * an error rather than silently target the configured default (which may be a
 * different region).
 */
export const REGION_ERROR_KEY = "region-error";
/** Cookie persisting the active selection across reloads. */
export const REGION_COOKIE = "inicontent_region";
/** App-route query parameter carrying an explicit region for deep links. */
export const REGION_QUERY_PARAM = "region";

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
 * Whether a region may be offered to the user at all. The registry treats a
 * missing flag as enabled (both share the `enabled !== false` rule), so only an
 * explicit `false` excludes it; a value that is not a region object is refused
 * rather than assumed available.
 */
export function isRegionSelectable(region: RegionOption): boolean {
	if (!region || typeof region !== "object") return false;
	return region.enabled !== false;
}

/**
 * Whether a database may be created in a region: it has to be selectable and
 * not explicitly closed to new databases (`acceptNewDatabases !== false`). A
 * region that stops accepting databases is still selectable — it keeps serving
 * the databases it already hosts.
 */
export function isRegionCreatable(region: RegionOption): boolean {
	return isRegionSelectable(region) && region.acceptNewDatabases !== false;
}

/**
 * Stable order mirroring the registry's `sortRegions`: the preferred group
 * first, then by display name, then by code so equal names still order the same
 * however the catalog arrived.
 */
function sortRegionsByPreference(
	preferred: (region: RegionOption) => boolean,
	catalog: readonly RegionOption[],
): RegionOption[] {
	return [...catalog].sort((a, b) => {
		const preferenceDelta = Number(preferred(b)) - Number(preferred(a));
		if (preferenceDelta !== 0) return preferenceDelta;
		return (
			(a.name || a.code).localeCompare(b.name || b.code) ||
			a.code.localeCompare(b.code)
		);
	});
}

/** The regions a picker may offer: enabled only, enabled first then by name. */
export function selectableRegions(
	catalog: readonly RegionOption[],
): RegionOption[] {
	return sortRegionsByPreference(
		isRegionSelectable,
		catalog.filter(isRegionSelectable),
	);
}

/**
 * The regions that accept new databases: selectable and creatable first, then
 * by name.
 */
export function creatableRegions(
	catalog: readonly RegionOption[],
): RegionOption[] {
	return sortRegionsByPreference(
		isRegionCreatable,
		catalog.filter(isRegionCreatable),
	);
}

/**
 * Whether the catalog leaves no region *choice* for creating a database.
 *
 * One creatable region (or none) is the default: the deployment's own region is
 * the only target, and a one-option picker would advertise a choice that does
 * not exist. `true` for an empty catalog too, so a catalog that has not loaded
 * yet never flashes a picker.
 */
export function isSingleRegion(catalog: readonly RegionOption[]): boolean {
	return creatableRegions(catalog).length <= 1;
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

/**
 * The region code an explicit deep link asks for, from an app-route query
 * object (`?region=sa-1`). Returns `null` when the parameter is absent or not a
 * valid code — an unvalidated value never becomes a request target.
 */
export function regionCodeFromQuery(query: unknown): string | null {
	if (!query || typeof query !== "object") return null;
	const raw = (query as Record<string, unknown>)[REGION_QUERY_PARAM];
	const value = Array.isArray(raw) ? raw[0] : raw;
	return normalizeRegionCode(value);
}

/** The bare origin (`https://host`) of a region API URL, or `null`. */
export function apiUrlOrigin(value: unknown): string | null {
	const apiUrl = normalizeRegionApiUrl(value);
	if (!apiUrl) return null;
	try {
		return new URL(apiUrl).origin;
	} catch {
		return null;
	}
}

/**
 * Every **secondary** region origin a deployment knows about.
 *
 * Used by the network boundary to decide where the main-region platform session
 * must never travel. The main origin is deliberately excluded: it is the one
 * place that session is valid. Origins are compared bare (`https://host`), so a
 * trailing path on a region URL never defeats the match.
 */
export function collectRegionOrigins(options: {
	selection?: RegionSelection | null;
	catalog?: readonly RegionOption[];
	mainApiUrl?: unknown;
}): string[] {
	const main = apiUrlOrigin(options.mainApiUrl);
	const origins = new Set<string>();

	const add = (value: unknown) => {
		const origin = apiUrlOrigin(value);
		if (origin && origin !== main) origins.add(origin);
	};

	add(options.selection?.apiUrl);
	for (const region of options.catalog ?? []) add(region.apiUrl);

	return [...origins];
}

// Public URLs call the Paris deployment "eu"; the region registry calls it "main".
export const DEFAULT_REGION_CODE = "main";
export const DEFAULT_REGION_LABEL = "eu";
export const TENANT_HOSTNAME_SUFFIX = ".inicontent.com";
const REGION_HOST_SEPARATOR = "--"; // legacy hostname separator

export function publicRegionLabel(region?: string | null): string | null {
	const code = normalizeRegionCode(region ?? DEFAULT_REGION_CODE);
	return code === DEFAULT_REGION_CODE ? DEFAULT_REGION_LABEL : code;
}

export function registryRegionCode(region: unknown): string | null {
	const code = normalizeRegionCode(region);
	return code === DEFAULT_REGION_LABEL ? DEFAULT_REGION_CODE : code;
}

export function isPlatformApex(hostname: string): boolean {
	return hostname === "inicontent.com" || hostname === "www.inicontent.com";
}

/** A DNS label: 1..63 chars, alphanumeric plus hyphen, no leading/trailing hyphen. */
const HOSTNAME_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
/**
 * A plausible non-ASCII DNS label: Unicode letters/digits and hyphens only.
 * Guards the IDNA path, because `new URL("https://x?y")` silently truncates at
 * the `?` instead of failing.
 */
const HOST_LABEL_INPUT_PATTERN = /^[\p{L}\p{N}-]+$/u;

export interface DatabaseHostname {
	/** Region code the hostname names, or `null` for the main/default region. */
	region: string | null;
	/** Database slug label (the ASCII form on the wire). */
	slug: string;
}

/** Parse a regional tenant host or a legacy single-label tenant host. */
export function parseDatabaseHostname(
	hostname: unknown,
): DatabaseHostname | null {
	if (typeof hostname !== "string" || !hostname.trim()) return null;
	let host = hostname.trim().toLowerCase();
	if (host.endsWith(".")) host = host.slice(0, -1);
	if (host.startsWith("[") || host.includes(":") || host.includes("/"))
		return null;
	if (!host.endsWith(TENANT_HOSTNAME_SUFFIX)) return null;

	const [label, regionLabel, extra] = host
		.slice(0, -TENANT_HOSTNAME_SUFFIX.length)
		.split(".");
	if (extra !== undefined || !HOSTNAME_LABEL_PATTERN.test(label)) return null;
	if (regionLabel !== undefined) {
		const region = registryRegionCode(regionLabel);
		if (!region || ["api", "s3"].includes(region)) return null;
		if (label.includes(REGION_HOST_SEPARATOR) && !label.startsWith("xn--"))
			return null;
		return { region, slug: label };
	}

	// An ACE (punycode) label starts with `xn--`: that `--` is the IDNA prefix,
	// not a region separator, so such a label carries no region.
	if (label.startsWith("xn--")) return { region: null, slug: label };

	const separator = label.indexOf(REGION_HOST_SEPARATOR);
	if (separator === -1) return { region: null, slug: label };

	const region = label.slice(0, separator);
	const slug = label.slice(separator + REGION_HOST_SEPARATOR.length);
	if (!normalizeRegionCode(region)) return null;
	if (!slug || !HOSTNAME_LABEL_PATTERN.test(slug)) return null;
	if (slug.includes(REGION_HOST_SEPARATOR) && !slug.startsWith("xn--"))
		return null;

	return { region, slug };
}

/**
 * The ASCII (ACE/punycode) form of one slug label, or `null` when it cannot
 * form a valid DNS label. An all-ASCII slug passes through lower-cased; a
 * non-ASCII slug is IDNA-encoded **on its own**, so the region separator stays
 * outside the `xn--` form (`sa-1--xn--…`, never `xn--sa-1--…`).
 */
function asciiSlugLabel(value: string): string | null {
	const lower = value.toLowerCase();
	if (HOSTNAME_LABEL_PATTERN.test(lower)) return lower;
	// Only a plausible host label may go through IDNA. `?`, `#`, `/` and `:`
	// are URL delimiters, not label characters, and would truncate the hostname
	// rather than fail.
	if (!HOST_LABEL_INPUT_PATTERN.test(value)) return null;
	try {
		const { hostname } = new URL(`https://${value}`);
		if (!hostname || hostname.includes(".")) return null;
		return HOSTNAME_LABEL_PATTERN.test(hostname) ? hostname : null;
	} catch {
		return null;
	}
}

/** Build the canonical tenant hostname, encoding the slug as its own DNS label. */
export function databaseHostname(
	slug: unknown,
	region?: string | null,
): string | null {
	if (typeof slug !== "string") return null;
	const trimmed = slug.trim();
	if (!trimmed || trimmed.includes(REGION_HOST_SEPARATOR)) return null;

	const regionLabel = publicRegionLabel(region);
	const slugLabel = asciiSlugLabel(trimmed);
	if (!slugLabel || !regionLabel || ["api", "s3"].includes(regionLabel))
		return null;
	return `${slugLabel}.${regionLabel}${TENANT_HOSTNAME_SUFFIX}`;
}

/** The password manager should associate credentials with the tenant's origin. */
export function resolveDatabaseLoginUrl(
	slug: unknown,
	region?: string | null,
): string | null {
	const host = databaseHostname(slug, region);
	if (!host) return null;
	const url = new URL(`https://${host}/login`);
	const regionCode = normalizeRegionCode(region);
	if (regionCode) url.searchParams.set(REGION_QUERY_PARAM, regionCode);
	return url.toString();
}
