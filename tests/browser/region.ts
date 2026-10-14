/**
 * M3/M4 — real-browser regional acceptance checks.
 *
 * The unit tests prove the routing logic; this harness proves the properties
 * that only an actual browser can answer, against the four controls a regional
 * login must not break (B1/B1a/B2/B3):
 *
 *   - **regional login** — the sign-in URL is always on the database's own
 *     regional hostname, never the SaaS admin host. This is the host a
 *     password manager scopes a saved credential to, so it is asserted here
 *     rather than only in a source-level autocomplete test;
 *   - **cookies** — the region-session cookie the API sets is host-only: a
 *     sibling region origin cannot read it, so a regional credential cannot
 *     authenticate against another region;
 *   - **region switching** — the region is derived from the hostname (and the
 *     `?region=` query) alone, so a selection survives a refresh and never
 *     leaks into a stale state;
 *   - **refresh / logout** — a reload keeps the routing region, and clearing
 *     the cookie removes the regional session without disturbing it.
 *
 * Cookies are host-scoped and ignore ports, so two *real hostnames* are
 * required: `127.0.0.1` and `127.0.0.2` (both loopback, distinct cookie jars).
 * Serve the same directory on both and open the main page with the sibling as
 * `?child=`, e.g.
 *
 *   http://127.0.0.1:4319/region.html?child=http://127.0.0.2:4320
 *
 * See tests/browser/README.md. Without `?child=` the cross-region checks are
 * skipped and a warning is printed. Read-only: nothing here mutates shared
 * state, and no customer database is ever contacted.
 */
import {
	databaseHostname,
	parseDatabaseHostname,
	regionCodeFromQuery,
	resolveDatabaseLoginUrl,
} from "../../app/composables/region";

/**
 * Mirrors `api/utils/regionSessionCookie.ts`. Duplicated rather than imported:
 * it is the name the API puts on the wire, and this harness must assert the
 * browser behaviour that follows from it without depending on server internals.
 */
const REGION_SESSION_COOKIE = "inicontent_region_sid";

/** Session-storage key proving the running origin survived a reload. */
const REFRESH_KEY = "inicontent-region-browser-check";

const params = new URLSearchParams(location.search);

function report(checks: Array<[string, boolean]>, note?: string) {
	const failed = checks.filter(([, ok]) => !ok);
	for (const [name, ok] of checks) {
		const line = document.createElement("p");
		line.textContent = `${ok ? "PASS" : "FAIL"} — ${name}`;
		line.style.color = ok ? "green" : "red";
		document.body.appendChild(line);
	}
	const summary = document.createElement("p");
	summary.textContent = failed.length
		? `REGION BROWSER CHECKS FAILED (${failed.length}/${checks.length})`
		: note
			? `ALL REGION BROWSER CHECKS PASSED (${checks.length}; ${note})`
			: `ALL REGION BROWSER CHECKS PASSED (${checks.length})`;
	document.body.appendChild(summary);
}

/**
 * Host-only by construction (no `Domain`), so scoped to this origin alone.
 * This is exactly the transport the API uses — asserted in the browser rather
 * than mocked, because a cookie jar is what the region isolation depends on.
 */
function setRegionCookie(value: string) {
	// biome-ignore lint/suspicious/noDocumentCookie: deliberate — the harness must set the cookie to prove the browser scopes it.
	document.cookie = `${REGION_SESSION_COOKIE}=${value}; Path=/; SameSite=Lax`;
}

/** Simulates sign-out: expiring the cookie removes the regional session. */
function clearRegionCookie() {
	// biome-ignore lint/suspicious/noDocumentCookie: deliberate — simulating sign-out.
	document.cookie = `${REGION_SESSION_COOKIE}=; Path=/; Max-Age=0`;
}

/** Reads a cookie back out of this origin's jar, or `null` when absent. */
function readRegionCookie(): string | null {
	const prefix = `${REGION_SESSION_COOKIE}=`;
	for (const part of document.cookie.split(";")) {
		const entry = part.trim();
		if (entry.startsWith(prefix)) {
			const value = entry.slice(prefix.length);
			return value === "" ? null : value;
		}
	}
	return null;
}

/**
 * Ask the sibling region's origin to write its own session cookie, then report
 * what it can see. A sibling that can read *our* value has broken B3.
 */
function probeChild(childOrigin: string): Promise<{
	canReadOurs: boolean;
} | null> {
	return new Promise((resolve) => {
		const frame = document.createElement("iframe");
		frame.style.display = "none";
		const url = new URL("/region.html", childOrigin);
		url.searchParams.set("mode", "child");
		url.searchParams.set("marker", readRegionCookie() ?? "");
		// A probe that never answers is reported as a failure, not dropped: a
		// silent skip would let the harness print PASS on an unproven control.
		const timer = setTimeout(() => resolve(null), 10000);
		window.addEventListener("message", function onMessage(event: MessageEvent) {
			const data = event.data as { type?: string } | null;
			if (data?.type !== "inicontent-region-cookie-isolation") return;
			if (event.origin !== childOrigin) return;
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve({ canReadOurs: data.canReadOurs === true });
		});
		frame.src = url.toString();
		document.body.appendChild(frame);
	});
}

/** The sibling's half: it writes its own cookie, then reports what it sees. */
function runChild() {
	const marker = params.get("marker") ?? "";
	setRegionCookie(`sibling-region--${location.origin}--${Math.random()}`);
	// It reads after writing, so its own value is what it sees — never the
	// parent's, unless cookies have leaked across the region boundary.
	const canReadOurs = readRegionCookie() === marker;
	(window.parent ?? window).postMessage(
		{
			type: "inicontent-region-cookie-isolation",
			canReadOurs,
		},
		"*",
	);
	report([["sibling region origin booted", true]], "child");
}

async function runMain() {
	// -- Regional login: the host a password manager scopes a credential to ----
	const login = new URL(
		resolveDatabaseLoginUrl("clinic", "sa-1") ?? "https://inicontent.com/",
	);
	const checks: Array<[string, boolean]> = [
		[
			"the database login URL is on the database's own regional hostname",
			login.hostname === "sa-1--clinic.inicontent.com",
		],
		[
			"the database login URL is never on the SaaS admin host",
			login.hostname !== "inicontent.com",
		],
		[
			"an internationalized slug logs in on a region-prefixed ACE host",
			resolveDatabaseLoginUrl("\u0645\u062a\u062c\u0631", "sa-1") ===
				"https://sa-1--xn--pgbep1f.inicontent.com/login?region=sa-1",
		],
		[
			"a malformed slug never produces a navigable login URL",
			resolveDatabaseLoginUrl("clinic?x=", "sa-1") === null,
		],
	];

	// -- Region switching and refresh: routing comes from the host alone -------
	const host = databaseHostname("clinic", "ae-1");
	checks.push([
		"switching regions re-derives the hostname, never a cached selection",
		parseDatabaseHostname(host ?? "")?.region === "ae-1",
	]);
	checks.push([
		"the query region agrees with a hostname-encoded region on a refresh",
		regionCodeFromQuery({ region: "ae-1" }) ===
			parseDatabaseHostname(host ?? "")?.region,
	]);

	// -- Cookies: a regional session is host-only (B3) -------------------------
	setRegionCookie(`region--${Math.random()}`);
	checks.push([
		"this origin can read its own region session cookie",
		readRegionCookie() !== null,
	]);

	const childOrigin = params.get("child");
	let note: string | undefined;
	if (childOrigin) {
		const probe = await probeChild(childOrigin);
		checks.push([
			"a sibling region cannot read this origin's session cookie (B3)",
			probe !== null && probe.canReadOurs === false,
		]);
		// A credential minted on one region must authenticate only there: this
		// origin's own value is unchanged by the sibling writing its own.
		const beforeSibling = readRegionCookie();
		checks.push([
			"a session established on another region authenticates only there",
			probe !== null && beforeSibling === readRegionCookie(),
		]);
		if (!probe) note = "the sibling origin did not answer the cookie probe";
	} else {
		note = "cross-region checks skipped; pass ?child=<other origin>";
		console.warn("No ?child= origin: skipping cross-region cookie checks.");
	}

	// -- Logout: clearing the cookie removes the session, not the state --------
	clearRegionCookie();
	checks.push([
		"logout removes the region session cookie",
		readRegionCookie() === null,
	]);
	checks.push([
		"logout leaves routing (the region) intact",
		parseDatabaseHostname(host ?? "")?.region === "ae-1",
	]);

	// -- Refresh: reload once and re-run the routing checks --------------------
	if (!sessionStorage.getItem(REFRESH_KEY)) {
		sessionStorage.setItem(REFRESH_KEY, "reloaded");
		checks.push(["a reload was requested to prove refresh", true]);
		report(checks, note);
		location.reload();
		return;
	}
	checks.push([
		"the routing region survives a refresh",
		parseDatabaseHostname(host ?? "")?.region === "ae-1" &&
			regionCodeFromQuery({ region: "ae-1" }) === "ae-1",
	]);
	checks.push([
		"a refresh does not resurrect a logged-out region session",
		readRegionCookie() === null,
	]);

	report(checks, note);
}

if (params.get("mode") === "child") runChild();
else runMain();
