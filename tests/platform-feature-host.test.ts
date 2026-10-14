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

test("a secondary region's platform host carries the region prefix", () => {
	assert.equal(
		resolvePlatformFeatureHost("clinic", "sa-1"),
		"https://sa-1--clinic.inicontent.com",
	);
	// The platform database itself always lives on the main host.
	assert.equal(
		resolvePlatformFeatureHost("inicontent", "sa-1"),
		"https://inicontent.com",
	);
	// A region that cannot form a host is refused, never silently dropped.
	assert.throws(() => resolvePlatformFeatureHost("clinic", "bad code"));
});
