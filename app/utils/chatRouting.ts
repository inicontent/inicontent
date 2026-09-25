const endpoints = new Set([
	"databases",
	"tables",
	"data",
	"pages",
	"dashboards",
	"translate",
]);

/** The current request leads so the router's input cap never hides a topic switch. */
export function buildChatRoutingMessage(
	message: string,
	endpoint?: string,
	history: Array<{ sender: string; text?: string }> = [],
): string {
	if (!endpoint) return message;
	return `${message}\n\nRouting context only: the previous assistant was ${endpoint}. Route the current request by its intent; use the previous topic only for ambiguous follow-ups.\n${history
		.slice(-2)
		.map((turn) => `${turn.sender}: ${(turn.text ?? "").slice(0, 300)}`)
		.join("\n")}`;
}

/** Never send a router response ID to a specialist, or one specialist's ID to another. */
export function redirectChat(
	previous: string | undefined,
	responseID: string,
	target: string,
) {
	if (!endpoints.has(target))
		throw new Error("AI returned an invalid routing target.");
	return {
		endpoint: target,
		responseID: previous === target ? responseID : "",
	};
}

/** Generation endpoints only prepare proposals; writes use separate approval requests. */
export function buildChatGenerationMessage(message: string): string {
	return `${message}\n\nPrepare a proposal for review. This request does not execute changes. Return the appropriate approval-pending action and structured payload (items for data, tables for schemas, pages for websites, dashboards for analytics). Preserve explicitly supplied values. Never claim that records or resources were saved, inserted, updated, or published by this generation request.`;
}
