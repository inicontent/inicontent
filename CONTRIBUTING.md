# Contributing to Inicontent CMS

Thanks for taking the time to contribute.

## Getting Started

1. Fork [inicontent/inicontent](https://github.com/inicontent/inicontent), then clone your fork:
   ```bash
   cd inicontent
   ```
2. Install dependencies (this project uses [pnpm](https://pnpm.io/)):
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm run dev
   ```
   The app runs at [http://localhost:3434](http://localhost:3434).

## Project Structure

- `app/` - Nuxt application: pages, components, composables, layouts, middleware, plugins, locales.
- `modules/` - custom Nuxt modules (e.g. `naiveui.ts`).
- `public/` - static assets.
- `index.d.ts` - shared type declarations.

## Branching and Commits

- Branch off `main` using a short descriptive name, e.g. `fix/pdf-export-crash` or `feat/table-filters`.
- Keep commits focused; one logical change per commit.
- Write commit messages in imperative mood ("fix", "add", "refactor"), not past tense.

## Code Style

Linting and formatting are enforced with [Biome](https://biomejs.dev/):

```bash
pnpm lint    # check for issues
pnpm format  # check and auto-fix
```

Run `pnpm lint` before opening a PR; CI runs `biome ci .` on every push and pull request and will fail on violations.

Style conventions already encoded in `biome.json`:
- Tabs for indentation.
- Double quotes in JavaScript/TypeScript.
- Imports auto-organized on save/format.

## Pull Requests

1. Ensure `pnpm lint` passes locally.
2. Open the PR against `inicontent/inicontent`'s `main` branch.
3. Describe **what** changed and **why** in the PR description; link any related issue.
4. Keep PRs scoped to a single feature or fix, when possible, to make review easier.
5. Be responsive to review feedback; a maintainer will merge once approved and CI is green.

## Reporting Bugs

Open an issue against [inicontent/inicontent](https://github.com/inicontent/inicontent/issues) with:
- Steps to reproduce.
- Expected vs. actual behavior.
- Environment details (browser, Node version, OS).

## Questions

If something is unclear, open an issue or start a discussion before investing significant time in an implementation, especially for larger changes.