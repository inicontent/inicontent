/**
 * Custom block types for the page builder.
 *
 * This is the extension point for blocks that aren't built in. Anything pushed
 * into `customBlocks` shows up everywhere a built-in block does: the builder's
 * block-type picker, the design picker, the schema-driven config editor, the
 * admin blocks list, the reuse panel, and page rendering. There is no `.vue`
 * component to write and no registry to edit — a block is a `schema` (its config
 * fields), a Liquid `template` (its markup), and optional `style` (its CSS).
 *
 * Empty by default, so a stock install behaves exactly as before.
 *
 * ## Example
 *
 * ```ts
 * import promo from "./custom/promo.html?raw";
 * import promoCss from "./custom/promo.css?raw";
 *
 * const customBlocks: CustomBlock[] = [
 *   {
 *     type: "Promo",              // stored as "Promo/1"; must not shadow a built-in
 *     schema: [
 *       { key: "heading", type: "string" },
 *       { key: "body", type: "string", subType: "textarea" },
 *       { key: "image", type: "asset" },
 *     ],
 *     file: promo,                // Liquid; or use `template` for inline markup
 *     style: promoCss,            // scoped to [data-block="Promo"]
 *   },
 * ];
 * ```
 *
 * And `custom/promo.html`:
 *
 * ```liquid
 * <section class="promo">
 *   <h2>{{ heading }}</h2>
 *   <p>{{ body }}</p>
 *   {% if image %}<img src="{{ image | asset }}" alt="{{ heading }}">{% endif %}
 * </section>
 * ```
 *
 * `{{ heading }}` resolves against the config fields above; `{{ item.x }}`
 * resolves against the row a dynamic page (`articles/[slug]`) matched; `| asset`
 * turns a stored `{ publicURL }` into a URL. Output is HTML-escaped unless you
 * pipe through `| raw`. See `AGENTS.md` for the full contract and
 * `app/composables/blockTemplate.ts` for the engine.
 *
 * ## Adding a config field later
 *
 * The `blocks` table stores a config as a positional ARRAY laid out by `schema`
 * order, so **append new keys to the end** of a schema — inserting one shifts
 * every slot after it and silently corrupts configs already in the database.
 */
const customBlocks: CustomBlock[] = [];

export default customBlocks;
