/** Disposable localhost-only fixtures. No connection to a tenant or production API. */
import { openDB } from "idb";
import {
	BROWSER_CONTAINMENT_VERSION,
	migrateBrowserPersistence,
	OFFLINE_QUEUE_DB,
	OFFLINE_QUEUE_VERSION,
	purgeBrowserCopies,
	QUARANTINE_STORE,
	THUMBNAIL_DB,
	THUMBNAIL_VERSION,
} from "../../app/composables/browserContainment";
import { setPhiDatabase } from "../../app/composables/phiGuard";
import {
	loadDatabaseConfigLocally,
	saveDatabaseConfigLocally,
} from "../../app/composables/useLocalDatabaseConfig";
import { getOfflineItem } from "../../app/composables/useOfflineItem";
import {
	clearAllMutations,
	enqueueMutation,
	getAllMutations,
	getMutationsByScope,
} from "../../app/composables/useOfflineQueue";
import {
	cacheThumbnail,
	getCachedThumbnail,
} from "../../app/composables/useThumbnailCache";

const assert = (condition: unknown, message: string) => {
	if (!condition) throw new Error(message);
};
const report = (message: string) => {
	document.body.appendChild(document.createElement("p")).textContent = message;
};
async function rejects(action: () => Promise<unknown>, message: string) {
	let failed = false;
	try {
		await action();
	} catch {
		failed = true;
	}
	assert(failed, message);
}
async function run() {
	if (sessionStorage.getItem("containment-reload") === "ready") {
		// After a reload the quarantined legacy work must still be there and the
		// live stores must still be empty — quarantine is durable, not in-memory.
		const db = await openDB(OFFLINE_QUEUE_DB, OFFLINE_QUEUE_VERSION);
		assert(
			(await db.count(QUARANTINE_STORE)) === 2,
			"quarantine survives reload",
		);
		assert(
			(await db.count("pending-mutations")) === 0,
			"live queue stays empty after reload",
		);
		db.close();
		assert(
			(await getAllMutations()).length === 0,
			"reload never exposes old data",
		);
		report("PASS: quarantine survives reload and remains hidden");
	} else {
		localStorage.setItem(
			"inicontent:db-config:synthetic",
			JSON.stringify({ clinical: "synthetic-only" }),
		);
		localStorage.setItem(
			"emailTemplates.customVariables",
			'["synthetic-only"]',
		);
		localStorage.setItem("theme", "dark");
		for (const name of [
			"inicontent-api-cache",
			"inicontent-config-cache",
			"inicontent-static-cache",
		]) {
			const cache = await caches.open(name);
			await cache.put("/api/synthetic", new Response("synthetic-only"));
		}
		const safe = await caches.open("inicontent-shell-v1-precache-test");
		await safe.put("/_nuxt/test.js", new Response("// static shell"));
		const expiration = await openDB("workbox-expiration", 1, {
			upgrade(db) {
				db.createObjectStore("cache-entries");
			},
		});
		await expiration.put(
			"cache-entries",
			{ url: "/api?synthetic_sid=old" },
			"legacy",
		);
		expiration.close();
		// Pre-containment schema: thumbnails v1, queue v2.
		const thumbnails = await openDB(THUMBNAIL_DB, 1, {
			upgrade(db) {
				db.createObjectStore("thumbnails", { keyPath: "key" });
			},
		});
		await thumbnails.put("thumbnails", {
			key: "old",
			data: "synthetic-thumbnail",
		});
		const queue = await openDB(OFFLINE_QUEUE_DB, 2, {
			upgrade(db) {
				db.createObjectStore("pending-mutations", { keyPath: "id" });
				db.createObjectStore("resolved-ids");
			},
		});
		await queue.put("pending-mutations", {
			id: "one",
			database: "synthetic",
			body: { draft: "preserve" },
			params: { synthetic_sid: "synthetic-token" },
		});
		await queue.put("resolved-ids", { pending__one: "123" }, "synthetic");
		let blocked = 0;
		const quarantined = await migrateBrowserPersistence(() => {
			blocked++;
			if (blocked === 1) thumbnails.close();
			else {
				// A write from an already open old tab immediately before it closes must
				// be included atomically in the preserved quarantine.
				void queue
					.put("pending-mutations", { id: "two", body: { draft: "late" } })
					.then(() => queue.close());
			}
		});
		assert(blocked === 2, "both old connections block migration until closed");
		assert(quarantined, "unsynced work is surfaced");
		const cleanedExpiration = await openDB("workbox-expiration", 2);
		assert(
			!cleanedExpiration.objectStoreNames.contains("cache-entries"),
			"Workbox cached URL metadata purged",
		);
		cleanedExpiration.close();
		const db = await openDB(OFFLINE_QUEUE_DB, OFFLINE_QUEUE_VERSION);
		assert(
			(await db.count(QUARANTINE_STORE)) === 2,
			"all unsynced work including late writer is preserved",
		);
		assert(
			(await db.get(QUARANTINE_STORE, "one")).body.draft === "preserve",
			"body unchanged",
		);
		assert(
			(await db.get("quarantined-resolved-ids-v1", "synthetic"))
				.pending__one === "123",
			"ID relationships preserved",
		);
		// The live stores are recreated empty — legacy data is quarantined, not
		// reused, but non-PHI offline persistence is available again.
		assert(
			db.objectStoreNames.contains("pending-mutations") &&
				(await db.count("pending-mutations")) === 0 &&
				db.objectStoreNames.contains("resolved-ids"),
			"live queue recreated empty",
		);
		db.close();
		const thumb = await openDB(THUMBNAIL_DB, THUMBNAIL_VERSION);
		assert(
			(await thumb.count("thumbnails")) === 0,
			"legacy thumbnails dropped, live store empty",
		);
		thumb.close();
		assert(
			localStorage.getItem("inicontent:db-config:synthetic") === null,
			"legacy metadata copy purged",
		);
		assert(
			localStorage.getItem("emailTemplates.customVariables") !== null,
			"session-boundary copies are not touched by the boot purge",
		);
		assert(
			localStorage.getItem("theme") === "dark",
			"unrelated preferences preserved",
		);
		assert(
			(await caches.keys()).every(
				(name) => !/^inicontent-(api|config|static|icon)-cache$/.test(name),
			),
			"legacy sensitive caches purged",
		);
		assert(
			await caches.has("inicontent-shell-v1-precache-test"),
			"safe shell preserved",
		);
		await rejects(
			() => openDB(OFFLINE_QUEUE_DB, OFFLINE_QUEUE_VERSION - 1),
			"old queue code must fail version check",
		);
		await rejects(
			() => openDB(THUMBNAIL_DB, THUMBNAIL_VERSION - 1),
			"old thumbnail code must fail version check",
		);

		// PHI: nothing persists through any browser API.
		setPhiDatabase(true);
		await rejects(
			() => enqueueMutation({} as never),
			"PHI offline writes cannot persist",
		);
		await cacheThumbnail("phi", "synthetic-data");
		assert(
			(await getCachedThumbnail("phi")) === null,
			"PHI thumbnails never read or written",
		);
		saveDatabaseConfigLocally("phi", { slug: "phi" } as never);
		assert(
			loadDatabaseConfigLocally("phi") === undefined,
			"PHI metadata never persisted",
		);
		assert(
			(await getOfflineItem("synthetic", "items", "one", "/api/synthetic")) ===
				undefined,
			"PHI never resolves queued rows",
		);
		assert(
			(await getAllMutations()).length === 0 &&
				(await getMutationsByScope("synthetic")).length === 0,
			"quarantined work is never read by the normal app",
		);

		// Non-PHI: full offline persistence is back.
		setPhiDatabase(false);
		await enqueueMutation({
			method: "PUT",
			url: "https://api.inicontent.com/synthetic/items/one",
			body: { id: "one", value: "local-draft" },
			database: "synthetic",
			table: "items",
		} as never);
		assert((await getAllMutations()).length === 1, "non-PHI write is queued");
		assert(
			(await getOfflineItem("synthetic", "items", "one", "/api/synthetic"))
				?.value === "local-draft",
			"non-PHI can resolve the queued row",
		);
		await cacheThumbnail("nonphi", "synthetic-data");
		assert(
			(await getCachedThumbnail("nonphi")) === "synthetic-data",
			"non-PHI thumbnails persist",
		);
		saveDatabaseConfigLocally("nonphi", { slug: "nonphi" } as never);
		assert(
			loadDatabaseConfigLocally("nonphi")?.slug === "nonphi",
			"non-PHI metadata persists",
		);
		await clearAllMutations();
		assert(
			(await getAllMutations()).length === 0,
			"clear empties the live queue",
		);
		await migrateBrowserPersistence(() => {
			throw new Error("unexpected block");
		});
		await purgeBrowserCopies();
		assert(
			localStorage.getItem("emailTemplates.customVariables") === null,
			"session-boundary purge clears custom variable copies",
		);
		report(
			"PASS: legacy quarantine, live-store recreation, PHI containment and non-PHI persistence",
		);
	}

	await navigator.serviceWorker.register("/sw.js");
	await navigator.serviceWorker.ready;
	if (!navigator.serviceWorker.controller)
		await new Promise<void>((resolve) =>
			navigator.serviceWorker.addEventListener(
				"controllerchange",
				() => resolve(),
				{ once: true },
			),
		);
	// An unidentified client is treated as PHI: it must not read or write
	// through the worker without answering the handshake.
	const stale = await fetch("/api/synthetic", { cache: "no-store" });
	assert(
		stale.status === 409,
		"unidentified clients cannot fetch through the worker",
	);
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data?.type === "CONTAINMENT_IDENTIFY")
			event.ports[0]?.postMessage(BROWSER_CONTAINMENT_VERSION);
	});
	const fresh = await fetch("/api/synthetic", { cache: "no-store" });
	assert(fresh.status === 200, "identified client can use network");
	const freshWrite = await fetch("/api/synthetic", {
		method: "POST",
		body: "synthetic-only",
	});
	assert(freshWrite.status === 200, "identified client can write online");
	report(
		"PASS: worker denies unidentified clients and permits identified ones",
	);
	if (sessionStorage.getItem("containment-reload") !== "ready") {
		sessionStorage.setItem("containment-reload", "ready");
		location.reload();
	} else report("ALL CONTAINMENT BROWSER CHECKS PASSED");
}
run().catch((error) => report(`FAIL: ${error.message}`));
