import { LazyTableFlows } from "#components";
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      middleware: ["dashboard", "table"],
      layout: "table",
    });
    return () => h(LazyTableFlows);
  },
});
