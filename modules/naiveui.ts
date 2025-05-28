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

		for (const key in Object.keys(naive).filter((name) =>
			/^N[A-Z]|n-[a-z]/.test(name),
		)) {
			// Add types for each component
			addComponent({
				export: key,
				name: key,
				filePath: "naive-ui",
				mode: "all",
				global: true,
			})
		}
	},
})
