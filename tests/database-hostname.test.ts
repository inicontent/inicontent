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
	// URL delimiters are not label characters: `new URL` would truncate them.
	assert.equal(databaseHostname("clinic?x="), null);
	assert.equal(databaseHostname("clinic#frag"), null);
	assert.equal(databaseHostname("clinic/path"), null);
	assert.equal(databaseHostname("clinic:8080"), null);
	assert.equal(databaseHostname("clinic?x=", "sa-1"), null);
});

test("a non-ASCII slug gets a region-prefixed ACE host", () => {
	// The region is encoded outside the ACE form, so the slug itself still
	// round-trips through the parser on every region — no `?region=` needed.
	const host = databaseHostname("مرحبا", "sa-1");
	assert.equal(host, "sa-1--xn--mgbbop3h.inicontent.com");
	assert.equal(parseDatabaseHostname(host)?.region, "sa-1");

	// On the main region the host stays bare, so an already-published URL is
	// unchanged.
	assert.equal(databaseHostname("مرحبا"), "xn--mgbbop3h.inicontent.com");
	assert.equal(
		parseDatabaseHostname(databaseHostname("مرحبا") as string)?.region,
		null,
	);

	// A slug that IDNA cannot encode yields no hostname rather than a malformed
	// one (Arabic-Indic digits are not valid in a DNS label).
	assert.equal(databaseHostname("٠١٢", "sa-1"), null);
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

	// An internationalized slug is reachable at its own regional host, so its
	// credentials are scoped there too.
	assert.equal(
		resolveDatabaseLoginUrl("مرحبا", "sa-1"),
		"https://sa-1--xn--mgbbop3h.inicontent.com/login?region=sa-1",
	);

	// An invalid slug yields no URL rather than a malformed one.
	assert.equal(resolveDatabaseLoginUrl("my--clinic"), null);
	assert.equal(resolveDatabaseLoginUrl(""), null);
});
