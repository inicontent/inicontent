# Contributing to Inicontent CMS

Thanks for taking the time to contribute.

## Prerequisites

- **Node.js** — this is a [Nuxt 4](https://nuxt.com/) app, so a recent Node LTS is
  required (`20.19+` or `22.12+`).
- **pnpm** — the project is managed with [pnpm](https://pnpm.io/), and its
  lockfile (`pnpm-lock.yaml`) is committed. Enable it via Corepack if needed:
  ```bash
  corepack enable
  ```
- **Build-script restrictions** — `pnpm-workspace.yaml` only allows build
  scripts for a small allowlist. If you add a dependency that runs a
  `postinstall`/`prepare` script, add it to `allowBuilds` there, or the install
  will refuse/ignore those scripts.

## Getting Started

1. Fork [inicontent/inicontent](https://github.com/inicontent/inicontent), then clone your fork:
   ```bash
   cd inicontent
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm run dev
   ```
   The app runs at [http://localhost:3434](http://localhost:3434).

No `.env` file is required to get started — the app defaults to the public
Inicontent API and the `inicontent` database. See
[Environment & Backend](#environment--backend) below to point it elsewhere.

## Environment & Backend

This repository contains the **client layer only** — the Inicontent REST API
behind `https://api.inicontent.com/` (`inicontent/api`) is proprietary and not
included here. Contributions are limited to the client side; the API surface you
develop against is documented in `CONTEXT.md`, shipped with
[`inicontent/starter`](https://github.com/inicontent/starter).

Optional environment variables (see the
[README](README.md#environment-variables) for the full table):

| Variable   | Default                       | Description                                    |
|------------|--------------------------------|------------------------------------------------|
| `database` | `inicontent`                  | Database slug the admin panel targets directly. |
| `apiBase`  | `https://api.inicontent.com/` | Base URL for the Inicontent API.                |
| `idOne`    | (built-in default)            | Public identifier used by the API client.       |

## Project Structure

```text
app/
├── app.vue                      # root component (SPA shell)
├── error.vue                    # error page (incl. the offline state)
├── spa-loading-template.html    # HTML shown while the shell boots
├── pages/                       # file-based routes
│   └── [[database]]/            # dynamic database slug (optional route segment)
│       ├── index.vue            # per-database landing / platform page
│       ├── auth/                # sign-in (incl. passkey) and password reset
│       ├── api/                 # public API docs per database
│       └── admin/               # the admin interface
│           ├── index.vue        # database list (or table list, see `database`)
│           ├── tables/          # table index, per-table list/detail/edit/new,
│           │                    #   flows, schedules, settings; special tables
│           │                    #   (assets, pages, blocks, templates, backups)
│           ├── dashboards/      # dashboard list and per-dashboard editor
│           ├── api/             # API-schema management per table
│           ├── billing/         # subscription / billing
│           └── settings.vue     # database settings
├── components/                  # ~99 Vue components, grouped by feature
│   ├── Table/                   # data-grid UI (+ Search, Settings, Views/)
│   ├── Column/                  # column config & per-type renderers (+ Table/)
│   ├── Field/                   # form fields per data type (+ Asset/, Html/)
│   ├── Data/                    # data-level actions (create, edit, import…)
│   ├── Dashboard/               # dashboard widgets (+ Widget/)
│   ├── Asset/                   # asset upload/preview, document thumbnails
│   ├── Auth/                    # sign-in UI
│   ├── Api/                     # API schema/config management UI
│   ├── Offline/                 # offline status and sync UI
│   ├── Form/                    # shared drawer/form scaffolding
│   └── …                        # Header, Chat*, FloatingChatbot, platform landing
├── composables/                 # auto-imported logic (use* / camelCase files)
│   ├── useOffline*.ts           # offline cache, sync queue, warm-up, item access
│   ├── useAsset*.ts, useOcr.ts, useScanner.ts, use{Pdf,Video}Compressor.ts
│   ├── usePasskeyAuth.ts, useSubscription.ts, useRealtimeSync.ts
│   └── Translation/             # translation helpers
├── layouts/                     # default, dashboard, table, api
├── middleware/                  # route guards
│   ├── global.ts / sid-ingest.global.ts   # run on every route
│   └── database.ts, table.ts, dashboard.ts, user.ts  # per-route
├── plugins/                     # offline-warmup.client.ts, template-globals.ts
├── locales/                     # UI translations: ar.ts, en.ts, es.ts, fr.ts
└── assets/main.css              # global styles

modules/naiveui.ts               # custom Nuxt modules (Naive UI setup)
public/                          # static assets (PWA icons, etc.)
index.d.ts                       # shared type declarations
nuxt.config.ts                   # app config; parts (e.g. the offline icon list)
                                 # apply only when built as the source app, not
                                 # when consumed as a Nuxt layer
```

Notable conventions:

- **Routing** uses Nuxt's optional route segment `[[database]]`, so the admin is
  reachable at `/admin` (default database) or `/admin/<dbName>` (multi-database).
- **State** flows through auto-imported composables (e.g. `useState<User>` in
  middleware) and scoped cookies; there is no Vuex/Pinia store.
- **Offline-first**: the PWA precaches the SPA shell and uses workbox runtime
  caching; offline-related logic lives in `composables/useOffline*` and
  `components/Offline/`.

## Branching and Commits

- Branch off `main` using a short descriptive name, e.g. `fix/pdf-export-crash` or `feat/table-filters`.
- Keep commits focused; one logical change per commit.
- Use [Conventional Commits](https://www.conventionalcommits.org/) with a scope where it helps:
  ```bash
  feat(Header): add language toggle
  fix: view button opens item page when override exists
  refactor(Table): extract pagination helpers
  ```
- Write the subject in imperative mood ("add", "fix", "refactor"), not past tense.

## Code Style

Linting and formatting are enforced with [Biome](https://biomejs.dev/):

```bash
pnpm lint    # check only; reports issues
pnpm format  # check and auto-fix (runs biome check --write)
```

Run `pnpm lint` (and `pnpm format` to fix) before opening a PR; CI runs
`biome ci .` on every push and pull request and will fail on violations.

Style conventions already encoded in `biome.json`:
- Tabs for indentation.
- Double quotes in JavaScript/TypeScript.
- Imports auto-organized on save/format.

## Localization

The UI is translated in four languages: Arabic, English, Spanish, and French.
When you add or change a user-facing string, update **all four** files in
`app/locales/` (`ar.ts`, `en.ts`, `es.ts`, `fr.ts`) in the same change.

## Testing

There is no automated test suite yet. Please verify your changes manually with
`pnpm run dev` and describe what you checked (and tested on) in the PR
description — browsers, offline/PWA behavior, and which databases you exercised.

## Pull Requests

1. Ensure `pnpm lint` passes locally.
2. Open the PR against `inicontent/inicontent`'s `main` branch.
3. Describe **what** changed and **why** in the PR description; link any related issue.
4. Keep PRs scoped to a single feature or fix, when possible, to make review easier.
5. If your change touches UI text, confirm all four locale files are updated.
6. Be responsive to review feedback; a maintainer will merge once approved and CI is green.

## Reporting Bugs

Open an issue against [inicontent/inicontent](https://github.com/inicontent/inicontent/issues) with:
- Steps to reproduce.
- Expected vs. actual behavior.
- Environment details (browser, Node version, OS).

## Questions

If something is unclear, open an issue or start a discussion before investing significant time in an implementation, especially for larger changes.