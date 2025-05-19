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

		Object.keys(naive)
			.filter((name) => /^N[A-Z]|n-[a-z]/.test(name))
			.forEach((name) => {
				addComponent({
					export: name,
					name,
					filePath: "naive-ui",
					mode: "all",
					global: true,
				})
			})
	},
})
