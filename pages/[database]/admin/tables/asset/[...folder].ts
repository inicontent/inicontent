import type { Asset, Database, apiResponse } from "~/types";
import { LazyAssetCard } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    const database = useState<Database>("database");

    useHead({
      title: `${database.value.slug} | ${t("assets")}`,
      link: [{ rel: "icon", href: database.value.icon ?? "" }],
    });

    const route = useRoute(),
      { data: assets } = await useLazyFetch<apiResponse<Asset[]>>(
        `${useRuntimeConfig().public.apiBase}${database.value.slug}/asset${
          route.params.folder
            ? `/${[].concat(route.params.folder as any).join("/")}`
            : ""
        }`
      );

    return () => h(LazyAssetCard, { modelValue: assets.value?.result });
  },
});
