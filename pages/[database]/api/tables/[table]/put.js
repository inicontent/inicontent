export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "api",
    });
    return () => h("span", {}, "Nothing Here");
  },
});
