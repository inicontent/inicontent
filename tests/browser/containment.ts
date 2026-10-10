/** Disposable localhost-only fixtures. No connection to a tenant or production API. */
import { openDB } from "idb";
import {
	BROWSER_CONTAINMENT_VERSION,
	migrateBrowserPersistence,
	purgeBrowserCopies,
	QUARANTINE_STORE,
} from "../../app/composables/browserContainment";
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
		const db = await openDB("inicontent-offline-queue", 3);
		assert(
			(await db.count(QUARANTINE_STORE)) === 2,
			"quarantine survives reload",
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
		const thumbnails = await openDB("inicontent-thumbnails", 1, {
			upgrade(db) {
				db.createObjectStore("thumbnails", { keyPath: "key" });
			},
		});
		await thumbnails.put("thumbnails", {
			key: "old",
			data: "synthetic-thumbnail",
		});
		const queue = await openDB("inicontent-offline-queue", 2, {
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
		const db = await openDB("inicontent-offline-queue", 3);
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
		assert(
			!db.objectStoreNames.contains("pending-mutations"),
			"legacy store inaccessible",
		);
		db.close();
		assert(
			localStorage.getItem("inicontent:db-config:synthetic") === null,
			"metadata copy purged",
		);
		assert(
			localStorage.getItem("emailTemplates.customVariables") === null,
			"custom variable copy purged",
		);
		assert(
			localStorage.getItem("theme") === "dark",
			"unrelated preferences preserved",
		);
		assert(
			(await caches.keys()).every(
				(name) => !/^inicontent-(api|config|static)-cache$/.test(name),
			),
			"sensitive caches purged",
		);
		assert(
			await caches.has("inicontent-shell-v1-precache-test"),
			"safe shell preserved",
		);
		await rejects(
			() => openDB("inicontent-offline-queue", 2),
			"old queue code must fail version check",
		);
		await rejects(
			() => openDB("inicontent-thumbnails", 1),
			"old thumbnail code must fail version check",
		);
		assert(
			(await getAllMutations()).length === 0 &&
				(await getMutationsByScope("synthetic")).length === 0,
			"normal app cannot read another user's queued work",
		);
		await rejects(
			() => clearAllMutations(),
			"generic cleanup cannot delete unsynced work",
		);
		await rejects(
			() => enqueueMutation({} as never),
			"new offline writes cannot persist",
		);
		await cacheThumbnail("new", "synthetic-data");
		assert(
			(await getCachedThumbnail("old")) === null,
			"legacy thumbnail never read",
		);
		assert(
			(await getOfflineItem("synthetic", "items", "one", "/api/synthetic")) ===
				undefined,
			"cached rows never read",
		);
		assert(
			await migrateBrowserPersistence(() => {
				throw new Error("unexpected block");
			}),
			"migration is idempotent and preserves queue",
		);
		await purgeBrowserCopies();
		report(
			"PASS: blocked connections, late writes, quarantine, stale versions, safe shell and idempotent cleanup",
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
	const stale = await fetch("/api/synthetic", { cache: "no-store" });
	assert(
		stale.status === 409,
		"stale clients cannot fetch or replay through the new worker",
	);
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data?.type === "CONTAINMENT_IDENTIFY")
			event.ports[0]?.postMessage(BROWSER_CONTAINMENT_VERSION);
	});
	const fresh = await fetch("/api/synthetic", { cache: "no-store" });
	assert(fresh.status === 200, "updated client can use network");
	const freshWrite = await fetch("/api/synthetic", {
		method: "POST",
		body: "synthetic-only",
	});
	assert(freshWrite.status === 200, "updated client can write online");
	assert(
		(await caches.keys()).every(
			(name) => !/^inicontent-(api|config|static)-cache$/.test(name),
		),
		"network requests do not recreate sensitive caches",
	);
	report(
		"PASS: worker denies stale clients, permits updated clients, and caches no API responses",
	);
	if (sessionStorage.getItem("containment-reload") !== "ready") {
		sessionStorage.setItem("containment-reload", "ready");
		location.reload();
	} else report("ALL CONTAINMENT BROWSER CHECKS PASSED");
}
run().catch((error) => report(`FAIL: ${error.message}`));
