import { LazyAssetCard } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: ["dashboard", "table"],
      layout: "table",
    });

    const route = useRoute(),
      database = useState<Database>("database");

    useHead({
      title: `${database.value.slug} | ${t("assets")}${
        route.params.folder
          ? ` | /${[].concat(route.params.folder as any).join("/")}`
          : ""
      }`,
      link: [{ rel: "icon", href: database.value?.icon ?? "" }],
    });

    return () => h(LazyAssetCard);
  },
});
