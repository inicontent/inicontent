# AGENTS.md

Guidance for coding agents working in this repository.

Scope: **how to work in this codebase.** For human contribution process see
[CONTRIBUTING.md](CONTRIBUTING.md). For working with a *database* — the REST API,
the query language, table schemas and flows — use the
[`@inicontent/mcp`](https://github.com/inicontent/mcp) server.

## What this repo is

The **client layer only** of Inicontent CMS: a [Nuxt 4](https://nuxt.com/) SPA
(`ssr: false`) with an admin panel, a drag-and-drop page/email builder, and an
offline-first PWA. The backend (`inicontent/api`) is proprietary and not here.

It is also published as a Nuxt **layer**, so apps (saas, clinicOS, starter) build
on top of it. Two consequences:

- Parts of `nuxt.config.ts` and `modules/` must work for a consumer that does
  **not** install this repo's dependencies. See the `isSourceApp` gate in
  `nuxt.config.ts:61` and `modules/icon-collections.ts`.
- Modules in `modules/` are auto-registered — they are not listed in
  `nuxt.config.ts`'s `modules` array.

## Commands

| Command         | Does                                              |
| --------------- | ------------------------------------------------- |
| `pnpm dev`      | Dev server on <http://localhost:3434>             |
| `pnpm build`    | Production build                                  |
| `pnpm generate` | Static generation                                 |
| `pnpm test`     | Unit tests (`node --test`)                        |
| `pnpm lint`     | Biome check                                       |
| `pnpm format`   | Biome check with `--write`                        |

Requires Node `20.19+` or `22.12+` (for `node --test` type stripping) and pnpm.
No `.env` is required; it defaults to the public API and the `inicontent`
database.

## Hard constraints

These are load-bearing. Breaking one fails silently or corrupts data rather than
raising an error.

- **`builder.d.ts` must stay at the repo root.** The generated tsconfig includes
  `../*.d.ts` but not `../types/**`, so moving it drops every global type out of
  the program and they all become `any`.
- **A block config is stored as a positional array**, laid out by `schema` order
  (`convertArrayToObject` / `convertObjectToArray` are the two ends). Therefore:
  **append new fields to the end of a schema.** Inserting one shifts every slot
  after it and silently corrupts configs already in the database.
- **A block's `name` is `"<Type>/<designNumber>"`** and is `split("/")` in about
  15 places. `"Template"` is a reserved pseudo-block (dynamic page binding).
- **Blocks are rendered inside `.contents`**, which sets
  `container-type: inline-size` and a background colour. Use **container
  queries**, not viewport media queries — the same markup renders inside the
  editor's device preview, where the viewport is not the page's viewport.
- **All four locale files must change together**: `app/locales/{ar,en,es,fr}.ts`.
- **Dependencies with a `postinstall`/`prepare` script** need an entry in the
  `allowBuilds` allowlist in `pnpm-workspace.yaml`, or the install silently skips
  the script.

## Conventions

- `app/composables/` is the utils directory — everything in it is auto-imported.
  `app/utils/` is empty and unused. Non-`use*` names there become global template
  identifiers too, so pick names carefully.
- Biome: tabs, double quotes, imports auto-organised on format.
- `.vue` files have `useConst` / `useImportType` / unused-vars disabled.
- No Vuex/Pinia. State is `useState<T>(key, init)` in composables/middleware plus
  scoped cookies.
- Routing uses the optional segment `[[database]]`, so admin paths are both
  `/admin` and `/admin/<dbName>`.
- Tests are `node:test` + `node:assert`, and import app modules with an
  **explicit `.ts` extension** (`../app/composables/foo.ts`) — that is what makes
  them loadable under Node's type stripping. Keep pure logic in a composable so
  it stays testable outside Vue.
- `pnpm lint` currently reports pre-existing errors on `main`; scope your checks
  to the files you touched and don't try to fix the baseline in passing.

## Adding a block type

Built-in blocks need four edits:

1. `builder.d.ts` — add the config type to `BlocksMap`.
2. `app/components/Block/<Name>/{index.vue,1..N.vue,config.ts}` — one component
   per design, plus per-language default configs.
3. `app/composables/blockTypes.ts` — add `{ total, schema }` to the registry
   passed to `mergeCustomBlocks`.
4. `app/components/Block/index.vue` — add a `v-else-if` branch.

Everything else picks it up for free: the builder's type picker, design picker and
config editor, the admin blocks list, the reuse panel, `ClonePageModal`, and the
translation overlay all read `blockTypes`.

If the block does not need a custom config editor, step 3 alone is enough — the
generic schema-driven editor covers it.

## Custom blocks (no component needed)

A block that is a schema plus markup does not need a `.vue` file at all. Declare
it in `app/components/Block/customBlocks.ts` (empty by default) and it is merged
into `blockTypes` at build time, so it appears everywhere a built-in block does.

```ts
import promo from "./custom/promo.html?raw";
import promoCss from "./custom/promo.css?raw";

const customBlocks: CustomBlock[] = [
  {
    type: "Promo",              // stored as "Promo/1"; must not shadow a built-in
    schema: [
      { key: "heading", type: "string" },
      { key: "image", type: "asset" },
    ],
    file: promo,                // Liquid template
    style: promoCss,            // CSS, scoped to [data-block="Promo"]
  },
];

export default customBlocks;
```

```liquid
{# custom/promo.html #}
<section class="promo">
  <h2>{{ heading }}</h2>
  {% if image %}<img src="{{ image | asset }}" alt="{{ heading }}">{% endif %}
</section>
```

### The `CustomBlock` shape

| Field       | Type       | Notes                                             |
| ----------- | ---------- | ------------------------------------------------- |
| `type`      | `string`   | Required. No `/`. Must not shadow a built-in — the registry throws. |
| `total`     | `number`   | Designs. Default `1`.                              |
| `schema`    | `Schema`   | Config fields. Same vocabulary as built-ins.       |
| `template`  | `string`   | Inline Liquid, used when `templates` has no entry. |
| `templates` | `string[]` | One per design, index 0 = design 1.                |
| `file`      | `string`   | Template loaded via a `?raw` import.               |
| `style`     | `string`   | CSS, injected once per type.                       |

Resolution order for a design is `templates[design - 1]` → `template` → `file`.

### Templates are Liquid

Rendered by `app/composables/blockTemplate.ts` (`liquidjs`, an independent MIT
implementation of the open Liquid spec — not Shopify's code). Rendering is
synchronous because the result feeds `v-html`.

**What is in scope:**

- `{{ field }}` — a config field, at the scope root
- `{{ item.column }}` — the row a dynamic page (`articles/[slug]`) matched.
  Absent on ordinary pages, where it renders as `""`.
- `{{ item.a.b }}` — nested paths
- `{{ x | upcase }}`, `| truncate: 40`, `| date`, `| default: "…"` — stock filters
- `{{ image | asset }}` — resolves a stored `{ publicURL }` to its URL
- `{% if %}` / `{% else %}` / `{% unless %}`
- `{% for row in items %}` with `forloop.index`, `forloop.first`, `forloop.last`
- `{% assign %}` / `{% capture %}`

**What is deliberately unavailable:**

- `{% include %}` / `{% render %}` / `{% layout %}` — no filesystem is
  configured, so there is nothing to resolve. This is also the mitigation for
  CVE-2026-44646.
- No filesystem, no network, no `eval`.

### Two rules that carry the security model

1. **`{{ x }}` is HTML-escaped by default.** Opt out per value with `| raw`,
   the way you would with `v-html`. This matters most on dynamic pages, where
   `{{ item.bio }}` resolves against a database row. Custom block *templates* are
   trusted (they come from a repo file, like a Vue component); the *values*
   interpolated into them are not.
2. **Never reach for `| raw` on user-controlled data.** There is no allowlist.

A malformed tag does not throw — it renders as empty and logs a warning in dev.
An empty result usually means a syntax error in the template, not a missing
config value.

### Styling

`style` is injected into `<head>` once per block type and is **not** scoped for
you — target `[data-block="<type>"]` so two custom blocks cannot leak rules into
each other:

```css
[data-block="Promo"] { background: #111; color: #fff; }
```

`.contents` sets a white background (and dark under `.dark`), so a block that
wants its own background should set one; otherwise stay transparent.

### Layer consumers

`app/components/Block/customBlocks.ts` is the default. An app that extends this
repo as a layer can declare its own at the same relative path;
`modules/custom-blocks.ts` redirects the `#inicontent/custom-blocks` import to
it. The consumer's list **replaces** this one rather than merging — two lists
would declare the same types, and the registry throws on collisions.