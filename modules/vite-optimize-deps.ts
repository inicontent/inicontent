import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineNuxtModule, useLogger } from "@nuxt/kit";

// `nuxt-tiptap-editor` hardcodes its ProseMirror dependencies as bare
// specifiers in `vite.optimizeDeps.include`:
//
//   optimizeDeps.include = [...existing, ...proseMirrorPackages]
//
// See its `dist/module.mjs` (the `proseMirrorPackages` list). But those 11
// packages are *transitive* deps of `@tiptap/*`, not direct deps of anything
// in the app. Under a non-hoisted (pnpm) install they only exist at
// `.pnpm/<pkg>@<ver>/node_modules/<pkg>`, reachable from an importer inside
// that `.pnpm` dir — `@tiptap/*` itself, which resolves them perfectly well on
// its own.
//
// Vite resolves `optimizeDeps.include` from the Vite root, i.e. the *app*.
// So for every consumer these entries never resolve and Nuxt emits
// `NUXT_B7002` on re-optimize, telling you to fix your nuxt.config.ts even
// though you didn't add them (the warning says as much).
//
// They're not just inert, they're *redundant*: Vite's dep optimizer bundles
// an entry's whole transitive graph, so ProseMirror is already pre-bundled
// into the `@tiptap/extension-*` entries — which DO resolve, because the
// layer depends on them directly.
//
// So dropping the unresolvable ones is a no-op at runtime and it silences
// the warning. Do NOT try to "fix" them by making them resolvable instead:
// these packages are dual-published (`prosemirror-view` maps `import` ->
// `dist/index.js` and `require` -> `dist/index.cjs`), so a root-level entry
// would pre-bundle the CJS build while `@tiptap/*` imports the ESM one — two
// copies of ProseMirror in the browser graph, which breaks `instanceof` and
// plugin-key identity. The real fix belongs upstream in nuxt-tiptap-editor.
//
// `vite.resolve.dedupe` gets the same list from that module and is left
// alone on purpose: it's silently skipped while unresolvable, and becomes a
// useful single-instance guard if a future install ever does hoist them.

/**
 * Whether Vite can resolve a bare specifier by walking `node_modules` up from
 * `from` — i.e. what its own resolver does for `optimizeDeps.include`.
 *
 * Deliberately NOT `createRequire(from).resolve(id)`: pnpm's generated bin
 * shims export `NODE_PATH=<root>/node_modules/.pnpm/node_modules`, and Node's
 * CJS resolver honours that. Under `pnpm dev` it therefore resolves the
 * hoisted transitive deps that Vite can never see, which would report the
 * broken entries as fine and make this module a silent no-op.
 */
function canViteResolve(id: string, from: string): boolean {
	let dir = from;
	for (;;) {
		if (existsSync(join(dir, "node_modules", id))) return true;
		const parent = dirname(dir);
		if (parent === dir) return false;
		dir = parent;
	}
}

export default defineNuxtModule({
	meta: {
		name: "inicontent-vite-optimize-deps",
	},
	setup(_options, nuxt) {
		const logger = useLogger("inicontent:optimize-deps");

		nuxt.hook("modules:done", () => {
			const optimizeDeps = nuxt.options.vite?.optimizeDeps;
			const include = optimizeDeps?.include;
			if (!include?.length) return;

			const resolvable: string[] = [];
			const dropped: string[] = [];
			for (const id of include) {
				if (canViteResolve(id, nuxt.options.rootDir)) resolvable.push(id);
				else dropped.push(id);
			}
			if (!dropped.length) return;

			optimizeDeps.include = resolvable;
			logger.info(
				`Dropped ${dropped.length} unresolvable vite.optimizeDeps.include entries added by nuxt-tiptap-editor: ${dropped.join(", ")}`,
			);
		});
	},
});
