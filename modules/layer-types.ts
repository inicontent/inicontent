import { createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
	setup(_, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		// Nuxt excludes root declarations under node_modules from its layer scan.
		nuxt.hook("prepare:types", ({ references }) => {
			for (const name of ["builder.d.ts", "index.d.ts", "module-shims.d.ts"]) {
				references.push({ path: resolve("..", name) });
			}
		});
	},
});
