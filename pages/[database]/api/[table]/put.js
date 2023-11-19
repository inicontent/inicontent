export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "api",
    });
    return () => h("span", {}, "Nothing Here");
  },
});
