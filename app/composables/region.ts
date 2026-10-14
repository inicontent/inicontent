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

// ─── Database hostnames ─────────────────────────────────────────────────────
//
// The region a database belongs to is encoded in its hostname so a bare
// `*.inicontent.com` host can be resolved deterministically without a global
// database locator:
//
//   main region      myclinic.inicontent.com
//   secondary region sa-1--myclinic.inicontent.com
//
// `--` separates the region code from the slug; a single hyphen is an ordinary
// slug character. A slug therefore never contains `--` (enforced at creation).

/** Tenant platform hostnames live under this suffix. */
export const TENANT_HOSTNAME_SUFFIX = ".inicontent.com";
/** Double hyphen separating an optional region code from the database slug. */
export const REGION_HOST_SEPARATOR = "--";

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

/**
 * Parse `[<region>--]<slug>.inicontent.com` deterministically, or `null` when
 * the value is not a database hostname. Mirrors the API's parser: another
 * domain, a multi-label host, an empty/invalid slug, an invalid region code and
 * a label with more than one separator all resolve to `null` rather than a
 * guess.
 */
export function parseDatabaseHostname(
	hostname: unknown,
): DatabaseHostname | null {
	if (typeof hostname !== "string" || !hostname.trim()) return null;
	let host = hostname.trim().toLowerCase();
	if (host.endsWith(".")) host = host.slice(0, -1);
	if (host.startsWith("[") || host.includes(":") || host.includes("/"))
		return null;
	if (!host.endsWith(TENANT_HOSTNAME_SUFFIX)) return null;

	const label = host.slice(0, -TENANT_HOSTNAME_SUFFIX.length);
	if (!label || label.includes(".") || !HOSTNAME_LABEL_PATTERN.test(label))
		return null;

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

/**
 * The platform hostname for a database slug: `<region>--<slug>.inicontent.com`
 * for a secondary region, `<slug>.inicontent.com` for the main/default one.
 * Returns `null` for a slug that cannot form a valid host, so a caller never
 * navigates to a malformed one.
 *
 * An internationalized slug is IDNA-encoded per label, so the region separator
 * is encoded **outside** the ACE form: `مرحبا` in `sa-1` is reached at
 * `sa-1--xn--mgbbop3h.inicontent.com`, and on the main region at
 * `xn--mgbbop3h.inicontent.com`. The region therefore lives in the hostname for
 * every supported slug, not only the ASCII ones; `?region=` stays an
 * independent cross-check rather than the only routing signal. A pre-existing
 * bare ACE host keeps resolving (the parser reads it as the main region).
 */
export function databaseHostname(
	slug: unknown,
	region?: string | null,
): string | null {
	if (typeof slug !== "string") return null;
	const trimmed = slug.trim();
	if (!trimmed || trimmed.includes(REGION_HOST_SEPARATOR)) return null;

	const regionCode = normalizeRegionCode(region);
	if (region && !regionCode) return null;

	const slugLabel = asciiSlugLabel(trimmed);
	if (!slugLabel) return null;

	const label = regionCode
		? `${regionCode}${REGION_HOST_SEPARATOR}${slugLabel}`
		: slugLabel;
	if (!HOSTNAME_LABEL_PATTERN.test(label)) return null;
	return `${label}${TENANT_HOSTNAME_SUFFIX}`;
}

/**
 * The absolute sign-in URL for a database: `/login` **on the database's own
 * hostname**, carrying the region as an explicit `?region=<code>`.
 *
 * This is why the credentials a password manager offers to save are scoped to
 * the database (`myclinic.inicontent.com`, or `sa-1--myclinic…`), never to the
 * SaaS administration host (`inicontent.com`) where the database was created —
 * a browser only associates saved credentials with the origin the form was
 * submitted from. The region prefix and the parameter both encode the region so
 * either one alone is enough to route.
 *
 * Returns `null` for a slug that cannot form a valid host.
 */
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
