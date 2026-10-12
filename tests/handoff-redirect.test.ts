import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { test } from "node:test";

async function sha256Base64Url(value: string): Promise<string> {
	return createHash("sha256").update(value, "utf8").digest("base64url");
}

/** Minimal cookie jar so the verifier write can be observed outside a browser. */
let cookieJar = "";
const fakeDocument = {
	get cookie() {
		return cookieJar;
	},
	set cookie(value: string) {
		cookieJar = cookieJar ? `${cookieJar}; ${value}` : value;
	},
};

const globals = globalThis as Record<string, unknown>;
globals.document = fakeDocument;
globals.location = {
	hostname: "alpha.inicontent.com",
	protocol: "https:",
};
globals.useRuntimeConfig = () => ({
	public: { database: "alpha", apiBase: "https://api.test/" },
});
globals.useState = (_key: string, init?: () => unknown) => ({
	value: init ? init() : undefined,
});
globals.useCookie = (name: string) => ({
	value: name === "alpha_sid" ? "alpha-sid" : "platform-sid",
});
globals.useApiBase = () => "https://api.test/";
globals.computed = (fn: () => unknown) => ({
	get value() {
		return fn();
	},
});
globals.useScopedCookie = (
	await import("../app/composables/databaseCookies.ts")
).useScopedCookie;

const { handoffVerifierCookieName, readHandoffVerifier } = await import(
	"../app/composables/handoffVerifier.ts"
);
const { usePlatformRedirect } = await import(
	"../app/composables/usePlatformRedirect.ts"
);

/** Read `<name>=<value>` out of the fake `document.cookie` jar. */
function jarValue(name: string): string | null {
	const match = cookieJar
		.split(/;\s*/)
		.find((part) => part.startsWith(`${name}=`));
	return match ? match.slice(name.length + 1) : null;
}

test("platformUrl mints one-time codes instead of embedding SIDs", async () => {
	cookieJar = "";
	const calls: Array<{
		url: string;
		headers: Record<string, string>;
		body: Record<string, unknown>;
	}> = [];
	globals.$fetch = async (url: string, options: Record<string, unknown>) => {
		calls.push({
			url,
			headers: (options.headers ?? {}) as Record<string, string>,
			body: (options.body ?? {}) as Record<string, unknown>,
		});
		return { code: `code-for-${url}` };
	};

	const { platformUrl } = usePlatformRedirect();
	const url = await platformUrl("billing");

	assert.match(url, /^https:\/\/alpha\.inicontent\.com\/admin\/billing\?/);
	assert.match(url, /alpha_handoff=/);
	assert.match(url, /inicontent_handoff=/);
	assert.doesNotMatch(url, /alpha-sid/);
	assert.doesNotMatch(url, /platform-sid/);
	assert.equal(calls.length, 2);

	// The two mints run in parallel, so don't depend on completion order.
	const byUrl = new Map(calls.map((call) => [call.url, call]));
	const tenantCall = byUrl.get("https://api.test/alpha/auth/handoff");
	const platformCall = byUrl.get("https://api.test/inicontent/auth/handoff");
	assert.ok(tenantCall);
	assert.ok(platformCall);
	assert.equal(tenantCall.headers.Authorization, "Bearer alpha-sid");
	assert.equal(platformCall.headers.Authorization, "Bearer platform-sid");
	// Both codes are bound to the exact origin they will be redeemed on.
	assert.equal(tenantCall.body.destination, "https://alpha.inicontent.com");
	assert.equal(platformCall.body.destination, "https://alpha.inicontent.com");

	// Only the PKCE challenge leaves the browser. The verifier is written to a
	// shared-domain cookie keyed by the code, never sent to the API here.
	for (const call of calls) {
		const challenge = call.body.challenge as string;
		assert.equal(call.body.verifier, undefined);
		assert.match(challenge, /^[A-Za-z0-9_-]{43}$/);

		const code = `code-for-${call.url}`;
		const verifier = jarValue(handoffVerifierCookieName(code));
		assert.ok(verifier, "a verifier must be delivered for every code");
		assert.equal(await sha256Base64Url(verifier as string), challenge);
		assert.equal(readHandoffVerifier(code), verifier);
	}
	// The two handoffs in one redirect must not share a verifier.
	assert.notEqual(
		readHandoffVerifier("code-for-https://api.test/alpha/auth/handoff"),
		readHandoffVerifier("code-for-https://api.test/inicontent/auth/handoff"),
	);
});

test("platformUrl degrades to a signed-out URL when minting fails", async () => {
	cookieJar = "";
	globals.$fetch = async () => {
		throw new Error("network down");
	};
	const { platformUrl } = usePlatformRedirect();
	const url = await platformUrl("billing");
	assert.equal(url, "https://alpha.inicontent.com/admin/billing");
});

test("platformUrl fails closed when the source cannot share the verifier", async () => {
	cookieJar = "";
	const loc = globals.location as { hostname: string; protocol: string };
	const originalHostname = loc.hostname;
	loc.hostname = "shop.example.com";
	let fetchCalls = 0;
	globals.$fetch = async () => {
		fetchCalls += 1;
		return { code: "should-not-be-minted" };
	};

	try {
		const { platformUrl } = usePlatformRedirect();
		const url = await platformUrl("billing");
		// No code is minted and no verifier is written: the user lands on the
		// platform host signed out rather than with an unredeemable code.
		assert.equal(url, "https://alpha.inicontent.com/admin/billing");
		assert.equal(fetchCalls, 0);
		assert.equal(cookieJar, "");
	} finally {
		loc.hostname = originalHostname;
	}
});
