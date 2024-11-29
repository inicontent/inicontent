# Inicontent CMS

## Introduction

Inicontent CMS is a content management system built using [Nuxt](https://github.com/nuxt/nuxt) as its framework. It leverages modern tools such as:  
- [Naive UI](https://github.com/tusen-ai/naive-ui) for a sleek component library.  
- [Tabler Icons](https://github.com/tabler/tabler-icons) for intuitive and attractive icons.  
- [Tiptap](https://github.com/ueberdosis/tiptap) for a powerful Rich Text Editor.

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
  - When no `database` is set in `appConfig`, the admin interface (`/admin`) will display all available databases. Users can then navigate to a specific database's admin panel at `/admin/<dbName>`.  
  - If a `database` is specified in `appConfig`, the `/admin` route will directly display the tables for the specified database, removing the need to include the database name in the path.  

**Example Configuration:**

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  appConfig: {
    database: "PUT_HERE_YOUR_DATABASE_NAME", 
    // If set, "/admin" will directly show the tables for the specified database.
    // If not set, "/admin" will list all databases, and you can navigate to "/admin/<dbName>".
  },
  extends: [["github:inicontent/inicontent", { install: true }]]
});
```

This method keeps your project clean and allows for easy updates to the CMS.

---

### 2. Advanced Method: Clone and Edit the Repository

If you require extensive customization, you can clone the repository and modify it directly.

**Steps:**
1. Clone the repository:  
   ```bash
   git clone https://github.com/inicontent/inicontent.git
   cd inicontent
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start editing and customize the project to meet your needs.

---

## Setup

Install the dependencies to get started:  

```bash
<npm|pnpm|yarn|bun> install
```

## Development

Start the development server at [http://localhost:3434](http://localhost:3434):

```bash
npm run dev
```

## Production

To build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```