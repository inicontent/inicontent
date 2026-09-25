import { temporaryReferences } from "./offlineReferences.ts";

/** FIFO, with only the head's prerequisites allowed to move ahead of it. */
export function nextOfflineMutation<
	T extends {
		id: string;
		status: string;
		body: any;
		url: string;
		database: string;
		timestamp: number;
	},
>(queue: T[]): T | undefined {
	const ordered = [...queue].sort((a, b) => a.timestamp - b.timestamp);
	const blocked = ordered.find((entry) => entry.status === "conflict");
	if (blocked) return blocked;
	const visiting = new Set<string>();
	function visit(entry: T): T {
		if (visiting.has(entry.id)) throw new Error("offlineDependencyCycle");
		visiting.add(entry.id);
		const refs = [
			...temporaryReferences(entry.body),
			...entry.url
				.split("/")
				.map(decodeURIComponent)
				.filter((part) => part.startsWith("pending__")),
		];
		for (const ref of refs) {
			const child = ordered.find(
				(candidate) =>
					`pending__${candidate.id}` === ref &&
					candidate.database === entry.database,
			);
			if (!child) throw new Error("offlineMissingDependency");
			return visit(child);
		}
		return entry;
	}
	return ordered[0] ? visit(ordered[0]) : undefined;
}
