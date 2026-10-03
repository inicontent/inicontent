import { Liquid } from "liquidjs";

/**
 * Template engine for custom blocks (see `CustomBlock` in `builder.d.ts` and
 * the authoring guide in `AGENTS.md`).
 *
 * Custom blocks are Liquid templates rather than Vue components: they have to be
 * authorable by someone who has never opened this repo (a content designer, or a
 * code agent), which rules out a bespoke syntax. Liquid is the most widely
 * documented template language for exactly this job and is well represented in
 * model training data, so an agent asked to "make a pricing block" writes valid
 * markup on the first try instead of inventing tags that don't parse. It also
 * keeps authoring independent of the bundle: `| truncate`, `| date`, `{% for %}`
 * and friends come for free rather than as helpers we would have to write and
 * maintain ourselves.
 *
 * This is `liquidjs` (harttle), an independent MIT implementation of the openly
 * specified Liquid language — not Shopify's code, and not covered by Shopify's
 * commercial license.
 *
 * Two engine options carry the security model, so don't change them casually:
 *
 *  - `outputEscape: "escape"` makes `{{ x }}` HTML-escape by default. Stock
 *    Liquid emits raw, which would be an XSS regression against the built-in
 *    blocks (Vue escapes for free) — and it matters here in particular because
 *    on a dynamic page `{{ item.bio }}` resolves against a database row. Opt out
 *    per-value with `| raw`, the same way you would with `v-html`.
 *  - No `root` / `partials` / `fs` is configured, so `{% include %}` and
 *    `{% render %}` have nothing to resolve against and are inert. This is the
 *    mitigation for CVE-2026-44646 (`{% render %}` silently drops
 *    `ownPropertyOnly` via `Context.spawn()`, unpatched as of 10.30.0). Its PoC
 *    needs instance-level `ownPropertyOnly: false`; the default is `true` and we
 *    rely on that too. Note the tags cannot simply be deleted — nonexistent tags
 *    always throw at parse time and that behaviour is not configurable.
 *
 * Rendering is synchronous because the result feeds a `v-html` binding. All
 * built-in tags and filters are synchronous, so this holds as long as we don't
 * wire up an async filesystem.
 */
const engine = new Liquid({
	// Escape `{{ x }}` by default; `| raw` opts out per value.
	outputEscape: "escape",
	// Treat "" and [] as falsy. Stock Liquid ("jsTruthy: false") considers a
	// blank string truthy, which reads as a bug to anyone writing `{% if %}`.
	jsTruthy: true,
	// Don't interpret a bare filename in include/render as a variable.
	dynamicPartials: false,
	// Parse cache: the same handful of templates re-render on every block in a
	// page, on every device change in the builder, and on every render pass.
	cache: true,
	// Default. An undefined variable renders as "" instead of throwing, so a
	// half-filled config previews cleanly instead of erroring.
	strictVariables: false,
});

// Config assets round-trip through the `blocks` table as `{ publicURL }` (see
// `convertArrayToObject`), so `{{ image }}` would stringify an object. This
// resolves one to its URL and passes a plain URL string through unchanged.
engine.registerFilter("asset", (value: unknown) => {
	if (value === null || value === undefined) return "";
	if (typeof value === "string") return value;
	const url = (value as { publicURL?: unknown }).publicURL;
	return typeof url === "string" ? url : "";
});

/**
 * The scope a custom block template is rendered against.
 *
 * Config fields sit at the root, so a schema key `heading` is `{{ heading }}`.
 * `item` is the row a dynamic ("template") page matched by its slug — the same
 * object the built-in blocks bind `{{ item.x }}` against — and is absent on
 * ordinary pages, where `{{ item.x }}` then renders as "" rather than erroring.
 */
export type CustomBlockScope = Record<string, unknown> & {
	item?: Record<string, unknown> | null;
};

/**
 * Render a custom block's Liquid template to an HTML string.
 *
 * Never throws for template-authored problems. A malformed tag is a parse error,
 * and letting it propagate would fail the whole page render instead of degrading
 * to one missing section — but silently swallowing it would leave the author
 * staring at an empty block, so the reason is logged in dev. `import.meta.dev` is
 * Vite's flag and is simply `undefined` (falsy) under `node --test`.
 *
 * `renderLimit` / `memoryLimit` bound a runaway template —
 * `{% for i in (1..99999999) %}` would otherwise hang the render loop. These are
 * per-render options, not constructor options.
 */
export function renderCustomBlock(
	template: string | undefined,
	scope: CustomBlockScope = {},
): string {
	if (!template) return "";
	try {
		return engine.parseAndRenderSync(template, scope, {
			renderLimit: 200,
			memoryLimit: 1e6,
		});
	} catch (error) {
		if (import.meta.dev) {
			console.warn(
				"[inicontent] custom block template failed to render:",
				error,
			);
		}
		return "";
	}
}

/**
 * Which of a custom block's templates a given design uses. Falls back through
 * `templates[design - 1]` → `template` → `file`, so a block can ship a single
 * template, a per-design set, or both.
 */
export function resolveCustomBlockTemplate(
	block: CustomBlock,
	design = 1,
): string | undefined {
	return block.templates?.[design - 1] ?? block.template ?? block.file;
}

const injectedStyles = new Set<string>();

/**
 * Add a custom block's CSS to the document once per block type.
 *
 * A plain `Map` registry rather than `useHead` with a keyed style entry: several
 * instances of the same block on one page (six `<Promo>`s, say) would each
 * register the same head key, and the last one to unmount would take the style
 * out from under the survivors. Block styles are static, so injecting once and
 * leaving it is both simpler and correct.
 *
 * Scoping is the renderer's job — the CSS is authored against
 * `[data-block="<type>"]`, which the block's root element carries, so two custom
 * blocks can't leak rules into each other.
 */
export function ensureCustomBlockStyle(
	type: string,
	css: string | undefined,
): void {
	if (!css || !import.meta.client || injectedStyles.has(type)) return;
	const element = document.createElement("style");
	element.dataset.customBlock = type;
	element.textContent = css;
	document.head.appendChild(element);
	injectedStyles.add(type);
}
