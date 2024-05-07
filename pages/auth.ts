import { LazyAuth } from "#components";
export default defineNuxtComponent({
	setup() {
		definePageMeta({
			middleware: "dashboard",
		});
		return () => h(LazyAuth);
	},
});
