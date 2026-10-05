import { existsSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtModule } from "@nuxt/kit";

/**
 * Makes a consuming app's own translation files loadable by this layer.
 *
 * An app that extends this repo (saas, clinicOS, starter, ...) keeps its
 * marketing/site strings in its *own* `app/locales/`, and until now had to
 * hand-write a composable plus a plugin to import them — duplicated per app, and
 * silently rot-prone. A relative `import.meta.glob` can't help: it only ever sees
 * files next to the layer's own source. So both directories are exposed as
 * aliases instead:
 *
 * - `#inicontent/core-locales` — always this layer's `app/locales`.
 * - `#inicontent/layer-locales` — the consuming app's `app/locales`, or a
 *   directory that does not exist when the app has none (the glob then resolves
 *   to `{}`, which is the no-op we want).
 *
 * Both are directories rather than files, which is what lets
 * `import.meta.glob("<specifier>/*.ts")` resolve: Vite hands `#`-prefixed
 * patterns to `resolveId`, so the alias is applied before the glob is scanned.
 *
 * When the app's locales directory IS this layer's (building this repo as the
 * app, not as a layer), `#inicontent/layer-locales` is pointed at the missing
 * sentinel rather than at the real directory — otherwise every language file
 * would be discovered twice and merged twice.
 *
 * The layer's own directory is located from this module's `import.meta.url`
 * rather than `nuxt.options._layers`, matching `modules/custom-blocks.ts`:
 * a layer's directory is not necessarily `rootDir`, and `_layers[0]` is an
 * internal field whose ordering isn't guaranteed.
 */

const CORE_SPECIFIER = "#inicontent/core-locales";
const LAYER_SPECIFIER = "#inicontent/layer-locales";

/** This layer's own locales directory, resolved from the module's location. */
const LAYER_LOCALES_DIR = fileURLToPath(
	new URL("../app/locales", import.meta.url),
);

/**
 * A directory that does not exist, used as the "this app ships no locales of its
 * own" signal. A glob over it resolves to an empty object, so the layer's loader
 * finds nothing there and simply loads the core files.
 */
const NO_LOCALES_DIR = fileURLToPath(
	new URL("../app/.no-app-locales", import.meta.url),
);

/**
 * Same file or not? Compared through `realpathSync` because `srcDir` and this
 * module's location can reach the same directory by different paths (a symlinked
 * `node_modules/inicontent`, a pnpm store path), in which case string equality
 * would say "different" and the files would be merged twice.
 */
function isSameDir(a: string, b: string) {
	if (!existsSync(a) || !existsSync(b)) return false;
	try {
		return realpathSync(a) === realpathSync(b);
	} catch {
		return false;
	}
}

export default defineNuxtModule({
	meta: {
		name: "inicontent-layer-locales",
	},
	setup(_options, nuxt) {
		const appLocalesDir = join(nuxt.options.srcDir, "locales");

		nuxt.options.alias[CORE_SPECIFIER] = LAYER_LOCALES_DIR;
		nuxt.options.alias[LAYER_SPECIFIER] =
			existsSync(appLocalesDir) && !isSameDir(appLocalesDir, LAYER_LOCALES_DIR)
				? appLocalesDir
				: NO_LOCALES_DIR;
	},
});
