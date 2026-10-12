/**
 * B2 — PKCE verifier transport for cross-origin session handoff.
 *
 * The handoff code travels in the redirect URL (short-lived, single-use, bound
 * to a destination origin). The code alone must not be redeemable: the client
 * also proves possession of a secret verifier whose `SHA256` is the challenge
 * the server stored when the code was minted. The verifier NEVER travels to the
 * server at mint and NEVER appears in the URL.
 *
 * Because the source and destination are different origins, the verifier is
 * carried between them by a short-lived cookie scoped to the shared registrable
 * domain (`inicontent.com`). Both apps live under it (`<slug>.inicontent.com`
 * and the bare platform host), so a cookie set by the source is readable by the
 * destination. The cookie is keyed by the code so two codes minted in one
 * redirect (tenant + platform) cannot overwrite each other.
 *
 * The cookie is deliberately not HttpOnly — the destination JS must read it to
 * submit it — and it is removed as soon as the code is consumed or expires. It
 * is single-use: the code is burned on the first redemption attempt.
 */

const COOKIE_PREFIX = "inicontent_handoff_v_";

/** Cookie name for a code's verifier. Shared by the mint and redeem clients. */
export function handoffVerifierCookieName(code: string): string {
	return `${COOKIE_PREFIX}${code}`;
}

/**
 * The registrable domain shared by the handoff apps, or undefined when the
 * current host is not under it (custom domains cannot share a cookie and must
 * not silently fall back to a host-only one).
 */
function sharedCookieDomain(): string | undefined {
	if (typeof location === "undefined") return undefined;
	const host = location.hostname;
	if (host === "inicontent.com" || host.endsWith(".inicontent.com")) {
		return "inicontent.com";
	}
	return undefined;
}

/**
 * Whether this app can hand a verifier to the destination.
 *
 * The verifier is carried on the registrable domain both apps share, so a
 * source on a tenant custom domain (e.g. `shop.example.com`) cannot deliver it
 * to `<slug>.inicontent.com`. Rather than mint a code that can never be
 * redeemed, the caller must fail closed and let the user sign in at the
 * platform host. (Fully supporting custom-domain sources needs the
 * destination-initiated exchange — see the security register.)
 */
export function handoffVerifierDeliverable(): boolean {
	return sharedCookieDomain() !== undefined;
}

/** base64url without padding, matching the API's `digest("base64url")`. */
function base64Url(bytes: Uint8Array): string {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

/**
 * A fresh verifier/challenge pair. The verifier is a 256-bit secret; the
 * challenge is `base64url(SHA256(verifier))`. A new pair is generated per code.
 */
export async function createHandoffPkce(): Promise<{
	verifier: string;
	challenge: string;
}> {
	const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(verifier),
	);
	return { verifier, challenge: base64Url(new Uint8Array(digest)) };
}

/** Persist a code's verifier for the destination app to read and submit. */
export function writeHandoffVerifier(code: string, verifier: string): void {
	if (typeof document === "undefined") return;
	const domain = sharedCookieDomain();
	if (!domain) return;
	const secure =
		typeof location !== "undefined" && location.protocol === "https:"
			? "; Secure"
			: "";
	// biome-ignore lint/suspicious/noDocumentCookie: a domain-scoped cookie on the shared parent is exactly what hands the verifier to the destination app; the Cookie Store API cannot set one.
	document.cookie = `${handoffVerifierCookieName(code)}=${encodeURIComponent(
		verifier,
	)}; Domain=${domain}; Path=/; Max-Age=300; SameSite=Lax${secure}`;
}

/** Read a code's verifier, or null when none was delivered. */
export function readHandoffVerifier(code: string): string | null {
	if (typeof document === "undefined") return null;
	const name = handoffVerifierCookieName(code);
	for (const part of document.cookie.split(/;\s*/)) {
		if (part.startsWith(`${name}=`)) {
			return decodeURIComponent(part.slice(name.length + 1));
		}
	}
	return null;
}

/** Drop a spent (or unusable) verifier so it cannot be replayed. */
export function clearHandoffVerifier(code: string): void {
	if (typeof document === "undefined") return;
	const domain = sharedCookieDomain();
	// biome-ignore lint/suspicious/noDocumentCookie: must clear the same domain-scoped verifier cookie that writeHandoffVerifier set.
	document.cookie = `${handoffVerifierCookieName(
		code,
	)}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
}
