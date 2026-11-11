import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { test } from "node:test";

async function sha256Base64Url(value: string): Promise<string> {
	return createHash("sha256").update(value, "utf8").digest("base64url");
}

const globals = globalThis as Record<string, unknown>;

/** A minimal Map-backed `Storage` so origin-local persistence is observable. */
function fakeStorage(): Storage {
	const map = new Map<string, string>();
	return {
		get length() {
			return map.size;
		},
		clear: () => map.clear(),
		getItem: (key: string) => map.get(key) ?? null,
		key: (index: number) => [...map.keys()][index] ?? null,
		removeItem: (key: string) => void map.delete(key),
		setItem: (key: string, value: string) => void map.set(key, String(value)),
	};
}

let sessionStore = fakeStorage();
globals.sessionStorage = sessionStore;

const location = {
	origin: "https://inicontent.com",
	protocol: "https:",
	hostname: "inicontent.com",
	href: "https://inicontent.com/alpha/admin/settings",
};
globals.location = location;

globals.useRuntimeConfig = () => ({
	public: { database: "alpha", apiBase: "https://api.test/" },
});
globals.useState = (_key: string, init?: () => unknown) => ({
	value: init ? init() : undefined,
});
globals.computed = (fn: () => unknown) => ({
	get value() {
		return fn();
	},
});

const handoff = await import("../app/composables/handoffVerifier.ts");
const { usePlatformRedirect } = await import(
	"../app/composables/usePlatformRedirect.ts"
);

function noVerifierSecret(value: string) {
	assert.doesNotMatch(value, /_sid=/);
	assert.doesNotMatch(value, /inicontent_handoff=/);
	assert.doesNotMatch(value, /_handoff=/);
}

test("platformUrl starts a destination-initiated handoff from a platform origin", async () => {
	location.origin = "https://inicontent.com";
	location.hostname = "inicontent.com";
	location.href = "https://inicontent.com/alpha/admin/settings";

	const { platformUrl } = usePlatformRedirect();
	const value = await platformUrl("billing");
	const url = new URL(value);

	assert.equal(url.origin, "https://alpha.eu.inicontent.com");
	assert.equal(url.pathname, "/admin/billing");
	// Only the source's return URL travels out; no secret and no code yet.
	assert.equal(
		url.searchParams.get(handoff.HANDOFF_INIT_PARAM),
		"https://inicontent.com/alpha/admin/settings",
	);
	noVerifierSecret(value);
});

test("platformUrl stays on the bare destination when it is the same origin", async () => {
	location.origin = "https://alpha.eu.inicontent.com";
	location.hostname = "alpha.eu.inicontent.com";
	location.href = "https://alpha.eu.inicontent.com/alpha/admin/settings";

	const { platformUrl } = usePlatformRedirect();
	const url = await platformUrl("billing");
	assert.equal(url, "https://alpha.eu.inicontent.com/admin/billing");
});

test("platformUrl does not attempt a handoff from a custom-domain source", async () => {
	location.origin = "https://shop.example.com";
	location.hostname = "shop.example.com";
	location.href = "https://shop.example.com/admin/settings";

	try {
		const { platformUrl } = usePlatformRedirect();
		const url = await platformUrl("billing");
		// No handshake is started: the destination must never redirect back to a
		// non-platform origin, so the user signs in at the platform host.
		assert.equal(url, "https://alpha.eu.inicontent.com/admin/billing");
	} finally {
		location.origin = "https://inicontent.com";
		location.hostname = "inicontent.com";
		location.href = "https://inicontent.com/alpha/admin/settings";
	}
});

test("isPlatformHandoffOrigin accepts platform hosts and rejects everything else", () => {
	for (const origin of [
		"https://inicontent.com",
		"https://www.inicontent.com",
		"https://alpha.eu.inicontent.com",
		"https://app.inicontent.com",
		"https://xn--bcher-kva.inicontent.com",
	]) {
		assert.equal(handoff.isPlatformHandoffOrigin(origin), true, origin);
	}
	for (const origin of [
		"",
		"https://shop.example.com",
		"https://inicontent.com.evil.test",
		"https://evilinicontent.com",
		"https://inicontent.com:8443",
		"http://inicontent.com",
		"https://inicontent.com/alpha",
		"https://-bad.inicontent.com",
		"https://a_b.inicontent.com",
	]) {
		assert.equal(handoff.isPlatformHandoffOrigin(origin), false, origin);
	}
});

test("createHandoffPkce derives the challenge from the verifier", async () => {
	const { verifier, challenge } = await handoff.createHandoffPkce();
	assert.match(verifier, /^[A-Za-z0-9_-]{43}$/);
	assert.equal(await sha256Base64Url(verifier), challenge);
	assert.equal(handoff.isHandoffChallenge(challenge), true);
	assert.equal(handoff.isHandoffChallenge("short"), false);
});

test("a verifier is stored, read back and cleared by state", () => {
	sessionStore = fakeStorage();
	globals.sessionStorage = sessionStore;
	const record = {
		verifier: "v".repeat(43),
		destination: "https://alpha.eu.inicontent.com",
		to: "https://alpha.eu.inicontent.com/admin/billing",
	};
	handoff.storeHandoffVerifier("state-1", record);
	assert.deepEqual(
		handoff.readHandoffVerifier("state-1")?.verifier,
		record.verifier,
	);
	handoff.clearHandoffVerifier("state-1");
	assert.equal(handoff.readHandoffVerifier("state-1"), null);
});

test("a verifier past its TTL is treated as absent and swept", () => {
	sessionStore = fakeStorage();
	globals.sessionStorage = sessionStore;
	handoff.storeHandoffVerifier("state-2", {
		verifier: "v".repeat(43),
		destination: "https://alpha.eu.inicontent.com",
		to: "https://alpha.eu.inicontent.com/admin/billing",
	});

	const now = Date.now;
	try {
		Date.now = () => now() + handoff.HANDOFF_VERIFIER_TTL_MS + 1;
		assert.equal(handoff.readHandoffVerifier("state-2"), null);
	} finally {
		Date.now = now;
	}
	// Swept on read, so a replay cannot find it either.
	assert.equal(
		sessionStore.getItem(handoff.handoffVerifierStorageKey("state-2")),
		null,
	);
});

test("stripHandoffParams removes the flow and code keys only", () => {
	const query = {
		inicontent_handoff_init: "x",
		inicontent_handoff_challenge: "y",
		inicontent_handoff_state: "z",
		inicontent_handoff_to: "t",
		alpha_handoff: "c1",
		inicontent_handoff: "c2",
		keep: "1",
	};
	assert.deepEqual(handoff.stripHandoffParams(query, "alpha"), { keep: "1" });
	// On the platform database `alpha_handoff` is not a handoff key, so it stays.
	assert.deepEqual(handoff.stripHandoffParams(query, "inicontent"), {
		alpha_handoff: "c1",
		keep: "1",
	});
});

test("handoffCodeParams names one code per database plus the platform code", () => {
	assert.deepEqual(handoff.handoffCodeParams("alpha"), [
		"alpha_handoff",
		"inicontent_handoff",
	]);
	assert.deepEqual(handoff.handoffCodeParams("inicontent"), [
		"inicontent_handoff",
	]);
});

test("handoffSourceUrl drops the fragment and any handoff parameters", () => {
	location.origin = "https://inicontent.com";
	location.href =
		"https://inicontent.com/alpha/admin/settings?inicontent_handoff_state=old&keep=1#draft";
	assert.equal(
		handoff.handoffSourceUrl(),
		"https://inicontent.com/alpha/admin/settings?keep=1",
	);
});
