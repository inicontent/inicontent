import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	createObjectUrlScope,
	managedObjectUrlCount,
	releaseAllObjectUrls,
	setObjectUrlApi,
} from "../app/composables/managedObjectUrl.ts";

/** Fake URL implementation recording every create/revoke for assertions. */
function fakeUrlApi() {
	const created: string[] = [];
	const revoked: string[] = [];
	let counter = 0;
	return {
		created,
		revoked,
		api: {
			createObjectURL(_blob: Blob): string {
				const url = `blob:test/${++counter}`;
				created.push(url);
				return url;
			},
			revokeObjectURL(url: string): void {
				revoked.push(url);
			},
		},
	};
}

test("a scope revokes only its own URLs, and only on release", () => {
	const fake = fakeUrlApi();
	setObjectUrlApi(fake.api);
	try {
		const first = createObjectUrlScope();
		const second = createObjectUrlScope();
		const firstUrl = first.create(new Blob(["one"]));
		const secondUrl = second.create(new Blob(["two"]));
		assert.equal(managedObjectUrlCount(), 2);

		// Creating does not revoke anything.
		assert.deepEqual(fake.revoked, []);

		first.releaseAll();
		assert.deepEqual(fake.revoked, [firstUrl]);
		assert.equal(managedObjectUrlCount(), 1);

		second.releaseAll();
		assert.deepEqual(fake.revoked, [firstUrl, secondUrl]);
		assert.equal(managedObjectUrlCount(), 0);
	} finally {
		releaseAllObjectUrls();
		setObjectUrlApi(undefined);
	}
});

test("release is idempotent and ignores URLs owned by another scope", () => {
	const fake = fakeUrlApi();
	setObjectUrlApi(fake.api);
	try {
		const owner = createObjectUrlScope();
		const other = createObjectUrlScope();
		const url = owner.create(new Blob(["x"]));

		// A foreign scope cannot revoke it.
		other.release(url);
		assert.deepEqual(fake.revoked, []);
		assert.equal(managedObjectUrlCount(), 1);

		// Releasing twice revokes once.
		owner.release(url);
		owner.release(url);
		assert.deepEqual(fake.revoked, [url]);
		assert.equal(managedObjectUrlCount(), 0);

		// releaseAll after release is a no-op, not a double revoke.
		owner.releaseAll();
		assert.deepEqual(fake.revoked, [url]);
	} finally {
		releaseAllObjectUrls();
		setObjectUrlApi(undefined);
	}
});

test("releaseAllObjectUrls revokes across every live scope (session change)", () => {
	const fake = fakeUrlApi();
	setObjectUrlApi(fake.api);
	try {
		const a = createObjectUrlScope();
		const b = createObjectUrlScope();
		const aUrl = a.create(new Blob(["a"]));
		const bUrl = b.create(new Blob(["b"]));
		releaseAllObjectUrls();
		assert.deepEqual([...fake.revoked].sort(), [aUrl, bUrl].sort());
		assert.equal(managedObjectUrlCount(), 0);
	} finally {
		releaseAllObjectUrls();
		setObjectUrlApi(undefined);
	}
});

test("create fails closed when the platform has no object URL support", () => {
	setObjectUrlApi(null);
	try {
		const scope = createObjectUrlScope();
		assert.throws(() => scope.create(new Blob(["x"])), /objectUrlUnsupported/);
		assert.equal(managedObjectUrlCount(), 0);
	} finally {
		releaseAllObjectUrls();
		setObjectUrlApi(undefined);
	}
});
