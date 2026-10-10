import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	loadDatabaseConfigLocally,
	saveDatabaseConfigLocally,
} from "../app/composables/useLocalDatabaseConfig.ts";
import { useOfflineFetch } from "../app/composables/useOfflineFetch.ts";
import { getOfflineItem } from "../app/composables/useOfflineItem.ts";
import {
	clearAllMutations,
	completeMutation,
	enqueueMutation,
	getAllMutations,
	getMutationsByScope,
	removeMutation,
	requeueMutation,
} from "../app/composables/useOfflineQueue.ts";

test("quarantined data is neither returned nor modified through legacy queue APIs", async () => {
	assert.deepEqual(await getAllMutations(), []);
	assert.deepEqual(await getMutationsByScope("other-user-tenant"), []);
	for (const action of [
		() => enqueueMutation({} as never),
		() => clearAllMutations(),
		() => removeMutation("x"),
		() => requeueMutation("x"),
		() => completeMutation({} as never),
	])
		await assert.rejects(action, /offlinePersistenceDisabled/);
	assert.equal(
		await getOfflineItem("db", "table", "id", "https://api.test/db/table/id"),
		undefined,
	);
});

test("metadata persistence does not read or write browser storage", () => {
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

test("online-only requests never silently queue failed or ambiguous writes", async () => {
	const globals = globalThis as Record<string, unknown>;
	globals.useRuntimeConfig = () => ({
		public: { apiBase: "https://api.test/" },
	});
	globals.useApiBase = () => "https://api.test/";
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
		/Failed to fetch/,
	);
	assert.equal(calls, 1);
	await assert.rejects(
		() => request("db/table/pending__x", { method: "PUT" }),
		/offlinePersistenceDisabled/,
	);
	assert.equal(calls, 1, "temporary legacy IDs never reach the API");
});
