import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtModule } from "@nuxt/kit";

/**
 * Lets an app that consumes this repo as a Nuxt layer declare its own custom
 * blocks, without editing anything inside `node_modules`.
 *
 * `app/components/Block/customBlocks.ts` holds the default — an empty array. A
 * layer consumer (saas, clinicOS, starter, ...) would otherwise have to patch
 * that file in place, which is lost on every reinstall. So both sides import the
 * block list through the `#inicontent/custom-blocks` specifier and this module
 * points it at the consumer's copy when one exists.
 *
 * The layer's own copy is located from this module's `import.meta.url` rather
 * than `nuxt.options._layers`, matching how `icon-collections.ts` resolves
 * itself — a layer's directory is not necessarily `rootDir`, and `_layers[0]` is
 * an internal field whose ordering isn't guaranteed.
 *
 * Precedence is app-over-layer (the same order `@nuxt/icon` uses in
 * `icon-collections.ts`). The consumer's list *replaces* the layer's rather than
 * merging: two independent lists would declare the same block types, and the
 * registry throws on collisions.
 *
 * A Vite alias is used because `blockTypes.ts` imports its list from *this*
 * directory — a relative import would always resolve to the layer's copy
 * regardless of what this module decides.
 */
const SPECIFIER = "#inicontent/custom-blocks";
const RELATIVE_PATH = "app/components/Block/customBlocks";

export default defineNuxtModule({
	meta: {
		name: "inicontent-custom-blocks",
	},
	setup(_options, nuxt) {
		const layerDefault = fileURLToPath(
			new URL(`../${RELATIVE_PATH}`, import.meta.url),
		);
		const consumerOverride = join(nuxt.options.rootDir, RELATIVE_PATH);

		const resolved = existsSync(consumerOverride)
			? consumerOverride
			: layerDefault;

		nuxt.options.alias[SPECIFIER] = resolved;
	},
});
