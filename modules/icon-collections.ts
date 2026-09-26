import { createRequire } from "node:module";
import { join } from "node:path";
import { defineNuxtModule } from "@nuxt/kit";

// `@nuxt/icon` writes `createRequire(import.meta.url)` + a *bare* specifier
// into `<consumer>/.nuxt/nuxt-icon-server-bundle.mjs` in dev:
//
//   'tabler': () => require('@iconify-json/tabler/icons.json')
//
// The collection itself is fine — `@nuxt/icon` finds it by walking up from
// `[rootDir, workspaceDir, ...layerDirs]`, so it resolves in THIS repo. But
// `createRequire` resolves from `<consumer>/.nuxt/`, and a layer's
// `node_modules` is a *sibling* of the consumer's, never an ancestor of it.
// So for every app that consumes this layer (saas, clinicOS, starter, ...)
// the require throws MODULE_NOT_FOUND and `/_nuxt_icon/*` 500s for any
// icon that isn't in the client bundle — which is what the icon picker
// (app/components/Field/Icon.vue, backed by api.iconify.design/search) and
// per-row/table icons rely on.
//
// Only dev is affected: in build mode `@nuxt/icon` takes its own fallback
// (module.mjs `isBundling` branch) and emits a `buildDir`-relative import
// that points straight back into this repo's `node_modules`, so Nitro
// inlines the JSON. That's why the deployed app works and `nuxt dev` doesn't.
//
// So rewrite the specifier to the absolute path it actually resolves to.
// Dev-only: absolute paths never reach a build output. Resolving through
// `createRequire` (rather than the bundler's resolver) keeps this identical
// to the CJS `require` it replaces.
const COLLECTION_REQUIRE_RE = /require\('(@iconify(?:-json)?\/[^']+)'\)/g;

const SERVER_BUNDLE_TEMPLATE = "nuxt-icon-server-bundle.mjs";

export default defineNuxtModule({
	meta: {
		name: "inicontent-icon-collections",
	},
	setup(_options, nuxt) {
		// `modules:done` fires after every module's setup() — so after
		// `@nuxt/icon` has run its `addTemplate()` — but before any template
		// is compiled to disk. Wrapping `getContents` here means both the
		// initial dev build and any later `updateTemplates()` re-generation
		// go through the rewrite.
		nuxt.hook("modules:done", () => {
			for (const template of nuxt.options.build.templates) {
				if (
					template.filename !== SERVER_BUNDLE_TEMPLATE ||
					!template.getContents
				) {
					continue;
				}

				const getContents = template.getContents;
				const requireFromLayer = createRequire(import.meta.url);
				const requireFromApp = createRequire(
					join(nuxt.options.rootDir, "index.js"),
				);

				template.getContents = async (ctx: object) => {
					const code: string = await getContents(ctx);
					if (!nuxt.options.dev) return code;

					return code.replace(
						COLLECTION_REQUIRE_RE,
						(match, specifier: string) => {
							// App first, then this layer — the same order
							// `@nuxt/icon` uses in getResolvePaths(), so an app
							// that installs its own copy keeps using it.
							for (const require of [requireFromApp, requireFromLayer]) {
								try {
									return `require(${JSON.stringify(
										require.resolve(specifier),
									)})`;
								} catch {
									// not resolvable from here; try the next one
								}
							}
							// Nothing found — leave the original specifier so the
							// failure surfaces as the normal module-resolution
							// error rather than being silently swallowed.
							return match;
						},
					);
				};
			}
		});
	},
});
