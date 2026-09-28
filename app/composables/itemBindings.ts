import { resolveSegmentValue } from "./pageTemplate";

type ItemRecord = Item | Record<string, unknown>;

export type ItemRepeatResolution = {
	config: unknown;
	repeated: unknown[];
	arrayPath?: string;
};

const repeatPlaceholderRE =
	/\{\{\s*item\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\[\](?:\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*))?\s*\}\}/g;
const exactRepeatPlaceholderRE =
	/^\s*\{\{\s*item\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\[\](?:\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*))?\s*\}\}\s*$/;

/**
 * Render-time data binding for dynamic ("template") pages.
 *
 * While a page renders the item matched by its slug (e.g. `/articles/slug`),
 * every string in a block config may reference the item with `{{item.column}}`
 * (or `{{ item.column }}`, nested paths like `{{item.author.name}}` allowed).
 * Example: `heading: "{{ item.title }}"` renders the article title.
 *
 * A string that consists of exactly one placeholder is replaced by the raw
 * item value — so a reference to an asset/URL column can flow straight into
 * a slot that expects an object or URL. Otherwise the value is stringified.
 */
export function resolveItemPlaceholders(
	value: unknown,
	item: ItemRecord | null | undefined,
	depth = 0,
): unknown {
	if (depth > 12 || value === null || value === undefined) return value;

	if (typeof value === "string") {
		if (!value.includes("{{")) return value;

		const exact = value.match(
			/^\s*\{\{\s*item\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\s*\}\}\s*$/,
		);
		if (exact) {
			const [, path = ""] = exact;
			if (!path) return value;
			const resolved = getByPath(item, path);
			if (typeof resolved === "string" || typeof resolved === "number")
				return String(resolved);
			if (resolved !== undefined) return resolved; // inject objects/arrays raw
			return value;
		}

		return value.replace(
			/\{\{\s*item\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\s*\}\}/g,
			(_match, path: string) => {
				const resolved = getByPath(item, path);
				if (resolved === null || resolved === undefined) return _match;
				if (
					typeof resolved === "string" ||
					typeof resolved === "number" ||
					typeof resolved === "boolean"
				)
					return String(resolved);
				// Object values inside longer text: fall back to a public URL
				// when the value looks like an asset, otherwise the raw match.
				const url = assetUrl(resolved);
				return url ?? _match;
			},
		);
	}

	if (Array.isArray(value))
		return value.map((entry) =>
			resolveItemPlaceholders(entry, item, depth + 1),
		);

	if (typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(
			value as Record<string, unknown>,
		)) {
			out[key] = resolveItemPlaceholders(entry, item, depth + 1);
		}
		return out;
	}

	return value;
}

/**
 * Resolve normal item placeholders and, when a block config contains
 * `{{item.array[].field}}`, build one resolved config per array entry.
 */
export function resolveItemRepeatPlaceholders(
	value: unknown,
	item: ItemRecord | null | undefined,
): ItemRepeatResolution {
	const arrayPath = findRepeatArrayPath(value);
	const config = resolveItemPlaceholders(value, item);
	if (!arrayPath) return { config, repeated: [] };

	const source = getByPath(item, arrayPath);
	if (!Array.isArray(source)) return { config, repeated: [], arrayPath };

	return {
		config,
		repeated: source.map((entry) =>
			resolveRepeatedPlaceholders(value, item, arrayPath, entry),
		),
		arrayPath,
	};
}

function findRepeatArrayPath(value: unknown, depth = 0): string | undefined {
	if (depth > 12 || value === null || value === undefined) return undefined;
	if (typeof value === "string") {
		repeatPlaceholderRE.lastIndex = 0;
		return repeatPlaceholderRE.exec(value)?.[1];
	}
	if (Array.isArray(value)) {
		for (const entry of value) {
			const path = findRepeatArrayPath(entry, depth + 1);
			if (path) return path;
		}
		return undefined;
	}
	if (typeof value === "object") {
		for (const entry of Object.values(value)) {
			const path = findRepeatArrayPath(entry, depth + 1);
			if (path) return path;
		}
	}
	return undefined;
}

function resolveRepeatedPlaceholders(
	value: unknown,
	item: ItemRecord | null | undefined,
	arrayPath: string,
	entry: unknown,
	depth = 0,
): unknown {
	if (depth > 12 || value === null || value === undefined) return value;

	if (typeof value === "string") {
		if (!value.includes("{{")) return value;

		const exact = value.match(exactRepeatPlaceholderRE);
		if (exact && exact[1] === arrayPath) {
			const [, , childPath] = exact;
			const resolved = childPath ? getByPath(entry, childPath) : entry;
			if (typeof resolved === "string" || typeof resolved === "number")
				return String(resolved);
			if (resolved !== undefined) return resolved;
			return value;
		}

		const replaced = value.replace(
			repeatPlaceholderRE,
			(match, currentArrayPath: string, childPath?: string) => {
				if (currentArrayPath !== arrayPath) return match;
				const resolved = childPath ? getByPath(entry, childPath) : entry;
				if (resolved === null || resolved === undefined) return match;
				if (
					typeof resolved === "string" ||
					typeof resolved === "number" ||
					typeof resolved === "boolean"
				)
					return String(resolved);
				return assetUrl(resolved) ?? match;
			},
		);

		return resolveItemPlaceholders(replaced, item);
	}

	if (Array.isArray(value))
		return value.map((entryValue) =>
			resolveRepeatedPlaceholders(
				entryValue,
				item,
				arrayPath,
				entry,
				depth + 1,
			),
		);

	if (typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [key, entryValue] of Object.entries(
			value as Record<string, unknown>,
		)) {
			out[key] = resolveRepeatedPlaceholders(
				entryValue,
				item,
				arrayPath,
				entry,
				depth + 1,
			);
		}
		return out;
	}

	return value;
}

function getByPath(item: unknown, path: string): unknown {
	if (!item || typeof item !== "object") return undefined;
	return path.split(".").reduce<unknown>((value, key) => {
		if (value === null || value === undefined || typeof value !== "object")
			return undefined;
		return (value as Record<string, unknown>)[key];
	}, item);
}

function assetUrl(value: unknown): string | undefined {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return assetUrl(value[0]);
	if (value && typeof value === "object") {
		const obj = value as Record<string, unknown>;
		if (typeof obj.publicURL === "string") return obj.publicURL;
		if (typeof obj.url === "string") return obj.url;
	}
	return undefined;
}

/**
 * Build a per-item URL for a template page slug:
 * `articles/[articleSlug]` + an item → `articles/the-article`.
 */
export function resolveTemplatePageHref(
	slug: string,
	item: Item | Record<string, unknown> | null | undefined,
	overrides?: Record<string, string | number>,
	prefix = "",
): string {
	function withPrefix(pathSlug: string): string {
		const path = `/${String(pathSlug).replace(/^\/+/, "")}`;
		const normalizedPrefix = prefix
			? `/${String(prefix).replace(/^\/+|\/+$/g, "")}`
			: "";
		if (!normalizedPrefix) return path;
		if (path === "/") return normalizedPrefix;
		if (path === normalizedPrefix || path.startsWith(`${normalizedPrefix}/`))
			return path;
		return `${normalizedPrefix}${path}`;
	}

	if (!slug.includes("[")) return withPrefix(slug);
	const filled = String(slug).replace(
		/\[([^\]]+)\]/g,
		(_match, segment: string) => {
			const value = resolveSegmentValue(item, segment, overrides?.[segment]);
			if (value === null || value === undefined || value === "") return _match;
			return encodeURIComponent(String(value));
		},
	);
	return withPrefix(filled);
}
