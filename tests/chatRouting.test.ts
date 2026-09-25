import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
	buildChatRoutingMessage,
	redirectChat,
} from "../app/utils/chatRouting.ts";

test("data entry after schema creation starts a fresh data conversation", () => {
	assert.deepEqual(redirectChat("tables", "schema-response", "data"), {
		endpoint: "data",
		responseID: "",
	});
});
test("schema refinements preserve specialist context", () => {
	assert.equal(
		redirectChat("tables", "schema-response", "tables").responseID,
		"schema-response",
	);
});
test("every supported topic can be selected without leaking another assistant's context", () => {
	for (const target of [
		"databases",
		"tables",
		"data",
		"pages",
		"dashboards",
		"translate",
	]) {
		assert.equal(
			redirectChat(undefined, "router-response", target).responseID,
			"",
		);
	}
	assert.throws(
		() => redirectChat("tables", "id", "../users"),
		/invalid routing/,
	);
});
test("current intent precedes bounded history, including after long prior messages", () => {
	const request = "Insert exactly three sales records";
	const result = buildChatRoutingMessage(request, "tables", [
		{ sender: "AI", text: "x".repeat(10000) },
	]);
	assert.ok(result.startsWith(request));
	assert.ok(result.length < 700);
	assert.ok(result.includes("previous assistant was tables"));
	assert.equal(buildChatRoutingMessage(request), request);
});
