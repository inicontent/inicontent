import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	isPhiDatabase,
	resolvePhiDatabase,
	setPhiDatabase,
} from "../app/composables/phiGuard.ts";
import {
	loadDatabaseConfigLocally,
	saveDatabaseConfigLocally,
} from "../app/composables/useLocalDatabaseConfig.ts";
import { useOfflineFetch } from "../app/composables/useOfflineFetch.ts";
import { getOfflineItem } from "../app/composables/useOfflineItem.ts";
import { enqueueMutation } from "../app/composables/useOfflineQueue.ts";

test("a PHI database never persists through the offline APIs", async () => {
	setPhiDatabase(true);
	assert.equal(isPhiDatabase(), true);
	// Rejected before touching IndexedDB — no body is ever written.
	await assert.rejects(
		() => enqueueMutation({} as never),
		/offlinePersistenceDisabled/,
	);
	assert.equal(
		await getOfflineItem("db", "table", "id", "https://api.test/db/table/id"),
		undefined,
	);
});

test("metadata persistence does not read or write browser storage for PHI", () => {
	setPhiDatabase(true);
	const globals = globalThis as Record<string, unknown>;
	globals.localStorage = {
		getItem() {
			throw new Error("must not read");
		},
		setItem() {
			throw new Error("must not write");
		},
	};
	assert.equal(loadDatabaseConfigLocally("db"), undefined);
	saveDatabaseConfigLocally("db", { slug: "db" } as never);
	delete globals.localStorage;
});

test("a PHI database never silently queues failed or ambiguous writes", async () => {
	setPhiDatabase(true);
	const globals = globalThis as Record<string, unknown>;
	globals.useApiBase = () => "https://api.test/";
	globals.useState = () => ({ value: { tables: [] } });
	let calls = 0;
	globals.$fetch = async (_url: unknown, options: Record<string, unknown>) => {
		calls++;
		assert.equal(options.cache, "no-store");
		assert.equal(options.retry, 0);
		assert.equal(options.offline, undefined);
		throw new TypeError("Failed to fetch");
	};
	const { request } = useOfflineFetch();
	await assert.rejects(
		() =>
			request("db/table", {
				method: "POST",
				body: { value: "synthetic" },
				offline: { database: "db" },
			}),
		/offlinePersistenceDisabled/,
	);
	assert.equal(calls, 1);
	await assert.rejects(
		() => request("db/table/pending__x", { method: "PUT" }),
		/offlinePersistenceDisabled/,
	);
	assert.equal(calls, 1, "temporary legacy IDs never reach the API");
});

test("a non-PHI database is not gated by the PHI guard", () => {
	setPhiDatabase(false);
	assert.equal(isPhiDatabase(), false);
	// Restore the safe default for any test that runs after this one.
	setPhiDatabase(true);
});

test("offline persistence is opt-in: only an explicit non-PHI classification disables PHI (C1)", () => {
	// Conservative default — missing, legacy and invalid state stays PHI.
	assert.equal(resolvePhiDatabase(undefined), true);
	assert.equal(resolvePhiDatabase(null), true);
	assert.equal(resolvePhiDatabase({}), true);
	assert.equal(resolvePhiDatabase({ phi: true }), true);
	assert.equal(resolvePhiDatabase({ phi: "true" as never }), true);
	assert.equal(resolvePhiDatabase({ phi: 1 as never }), true);
	// Only the server explicitly classifying the database as non-PHI enables offline.
	assert.equal(resolvePhiDatabase({ phi: false }), false);
});
