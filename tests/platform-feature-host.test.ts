import { strict as assert } from "node:assert";
import { test } from "node:test";
import { resolvePlatformFeatureHost } from "../app/composables/platformFeatureHost.ts";

test("billing stays on platform hosts for platform and tenant databases", () => {
	assert.equal(
		resolvePlatformFeatureHost("inicontent"),
		"https://inicontent.com",
	);
	assert.equal(
		resolvePlatformFeatureHost("clinic"),
		"https://clinic.inicontent.com",
	);
	assert.equal(
		resolvePlatformFeatureHost("bücher"),
		"https://xn--bcher-kva.inicontent.com",
	);
});

test("malformed slugs cannot redirect billing off platform", () => {
	for (const slug of [
		"",
		"evil.test",
		"evil.test/",
		"clinic@evil.test",
		"clinic?x=",
		"clinic#",
		"../clinic",
	]) {
		assert.throws(() => resolvePlatformFeatureHost(slug), undefined, slug);
	}
});
