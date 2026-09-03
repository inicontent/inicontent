# Inicontent CMS

## Introduction

Inicontent CMS is a content management system built using [Nuxt](https://github.com/nuxt/nuxt) as its framework. It leverages modern tools such as:  
- [Naive UI](https://github.com/tusen-ai/naive-ui) for a sleek component library.  
- [Tabler Icons](https://github.com/tabler/tabler-icons) for intuitive and attractive icons.  
- [Tiptap](https://github.com/ueberdosis/tiptap) for a powerful Rich Text Editor.

## Features

- **Multi-database admin** - manage one or many databases from a single `/admin` interface.
- **Rich text editing** via [Tiptap](https://github.com/ueberdosis/tiptap).
- **Sleek UI** built with [Naive UI](https://github.com/tusen-ai/naive-ui) and [Tabler Icons](https://github.com/tabler/tabler-icons).
- **PWA-ready** out of the box.
- **Drop-in as a Nuxt Layer**, or clone and customize directly.

## Ecosystem

- **[`inicontent/starter`](https://github.com/inicontent/starter)** — the minimal layer app to
  build on. It ships `CONTEXT.md`, the AI-agent build context: authentication, the REST API,
  the query language, table schemas & flows, and custom-route registration.
- **`inicontent/api (private)`** — the server behind
  `https://api.inicontent.com/`: REST CRUD per table, authentication, assets, and the built-in
  AI-assistant endpoints (`{db}/ai`, `{db}/ai/tables`, …).

## REST API & authentication (short version)

Every database gets a public REST API at `https://api.inicontent.com/{databaseSlug}`:

- `PUT {db}/auth/signin` with `{ "username": ..., "password": ... }` → returns a `sessionID`;
  pass it on every request as the `{db}_sid` query param.
- Table data: `GET/POST/PUT/DELETE {db}/{table}` — list pagination/projection live in the
  Inison-stringified `options` query param and filters in `where`.
- Structure: `GET/POST/PUT/DELETE inicontent/databases/{db}[/{table}]` for metadata, schemas,
  flows (`onRequest`/`onResponse`), and table CRUD.
- AI assistant: `POST {db}/ai` (router), then `POST/PUT {db}/ai/tables`, `{db}/ai/data`,
  `{db}/ai/pages` … to design schemas, roles and demo data.

See the `CONTEXT.md` shipped with `inicontent/starter` for the full reference (query language,
schema field types, flows, routing).

## Usage

There are two ways to use this project:

### 1. Recommended Method: Add as a Nuxt Layer

The easiest way to integrate Inicontent CMS is to use it as a Nuxt Layer.  

**Steps:**
1. Add the repository as a layer in your `nuxt.config` file.
2. Remove your existing `app.vue` file to avoid conflicts.  
3. To override specific admin routes, create corresponding files in the `pages` directory. These will automatically override the default routes provided by the CMS.

**Database Configuration:**  
- By default, the CMS is a multi-database manager.  
  - When no `database` is set in `.env`, the admin interface (`/admin`) will display all available databases. Users can then navigate to a specific database's admin panel at `/admin/<dbName>`.  
  - If a `database` is specified in `.env`, the `/admin` route will directly display the tables for the specified database, removing the need to include the database name in the path.  

**Example Configuration:**

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

### 2. Advanced Method: Clone and Edit the Repository

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

Install the dependencies to get started (any package manager works — npm, pnpm, yarn, or bun):  

```bash
npm install
```

## Development

Start the development server at [http://localhost:3434](http://localhost:3434):

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Linting

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
pnpm lint    # check
pnpm format  # check and write
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch/commit conventions, and the PR process.