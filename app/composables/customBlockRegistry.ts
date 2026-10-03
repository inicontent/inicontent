/**
 * Registry merge for custom blocks.
 *
 * Kept separate from `blockTypes.ts` so it can be unit tested: `blockTypes.ts`
 * statically imports the block list through the `#inicontent/custom-blocks`
 * alias, which only resolves inside a Nuxt build, whereas this module has no
 * imports at all and can be loaded directly by `node --test`.
 */

/** A registry entry, mirroring `BlockObject` in `app/composables/blockTypes.ts`. */
export type BlockRegistryEntry = {
	total: number;
	schema: Schema;
	custom?: CustomBlock;
};

/**
 * The registry: the built-in names as definite keys, plus an index signature so
 * a custom block type — a plain string chosen by the author, unknown at compile
 * time — can still be looked up.
 *
 * Both halves matter for types. `noUncheckedIndexedAccess` (on by default in the
 * Nuxt tsconfig) only adds `undefined` to *index signature* access, so
 * `blockTypes.Form` would become `BlockRegistryEntry | undefined` if the built-in
 * names were expressed as an index signature alone — which is why the generic
 * `Record<T, …>` half is kept. `T` is inferred as the literal union of built-in
 * names, so those stay definite.
 */
export type BlockRegistry<T extends string = string> = Record<
	T,
	BlockRegistryEntry
> &
	Record<string, BlockRegistryEntry>;

/**
 * Merge the built-in block registry with a custom block list.
 *
 * Custom blocks need no `.vue` component, so an entry is just a design count and
 * a config `schema` plus the `custom` definition that `Block/Custom/index.vue`
 * renders. Because `schema` is the same vocabulary the built-ins use, a custom
 * block gets positional-array storage and the schema-driven config editor for
 * free.
 *
 * Throws on a name collision rather than silently shadowing a built-in: the
 * renderer dispatches built-ins by an explicit `block === "Header"` chain, so a
 * shadowed type would produce a block that renders as nothing.
 */
export function mergeCustomBlocks<T extends string>(
	builtIns: Record<T, BlockRegistryEntry>,
	customBlocks: readonly CustomBlock[] = [],
): BlockRegistry<T> {
	const entries = new Map<string, BlockRegistryEntry>(
		Object.entries(builtIns) as [string, BlockRegistryEntry][],
	);

	for (const block of customBlocks) {
		if (!block.type)
			throw new Error(
				"[inicontent] a custom block in app/components/Block/customBlocks.ts has no `type`.",
			);
		if (entries.has(block.type))
			throw new Error(
				`[inicontent] custom block "${block.type}" shadows a built-in block type. Rename it in app/components/Block/customBlocks.ts.`,
			);
		entries.set(block.type, {
			total: block.total ?? 1,
			schema: block.schema ?? [],
			custom: block,
		});
	}

	return Object.fromEntries(entries) as BlockRegistry<T>;
}
