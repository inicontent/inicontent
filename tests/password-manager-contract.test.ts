/**
 * Password-manager integration contract (M3).
 *
 * The browser offers to save a database's administrator credentials only if the
 * sign-in inputs carry the standard autocomplete contract. These assertions are
 * deliberately source-level: the values have to be reachable by a real password
 * manager, and `field.inputProps` in this codebase are **NInput props**, so the
 * hints must be nested under NInput's own `inputProps` (the object it forwards
 * onto the inner `<input>`). A flat `autocomplete` would land on the wrapper
 * div and be invisible to the browser.
 *
 * No browser is driven here; this guards the wiring that a device test would
 * otherwise be the only way to catch.
 */

import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = join(import.meta.dirname, "..");

function source(relative: string): string {
	return readFileSync(join(root, relative), "utf8");
}

test("the sign-in form declares the username + current-password contract", () => {
	const auth = source("app/components/Auth/index.vue");
	assert.match(auth, /autocomplete:\s*"username"/);
	assert.match(auth, /autocomplete:\s*"current-password"/);
	// Nested, not flat: NInput copies this onto the inner <input>.
	assert.match(auth, /inputProps:\s*\{\s*inputProps:\s*\{/);
});

test("the create form offers the new-password contract", () => {
	const dashboard = source("app/components/Dashboard.vue");
	assert.match(dashboard, /autocomplete:\s*"new-password"/);
	assert.match(dashboard, /autocomplete:\s*"off"/);
	// Both passwords use it; a single occurrence would silently drop one field.
	assert.equal(
		dashboard.match(/autocomplete:\s*"new-password"/g)?.length,
		2,
		"both administrator password fields declare new-password",
	);
});

test("the database login alias resolves to the real sign-in page", () => {
	const login = source("app/pages/login.vue");
	assert.match(login, /definePageMeta\(\{[\s\S]*middleware:[\s\S]*path:\s*`\$\{databaseRoutePrefix\(to\)\}\/auth`/);
});

test("the post-create sign-in link is on the database host, not the admin host", () => {
	// A browser associates saved credentials with the origin the form was
	// submitted from, so the link must point at `slug.region.inicontent.com`,
	// never at this administration host. The URL builder is pure and covered by
	// `database-hostname.test.ts`; this pins that the form uses it.
	const dashboard = source("app/components/Dashboard.vue");
	assert.match(dashboard, /resolveDatabaseLoginUrl\(/);
	const region = source("app/composables/region.ts");
	assert.match(region, /export function resolveDatabaseLoginUrl\(/);
});
