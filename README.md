# Inicontent CMS

[![Code quality](https://github.com/inicontent/inicontent/actions/workflows/pull_request.yml/badge.svg)](https://github.com/inicontent/inicontent/actions/workflows/pull_request.yml)

Inicontent CMS is a content management system built on [Nuxt](https://github.com/nuxt/nuxt).

## Features

- **Multi-database admin** - manage one or many databases from a single `/admin` interface.
- **Rich text editing** via [Tiptap](https://github.com/ueberdosis/tiptap).
- **Sleek UI** built with [Naive UI](https://github.com/tusen-ai/naive-ui) and [Tabler Icons](https://github.com/tabler/tabler-icons).
- **PWA-ready** out of the box.
- **Drop-in as a Nuxt Layer**, or clone and customize directly.

## Usage

There are two ways to use this project:

### 1. Recommended: Add as a Nuxt Layer

The easiest way to integrate Inicontent CMS is to use it as a Nuxt Layer.

**Steps:**
1. Add the repository as a layer in your `nuxt.config`.
2. Remove your existing `app.vue` file to avoid conflicts.
3. To override specific admin routes, create corresponding files in the `pages` directory. These automatically override the default routes provided by the CMS.

**Example configuration:**

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [["github:inicontent/inicontent", { install: true }]]
});
```

```sh
# .env
database=DATABASE_SLUG
```

**Database configuration:**
- The CMS is a multi-database manager by default.
- When no `database` is set in `.env`, `/admin` lists all available databases; users navigate to a specific database's admin panel at `/admin/<dbName>`.
- When `database` is set, `/admin` shows that database's tables directly, without the name in the path.

This method keeps your project clean and makes updates to the CMS easy.

### 2. Advanced: Clone and Edit the Repository

If you need extensive customization, clone the repository and modify it directly.

```bash
git clone https://github.com/inicontent/inicontent.git
cd inicontent
pnpm install
```

## Environment Variables

| Variable   | Required | Default                       | Description                                    |
|------------|----------|--------------------------------|------------------------------------------------|
| `database` | No       | `inicontent`                  | Database slug the admin panel targets directly. |
| `apiBase`  | No       | `https://api.inicontent.com/` | Base URL for the Inicontent API.                |
| `idOne`    | No       | (built-in default)            | Public identifier used by the API client.       |

Copy these into a local `.env` file as needed; none are required to start the dev server.

## Setup

Requires Node.js and [pnpm](https://pnpm.io/).

```bash
pnpm install
```

## Development

Start the development server at [http://localhost:3434](http://localhost:3434):

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Linting

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
pnpm lint    # check
pnpm format  # check and write
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch/commit conventions, and the PR process.
