import { strict as assert } from "node:assert";
import { test } from "node:test";

const globals = globalThis as Record<string, unknown>;
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

const { usePlatformRedirect } = await import(
	"../app/composables/usePlatformRedirect.ts"
);

test("platformUrl mints one-time codes instead of embedding SIDs", async () => {
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
	assert.equal(calls[0].headers.Authorization, "Bearer alpha-sid");
	assert.equal(calls[0].url, "https://api.test/alpha/auth/handoff");
	assert.equal(calls[1].url, "https://api.test/inicontent/auth/handoff");
	// Both codes are bound to the exact origin they will be redeemed on.
	assert.equal(calls[0].body.destination, "https://alpha.inicontent.com");
	assert.equal(calls[1].body.destination, "https://alpha.inicontent.com");
});

test("platformUrl degrades to a signed-out URL when minting fails", async () => {
	globals.$fetch = async () => {
		throw new Error("network down");
	};
	const { platformUrl } = usePlatformRedirect();
	const url = await platformUrl("billing");
	assert.equal(url, "https://alpha.inicontent.com/admin/billing");
});
