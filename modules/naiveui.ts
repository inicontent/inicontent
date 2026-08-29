import { addComponent, defineNuxtModule } from "@nuxt/kit"
import naive from "naive-ui"

export default defineNuxtModule({
	hooks: {
		"prepare:types": ({ references }) => {
			references.push({
				types: "naive-ui/volar",
			})
		},
	},
	setup(_options, _nuxt) {
		// Setup transpile
		const transpile = process.env.NODE_ENV === "production" ? ["naive-ui"] : []
		if (!_nuxt.options.build.transpile)
			_nuxt.options.build.transpile = transpile
		else
			_nuxt.options.build.transpile =
				_nuxt.options.build.transpile.concat(transpile)

		for (const key of Object.keys(naive).filter((name) =>
			/^N[A-Z]|n-[a-z]/.test(name),
		)) {
			// Add types for each component.
			//
			// NOTE: these must stay `global: false` (the default). Registering
			// every naive-ui component as a runtime global forces Nuxt to
			// eagerly import the whole library (all ~100 components + their
			// dark/rtl styles) into the initial SPA shell chunk. With the
			// default mode Nuxt still resolves N* components used in SFC
			// templates at compile time, but only bundles the ones actually
			// referenced (and code-splits them per chunk).
			addComponent({
				export: key,
				name: key,
				filePath: "naive-ui",
				mode: "all",
			})
		}
	},
})
