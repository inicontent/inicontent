import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { test } from "node:test";

const { planHandoff } = await import("../app/composables/handoffFlow.ts");
const {
	HANDOFF_CHALLENGE_PARAM,
	HANDOFF_INIT_PARAM,
	HANDOFF_STATE_PARAM,
	HANDOFF_TO_PARAM,
} = await import("../app/composables/handoffVerifier.ts");

const challenge = createHash("sha256")
	.update("verifier", "utf8")
	.digest("base64url");

const base = {
	databaseSlug: "alpha",
	destinationOrigin: "https://alpha.inicontent.com",
	currentOrigin: "https://alpha.inicontent.com",
	destinationSignedIn: false,
};

test("redeem wins when a handoff code is present, with its verifier state", () => {
	const plan = planHandoff(
		{
			alpha_handoff: "code-a",
			inicontent_handoff: "code-b",
			[HANDOFF_STATE_PARAM]: "state-1",
		},
		base,
	);
	assert.equal(plan.kind, "redeem");
	if (plan.kind !== "redeem") return;
	assert.equal(plan.state, "state-1");
	assert.deepEqual(plan.codes, [
		{ key: "alpha_handoff", slug: "alpha", code: "code-a" },
		{ key: "inicontent_handoff", slug: "inicontent", code: "code-b" },
	]);
});

test("a code takes precedence over challenge/init parameters", () => {
	const plan = planHandoff(
		{
			alpha_handoff: "code-a",
			[HANDOFF_CHALLENGE_PARAM]: challenge,
			[HANDOFF_INIT_PARAM]: "https://inicontent.com/alpha/admin",
		},
		base,
	);
	assert.equal(plan.kind, "redeem");
});

test("the source mints when handed a challenge bound to its destination", () => {
	const plan = planHandoff(
		{
			[HANDOFF_CHALLENGE_PARAM]: challenge,
			[HANDOFF_STATE_PARAM]: "state-2",
			[HANDOFF_TO_PARAM]: "https://alpha.inicontent.com/admin/billing",
		},
		{ ...base, currentOrigin: "https://inicontent.com" },
	);
	assert.equal(plan.kind, "mint");
	if (plan.kind !== "mint") return;
	assert.equal(plan.destination, "https://alpha.inicontent.com");
	assert.equal(plan.challenge, challenge);
	assert.equal(plan.state, "state-2");
	assert.deepEqual(plan.codes, [
		{ key: "alpha_handoff", slug: "alpha" },
		{ key: "inicontent_handoff", slug: "inicontent" },
	]);
});

test("a challenge bound to some other origin is dropped, not minted", () => {
	const plan = planHandoff(
		{
			[HANDOFF_CHALLENGE_PARAM]: challenge,
			[HANDOFF_TO_PARAM]: "https://evil.example.net/admin/billing",
		},
		base,
	);
	assert.equal(plan.kind, "strip");
});

test("a malformed challenge is dropped", () => {
	const plan = planHandoff(
		{
			[HANDOFF_CHALLENGE_PARAM]: "not-a-digest",
			[HANDOFF_TO_PARAM]: "https://alpha.inicontent.com/admin/billing",
		},
		base,
	);
	assert.equal(plan.kind, "strip");
});

test("a to without a challenge is dropped", () => {
	const plan = planHandoff(
		{ [HANDOFF_TO_PARAM]: "https://alpha.inicontent.com/admin/billing" },
		base,
	);
	assert.equal(plan.kind, "strip");
});

test("the destination initiates for a platform source that is not itself", () => {
	const plan = planHandoff(
		{ [HANDOFF_INIT_PARAM]: "https://inicontent.com/alpha/admin/settings" },
		base,
	);
	assert.equal(plan.kind, "initiate");
	if (plan.kind !== "initiate") return;
	assert.equal(plan.source, "https://inicontent.com/alpha/admin/settings");
});

test("the destination refuses to redirect back to a non-platform origin", () => {
	const plan = planHandoff(
		{ [HANDOFF_INIT_PARAM]: "https://shop.example.com/admin/settings" },
		base,
	);
	assert.equal(plan.kind, "strip");
});

test("the destination refuses to loop back to itself", () => {
	const plan = planHandoff(
		{ [HANDOFF_INIT_PARAM]: "https://alpha.inicontent.com/admin/billing" },
		base,
	);
	assert.equal(plan.kind, "strip");
});

test("the destination skips the round-trip when already signed in", () => {
	const plan = planHandoff(
		{ [HANDOFF_INIT_PARAM]: "https://inicontent.com/alpha/admin/settings" },
		{ ...base, destinationSignedIn: true },
	);
	assert.equal(plan.kind, "strip");
});

test("an ordinary navigation is untouched", () => {
	assert.equal(planHandoff({ keep: "1" }, base).kind, "none");
});
