/**
 * M3/M4 — deterministic region routing from database hostnames (client side).
 *
 * Mirrors the API's parser. The region is encoded in the hostname so a
 * `*.inicontent.com` host resolves without a global database locator; a single
 * hyphen stays an ordinary slug character and `--` is the reserved separator.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	databaseHostname,
	parseDatabaseHostname,
	resolveDatabaseLoginUrl,
} from "../app/composables/region.ts";

test("a bare hostname resolves to the main region", () => {
	assert.deepEqual(parseDatabaseHostname("myclinic.inicontent.com"), {
		region: null,
		slug: "myclinic",
	});
	assert.deepEqual(parseDatabaseHostname("my-clinic.inicontent.com"), {
		region: null,
		slug: "my-clinic",
	});
	assert.deepEqual(parseDatabaseHostname("MyClinic.inicontent.com."), {
		region: null,
		slug: "myclinic",
	});
});

test("a region-encoded hostname splits on the double hyphen", () => {
	assert.deepEqual(parseDatabaseHostname("sa-1--myclinic.inicontent.com"), {
		region: "sa-1",
		slug: "myclinic",
	});
	assert.deepEqual(parseDatabaseHostname("sa-1--my-clinic.inicontent.com"), {
		region: "sa-1",
		slug: "my-clinic",
	});
});

test("an ambiguous or malformed label is rejected, never guessed", () => {
	for (const hostname of [
		"a--b--c.inicontent.com",
		"-sa--clinic.inicontent.com",
		"sa-1--.inicontent.com",
		"sa-1--clinic.example.com",
		"foo.bar.inicontent.com",
		"myclinic.inicontent.com.evil.test",
		"myclinic.inicontent.com:443",
		"myclinic.example.com",
		"https://myclinic.inicontent.com",
		"",
	])
		assert.equal(parseDatabaseHostname(hostname), null, hostname);
});

test("a punycode label is a slug, not a region prefix", () => {
	assert.deepEqual(parseDatabaseHostname("xn--mgbh0fb.inicontent.com"), {
		region: null,
		slug: "xn--mgbh0fb",
	});
	assert.deepEqual(parseDatabaseHostname("sa-1--xn--mgbh0fb.inicontent.com"), {
		region: "sa-1",
		slug: "xn--mgbh0fb",
	});
});

test("a database hostname is built from a slug and an optional region", () => {
	assert.equal(databaseHostname("clinic"), "clinic.inicontent.com");
	assert.equal(databaseHostname("clinic", null), "clinic.inicontent.com");
	assert.equal(
		databaseHostname("clinic", "sa-1"),
		"sa-1--clinic.inicontent.com",
	);
	assert.equal(
		databaseHostname("clinic", "SA-1"),
		"sa-1--clinic.inicontent.com",
	);
	// A single hyphen in the slug is fine.
	assert.equal(
		databaseHostname("my-clinic", "sa-1"),
		"sa-1--my-clinic.inicontent.com",
	);
});

test("an invalid slug or region never yields a hostname", () => {
	assert.equal(databaseHostname("my--clinic"), null);
	assert.equal(databaseHostname(""), null);
	assert.equal(databaseHostname("-clinic"), null);
	assert.equal(databaseHostname("clinic-"), null);
	assert.equal(databaseHostname("clinic", "bad code"), null);
	assert.equal(databaseHostname(undefined), null);
});

test("a non-ASCII slug keeps the bare host (region travels out of band)", () => {
	const host = databaseHostname("مرحبا", "sa-1");
	assert.ok(host, "a punycoded host is produced");
	assert.ok(host.endsWith(".inicontent.com"));
	// IDNA folds the whole label into one ACE label, so it cannot carry the
	// region separator — parsing it back yields no region.
	assert.equal(parseDatabaseHostname(host)?.region, null);
});

test("the sign-in URL is on the database's own hostname, never the admin host", () => {
	assert.equal(
		resolveDatabaseLoginUrl("clinic"),
		"https://clinic.inicontent.com/login",
	);
	assert.equal(
		resolveDatabaseLoginUrl("clinic", "sa-1"),
		"https://sa-1--clinic.inicontent.com/login?region=sa-1",
	);
	// The host a password manager scopes saved credentials to.
	const url = new URL(resolveDatabaseLoginUrl("clinic", "sa-1") as string);
	assert.equal(url.hostname, "sa-1--clinic.inicontent.com");
	assert.notEqual(url.hostname, "inicontent.com");

	// An invalid slug yields no URL rather than a malformed one.
	assert.equal(resolveDatabaseLoginUrl("my--clinic"), null);
	assert.equal(resolveDatabaseLoginUrl(""), null);
});
