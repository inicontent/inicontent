import * as composables from "@/composables";

export default defineNuxtPlugin((nuxtApp) => {
	for (const [key, val] of Object.entries(composables)) {
		if (typeof val === "function") {
			(nuxtApp.vueApp.config.globalProperties as any)[key] = val;
		}
	}
});
