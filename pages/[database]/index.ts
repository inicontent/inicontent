export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });
    return () => h("span", {}, "A page builder is coming soon!");
  },
});
