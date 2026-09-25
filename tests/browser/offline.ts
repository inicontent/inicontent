/** Browser integration harness: bundle with esbuild and serve on an isolated localhost origin. */
import {
	clearAllMutations,
	completeMutation,
	enqueueMutation,
	getAllMutations,
	markConflict,
	requeueMutation,
} from "../../app/composables/useOfflineQueue";
import {
	resolveConflictKeepServer,
	useOfflineSync,
} from "../../app/composables/useOfflineSync";

const state = new Map();
Object.assign(globalThis, {
	randomID: () => crypto.randomUUID(),
	useState: (key: string, init?: () => unknown) => {
		if (!state.has(key)) state.set(key, { value: init?.() });
		return state.get(key);
	},
	refreshNuxtData: async () => {},
	getPath: (_schema: unknown, id: string) => id,
});
const tables = [
	{
		slug: "parents",
		schema: [{ key: "child", type: "table", table: "children" }],
	},
	{ slug: "children", schema: [] },
];
const base = {
	method: "POST" as const,
	url: `${location.origin}/db/parents`,
	database: "db",
	table: "parents",
	tables,
	body: {},
};
const assert = (condition: unknown, message: string) => {
	if (!condition) throw new Error(message);
};
const report = (message: string) => {
	document.body.appendChild(document.createElement("p")).textContent = message;
};
async function run() {
	const sync = useOfflineSync();
	let calls: any[] = [];
	Object.assign(globalThis, {
		$fetch: async (url: string, options: any) => {
			calls.push({ url, options });
			return { result: { id: "101" } };
		},
	});
	sync.initSync();
	if (sessionStorage.getItem("offline-test-phase") === "reload") {
		const records = await getAllMutations();
		assert(
			records.length === 2 && records[0].status === "conflict",
			"failure must survive reload",
		);
		await sync.syncPendingMutations();
		assert(calls.length === 0, "persisted failure must block later writes");
		await requeueMutation(records[0].id, { repaired: true });
		await sync.syncPendingMutations();
		assert(
			calls.length === 2 && calls[0].options.body.repaired,
			"edited head retries before tail",
		);
		assert(
			(await getAllMutations()).length === 0,
			"successful retry drains queue",
		);
		sessionStorage.removeItem("offline-test-phase");
		const discard = await enqueueMutation({
			...base,
			body: { discarded: true },
		});
		await enqueueMutation({ ...base, body: { afterDiscard: true } });
		await markConflict(discard.id, null, "test");
		calls = [];
		await resolveConflictKeepServer(discard.id);
		assert(
			calls.length === 1 && calls[0].options.body.afterDiscard,
			"discard must resume the remaining queue",
		);
		report(
			"PASS: reload persistence, blocked FIFO, edit/retry and continuation",
		);
		report("ALL BROWSER CHECKS PASSED");
		return;
	}
	await clearAllMutations();
	const parent = await enqueueMutation({
		...base,
		body: { child: { name: "Inline child" } },
	});
	let records = await getAllMutations();
	assert(
		records.length === 2 && records[0].table === "children",
		"inline children must persist before parents",
	);
	const child = records[0];
	assert(
		(parent.body as any).child === `pending__${child.id}`,
		"parent must point to temporary child",
	);
	await completeMutation(child, "42");
	records = await getAllMutations();
	assert(
		(records[0].body as any).child === "42",
		"child completion must atomically substitute parent id",
	);
	const late = await enqueueMutation({
		...base,
		body: { child: `pending__${child.id}` },
	});
	assert(
		(late.body as any).child === "42",
		"late saved parent must use persisted id mapping",
	);
	await sync.syncPendingMutations();
	assert(
		(await getAllMutations()).length === 0,
		"resolved reference queue must drain",
	);
	report(
		"PASS: atomic inline children, parent substitution and durable id mapping",
	);
	calls = [];
	await enqueueMutation({
		...base,
		kind: "schema",
		body: { slug: "parents", schema: [] },
	});
	await enqueueMutation({ ...base, body: { later: true } });
	window.dispatchEvent(new Event("online"));
	await new Promise((resolve) => setTimeout(resolve, 50));
	assert(calls.length === 0, "reconnect must never auto sync");
	Object.assign(globalThis, {
		$fetch: async () => {
			calls.push("failed");
			throw new Error("Simulated failure");
		},
	});
	await sync.syncPendingMutations();
	records = await getAllMutations();
	assert(
		calls.length === 1 && records[0].status === "conflict",
		"one failed send must pin queue immediately",
	);
	sessionStorage.setItem("offline-test-phase", "reload");
	location.reload();
}
run().catch((error) => {
	report(`FAIL: ${error.stack}`);
});
