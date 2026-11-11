import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	databaseRoutePrefix,
	tenantDatabasePath,
} from "../app/composables/databaseRoute.ts";

test("tenant and page links retain the region and encode the database as one segment", () => {
	const slug = "عيادة";
	const params = { region: "eu", database: slug };
	assert.equal(
		tenantDatabasePath(slug, "main"),
		databaseRoutePrefix({ params }),
	);
	assert.equal(tenantDatabasePath("clinic", "sa-1"), "/sa-1/clinic");
	assert.equal(databaseRoutePrefix({ params: {} }), "");
	assert.equal(
		databaseRoutePrefix({ params: { database: "clinic" } }),
		"/clinic",
	);
});
