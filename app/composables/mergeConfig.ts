// Merge a (possibly partial) stored config over the block's default config.
// Keys the stored config doesn't actually set (missing, null or undefined)
// keep their default value, so configuring e.g. only the announcement leaves
// the rest of the header on its default config.
export default function mergeConfig<T extends object>(
	defaults: T,
	source?: T,
): T {
	const defined = Object.fromEntries(
		Object.entries(source ?? {}).filter(
			([, value]) => value !== undefined && value !== null,
		),
	) as Partial<T>;
	return { ...defaults, ...defined };
}
