/**
 * Email "sheet" rendering for the visual builder.
 *
 * The canvas editor shows the whole email as one continuous document instead
 * of a stack of separate block thumbnails. Each block's compiled MJML output
 * (from `renderEmailTemplateClient`) is reduced to its `<body>` markup plus its
 * `<style>` content; the builder stitches those bodies into a single `.email-sheet`
 * container and injects the styles re-scoped under that class so nothing leaks
 * into the app page (`body { margin:0 }` etc. are dropped or namespaced).
 *
 * Column widths come from MJML's `@media (min-width: 480px)` rules, which
 * respond to the *viewport*, not the container. In the editor sheet that media
 * query is re-emitted under `.email-sheet.isWide`, a class toggled by a
 * ResizeObserver on the frame, so columns lay out side-by-side in desktop/tablet
 * previews and stack on the mobile frame — mirroring real clients.
 *
 * Everything is cached per block (name + merged config) so reorders, re-renders
 * and identical variants never recompile.
 */

import type { Ref } from "vue";
import type { EmailBlock } from "~/composables/emailBuilder";
import {
	blockDefByName,
	buildMJML,
	collectPlaceholders,
	SAMPLE_VALUES,
} from "~/composables/emailBuilder";
import { renderEmailTemplateClient } from "~/composables/emailRender";

/** Sample values for placeholders in a source — used for editor/preview only. */
export function sampleVariables(content: string): Record<string, string> {
	const variables: Record<string, string> = { ...SAMPLE_VALUES };
	for (const key of collectPlaceholders(content)) {
		if (!(key in variables))
			variables[key] = `sample_${key.replace(/^@/, "").replace(/\./g, "_")}`;
	}
	return variables;
}

export interface SheetCompiled {
	/** Compiled mail markup for one block (content of its `<body>`). */
	body: string;
	/** Raw `<style>` element contents emitted by that block's own MJML compile. */
	styles: string[];
}

/** Reduce a full compiled email document to its body markup and style contents. */
export function extractBodyStyles(html: string): SheetCompiled {
	const styles: string[] = [];
	for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
		styles.push(match[1]);
	}
	let body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
	if (!body) {
		// No explicit body tag — take everything between </head> and </html>.
		const headEnd = html.search(/<\/head>/i);
		if (headEnd !== -1) {
			const htmlEnd = html.toLowerCase().lastIndexOf("</html>");
			body = html.slice(headEnd + 7, htmlEnd === -1 ? html.length : htmlEnd);
		}
	}
	return { body, styles };
}

// ── CSS scoping ────────────────────────────────────────────────────────────────

type CssBlock =
	| { type: "rule"; selector: string; body: string }
	| { type: "media"; query: string; body: string };

/** Split a stylesheet into its top-level rules / @media blocks (brace-aware). */
function parseCssBlocks(css: string): CssBlock[] {
	const out: CssBlock[] = [];
	let index = 0;
	const length = css.length;
	while (index < length) {
		while (index < length && /\s/.test(css[index])) index += 1;
		if (css.startsWith("/*", index)) {
			const end = css.indexOf("*/", index + 2);
			index = end === -1 ? length : end + 2;
			continue;
		}
		if (index >= length) break;
		const open = css.indexOf("{", index);
		if (open === -1) break; // trailing whitespace/comment — nothing else
		const prelude = css.slice(index, open).trim();
		let depth = 1;
		let close = open + 1;
		while (close < length && depth > 0) {
			if (css[close] === "{") depth += 1;
			else if (css[close] === "}") depth -= 1;
			close += 1;
		}
		const inner = css.slice(open + 1, close - 1);
		if (prelude.startsWith("@media")) {
			out.push({ type: "media", query: prelude.slice(6).trim(), body: inner });
		} else if (!prelude.startsWith("@")) {
			out.push({ type: "rule", selector: prelude, body: inner });
		}
		// Other at-rules (@charset/@import/…) are dropped.
		index = close;
	}
	return out;
}

/** Scope one selector under `prefix`, returning null for page-global/harmless ones. */
function scopeSelector(selector: string, prefix: string): string | null {
	const sel = selector.trim();
	if (!sel) return null;
	if (
		sel === "body" ||
		sel.startsWith("body ") ||
		sel === "html" ||
		sel.startsWith("html ") ||
		sel === "*" ||
		sel.includes("#outlook") ||
		sel.includes(".moz-text-html")
	)
		return null;
	return `${prefix}${sel}`;
}

/**
 * Re-scope raw MJML style content under `.email-sheet` so it cannot leak into
 * the host page. `@media (min-width:480px)` blocks become
 * `.email-sheet.isWide …` rules; every other media query is dropped.
 */
export function scopeSheetStyles(styleContents: string[]): string {
	const out: string[] = [];
	const collect = (selectorText: string, prefix: string, body: string) => {
		const selectors = selectorText
			.split(",")
			.map((sel) => scopeSelector(sel, prefix))
			.filter((sel): sel is string => sel !== null);
		if (selectors.length) out.push(`${selectors.join(", ")} { ${body} }`);
	};
	for (const css of new Set(styleContents)) {
		for (const block of parseCssBlocks(css)) {
			if (block.type === "rule") {
				collect(block.selector, ".email-sheet ", block.body);
			} else if (block.type === "media") {
				if (!/min-width\s*:\s*480px/.test(block.query)) continue;
				for (const sub of parseCssBlocks(block.body)) {
					if (sub.type === "rule")
						collect(sub.selector, ".email-sheet.isWide ", sub.body);
				}
			}
		}
	}
	return out.join("\n");
}

// ── Per-block compile cache ────────────────────────────────────────────────────

const sheetCache = new Map<string, SheetCompiled>();
const SHEET_CACHE_MAX = 400;

export function sheetCacheKey(
	name: string,
	config: Record<string, unknown> | undefined,
): string {
	return `${name}|${JSON.stringify({
		...(blockDefByName(name)?.defaults ?? {}),
		...(config ?? {}),
	})}`;
}

/** Compile one block to a sheet-ready body + styles, cached by content. */
export async function compileBlockForSheet(
	name: string,
	config: Record<string, unknown> | undefined,
): Promise<SheetCompiled> {
	const key = sheetCacheKey(name, config);
	const hit = sheetCache.get(key);
	if (hit) return hit;
	const def = blockDefByName(name);
	if (!def || !import.meta.client) return { body: "", styles: [] };
	const block: EmailBlock = {
		id: "sheet",
		name,
		config: { ...def.defaults, ...(config ?? {}) },
	};
	const templateContent = buildMJML([block]);
	if (!templateContent) return { body: "", styles: [] };
	const rendered = await renderEmailTemplateClient(
		templateContent,
		"",
		sampleVariables(templateContent),
	);
	if (!rendered.html) return { body: "", styles: [] };
	const compiled = extractBodyStyles(rendered.html);
	sheetCache.set(key, compiled);
	if (sheetCache.size > SHEET_CACHE_MAX) {
		const first = sheetCache.keys().next().value;
		if (first !== undefined) sheetCache.delete(first);
	}
	return compiled;
}

/** Flat list of content blocks (columns containers excluded, their children included). */
export function collectContentBlocks(blocks: EmailBlock[]): EmailBlock[] {
	const out: EmailBlock[] = [];
	const walk = (list: EmailBlock[]) => {
		for (const block of list) {
			if (!block.name) continue;
			if (Array.isArray(block.children)) {
				for (const column of block.children) walk(column);
			} else {
				out.push(block);
			}
		}
	};
	walk(blocks);
	return out;
}

/**
 * Reactive sheet state for a block tree: `bodies` maps block id → compiled
 * `<body>` markup (keyed by the *stable block id*, so reorders never recompile),
 * `css` is the merged, `.email-sheet`-scoped stylesheet. Debounced + guarded
 * against out-of-order async renders.
 */
export function useEmailSheet(blocks: Ref<EmailBlock[]>) {
	const bodies = ref<Record<string, string>>({});
	const css = ref("");
	let timer: ReturnType<typeof setTimeout> | undefined;
	let inFlight = 0;
	let cachedSignature = "";

	function signature(blocksOf: EmailBlock[]): string {
		return JSON.stringify(
			collectContentBlocks(blocksOf).map((block) =>
				sheetCacheKey(block.name, block.config),
			),
		);
	}

	async function refresh(): Promise<void> {
		const current = blocks.value;
		const sig = signature(current);
		if (sig === cachedSignature) return;
		const items = collectContentBlocks(current);
		if (!items.length) {
			bodies.value = {};
			css.value = "";
			cachedSignature = sig;
			return;
		}
		const requestID = ++inFlight;
		const next: Record<string, string> = {};
		const styleBat: string[] = [];
		await Promise.all(
			items.map(async (block) => {
				const compiled = await compileBlockForSheet(block.name, block.config);
				next[block.id] = compiled.body;
				styleBat.push(...compiled.styles);
			}),
		);
		if (requestID !== inFlight) return;
		bodies.value = next;
		css.value = scopeSheetStyles(styleBat);
		cachedSignature = sig;
	}

	function schedule(): void {
		if (!import.meta.client) return;
		clearTimeout(timer);
		timer = setTimeout(refresh, 120);
	}

	watch(blocks, schedule, { deep: true, immediate: true });
	onBeforeUnmount(() => {
		clearTimeout(timer);
		inFlight += 1;
	});

	return { bodies, css, refresh };
}
