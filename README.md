# Inicontent CMS

## Introduction

In this prject we are using [Nuxt 3](https://github.com/nuxt/nuxt), [Naive UI](https://github.com/tusen-ai/naive-ui) as a component library, and [Tabler](https://github.com/tabler/tabler-icons) for icons.

## Architecture

### Routes

```shell
────📁 pages
    ├───📁 [database] # Database slug
    │   ├───📁 admin
    │   │   ├───📁 dashboards # TODO
    │   │   │   ├───📄 [slug].js 
    │   │   │   └───📄 index.js
    │   │   ├───📁 tables
    │   │   │   ├───📁 [table] # Table slug
    │   │   │   │   ├───📁 [id] # Single item id
    │   │   │   │   │   ├───📄 edit.js
    │   │   │   │   │   └───📄 index.js # ReadOnly
    │   │   │   │   ├───📄 index.ts # Display the list of table items
    │   │   │   │   ├───📄 new.ts # Create new item
    │   │   │   │   ├───📄 flows.ts # Manage Table Flows
    │   │   │   │   └───📄 settings.ts # Table settings (Schema, Global config)
    │   │   │   │       ├───🖊️ # ToDo: Add Global config section
    │   │   │   │       └───🖊️ # ToDo: Improve user experience
    │   │   │   ├───📁 asset
    │   │   │   │   ├───📄 [...folder].ts # Display list of assets and folders of the given path/folder
    │   │   │   │   └───📄 flows.ts # Manage Table Flows
    │   │   │   └───📄 index.ts # Display list of tables
    │   │   ├───📄 index.ts # Display tables and dashboard
    │   │   └───📄 settings.js # Display Global config of current database
    │   │       └───🖊️ # ToDo: Add Global config section
    │   ├───📁 api # WIP
    │   │   ├───📁 [table]
    │   │   │   ├───📄 delete.js
    │   │   │   ├───📄 get.js
    │   │   │   ├───📄 post.js
    │   │   │   ├───📄 put.js
    │   │   │   ├───📄 index.js
    │   │   │   │   └───🖊️ # ToDo: Display all available methods
    │   │   │   └───🖊️ # ToDo: Check if table exists and current user have access to it and the selected method
    │   │   ├───📁 assets
    │   │   └───📄 index.js
    │   │       └───🖊️ # ToDo: Build an API documention of the current db, based on current user role (even guest)
    │   ├───📄 auth.ts # Auth of "X" database (sign-in|sign-up)
    │   │   └───🖊️ # ToDo: Add a sub page called "password reset" (rest.ts) 
    │   └───📄 index.ts # Home page of "X" database
    │       └───🖊️ # ToDo: Create a page builder !
    ├───📄 admin.ts # Display the list of all databases (+ ability to create new one)
    └───📄 auth.ts # Auth of "inicontent" database (sign-in|sign-up)
        └───🖊️ # ToDo: Add a sub page called "password reset" (rest.ts)
```

### Middleware

```shell
────📁 middleware
    ├───📄 dashboard.ts # Set "database" and "user" states and save redirection to be fired after signing in
    │   └───🖊️ # ToDo: Prevent multiple re-fetchs after each route changes
    └───📄 table.ts # Set "table" and "user" state and handle invalid table slugs
```

### Layouts

```shell
────📁 layouts
    ├───📄 default.ts # Header
    ├───📄 table.ts # Header + Side Navigation Menu displaying tables and as subItems(newItem, display_all)[]
    ├───📄 api.js # Header + Side Navigation Menu displaying tables and as subItems (available_table_methods)[]
    │   └───🖊️ # ToDo: Move to typescript
    └───🖊️ # ToDo: Add Editor Layout (Elementor)
```

### Composables

```shell
────📁 layouts
    ├───📄 Dot.ts # Convert an object to dot notation (used to get current field path in a given data)
    ├───📄 fieldsList.ts # Used for schema fields list (getting field "name" and "icon")
    ├───📄 generateSearchInOptions.ts # WIP
    ├───📄 copyToClipboard.ts # Used for copying ID
    ├───📄 comparisonOperatorOptions.ts
    ├───📄 checkFieldType.ts # Detect field type based on value and given array of possible types
    ├───📄 getPath.ts # Used to get current field path
    ├───📄 humanFileSize.ts
    ├───📄 randomID.ts
    ├───📄 renderLabel.ts # Render item label based on table label template (display item id by default)
    ├───📄 useCookie.ts # Used to make cookies reactive (current_lang, current_theme[dark|light])
    └───📄 useLanguage.ts # Used for managing multi-lang and display text based on current selected lang (+ fetch from "translation" table the non predefined translations)
```

### Components

```shell
────📁 components
    ├───📁 Asset
    │   ├───📄 Card.ts # Has the upload button in the header (with upload progress)
    │   │   └───🖊️ # ToDo: Move the upload indicator to a seperate component (so it can be used for the TextEditor)
    │   ├───📄 Grid.ts
    │   │   └───🖊️ # ToDo: Create a new file called "item.ts" and embed it to "Grid.ts"
    │   └───📄 Icon.ts # Display asset icon based on mime-type, if it's not an image
    ├───📁 Table
    │   ├───📄 Drawer.ts # Used to display child item inside an item 
    │   ├───📄 Flows.ts # Display Table Flows Editor 
    │   └───📄 Grid.ts # Display tables as grid
    ├───📁 Render
    │   ├───📁 Field # Contains all supported fields (text,number,upload,editor...)
    │   │   └───📁 Html # WYSIWYG (rich editor)
    │   │       ├───🖊️ # ToDo: Replace all execCommand() (execCommand is now Deprecated)
    │   │       ├───🖊️ # ToDo: Add Table, Image, Embed
    │   │       ├───🖊️ # ToDo: Add a built-in command menu when typing "/" (ie: /image supposed to auto-trigger the upload input)
    │   │       └───🖊️ # ToDo: https://github.com/ianstormtaylor/slate
    │   ├───📄 Fields.ts # Display Fields&Inputs based on given schema
    │   └───📄 Datas.ts # Display Data in ReadOnly mode
    └───🖊️ # ToDo: add pageBuilder https://everright.site/en/formEditor/introduction.html
```

### Types

```shell
────📁 types
    └───📄 index.d.ts # Field | Schema | Table | Database | User | apiResponse | Asset | ThemeConfig
```

## Setup

Make sure to install the dependencies:

```js
<npm|pnpm|yarn> install
```

## Development Server

Start the development server on <http://localhost:3434>

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Deployement

After each update of this repo, a Github Action does build the project and upload the production files to the server using FTP
